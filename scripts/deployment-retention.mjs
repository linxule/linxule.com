import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { pathToFileURL } from "node:url";

// Deliberately scoped to these Hobby projects and their canonical domains.
// Vercel's own retention (1-day expiry, set 2026-09-13) clears previews and
// failed builds but keeps a floor of 10 production deployments; this helper
// enforces the narrower rule of current + one rollback.
// This is rollback hygiene, not a storage tool: deleted deployments stay on
// the Deployment Storage meter for the 30-day recovery hold (docs/publishing.md).
export const TEAM = "team_TT999ORKqVDviH2vw2yzYh8o";
export const PROJECTS = {
  "linxule-com": { id: "prj_KYGjrsiyQVCOEiLMdIkaWAKc9aiK", domains: ["linxule.com", "www.linxule.com"] },
  "research-memex": { id: "prj_LxgKlOBy2SiRfimxIBtYDIQgFF19", domains: ["research-memex.org", "www.research-memex.org"] },
};
export const PROJECT = PROJECTS["linxule-com"].id;

function requireThat(condition, message) {
  if (!condition) throw new Error(message);
}

export function projectConfig(name = "linxule-com") {
  const config = PROJECTS[name];
  requireThat(config, `Unknown project "${name}"; known: ${Object.keys(PROJECTS).join(", ")}.`);
  return { name, ...config };
}

// Auto mode: current is whatever production points at, rollback is the newest
// older READY production deployment. Explicit IDs recorded during a publish
// always take precedence (see docs/publishing.md).
export function resolveKeepIds({ project, deployments }, { current, rollback } = {}) {
  const live = current ?? project.targets?.production?.id;
  requireThat(typeof live === "string", "Production deployment is unknown.");
  if (rollback) return { current: live, rollback };
  const liveRecord = deployments.find(d => d.uid === live);
  requireThat(liveRecord, "Current production deployment is missing from the inventory.");
  const previous = deployments
    .filter(d => d.state === "READY" && d.target === "production" && d.created < liveRecord.created)
    .sort((a, b) => b.created - a.created)[0];
  requireThat(previous, "No older successful production deployment exists to keep as rollback; nothing to prune.");
  return { current: live, rollback: previous.uid };
}

export function planRetention({ project, deployments, aliases }, current, rollback, config = projectConfig()) {
  requireThat(project.id === config.id && project.accountId === TEAM, "Wrong project or team.");
  requireThat(current !== rollback, "Current and rollback must be different deployments.");
  requireThat(project.targets?.production?.id === current, "Production changed; stop and recheck the publish.");
  requireThat(Array.isArray(deployments) && Array.isArray(aliases), "Incomplete deployment or alias inventory.");
  const seen = new Set();
  for (const d of deployments) {
    requireThat(d.projectId === config.id && typeof d.uid === "string" && !seen.has(d.uid), "Unexpected deployment inventory.");
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
  for (const domain of config.domains) {
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

function snapshot(api, config) {
  const query = `teamId=${TEAM}&projectId=${config.id}&limit=100`;
  return {
    project: api(`/v9/projects/${config.id}?teamId=${TEAM}`),
    deployments: api(`/v6/deployments?${query}`, { paginate: true }),
    aliases: api(`/v4/aliases?${query}`, { paginate: true }),
  };
}

export function runRetention({ project, current, rollback, apply = false }, api = vercelAPI, log = console.log) {
  const config = projectConfig(project);
  const first = snapshot(api, config);
  const keep = resolveKeepIds(first, { current, rollback });
  const plan = planRetention(first, keep.current, keep.rollback, config);
  log(JSON.stringify({ project: config.name, mode: apply ? "apply" : "dry-run", ...plan }, null, 2));
  if (!apply) return plan;
  for (const id of plan.remove) {
    // Revalidate domains, kept versions, and inventory before every deletion.
    const fresh = planRetention(snapshot(api, config), keep.current, keep.rollback, config);
    requireThat(fresh.remove.includes(id), `Deletion candidate ${id} changed; stop.`);
    requireThat(fresh.remove.every(candidate => plan.remove.includes(candidate)), "Deployment inventory changed; stop.");
    const result = api(`/v13/deployments/${id}?teamId=${TEAM}`, { remove: true });
    requireThat(result.uid === id && result.state === "DELETED", `Deletion was not confirmed for ${id}; inspect it before retrying.`);
    log(`Deleted ${id}`);
  }
  const final = planRetention(snapshot(api, config), keep.current, keep.rollback, config);
  requireThat(final.remove.length === 0, "Cleanup incomplete; additional deployments remain.");
  log("Verified: current production and one rollback are the only READY deployments.");
  return final;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const { values } = parseArgs({ options: {
      project: { type: "string", default: "linxule-com" },
      current: { type: "string" }, rollback: { type: "string" },
      auto: { type: "boolean", default: false },
      apply: { type: "boolean", default: false }, help: { type: "boolean" },
    } });
    if (values.help) {
      console.log([
        "bun run publish:retention --current dpl_NEW --rollback dpl_PREVIOUS [--apply]",
        "bun run publish:retention --project research-memex --auto [--apply]",
        "Dry-run by default. For linxule-com publishes, pass the IDs recorded during publishing;",
        "--auto keeps current production plus the newest older successful release. See docs/publishing.md.",
      ].join("\n"));
    } else {
      const isId = value => /^dpl_[a-zA-Z0-9]+$/.test(value ?? "");
      if (values.auto) {
        requireThat(!values.current && !values.rollback, "--auto and explicit IDs are mutually exclusive.");
      } else {
        requireThat(isId(values.current) && isId(values.rollback), "Supply --current and --rollback deployment IDs recorded during publishing, or --auto.");
      }
      runRetention(values);
    }
  } catch (error) {
    console.error(`Retention stopped: ${error.message}`);
    process.exitCode = 1;
  }
}
