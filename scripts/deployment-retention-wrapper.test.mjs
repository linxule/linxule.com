import { expect, test } from "bun:test";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const source = readFileSync(new URL("./vercel-retention.sh", import.meta.url), "utf8");

test("the maintained wrapper is directly executable by launchd", () => {
  expect(statSync(new URL("./vercel-retention.sh", import.meta.url)).mode & 0o111).toBe(0o111);
  expect(source.startsWith("#!/bin/zsh\n")).toBe(true);
});

// Exercise the actual wrapper with an isolated filesystem and a stub executable.
// No test can invoke Vercel, real retention, or the installed wrapper.
function run(first, { missingSite = false, badLog = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "retention-wrapper-test-"));
  try {
    const bin = join(dir, "bin");
    const site = join(dir, "site");
    const log = join(dir, "run.log");
    mkdirSync(bin);
    if (!missingSite) mkdirSync(site);
    if (badLog) mkdirSync(log);
    writeFileSync(join(bin, "bun"), `#!/bin/sh\nprintf 'stub project=%s args=%s\\n' "$3" "$*"\ncase "$3" in research-memex) exit ${first};; *) exit 99;; esac\n`, { mode: 0o755 });
    for (const pattern of [/^export PATH=.*$/gm, /^SITE=.*$/gm, /^LOG=.*$/gm]) {
      expect([...source.matchAll(pattern)]).toHaveLength(1);
    }
    const script = source
      .replace(/^export PATH=.*$/m, `export PATH="${bin}:/usr/bin:/bin"`)
      .replace(/^SITE=.*$/m, `SITE="${site}"`)
      .replace(/^LOG=.*$/m, `LOG="${log}"`);
    expect(script).not.toContain('SITE="$HOME/');
    expect(script).not.toContain('LOG="$HOME/');
    expect(script).toContain(`export PATH="${bin}:/usr/bin:/bin"`);
    expect(script).not.toContain(".bun/bin");
    const executable = join(dir, "wrapper.sh");
    writeFileSync(executable, script, { mode: 0o755 });
    const result = spawnSync(executable, [], { encoding: "utf8" });
    return { status: result.status, log: badLog ? "" : readFileSync(log, "utf8") };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

for (const first of [0, 1, 2]) {
  test(`preserves run and status for exit ${first}`, () => {
    const result = run(first);
    expect(result.status).toBe(first ? 1 : 0);
    expect(result.log).toContain("stub project=research-memex args=scripts/deployment-retention.mjs --project research-memex --auto --apply");
    expect(result.log).toContain("--- research-memex:");
    expect(result.log).not.toContain("linxule-com");
    if (first) expect(result.log).toContain(`research-memex: failed (exit ${first})`);
  });
}

test("missing checkout stops without invoking retention", () => {
  const result = run(0, { missingSite: true });
  expect(result.status).toBe(1);
  expect(result.log).toContain("site checkout missing");
  expect(result.log).not.toContain("stub project=");
});

test("log redirection failure is not reported as success", () => {
  expect(run(0, { badLog: true }).status).toBe(1);
});
