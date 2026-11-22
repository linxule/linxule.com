/**
 * Human–AI collaborator lineage aggregated across the whole archive:
 *   - `src/writing/*.md` (`authors`)
 *   - `src/papers/<slug>/index.md` (`authors`)
 *   - `src/cv/index.md` (`# Under Review`, `# Working Papers`, `# Public Scholarship` co-authors)
 *   - `src/making/portraits/*.md` (`prompter`, `generator`)
 *   - `src/making/artifacts/*.md` (`creator`)
 *   - `src/builds/vellum.md` (`## Made together` provenance record)
 *
 * Emits canonical slashless `/making/prompter/<slug>` and `/making/creator/<slug>`
 * links ONLY where those filter books actually exist in Eleventy collections.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { creditFamily, creditModel, slugify } from "../../eleventy/strings.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const FAMILY_DISPLAY = {
  claude: { name: "Claude", kind: "ai" },
  kimi: { name: "Kimi", kind: "ai" },
  gpt: { name: "GPT", kind: "ai" },
  deepseek: { name: "DeepSeek", kind: "ai" },
  gemini: { name: "Gemini", kind: "ai" },
  gemma: { name: "Gemma", kind: "ai" },
  glm: { name: "GLM", kind: "ai" },
  grok: { name: "Grok", kind: "ai" },
  midjourney: { name: "Midjourney", kind: "ai" },
};

const HUMAN_CANONICAL = new Map([
  ["kevin corley", "Kevin Corley"],
  ["kevin g. corley", "Kevin Corley"],
  ["corley, k. g.", "Kevin Corley"],
  ["carliss y. baldwin", "Carliss Y. Baldwin"],
  ["carliss baldwin", "Carliss Y. Baldwin"],
  ["baldwin, c. y.", "Carliss Y. Baldwin"],
  ["erkko autio", "Erkko Autio"],
  ["autio, e.", "Erkko Autio"],
  ["ying-ying hsieh", "Ying-Ying Hsieh"],
  ["hsieh, y.-y.", "Ying-Ying Hsieh"],
]);

const CV_HUMAN_MATCHERS = [
  { name: "Kevin Corley", re: /\b(?:Kevin\s+(?:G\.\s+)?Corley|Corley,\s*K\.\s*G\.)/i },
  { name: "Carliss Y. Baldwin", re: /\b(?:Carliss\s+(?:Y\.\s+)?Baldwin|Baldwin,\s*C\.\s*Y\.)/i },
  { name: "Erkko Autio", re: /\b(?:Erkko\s+Autio|Autio,\s*E\.)/i },
  { name: "Ying-Ying Hsieh", re: /\b(?:Ying-Ying\s+Hsieh|Hsieh,\s*Y\.-Y\.)/i },
];

const SELF_AUTHORS = new Set(["xule lin", "林徐乐"]);

function preferDisplayName(current, candidate) {
  if (!current) return candidate;
  if (!candidate) return current;
  const curHasUpper = /[A-Z]/.test(current);
  const candHasUpper = /[A-Z]/.test(candidate);
  if (!curHasUpper && candHasUpper) return candidate;
  return current;
}

function readMarkdownDir(relDir) {
  const dir = path.join(ROOT, relDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => {
      const fullPath = path.join(dir, file);
      const parsed = matter(readFileSync(fullPath, "utf8"), { cache: false });
      return {
        file,
        slug: file.replace(/\.md$/, ""),
        data: parsed.data,
        content: parsed.content,
      };
    });
}

function classifyCollaborator(raw) {
  const cleaned = String(raw || "").trim().replace(/\s+/g, " ");
  if (!cleaned) return null;
  const lower = cleaned.toLowerCase();
  if (SELF_AUTHORS.has(lower)) return null;

  const humanCanonical = HUMAN_CANONICAL.get(lower);
  if (humanCanonical) {
    return {
      familySlug: slugify(humanCanonical),
      familyName: humanCanonical,
      kind: "human",
      modelName: humanCanonical,
      modelSlug: slugify(humanCanonical),
    };
  }

  // Map model aliases & wrappers to their canonical AI lineage family.
  if (/^(?:claude|opus\b|sonnet\b|haiku\b|fable\b)/i.test(cleaned)) {
    const modelName = cleaned
      .replace(/^claude\s*\(([^)]+)\)$/i, "Claude $1")
      .replace(/^(opus|sonnet|haiku|fable)\b/i, (_, m) => `Claude ${m[0].toUpperCase()}${m.slice(1).toLowerCase()}`);
    return {
      familySlug: "claude",
      familyName: "Claude",
      kind: "ai",
      modelName,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^(?:gpt|chatgpt|codex|dall-e)/i.test(cleaned)) {
    return {
      familySlug: "gpt",
      familyName: "GPT",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^kimi\b/i.test(cleaned)) {
    return {
      familySlug: "kimi",
      familyName: "Kimi",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^deepseek\b/i.test(cleaned)) {
    return {
      familySlug: "deepseek",
      familyName: "DeepSeek",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^gemini\b/i.test(cleaned)) {
    return {
      familySlug: "gemini",
      familyName: "Gemini",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^gemma\b/i.test(cleaned)) {
    return {
      familySlug: "gemma",
      familyName: "Gemma",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^glm\b/i.test(cleaned)) {
    return {
      familySlug: "glm",
      familyName: "GLM",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^grok\b/i.test(cleaned)) {
    return {
      familySlug: "grok",
      familyName: "Grok",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  if (/^midjourney\b/i.test(cleaned)) {
    return {
      familySlug: "midjourney",
      familyName: "Midjourney",
      kind: "ai",
      modelName: cleaned,
      modelSlug: slugify(cleaned),
    };
  }

  const family = creditFamily(cleaned) || slugify(cleaned);
  const meta = FAMILY_DISPLAY[family] || {
    name: family.charAt(0).toUpperCase() + family.slice(1),
    kind: "ai",
  };
  return {
    familySlug: slugify(family),
    familyName: meta.name,
    kind: meta.kind,
    modelName: cleaned,
    modelSlug: slugify(cleaned),
  };
}

function splitGeneratorCredits(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw
    .split(/\s*·\s*/)
    .map((part) => part.replace(/\s*\([^)]*\)\s*/g, " ").trim())
    .filter(Boolean);
}

const writingDocs = readMarkdownDir("src/writing");
const portraitDocs = readMarkdownDir("src/making/portraits");
const artifactDocs = readMarkdownDir("src/making/artifacts");

// Build exact sets of filter-book slugs that Eleventy collections emit.
const prompterFamilySlugs = new Set();
const prompterModelSlugs = new Set();
for (const doc of portraitDocs) {
  const prompter = doc.data.prompter || "self";
  const family = creditFamily(prompter);
  const familySlug = slugify(family);
  const modelSlug = slugify(prompter);
  if (familySlug) prompterFamilySlugs.add(familySlug);
  if (creditModel(prompter) && modelSlug && modelSlug !== familySlug) {
    prompterModelSlugs.add(modelSlug);
  }
}

const creatorFamilySlugs = new Set();
const creatorModelSlugs = new Set();
for (const doc of artifactDocs) {
  const creator = doc.data.creator || "unknown";
  const family = creditFamily(creator);
  const familySlug = slugify(family);
  const modelSlug = slugify(creator);
  if (familySlug) creatorFamilySlugs.add(familySlug);
  if (creditModel(creator) && modelSlug && modelSlug !== familySlug) {
    creatorModelSlugs.add(modelSlug);
  }
}

const familyMap = new Map();
const modelMap = new Map();
const allCreditedWorks = new Set();

function recordContribution({ raw, section, role, workUrl, explicitModelSlug = null }) {
  const info = classifyCollaborator(raw);
  if (!info) return;

  allCreditedWorks.add(workUrl);

  let fam = familyMap.get(info.familySlug);
  if (!fam) {
    fam = {
      name: info.familyName,
      slug: info.familySlug,
      kind: info.kind,
      roles: new Set(),
      worksBySection: {
        writing: new Set(),
        papers: new Set(),
        portraits: new Set(),
        artifacts: new Set(),
        builds: new Set(),
      },
      allWorks: new Set(),
      modelKeys: new Set(),
    };
    familyMap.set(info.familySlug, fam);
  }
  fam.roles.add(role);
  fam.worksBySection[section].add(workUrl);
  fam.allWorks.add(workUrl);

  const canonicalModelSlug = slugify(info.modelName) || info.modelSlug;
  const rawSlug = explicitModelSlug || info.modelSlug || canonicalModelSlug;
  const modelKey = `${info.familySlug}::${canonicalModelSlug}`;
  fam.modelKeys.add(modelKey);

  let mod = modelMap.get(modelKey);
  if (!mod) {
    mod = {
      name: info.modelName,
      slug: canonicalModelSlug,
      rawSlugs: new Set(),
      family: info.familyName,
      familySlug: info.familySlug,
      kind: info.kind,
      roles: new Set(),
      worksBySection: {
        writing: new Set(),
        papers: new Set(),
        portraits: new Set(),
        artifacts: new Set(),
        builds: new Set(),
      },
      allWorks: new Set(),
    };
    modelMap.set(modelKey, mod);
  }
  mod.name = preferDisplayName(mod.name, info.modelName);
  mod.rawSlugs.add(canonicalModelSlug);
  if (rawSlug) mod.rawSlugs.add(rawSlug);
  mod.roles.add(role);
  mod.worksBySection[section].add(workUrl);
  mod.allWorks.add(workUrl);
}

// 1. Writing authors
for (const doc of writingDocs) {
  const workUrl = `/writing/${doc.slug}`;
  const authors = Array.isArray(doc.data.authors) ? doc.data.authors : [];
  for (const author of authors) {
    const name = typeof author === "string" ? author : author?.name;
    if (name) recordContribution({ raw: name, section: "writing", role: "coauthor", workUrl });
  }
}

// 1b. Formal paper landing authors (`src/papers/*/index.md`)
const papersDir = path.join(ROOT, "src/papers");
if (existsSync(papersDir)) {
  for (const entry of readdirSync(papersDir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(papersDir, entry.name, "index.md");
    if (!existsSync(indexPath)) continue;
    const parsed = matter(readFileSync(indexPath, "utf8"), { cache: false });
    const workUrl = `/papers/${entry.name}`;
    const authors = Array.isArray(parsed.data.authors) ? parsed.data.authors : [];
    for (const author of authors) {
      const name = typeof author === "string" ? author : author?.name;
      if (name) recordContribution({ raw: name, section: "papers", role: "coauthor", workUrl });
    }
  }
}

// 1c. Human co-authors from CV research sections (`# Under Review`, `# Working Papers`, `# Public Scholarship`)
const cvPath = path.join(ROOT, "src/cv/index.md");
if (existsSync(cvPath)) {
  const { content: cvContent } = matter(readFileSync(cvPath, "utf8"), { cache: false });
  const cvSections = [
    { heading: "Under Review", anchor: "/cv#under-review", section: "papers" },
    { heading: "Working Papers", anchor: "/cv#working-papers", section: "papers" },
    { heading: "Public Scholarship", anchor: "/cv#public-scholarship", section: "writing" },
  ];
  for (const spec of cvSections) {
    const headingRe = new RegExp(`^#\\s+${spec.heading}\\b`, "m");
    const afterHeading = cvContent.split(headingRe)[1];
    if (!afterHeading) continue;
    const body = afterHeading.split(/^#\s+/m)[0] || "";
    for (const line of body.split("\n")) {
      if (!/^-\s+/.test(line)) continue;
      for (const matcher of CV_HUMAN_MATCHERS) {
        if (matcher.re.test(line)) {
          recordContribution({
            raw: matcher.name,
            section: spec.section,
            role: "coauthor",
            workUrl: spec.anchor,
          });
        }
      }
    }
  }
}

// 2. Portrait prompters & generators
for (const doc of portraitDocs) {
  const workUrl = `/making/portraits/${doc.slug}`;
  if (doc.data.prompter) {
    recordContribution({
      raw: doc.data.prompter,
      section: "portraits",
      role: "prompter",
      workUrl,
      explicitModelSlug: slugify(doc.data.prompter),
    });
  }
  if (doc.data.generator) {
    for (const gen of splitGeneratorCredits(doc.data.generator)) {
      recordContribution({ raw: gen, section: "portraits", role: "generator", workUrl });
    }
  }
}

// 3. Artifact creators
for (const doc of artifactDocs) {
  const workUrl = `/making/artifacts/${doc.slug}`;
  if (doc.data.creator) {
    recordContribution({
      raw: doc.data.creator,
      section: "artifacts",
      role: "creator",
      workUrl,
      explicitModelSlug: slugify(doc.data.creator),
    });
  }
}

// 4. Vellum build provenance (`src/builds/vellum.md`)
const vellumPath = path.join(ROOT, "src/builds/vellum.md");
if (existsSync(vellumPath)) {
  const { content } = matter(readFileSync(vellumPath, "utf8"), { cache: false });
  const madeTogether = content.split(/^##\s+Made together\b/m)[1]?.split(/^##\s+/m)[0] || "";
  for (const line of madeTogether.split("\n")) {
    const match = line.match(/^\s*-\s+\*\*([^*]+)\*\*\s*(.*)$/);
    if (!match) continue;
    const rawHeader = match[1]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/:\s*$/, "")
      .trim();
    const primaryFamily = rawHeader.split(",")[0].trim();
    recordContribution({
      raw: primaryFamily,
      section: "builds",
      role: "build",
      workUrl: "/builds/vellum",
    });
  }
}

const models = [...modelMap.entries()]
  .map(([key, mod]) => {
    const matchedPrompterSlug = [...mod.rawSlugs].find((s) => prompterModelSlugs.has(s)) || null;
    const matchedCreatorSlug = [...mod.rawSlugs].find((s) => creatorModelSlugs.has(s)) || null;
    return [
      key,
      Object.freeze({
        name: mod.name,
        slug: mod.slug,
        family: mod.family,
        familySlug: mod.familySlug,
        kind: mod.kind,
        roles: Object.freeze([...mod.roles].sort()),
        counts: Object.freeze({
          writing: mod.worksBySection.writing.size,
          papers: mod.worksBySection.papers.size,
          portraits: mod.worksBySection.portraits.size,
          artifacts: mod.worksBySection.artifacts.size,
          builds: mod.worksBySection.builds.size,
        }),
        totalWorks: mod.allWorks.size,
        prompterUrl: matchedPrompterSlug ? `/making/prompter/${matchedPrompterSlug}` : null,
        creatorUrl: matchedCreatorSlug ? `/making/creator/${matchedCreatorSlug}` : null,
        works: Object.freeze([...mod.allWorks].sort()),
      }),
    ];
  });

const modelsByKey = new Map(models);
const sortedModels = models
  .map(([, entry]) => entry)
  .sort((a, b) => b.totalWorks - a.totalWorks || a.name.localeCompare(b.name));

const families = [...familyMap.values()]
  .map((fam) => {
    const seenNames = new Set();
    const famModels = [];
    for (const m of [...fam.modelKeys]
      .map((key) => modelsByKey.get(key))
      .filter(Boolean)
      .sort((a, b) => b.totalWorks - a.totalWorks || a.name.localeCompare(b.name))) {
      const lowerName = m.name.toLowerCase();
      if (seenNames.has(lowerName)) continue;
      seenNames.add(lowerName);
      famModels.push(m.name);
    }

    return Object.freeze({
      name: fam.name,
      slug: fam.slug,
      kind: fam.kind,
      roles: Object.freeze([...fam.roles].sort()),
      counts: Object.freeze({
        writing: fam.worksBySection.writing.size,
        papers: fam.worksBySection.papers.size,
        portraits: fam.worksBySection.portraits.size,
        artifacts: fam.worksBySection.artifacts.size,
        builds: fam.worksBySection.builds.size,
      }),
      totalWorks: fam.allWorks.size,
      prompterUrl: prompterFamilySlugs.has(fam.slug) ? `/making/prompter/${fam.slug}` : null,
      creatorUrl: creatorFamilySlugs.has(fam.slug) ? `/making/creator/${fam.slug}` : null,
      models: Object.freeze(famModels),
    });
  })
  .sort((a, b) => b.totalWorks - a.totalWorks || a.name.localeCompare(b.name));

export default {
  families: Object.freeze(families),
  models: Object.freeze(sortedModels),
  totalWorks: allCreditedWorks.size,
};
