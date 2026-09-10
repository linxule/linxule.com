import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

// Deliberately scoped to this site's existing Hobby project.
export const TEAM = "team_TT999ORKqVDviH2vw2yzYh8o";
export const PROJECT = "prj_KYGjrsiyQVCOEiLMdIkaWAKc9aiK";

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

export function planRetention({ project, deployments, aliases }, current, rollback) {
  requireThat(project.id === PROJECT && project.accountId === TEAM, "Wrong project or team.");
  requireThat(current !== rollback, "Current and rollback must be different deployments.");
  requireThat(project.targets?.production?.id === current, "Production changed; stop and recheck the publish.");
  requireThat(Array.isArray(deployments) && Array.isArray(aliases), "Incomplete deployment or alias inventory.");
  const seen = new Set();
  for (const d of deployments) {
    requireThat(d.projectId === PROJECT && typeof d.uid === "string" && !seen.has(d.uid), "Unexpected deployment inventory.");
    seen.add(d.uid);
    requireThat(["READY", "ERROR", "CANCELED"].includes(d.state), "A deployment is in flight or has an unknown state; finish it first.");
    requireThat(Number.isFinite(d.created), "Deployment creation time is missing.");
  }
  const live = deployments.find(d => d.uid === current);
  const previous = deployments.find(d => d.uid === rollback);
  for (const d of [live, previous]) {
    requireThat(d?.state === "READY" && d.target === "production", "Both keep IDs must be READY production deployments.");
  }
  requireThat(previous.created < live.created, "Rollback must predate current production.");
  for (const domain of ["linxule.com", "www.linxule.com"]) {
    requireThat(aliases.some(a => a.alias === domain && a.deploymentId === current), `${domain} does not point to the expected current deployment.`);
  }
  const remove = deployments.filter(d => d.state === "READY" && ![current, rollback].includes(d.uid));
  for (const d of remove) {
    requireThat(d.target === "production", `Preview ${d.uid} needs separate review; no automatic preview deletion.`);
    requireThat(d.created < previous.created, `Unexpected newer deployment ${d.uid}; recheck the recorded rollback.`);
    requireThat(!aliases.some(a => a.deploymentId === d.uid), `Deployment ${d.uid} still has an alias; review it separately.`);
  }
  return { preserve: [current, rollback], remove: remove.map(d => d.uid).sort() };
}

// GETs use the installed CLI's subscription/session authentication. Never read tokens.
export function vercelAPI(endpoint, { paginate = false, remove = false } = {}) {
  const args = ["api", endpoint, "--raw"];
  if (paginate) args.push("--paginate");
  if (remove) args.push("--method", "DELETE", "--dangerously-skip-permissions");
  const result = execFileSync("vercel", args, {
    encoding: "utf8", timeout: 60_000, maxBuffer: 20 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(result);
}

function snapshot(api) {
  const query = `teamId=${TEAM}&projectId=${PROJECT}&limit=100`;
  return {
    project: api(`/v9/projects/${PROJECT}?teamId=${TEAM}`),
    deployments: api(`/v6/deployments?${query}`, { paginate: true }),
    aliases: api(`/v4/aliases?${query}`, { paginate: true }),
  };
}

export function runRetention({ current, rollback, apply = false }, api = vercelAPI, log = console.log) {
  const plan = planRetention(snapshot(api), current, rollback);
  log(JSON.stringify({ mode: apply ? "apply" : "dry-run", ...plan }, null, 2));
  if (!apply) return plan;
  for (const id of plan.remove) {
    // Revalidate domains, kept versions, and inventory before every deletion.
    const fresh = planRetention(snapshot(api), current, rollback);
    requireThat(fresh.remove.includes(id), `Deletion candidate ${id} changed; stop.`);
    requireThat(fresh.remove.every(candidate => plan.remove.includes(candidate)), "Deployment inventory changed; stop.");
    const result = api(`/v13/deployments/${id}?teamId=${TEAM}`, { remove: true });
    requireThat(result.uid === id && result.state === "DELETED", `Deletion was not confirmed for ${id}; inspect it before retrying.`);
    log(`Deleted ${id}`);
  }
  const final = planRetention(snapshot(api), current, rollback);
  requireThat(final.remove.length === 0, "Cleanup incomplete; additional deployments remain.");
  log("Verified: current production and one rollback are the only READY deployments.");
  return final;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { values } = parseArgs({ options: {
      current: { type: "string" }, rollback: { type: "string" },
      apply: { type: "boolean", default: false }, help: { type: "boolean" },
    } });
    if (values.help) {
      console.log("bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS [--apply]\nDry-run by default. Apply only after the new production deployment passes the publish checklist. See docs/publishing.md.");
    } else {
      requireThat(/^dpl_[a-zA-Z0-9]+$/.test(values.current ?? "") && /^dpl_[a-zA-Z0-9]+$/.test(values.rollback ?? ""), "Supply --current and --rollback deployment IDs recorded during publishing.");
      runRetention(values);
    }
  } catch (error) {
    console.error(`Retention stopped: ${error.message}`);
    process.exitCode = 1;
  }
}
