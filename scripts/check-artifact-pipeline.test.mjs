import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const artifactLayout = read("src/_includes/layouts/artifact.njk");
const creatorLayout = read("src/making/creator/creator.njk");
const creatorFamilyLayout = read("src/making/creator/family.njk");
const baseLayout = read("src/_includes/layouts/base.njk");
const markdownTwin = read("src/md-outputs/artifacts.md.njk");
const artifactSource = read(
  "src/making/artifacts/artifact-2026-07-27-three-begets-ten-thousand-things.md",
);
const kimiosSource = read(
  "src/making/artifacts/artifact-2026-06-13-kimios.md",
);
const tideGardenSource = read(
  "src/making/artifacts/artifact-2026-04-20-tide-garden.md",
);
const scoredSource = read(
  "src/making/artifacts/artifact-2026-06-09-something-in-the-glass-scored.md",
);
const noPrivilegedAccessSource = read(
  "src/making/artifacts/artifact-2026-06-16-no-privileged-access.md",
);
const videoWrapper = read(
  "src/assets/artifacts/ten-thousand-things/index.html",
);
const indexNowScript = read("scripts/indexnow-submit.sh");
const buildFreshnessScript = read("scripts/build-freshness.mjs");
const deployGuidePath = ".claude/rules/deploying-artifacts.md";
const deployGuideExists = existsSync(deployGuidePath);
const deployGuide = deployGuideExists ? read(deployGuidePath) : "";

describe("artifact publishing contract", () => {
  test("Pagefind covers the full artifact narrative, not only the hero", () => {
    const pagefindStart = artifactLayout.indexOf(
      'class="artifact-page" data-pagefind-body',
    );
    const collaborator = artifactLayout.indexOf(
      'class="collaborator-context"',
    );
    const witnesses = artifactLayout.indexOf('class="witnesses-context"');
    const pagefindEnd = artifactLayout.indexOf(
      "{# end artifact Pagefind body #}",
    );

    expect(pagefindStart).toBeGreaterThan(-1);
    expect(collaborator).toBeGreaterThan(pagefindStart);
    expect(witnesses).toBeGreaterThan(collaborator);
    expect(pagefindEnd).toBeGreaterThan(witnesses);
  });

  test("same-origin iframe privileges are opt-in across artifact listings", () => {
    for (const layout of [
      artifactLayout,
      creatorLayout,
      creatorFamilyLayout,
    ]) {
      expect(layout).toContain(
        'iframeCapabilities | default(["allow-scripts"])',
      );
      expect(layout).not.toContain(
        'sandbox="allow-scripts allow-same-origin"',
      );
    }

    expect(creatorLayout).toContain("?v={{ site.version }}");
    expect(creatorFamilyLayout).toContain("?v={{ site.version }}");
  });

  test("script-free video wrappers opt out of iframe privileges", () => {
    expect(artifactSource).toContain("iframeCapabilities: []");
    expect(kimiosSource).toContain("iframeCapabilities: []");
    expect(tideGardenSource).toContain("iframeCapabilities: []");
  });

  test("nested Strudel players declare their reviewed same-origin exception", () => {
    for (const source of [scoredSource, noPrivilegedAccessSource]) {
      expect(source).toContain(
        "iframeCapabilities: [allow-scripts, allow-same-origin]",
      );
      expect(source).toContain("Reviewed sandbox exception:");
    }
  });

  test("artifact JSON-LD is escaped, credited, and video-aware", () => {
    expect(baseLayout).toContain('"creditText"');
    expect(baseLayout).toContain('"VideoObject"');
    expect(baseLayout).toContain("title | dump | safe");
    expect(baseLayout).toContain("thumbnailUrl");
    expect(baseLayout).toContain(
      '"creator": {"@type": "SoftwareApplication"',
    );
  });

  test("the TTT source declares structured video and an accessible alternative", () => {
    expect(artifactSource).toContain("mediaType: video");
    expect(artifactSource).toContain("contentUrl:");
    expect(artifactSource).toContain("duration: PT49S");
    expect(artifactSource).toContain("mediaDescription:");
    expect(artifactSource).toContain("loop: true");
    expect(artifactSource).toContain(
      "creditText: Kimi K3, running in Kimi Code",
    );
    expect(artifactSource).toContain("schemaCreator: Kimi K3");
    expect(videoWrapper).toMatch(/\sloop(?:\s|>)/);
  });

  test("Markdown twins describe media rather than calling every source an image", () => {
    expect(markdownTwin).toContain("**Video player**");
    expect(markdownTwin).toContain("**Poster**");
    expect(markdownTwin).not.toContain("**Image**: {{ artifact.data.src }}");
  });

  test("fullscreen controls expose state and restore focus", () => {
    expect(artifactLayout).toContain('aria-expanded="false"');
    expect(artifactLayout).toContain(
      "fullscreenBtn.setAttribute('aria-expanded'",
    );
    expect(artifactLayout).toContain("fullscreenBtn.focus()");
    expect(artifactLayout).toContain("function inertOutside(element)");
    expect(artifactLayout).toContain("function trapFocus(event, root)");
    expect(artifactLayout).toContain("trapFocus(e, fullscreenOverlay)");
    expect(artifactLayout).toContain("trapFocus(e, container)");
  });

  test("the global rendering marker stays out of the Making book", () => {
    expect(baseLayout).toContain(
      "mdAlternate and page.url != '/making/'",
    );
  });

  test("manual IndexNow publication has an explicit, documented bypass", () => {
    expect(indexNowScript).toContain('${INDEXNOW_FORCE:-}" != "1"');
    expect(indexNowScript).toContain("src/indexnow-key.njk");
    expect(indexNowScript).toContain("public verification token");
  });

  test("build freshness can identify a Vercel checkout without Git metadata", () => {
    expect(buildFreshnessScript).toContain(
      "process.env.VERCEL_GIT_COMMIT_SHA",
    );
  });

  test.skipIf(!deployGuideExists)("the guide makes looping a per-work decision", () => {
    expect(deployGuide).toContain("loop: true");
    expect(deployGuide).toContain("loop: false");
  });
});
