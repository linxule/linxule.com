import { beforeAll, describe, expect, test } from "bun:test";
import Eleventy from "@11ty/eleventy";

const PLAY_URL = "https://linxule.com/play/";
const PLAY_COPY =
  "No telemetry, no API calls, no external runtime dependencies — fully offline once downloaded.";

let rendered;

beforeAll(async () => {
  const eleventy = new Eleventy("src", undefined, {
    configPath: "eleventy.config.js",
    quietMode: true,
  });
  rendered = await eleventy.toJSON();
});

function output(url) {
  const page = rendered.find((entry) => entry.url === url);
  expect(page, `missing rendered output for ${url}`).toBeDefined();
  return page.content;
}

describe("/play integration", () => {
  test("publishes the Worker-canonical URL in the sitemap exactly once", () => {
    const sitemap = output("/sitemap.xml");
    const locations = [
      ...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),
    ].map((match) => match[1]);

    expect(locations.filter((location) => location === PLAY_URL)).toHaveLength(1);
    expect(locations).not.toContain("https://linxule.com/play");
  });

  test("keeps the project index entry canonical and accurately scoped", () => {
    const siteIndex = JSON.parse(output("/site-index.json"));
    const matches = siteIndex.projects.filter(
      (project) => project.name === "AI Simulator",
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].url).toBe(PLAY_URL);
    expect(matches[0].description).toContain(PLAY_COPY);
    expect(matches[0].description).not.toContain("zero network calls");
  });

  test("keeps primary and secondary links in both project renderings", () => {
    const markdown = output("/projects.md");
    const html = output("/projects/");
    const expectedLinks = [
      PLAY_URL,
      "https://linxule.itch.io/ai-simulator",
      "https://github.com/linxule/ai-simulator",
    ];

    for (const link of expectedLinks) {
      expect(markdown).toContain(link);
    }
    expect(markdown).toContain(PLAY_COPY);

    expect(html).toContain('href="/play/"');
    expect(html).toContain('href="https://linxule.itch.io/ai-simulator"');
    expect(html).toContain('href="https://github.com/linxule/ai-simulator"');
    expect(html).toContain(PLAY_COPY);
  });
});
