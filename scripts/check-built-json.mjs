/**
 * Validate machine-readable JSON emitted by the built site.
 *
 * This deliberately checks every JSON-LD block rather than a named artifact so
 * future content with quotes, markup, or non-Latin text cannot silently break
 * structured data. It also checks that the projects discovery surface and its
 * Markdown twin agree on names and URLs.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const SITE = "_site";
const problems = [];
let jsonLdBlocks = 0;

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

for (const file of walk(SITE).filter((candidate) => candidate.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    jsonLdBlocks++;
    try {
      JSON.parse(match[1]);
    } catch (error) {
      problems.push(
        `${path.relative(SITE, file)} has invalid JSON-LD: ${error.message}`,
      );
    }
  }
}

const indexPath = path.join(SITE, "site-index.json");
let siteIndex;
if (!existsSync(indexPath)) {
  problems.push("site-index.json is missing");
} else {
  try {
    siteIndex = JSON.parse(readFileSync(indexPath, "utf8"));
  } catch (error) {
    problems.push(`site-index.json is invalid JSON: ${error.message}`);
  }
}

if (siteIndex) {
  if (!Array.isArray(siteIndex.pages)) problems.push("site-index.pages is not an array");
  if (!Array.isArray(siteIndex.projects)) {
    problems.push("site-index.projects is not an array");
  } else {
    const projectsMarkdownPath = path.join(SITE, "projects.md");
    const projectsMarkdown = existsSync(projectsMarkdownPath)
      ? readFileSync(projectsMarkdownPath, "utf8")
      : "";
    const seenNames = new Set();
    for (const [index, project] of siteIndex.projects.entries()) {
      const label = `site-index.projects[${index}]`;
      if (!project || typeof project !== "object") {
        problems.push(`${label} is not an object`);
        continue;
      }
      if (typeof project.name !== "string" || !project.name.trim()) {
        problems.push(`${label}.name is missing`);
      } else if (seenNames.has(project.name)) {
        problems.push(`${label}.name duplicates "${project.name}"`);
      } else {
        seenNames.add(project.name);
      }
      if (typeof project.url !== "string" || !/^https?:\/\//.test(project.url)) {
        problems.push(`${label}.url is not absolute`);
      }
      if (!projectsMarkdown) {
        problems.push("projects.md is missing");
      } else {
        if (project.name && !projectsMarkdown.includes(project.name)) {
          problems.push(`projects.md does not contain project "${project.name}"`);
        }
        if (project.url && !projectsMarkdown.includes(project.url)) {
          problems.push(`projects.md does not contain URL "${project.url}"`);
        }
      }
    }
  }
}

if (problems.length) {
  console.error(
    `[built-json-lint] FAILED — ${problems.length} problem(s):\n` +
      problems.map((problem) => `  - ${problem}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `[built-json-lint] OK — ${jsonLdBlocks} JSON-LD block(s), site-index.json, and projects.md parsed/agree`,
);
