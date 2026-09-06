import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import nunjucks from "nunjucks";
import { decodeXML } from "entities";
import filters from "../eleventy/filters.js";
import renderingFidelity from "../eleventy/rendering-fidelity.js";

const site = {
  url: "https://linxule.com", author: "Xule Lin", authorZh: "林徐乐",
  title: "Xule Lin", description: "The source remains.",
};
const env = new nunjucks.Environment(null, { autoescape: true });
const config = { addFilter: (name, filter) => env.addFilter(name, filter) };
filters(config);
renderingFidelity(config);
const read = (file) => readFileSync(file, "utf8");
const markdownTemplate = nunjucks.compile(matter(read("src/md-outputs/artifacts.md.njk")).content, env);
const feedTemplate = nunjucks.compile(matter(read("src/feed.njk")).content, env);
const base = read("src/_includes/layouts/base.njk");
const structuredTemplate = nunjucks.compile(base.slice(
  base.indexOf("{# JSON-LD Structured Data #}"), base.indexOf("{% block head %}"),
), env);

function source(file) {
  const parsed = matter(read(file));
  const defaults = file.startsWith("src/talks/") ? JSON.parse(read("src/talks/talks.json")) : {};
  const data = { ...defaults, ...parsed.data };
  const url = "/" + file.replace(/^src\//, "").replace(/(?:\/index)?\.md$/, "/");
  return { data, rawInput: parsed.content, url, date: new Date(data.date), fileSlug: path.basename(file, ".md") };
}

const artifacts = [
  "artifact-2026-08-08-hortus-machinarum",
  "artifact-2026-04-13-nyan-wave",
  "artifact-2026-02-10-claude-self-portrait",
].map((name) => source(`src/making/artifacts/${name}.md`));

function elements(xml, tag) {
  return [...xml.matchAll(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "g"))]
    .map((match) => match[1]);
}
function text(xml, tag) { return elements(xml, tag).map(decodeXML); }
function parseStructured(data, url, extras = {}) {
  const html = structuredTemplate.render({
    ...data, site, page: { url }, collections: { concepts: [] },
    metaDescription: data.description || data.subtitle || site.description,
    date: new Date(data.date), ...extras,
  });
  return { html, values: elements(html, "script").map((json) => JSON.parse(json)) };
}

describe("artifact Markdown catalogs", () => {
  for (const artifact of artifacts) {
    test(`${artifact.data.title}: every exhibited work retains its path, alternative, and interpretation`, () => {
      const output = markdownTemplate.render({ artifact, site });
      const catalog = output.split("## Exhibited Works")[1].split("## Context")[0];
      const entries = catalog.split(/\n### /).slice(1);
      expect(entries).toHaveLength(artifact.data.images.length);
      artifact.data.images.forEach((image, index) => {
        const entry = entries[index];
        expect(entry).toContain(`](${new URL(image.src, site.url).href})`);
        expect(entry.match(/\*\*Description\*\*: (.*)/)?.[1]).toBe(image.alt);
        expect(entry.match(/\*\*Interpretation\*\*: (.*)/)?.[1]).toBe(image.interpretation);
        expect(entry.startsWith(image.src.endsWith(".html") ? "Interactive variation" : "Image")).toBe(true);
      });
      expect(output).toContain(`**Creator**: ${artifact.data.creator}`);
    });
  }

  test("single video works preserve the player, remote file, poster, and description without a gallery", () => {
    const artifact = source("src/making/artifacts/artifact-2026-07-27-three-begets-ten-thousand-things.md");
    const output = markdownTemplate.render({ artifact, site });
    expect(output).toContain(`**Video player**: [Open the embedded player](${site.url}${artifact.data.src})`);
    expect(output).toContain(artifact.data.video.contentUrl);
    expect(output).toContain(`**Poster**: [Open the poster](${site.url}${artifact.data.thumbnail})`);
    const description = artifact.data.mediaDescription.replace(/<[^>]+>/g, "").trim();
    expect(output).toContain(description);
    expect(output).not.toContain("## Exhibited Works");
  });

  test("catalog URLs preserve external sources and source query strings", () => {
    const artifact = { data: {
      title: "A variation", images: [{ src: "https://example.org/work.png?a=1&b=2", alt: "A & B", interpretation: "An external plate." }],
    }, date: new Date("2026-09-06"), rawInput: "", url: "/making/artifacts/a/" };
    const output = markdownTemplate.render({ artifact, site });
    expect(output).toContain("](https://example.org/work.png?a=1&b=2)");
    expect(output).toContain("**Description**: A & B");
  });
});

describe("Atom fidelity", () => {
  test("real source author shapes and full captions survive feed rendering", () => {
    const seam = source("src/writing/seam-02-the-saturday-meeting.md");
    const takeoff = source("src/writing/the-social-science-takeoff-has-begun.md");
    const portrait = source("src/making/portraits/portraits-2026-06-18-the-friction-of-synthesis.md");
    const paper = source("src/papers/interpretive-orchestration/index.md");
    const talk = source("src/talks/haio-symposium.md");
    const collections = { writing: [seam, takeoff], portraits: [portrait], artifacts, talks: [talk], papers: [paper] };
    const output = feedTemplate.render({ site, collections });
    expect(text(output.split("<entry>")[0], "name")).toEqual([site.author]);
    const entries = new Map(elements(output, "entry").map((entry) => [text(entry, "id")[0], entry]));
    const entry = (item) => entries.get(site.url + item.url);
    const authorNames = (item) => elements(entry(item), "author").flatMap((author) => text(author, "name"));
    expect(authorNames(seam)).toEqual(seam.data.authors);
    expect(authorNames(paper)).toEqual(paper.data.authors.map((author) => author.name));
    expect(authorNames(talk)).toEqual(talk.data.speakers);
    expect(authorNames(portrait)).toEqual([portrait.data.prompter]);
    expect(elements(entry(portrait), "contributor").flatMap((contributor) => text(contributor, "name"))).toEqual([portrait.data.generator]);
    expect(text(entry(seam), "summary")).toEqual([seam.data.subtitle]);
    expect(text(entry(takeoff), "summary")).toEqual([takeoff.data.description]);
    expect(text(entry(paper), "summary")).toEqual([paper.data.abstract]);
    for (const artifact of artifacts) {
      expect(authorNames(artifact)).toEqual([artifact.data.creator]);
      expect(text(entry(artifact), "summary")).toEqual([artifact.data.contextExcerpt.map((line) => line.text ?? line).join("\n")]);
    }
    expect(text(entry(portrait), "summary")).toEqual([portrait.data.prompt.map((line) => line.text ?? line).join("\n")]);
  });

  test("XML escaping preserves literal punctuation, authors, and fallback descriptions", () => {
    const description = 'A "quoted" & <literal> caption.\nThe complete second line.';
    const item = { data: { title: '"X" & Y', description, authors: ['A & B', '<named collaborator>'] }, url: "/writing/escaping/", date: new Date("2026-09-06") };
    const output = feedTemplate.render({ site, collections: { writing: [item], portraits: [], artifacts: [], talks: [], papers: [] } });
    const [entry] = elements(output, "entry");
    expect(text(entry, "title")).toEqual([item.data.title]);
    expect(text(entry, "summary")).toEqual([description]);
    expect(elements(entry, "author").flatMap((author) => text(author, "name"))).toEqual(item.data.authors);
    expect(entry).not.toContain("<literal>");
  });
});

describe("JSON-LD decoded source fidelity", () => {
  function markdownFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? markdownFiles(file) : file.endsWith(".md") ? [file] : [];
    });
  }

  test("every current content title and writing description decodes exactly to its frontmatter", () => {
    const files = ["src/writing", "src/making/portraits", "src/making/artifacts", "src/talks", "src/papers"].flatMap(markdownFiles);
    let checked = 0;
    for (const file of files) {
      const item = source(file);
      if (!/^layouts\/(writing|portrait|artifact|talk|paper)\.njk$/.test(item.data.layout)) continue;
      const { values } = parseStructured(item.data, item.url);
      expect(values).toHaveLength(1);
      expect(values[0].headline ?? values[0].name).toBe(item.data.paperTitle ?? item.data.title);
      if (item.data.layout === "layouts/writing.njk") {
        expect(values[0].description).toBe(item.data.description ?? item.data.subtitle ?? site.description);
        expect(values[0].author.map((author) => author.name)).toEqual(item.data.authors ?? []);
      }
      checked++;
    }
    expect(checked).toBeGreaterThan(100);
  });

  test("quotes, backslashes, Unicode, and script-closing text round-trip in every content shape", () => {
    const literal = '"Quoted" & literal &quot; \\ 中文\n</script><script>alert("text")</script>';
    for (const shape of ["writing", "portrait", "artifact", "talk", "paper"]) {
      const data = {
        layout: `layouts/${shape}.njk`, title: literal, description: literal,
        authors: shape === "paper" ? [{ name: literal }] : [literal],
        prompter: literal, creator: literal, speakers: [literal],
        date: "2026-09-06", paperTitle: shape === "paper" ? literal : undefined,
        abstract: "A complete abstract.", defines: [{ term: literal, definition: literal }],
      };
      const { html, values } = parseStructured(data, `/${shape}/escaping/`);
      expect(values).toHaveLength(1);
      expect(values[0].headline ?? values[0].name).toBe(literal);
      if (shape !== "paper") expect(values[0].description).toBe(literal);
      expect((html.match(/<\/script>/gi) || []).length).toBe(1);
      const name = shape === "artifact" || shape === "portrait"
        ? values[0].creator.name : values[0].author[0].name;
      expect(name).toBe(literal);
      if (shape === "writing") expect(values[0].hasPart[0].description).toBe(literal);
    }
  });

  test("profile, concepts, and projects preserve their authored strings in script elements", () => {
    const literal = '"Name" & 中文 </script>';
    const homepage = parseStructured({}, "/", { site: { ...site, author: literal, description: literal } });
    expect(homepage.values[0].mainEntity.name).toBe(literal);
    expect(homepage.values[0].mainEntity.description).toBe(literal);
    expect(homepage.values[0].mainEntity.image.caption).toBe(`${literal} ${site.authorZh}`);
    const concepts = parseStructured({}, "/concepts/", { collections: { concepts: [{ term: literal, definition: literal, url: "/writing/concept/", anchor: "concept" }] } });
    expect(concepts.values[0].hasDefinedTerm[0].name).toBe(literal);
    expect(concepts.values[0].hasDefinedTerm[0].description).toBe(literal);
    const projects = parseStructured({}, "/builds/", { groups: [{ projects: [{ name: literal, description: literal, href: "https://github.com/example/work" }] }] });
    expect(projects.values[0].hasPart[0].name).toBe(literal);
    expect(projects.values[0].hasPart[0].description).toBe(literal);
    for (const { html } of [homepage, concepts, projects]) {
      expect((html.match(/<\/script>/gi) || []).length).toBe(1);
    }
  });
});
