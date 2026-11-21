/**
 * Validate machine-readable JSON emitted by the built site.
 *
 * This deliberately checks every JSON-LD block rather than a named artifact so
 * future content with quotes, markup, or non-Latin text cannot silently break
 * structured data. It also checks that the projects discovery surface and its
 * Markdown twin agree on names and URLs.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { STATIC_MARKDOWN_TWINS, buildMcpServerCard } from "../mcp/metadata.mjs";

const SITE = "_site";
const problems = [];
let jsonLdBlocks = 0;
const structuredPages = new Map();

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

// Google validates nested talk recordings as well as top-level video artifacts.
// Parseable JSON alone does not catch missing descriptions or date-only uploads.
let videos = 0;
function checkVideos(value, file) {
  if (!value || typeof value !== "object") return;
  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (types.includes("VideoObject")) {
    videos++;
    const label = `${path.relative(SITE, file)} VideoObject`;
    for (const field of ["name", "description"]) {
      if (typeof value[field] !== "string" || !value[field].trim()) {
        problems.push(`${label} is missing ${field}`);
      }
    }
    const thumbnails = Array.isArray(value.thumbnailUrl) ? value.thumbnailUrl : [value.thumbnailUrl];
    if (!thumbnails.length || thumbnails.some(url => typeof url !== "string" || !/^https?:\/\/[^/]+\//.test(url))) {
      problems.push(`${label} needs an absolute thumbnailUrl`);
    }
    if (typeof value.uploadDate !== "string" ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value.uploadDate) ||
        !Number.isFinite(Date.parse(value.uploadDate))) {
      problems.push(`${label} uploadDate must be an ISO datetime with timezone`);
    }
  }
  for (const child of Object.values(value)) checkVideos(child, file);
}

for (const file of walk(SITE).filter((candidate) => candidate.endsWith(".html"))) {
  const html = readFileSync(file, "utf8");
  for (const match of html.matchAll(
    /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    jsonLdBlocks++;
    try {
      const value = JSON.parse(match[1]);
      checkVideos(value, file);
      if (value.mainEntityOfPage && typeof value.mainEntityOfPage === "string") {
        const url = new URL(value.mainEntityOfPage).pathname.replace(/\/$/, "");
        structuredPages.set(url, { value, file: path.relative(SITE, file) });
      }
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
  else {
    // Both values must decode to the same source title. Valid JSON alone misses
    // HTML-autoescaped quotes and ampersands left inside JSON-LD raw text.
    for (const page of siteIndex.pages) {
      const structured = structuredPages.get(page.url.replace(/\/$/, ""));
      if (!structured) {
        problems.push(`${page.url} has no JSON-LD matching its page URL`);
      } else if ((structured.value.headline ?? structured.value.name) !== page.title) {
        problems.push(`${structured.file} JSON-LD title differs from site-index source title`);
      }
    }
  }
  if (!Array.isArray(siteIndex.projects)) {
    problems.push("site-index.projects is not an array");
  } else {
    const projectsMarkdownPath = path.join(SITE, "builds.md");
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
        problems.push("builds.md is missing");
      } else {
        if (project.name && !projectsMarkdown.includes(project.name)) {
          problems.push(`builds.md does not contain project "${project.name}"`);
        }
        if (project.url && !projectsMarkdown.includes(project.url)) {
          problems.push(`builds.md does not contain URL "${project.url}"`);
        }
      }
    }
  }
}

{
  // Validate ARD /.well-known/ai-catalog.json and related discovery surfaces.
  const aiCatalogPath = path.join(SITE, ".well-known", "ai-catalog.json");
  if (!existsSync(aiCatalogPath)) {
    problems.push(".well-known/ai-catalog.json is missing");
  } else {
    let rawAiCatalog = "";
    let aiCatalog;
    try {
      rawAiCatalog = readFileSync(aiCatalogPath, "utf8");
      aiCatalog = JSON.parse(rawAiCatalog);
    } catch (error) {
      problems.push(`.well-known/ai-catalog.json is invalid JSON: ${error.message}`);
    }

    if (aiCatalog && typeof aiCatalog === "object" && !Array.isArray(aiCatalog)) {
      const allowedRootKeys = new Set(["specVersion", "host", "entries"]);
      for (const key of Object.keys(aiCatalog)) {
        if (!allowedRootKeys.has(key)) {
          problems.push(`.well-known/ai-catalog.json has unexpected root key "${key}"`);
        }
      }
      if (aiCatalog.specVersion !== "1.0") {
        problems.push(`.well-known/ai-catalog.json specVersion must be "1.0"`);
      }

      const host = aiCatalog.host;
      if (!host || typeof host !== "object" || Array.isArray(host)) {
        problems.push(".well-known/ai-catalog.json host must be an object");
      } else {
        const allowedHostKeys = new Set(["displayName", "identifier", "documentationUrl", "logoUrl"]);
        for (const key of Object.keys(host)) {
          if (!allowedHostKeys.has(key)) {
            problems.push(`.well-known/ai-catalog.json host has unexpected key "${key}"`);
          }
        }
        if (typeof host.displayName !== "string" || !host.displayName.trim()) {
          problems.push(".well-known/ai-catalog.json host.displayName is missing");
        }
        if (typeof host.identifier !== "string" || !/^did:web:[a-z0-9.-]+$/.test(host.identifier)) {
          problems.push(".well-known/ai-catalog.json host.identifier must be a did:web identifier");
        }
        if (typeof host.documentationUrl !== "string" || !/^https:\/\//.test(host.documentationUrl)) {
          problems.push(".well-known/ai-catalog.json host.documentationUrl must be an https URL");
        }
      }

      const excludedHosts = [
        "a4b.linxule.com",
        "pmux.research-memex.org",
        "open-interview-staging.linxule.com",
        "media.linxule.com",
      ];
      for (const excluded of excludedHosts) {
        if (rawAiCatalog.includes(excluded)) {
          problems.push(`.well-known/ai-catalog.json must exclude "${excluded}"`);
        }
      }

      if (!Array.isArray(aiCatalog.entries) || aiCatalog.entries.length === 0) {
        problems.push(".well-known/ai-catalog.json entries must be a non-empty array");
      } else {
        const seenIds = new Set();
        const urnRe = /^urn:air:[a-zA-Z0-9.-]+(:[a-zA-Z0-9._-]+)+$/;
        for (const [idx, entry] of aiCatalog.entries.entries()) {
          const label = `ai-catalog.entries[${idx}]`;
          if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
            problems.push(`${label} is not an object`);
            continue;
          }
          if (typeof entry.identifier !== "string" || !urnRe.test(entry.identifier)) {
            problems.push(`${label}.identifier must match urn:air:<fqdn>:<ns>:<name>`);
          } else if (seenIds.has(entry.identifier)) {
            problems.push(`${label}.identifier duplicates "${entry.identifier}"`);
          } else {
            seenIds.add(entry.identifier);
          }
          for (const field of ["displayName", "type", "description"]) {
            if (typeof entry[field] !== "string" || !entry[field].trim()) {
              problems.push(`${label}.${field} is missing`);
            }
          }
          const hasUrl = Object.prototype.hasOwnProperty.call(entry, "url");
          const hasData = Object.prototype.hasOwnProperty.call(entry, "data");
          if (hasUrl === hasData) {
            problems.push(`${label} must have exactly one of "url" or "data"`);
          } else if (hasUrl && (typeof entry.url !== "string" || !/^https:\/\//.test(entry.url))) {
            problems.push(`${label}.url must be an https URL`);
          } else if (hasData) {
            if (!entry.data || typeof entry.data !== "object" || Array.isArray(entry.data)) {
              problems.push(`${label}.data must be an object`);
            } else if (entry.type === "application/mcp-server-card+json") {
              if (typeof entry.data.$schema !== "string" || !entry.data.$schema.startsWith("https://")) {
                problems.push(`${label}.data.$schema is missing`);
              }
              if (typeof entry.data.name !== "string" || !/^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/.test(entry.data.name)) {
                problems.push(`${label}.data.name must be reverse-DNS name/slug`);
              }
              if (typeof entry.data.version !== "string" || !entry.data.version.trim()) {
                problems.push(`${label}.data.version is missing`);
              }
              if (
                typeof entry.data.description !== "string" ||
                !entry.data.description.trim() ||
                entry.data.description.length > 100
              ) {
                problems.push(`${label}.data.description must be 1..100 chars`);
              }
              if (!Array.isArray(entry.data.remotes) || entry.data.remotes.length === 0) {
                problems.push(`${label}.data.remotes must be a non-empty array`);
              }
              if (!entry.data.serverInfo || typeof entry.data.serverInfo.name !== "string") {
                problems.push(`${label}.data.serverInfo.name is missing`);
              }
            }
            if (entry.version !== undefined) {
              if (typeof entry.version !== "string" || !entry.version.trim()) {
                problems.push(`${label}.version must be a non-empty string`);
              } else if (
                entry.version !== entry.data?.version ||
                entry.version !== entry.data?.serverInfo?.version
              ) {
                problems.push(
                  `${label}.version ("${entry.version}") must match data.version ("${entry.data?.version}") and data.serverInfo.version ("${entry.data?.serverInfo?.version}")`,
                );
              }
            }
          }
          if (!Array.isArray(entry.tags) || entry.tags.length === 0 || entry.tags.some((t) => typeof t !== "string" || !t.trim())) {
            problems.push(`${label}.tags must be a non-empty array of strings`);
          }
          if (
            !Array.isArray(entry.representativeQueries) ||
            entry.representativeQueries.length < 2 ||
            entry.representativeQueries.length > 5 ||
            entry.representativeQueries.some((q) => typeof q !== "string" || !q.trim())
          ) {
            problems.push(`${label}.representativeQueries must have 2..5 non-empty strings`);
          }
        }
      }
    } else if (aiCatalog !== undefined) {
      problems.push(".well-known/ai-catalog.json root must be an object");
    }
  }

  // Validate apex SEP-2127 / SEP-1649 MCP Server Card parity with Worker metadata.
  const serverCardPath = path.join(SITE, ".well-known", "mcp", "server-card.json");
  if (!existsSync(serverCardPath)) {
    problems.push(".well-known/mcp/server-card.json is missing");
  } else {
    try {
      const card = JSON.parse(readFileSync(serverCardPath, "utf8"));
      const expected = buildMcpServerCard("https://linxule.com");
      if (JSON.stringify(card) !== JSON.stringify(expected)) {
        problems.push(".well-known/mcp/server-card.json drifted from mcp/metadata.mjs");
      }
      if (typeof card.description !== "string" || card.description.length === 0 || card.description.length > 100) {
        problems.push(".well-known/mcp/server-card.json description must be 1..100 chars");
      }
      if (!Array.isArray(card.remotes) || card.remotes[0]?.url !== "https://linxule.com/mcp") {
        problems.push(".well-known/mcp/server-card.json must point remotes[0].url at https://linxule.com/mcp");
      }
      if (card.url !== "https://linxule.com/mcp" || card.serverInfo?.name !== "linxule") {
        problems.push(".well-known/mcp/server-card.json is missing SEP-1649 url or serverInfo.name");
      }
    } catch (error) {
      problems.push(`.well-known/mcp/server-card.json is invalid JSON: ${error.message}`);
    }
  }

  // Verify discovery pointers in built robots.txt and homepage HTML.
  const robotsPath = path.join(SITE, "robots.txt");
  if (!existsSync(robotsPath)) {
    problems.push("robots.txt is missing");
  } else {
    const robots = readFileSync(robotsPath, "utf8");
    if (!robots.includes("Agentmap: https://linxule.com/.well-known/ai-catalog.json")) {
      problems.push("robots.txt is missing Agentmap directive for /.well-known/ai-catalog.json");
    }
  }

  const homeHtmlPath = path.join(SITE, "index.html");
  if (existsSync(homeHtmlPath)) {
    const homeHtml = readFileSync(homeHtmlPath, "utf8");
    if (!homeHtml.includes('<link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json">')) {
      problems.push("index.html is missing <link rel=\"ai-catalog\">");
    }
  }

  // Validate RFC 9727 /.well-known/api-catalog linkset.
  const apiCatalogPath = path.join(SITE, ".well-known", "api-catalog");
  if (!existsSync(apiCatalogPath)) {
    problems.push(".well-known/api-catalog is missing");
  } else {
    try {
      const apiCatalog = JSON.parse(readFileSync(apiCatalogPath, "utf8"));
      if (
        !apiCatalog ||
        typeof apiCatalog !== "object" ||
        Array.isArray(apiCatalog) ||
        !Array.isArray(apiCatalog.linkset) ||
        apiCatalog.linkset.length === 0
      ) {
        problems.push(".well-known/api-catalog must contain a non-empty linkset array");
      } else {
        for (const [idx, item] of apiCatalog.linkset.entries()) {
          const label = `api-catalog.linkset[${idx}]`;
          if (!item || typeof item !== "object" || Array.isArray(item)) {
            problems.push(`${label} must be an object`);
            continue;
          }
          if (typeof item.anchor !== "string") {
            problems.push(`${label}.anchor is missing`);
          } else {
            try {
              const anchorUrl = new URL(item.anchor);
              if (anchorUrl.protocol !== "https:") {
                problems.push(`${label}.anchor must use https://`);
              }
            } catch {
              problems.push(`${label}.anchor ("${item.anchor}") is not a valid URL`);
            }
          }
        }
      }
    } catch (error) {
      problems.push(`.well-known/api-catalog is invalid JSON: ${error.message}`);
    }
  }

  // Validate Agent Skills Discovery v0.2.0 index and SHA-256 parity with built artifacts.
  const agentSkillsIndexPath = path.join(SITE, ".well-known", "agent-skills", "index.json");
  if (!existsSync(agentSkillsIndexPath)) {
    problems.push(".well-known/agent-skills/index.json is missing");
  } else {
    try {
      const skillsIndex = JSON.parse(readFileSync(agentSkillsIndexPath, "utf8"));
      if (!skillsIndex || typeof skillsIndex !== "object" || Array.isArray(skillsIndex)) {
        problems.push(".well-known/agent-skills/index.json root must be an object");
      } else {
        if (skillsIndex.$schema !== "https://schemas.agentskills.io/discovery/0.2.0/schema.json") {
          problems.push(".well-known/agent-skills/index.json $schema must be the v0.2.0 discovery schema URL");
        }
        if (!Array.isArray(skillsIndex.skills) || skillsIndex.skills.length === 0) {
          problems.push(".well-known/agent-skills/index.json skills must be a non-empty array");
        } else {
          for (const [idx, skill] of skillsIndex.skills.entries()) {
            const label = `agent-skills.skills[${idx}]`;
            if (!skill || typeof skill !== "object" || Array.isArray(skill)) {
              problems.push(`${label} must be an object`);
              continue;
            }
            for (const field of ["name", "type", "description", "url", "digest"]) {
              if (typeof skill[field] !== "string" || !skill[field].trim()) {
                problems.push(`${label}.${field} is missing`);
              }
            }
            if (typeof skill.url === "string" && typeof skill.digest === "string") {
              if (!skill.url.startsWith("/") || skill.url.includes("..")) {
                problems.push(`${label}.url ("${skill.url}") must be a root-relative path`);
              } else if (!/^sha256:[0-9a-f]{64}$/.test(skill.digest)) {
                problems.push(`${label}.digest ("${skill.digest}") must be sha256:<64 lowercase hex>`);
              } else {
                const builtSkillPath = path.join(SITE, skill.url.replace(/^\//, ""));
                if (!existsSync(builtSkillPath)) {
                  problems.push(`${label} target file is missing in _site: ${skill.url}`);
                } else {
                  const actualDigest = `sha256:${createHash("sha256").update(readFileSync(builtSkillPath)).digest("hex")}`;
                  if (skill.digest !== actualDigest) {
                    problems.push(`${label}.digest (${skill.digest}) does not match built ${skill.url} (${actualDigest})`);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      problems.push(`.well-known/agent-skills/index.json is invalid JSON: ${error.message}`);
    }
  }

  // Verify every static Markdown twin declared in mcp/metadata.mjs exists in _site/.
  for (const [canonicalPath, entry] of Object.entries(STATIC_MARKDOWN_TWINS)) {
    const builtMdPath = path.join(SITE, entry.mdPath.replace(/^\//, ""));
    if (!existsSync(builtMdPath)) {
      problems.push(`STATIC_MARKDOWN_TWINS["${canonicalPath}"] missing built file _site${entry.mdPath}`);
    } else if (statSync(builtMdPath).size === 0) {
      problems.push(`STATIC_MARKDOWN_TWINS["${canonicalPath}"] built file _site${entry.mdPath} is empty`);
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
  `[built-json-lint] OK — ${jsonLdBlocks} JSON-LD block(s), ${videos} VideoObject(s), site-index.json, builds.md, .well-known/mcp/server-card.json, .well-known/ai-catalog.json, .well-known/api-catalog, .well-known/agent-skills/index.json, and ${Object.keys(STATIC_MARKDOWN_TWINS).length} static Markdown twins parsed/agree`,
);
