import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import registerCollections from "../eleventy/collections.js";

const read = (file) => readFileSync(file, "utf8");

const artifactLayout = read("src/_includes/layouts/artifact.njk");
const creatorLayout = read("src/making/creator/creator.njk");
const creatorFamilyLayout = read("src/making/creator/family.njk");
const filterBookPath = "src/_includes/components/making-filter-book.njk";
const filterBook = existsSync(filterBookPath) ? read(filterBookPath) : "";
const baseLayout = read("src/_includes/layouts/base.njk");
const markdownTwin = read("src/md-outputs/artifacts.md.njk");
const indexNowScript = read("scripts/indexnow-submit.sh");
const buildFreshnessScript = read("scripts/build-freshness.mjs");

const artifactDocs = readdirSync("src/making/artifacts")
  .filter((f) => f.endsWith(".md"))
  .sort()
  .map((file) => {
    const fullPath = path.join("src/making/artifacts", file);
    const raw = read(fullPath);
    const { data, content } = matter(raw, { cache: false });
    return { file, fullPath, raw, data, content };
  });

describe("artifact publishing contract", () => {
  test("a family-only credit stays discoverable without colliding with its family page", () => {
    const registered = {};
    registerCollections({ addCollection: (name, callback) => { registered[name] = callback; } });
    const generic = { data: { creator: "claude" }, date: new Date("2026-10-09") };
    const specific = { data: { creator: "claude opus 5.5" }, date: new Date("2026-09-28") };
    const api = { getFilteredByGlob: () => [generic, specific] };
    const models = registered.artifactsByCreator(api);
    const families = registered.artifactsByCreatorFamily(api);
    expect(models.map((item) => item.slug)).toEqual(["claude-opus-55"]);
    expect(families[0].items).toEqual([generic, specific]);
    expect(new Set([...models, ...families].map((item) => item.slug)).size).toBe(2);
  });

  test("gpt-6 astra and gpt 6 astra merge under the gpt family without splitting into gpt-6", () => {
    const registered = {};
    registerCollections({ addCollection: (name, callback) => { registered[name] = callback; } });
    const hyphenated = { data: { creator: "gpt-6 astra" }, date: new Date("2026-09-19") };
    const spaced = { data: { creator: "gpt 6 astra" }, date: new Date("2026-09-08") };
    const api = { getFilteredByGlob: () => [hyphenated, spaced] };
    const models = registered.artifactsByCreator(api);
    const families = registered.artifactsByCreatorFamily(api);
    expect(models.map((item) => item.slug)).toEqual(["gpt-6-astra"]);
    expect(models[0].count).toBe(2);
    expect(families.map((item) => item.slug)).toEqual(["gpt"]);
    expect(families[0].count).toBe(2);
  });

  test("portraitsByPrompter guards against family-only single-word slug collisions", () => {
    const registered = {};
    registerCollections({ addCollection: (name, callback) => { registered[name] = callback; } });
    const generic = { data: { prompter: "claude" }, date: new Date("2026-10-09") };
    const specific = { data: { prompter: "claude fable 5" }, date: new Date("2026-09-28") };
    const api = { getFilteredByGlob: () => [generic, specific] };
    const models = registered.portraitsByPrompter(api);
    const families = registered.portraitsByPrompterFamily(api);
    expect(models.map((item) => item.slug)).toEqual(["claude-fable-5"]);
    expect(families.map((item) => item.slug)).toEqual(["claude"]);
    expect(families[0].count).toBe(2);
  });

  test("every artifact source satisfies core schema invariants", () => {
    expect(artifactDocs.length).toBeGreaterThan(20);
    for (const { file, data } of artifactDocs) {
      expect(typeof data.title, `${file} title`).toBe("string");
      expect(data.title.trim().length, `${file} title non-empty`).toBeGreaterThan(0);
      expect(data.date, `${file} date`).toBeDefined();
      expect(typeof data.creator, `${file} creator`).toBe("string");
      expect(data.layout, `${file} layout`).toBe("layouts/artifact.njk");

      if (Array.isArray(data.images)) {
        for (const [idx, img] of data.images.entries()) {
          expect(typeof img.src, `${file} images[${idx}].src`).toBe("string");
          expect(typeof img.alt, `${file} images[${idx}].alt`).toBe("string");
        }
      }

      if (typeof data.src === "string" && /\.html?$/i.test(data.src)) {
        expect(typeof data.thumbnail, `${file} HTML artifact must declare thumbnail`).toBe("string");
        if (data.thumbnail.startsWith("/")) {
          expect(
            existsSync(path.join("src", data.thumbnail.slice(1))),
            `${file} thumbnail exists: ${data.thumbnail}`,
          ).toBe(true);
        }
      }
    }
  });

  test("every video artifact declares structured video metadata, minimal iframe privileges, and matching loop flag", () => {
    const videos = artifactDocs.filter(({ data }) => data.mediaType === "video");
    expect(videos.length).toBeGreaterThan(0);

    for (const { file, data } of videos) {
      expect(typeof data.thumbnail, `${file} video poster`).toBe("string");
      expect(typeof data.mediaDescription, `${file} accessible mediaDescription`).toBe("string");
      expect(typeof data.video?.contentUrl, `${file} video.contentUrl`).toBe("string");

      if (typeof data.src === "string" && data.src.startsWith("/")) {
        const wrapperPath = path.join("src", data.src.slice(1));
        expect(existsSync(wrapperPath), `${file} wrapper exists`).toBe(true);
        const wrapperHtml = read(wrapperPath);
        // Script-free video wrappers must opt out of iframe script privileges.
        if (!/<script\b/i.test(wrapperHtml)) {
          expect(data.iframeCapabilities, `${file} script-free video wrapper must opt out of iframe scripts`).toEqual([]);
        }
        if (data.loop === true) {
          expect(wrapperHtml, `${file} looping video wrapper carries loop attr`).toMatch(/\sloop(?:\s|>)/);
        }
      }
    }
  });

  test("any artifact requesting allow-same-origin documents its reviewed sandbox exception", () => {
    const sameOriginArtifacts = artifactDocs.filter(
      ({ data }) => Array.isArray(data.iframeCapabilities) && data.iframeCapabilities.includes("allow-same-origin"),
    );
    for (const { file, raw } of sameOriginArtifacts) {
      expect(raw, `${file} must document Reviewed sandbox exception`).toContain("Reviewed sandbox exception:");
    }
  });

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

  test("same-origin iframe privileges are opt-in across artifact templates", () => {
    const templates = [artifactLayout, creatorLayout, creatorFamilyLayout, filterBook].filter(Boolean);
    for (const layout of templates) {
      expect(layout).not.toContain('sandbox="allow-scripts allow-same-origin"');
    }
    expect(artifactLayout).toContain('iframeCapabilities | default(["allow-scripts"])');
    // Creator templates may either render iframes directly or delegate via making-filter-book.njk.
    const creatorSurface = `${creatorLayout}\n${creatorFamilyLayout}\n${filterBook}`;
    if (creatorSurface.includes("<iframe")) {
      expect(creatorSurface).toContain('iframeCapabilities | default(["allow-scripts"])');
      expect(creatorSurface).toContain("?v={{ site.version }}");
    }
  });

  test("artifact JSON-LD is escaped, credited, and video-aware", () => {
    expect(baseLayout).toContain('"creditText"');
    expect(baseLayout).toContain('"VideoObject"');
    expect(baseLayout).toContain("title | jsonScript | safe");
    expect(baseLayout).toContain("thumbnailUrl");
    expect(baseLayout).toContain(
      '"creator": {"@type": "SoftwareApplication"',
    );
  });

  test("Markdown twins describe media rather than calling every source an image", () => {
    expect(markdownTwin).toContain("**Video player**");
    expect(markdownTwin).toContain("**Poster**");
    expect(markdownTwin).not.toContain("**Image**: {{ artifact.data.src }}");
  });

  test("fullscreen controls expose state and use the shared host modal", () => {
    expect(artifactLayout).toContain('aria-expanded="false"');
    expect(artifactLayout).toContain(
      "fullscreenBtn.setAttribute('aria-expanded'",
    );
    expect(artifactLayout).toContain("import { createHostModal } from '/assets/js/host-modal.js");
    expect(artifactLayout).toContain("createHostModal(fullscreenOverlay");
    expect(artifactLayout).toContain("createHostModal(container");
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
});
