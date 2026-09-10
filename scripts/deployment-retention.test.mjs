import { expect, test } from "bun:test";
import { planRetention, runRetention, PROJECT, TEAM } from "./deployment-retention.mjs";

function fixture() {
  return {
    project: { id: PROJECT, accountId: TEAM, targets: { production: { id: "dpl_new" } } },
    deployments: [
      { uid: "dpl_new", projectId: PROJECT, created: 30, state: "READY", target: "production" },
      { uid: "dpl_previous", projectId: PROJECT, created: 20, state: "READY", target: "production" },
      { uid: "dpl_old", projectId: PROJECT, created: 10, state: "READY", target: "production" },
      { uid: "dpl_failed", projectId: PROJECT, created: 15, state: "ERROR", target: "production" },
    ],
    aliases: ["linxule.com", "www.linxule.com"].map(alias => ({ alias, deploymentId: "dpl_new" })),
  };
}
const options = { current: "dpl_new", rollback: "dpl_previous" };
const plan = data => planRetention(data, options.current, options.rollback);

test("keeps the explicitly recorded live and rollback versions, ignoring unsuccessful builds", () => {
  expect(plan(fixture())).toEqual({ preserve: ["dpl_new", "dpl_previous"], remove: ["dpl_old"] });
});

for (const [name, mutate] of [
  ["wrong team", d => { d.project.accountId = "another-team"; }],
  ["wrong project", d => { d.deployments[2].projectId = "another-project"; }],
  ["production moved", d => { d.project.targets.production.id = "dpl_other"; }],
  ["domain moved", d => { d.aliases[0].deploymentId = "dpl_old"; }],
  ["rollback missing", d => { d.deployments.splice(1, 1); }],
  ["rollback not ready", d => { d.deployments[1].state = "ERROR"; }],
  ["preview requires review", d => { d.deployments[2].target = null; }],
  ["aliased old deployment", d => { d.aliases.push({ alias: "legacy.vercel.app", deploymentId: "dpl_old" }); }],
  ["unexpected newer release", d => { d.deployments[2].created = 25; }],
  ["build in flight", d => { d.deployments[3].state = "BUILDING"; }],
  ["missing inventory", d => { d.aliases = null; }],
]) {
  test(`refuses cleanup when ${name}`, () => {
    const data = fixture(); mutate(data);
    expect(() => plan(data)).toThrow();
  });
}

function fakeAPI(data, beforeDeleteCheck = () => {}) {
  const deleted = [];
  let projectReads = 0;
  const api = (url, flags = {}) => {
    if (flags.remove) {
      const id = url.split("/").at(-1).split("?")[0];
      deleted.push(id);
      data.deployments = data.deployments.filter(d => d.uid !== id);
      return { uid: id, state: "DELETED" };
    }
    if (url.startsWith("/v9/projects/")) {
      if (++projectReads > 1) beforeDeleteCheck(data);
      return structuredClone(data.project);
    }
    if (url.startsWith("/v6/deployments?")) return structuredClone(data.deployments);
    if (url.startsWith("/v4/aliases?")) return structuredClone(data.aliases);
    throw new Error(`Unexpected request: ${url}`);
  };
  return { api, deleted };
}

test("default dry-run never deletes; apply removes only the older successful release", () => {
  const fake = fakeAPI(fixture());
  runRetention(options, fake.api, () => {});
  expect(fake.deleted).toEqual([]);
  expect(runRetention({ ...options, apply: true }, fake.api, () => {}).remove).toEqual([]);
  expect(fake.deleted).toEqual(["dpl_old"]);
});

test("production changing between the plan and deletion stops without deleting", () => {
  const fake = fakeAPI(fixture(), d => { d.project.targets.production.id = "dpl_other"; });
  expect(() => runRetention({ ...options, apply: true }, fake.api, () => {})).toThrow("Production changed");
  expect(fake.deleted).toEqual([]);
});

test("an API deletion failure stops immediately without retrying or deleting another release", () => {
  const data = fixture();
  data.deployments.push({ ...data.deployments[2], uid: "dpl_older", created: 5 });
  const fake = fakeAPI(data); let attempts = 0;
  const api = (url, flags = {}) => {
    if (flags.remove) { attempts++; throw new Error("API failure"); }
    return fake.api(url, flags);
  };
  expect(() => runRetention({ ...options, apply: true }, api, () => {})).toThrow("API failure");
  expect(attempts).toBe(1);
  expect(fake.deleted).toEqual([]);
});
