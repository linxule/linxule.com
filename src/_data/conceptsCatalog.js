/**
 * Unified catalog of all 14 signature concepts across anchored essays,
 * scholarship-grounded dissertation/working-paper work, and forming territories.
 *
 * Joins `src/concepts/index.md` (territories, statuses, oneliners, open questions),
 * `src/writing/*.md` (`defines:`, series, date, title, authors), and
 * `src/papers/<slug>/index.md` (`doi`, `venue`, `year`, `coins`, `onSite`) with
 * canonical slashless URLs.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { slugify } from "../../eleventy/strings.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function stripSlash(url) {
  if (!url) return null;
  const s = String(url).trim();
  if (!s) return null;
  if (s === "/") return "/";
  return s.replace(/\/+$/, "");
}

function canonicalPathname(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url, "https://linxule.com");
    return stripSlash(parsed.pathname);
  } catch {
    return stripSlash(url);
  }
}

function yearOf(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return Number.isFinite(d.getTime()) ? d.getUTCFullYear() : null;
}

function isoDateOf(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return Number.isFinite(d.getTime()) ? d.toISOString().split("T")[0] : null;
}

// 1. Index `defines:` entries across src/writing/*.md
const writingDir = path.join(ROOT, "src/writing");
const definitionsBySlug = new Map();
const essaysByPath = new Map();

for (const file of readdirSync(writingDir).filter((f) => f.endsWith(".md")).sort()) {
  const fullPath = path.join(writingDir, file);
  const { data } = matter(readFileSync(fullPath, "utf8"), { cache: false });
  const essaySlug = file.replace(/\.md$/, "");
  const essayUrl = `/writing/${essaySlug}`;
  const essayMeta = {
    url: essayUrl,
    title: data.title || essaySlug,
    series: data.series || null,
    year: yearOf(data.date),
    date: isoDateOf(data.date),
    authors: Array.isArray(data.authors) ? data.authors : [],
  };
  essaysByPath.set(essayUrl, essayMeta);

  if (Array.isArray(data.defines)) {
    for (const def of data.defines) {
      if (!def || typeof def.term !== "string") continue;
      const termSlug = slugify(def.term);
      definitionsBySlug.set(termSlug, {
        term: def.term,
        definition: typeof def.definition === "string" ? def.definition : null,
        essay: essayMeta,
      });
    }
  }
}

// 2. Index formal papers under src/papers/*/index.md for DOI linkage
const papersDir = path.join(ROOT, "src/papers");
const papers = [];
if (existsSync(papersDir)) {
  for (const entry of readdirSync(papersDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(papersDir, entry.name, "index.md");
    if (!existsSync(indexPath)) continue;
    const { data } = matter(readFileSync(indexPath, "utf8"), { cache: false });
    papers.push({
      url: `/papers/${entry.name}`,
      title: data.paperTitle || data.title || entry.name,
      venue: typeof data.venue === "string" ? data.venue : null,
      year: (typeof data.year === "number" ? data.year : null) || yearOf(data.date),
      coins: typeof data.coins === "string" ? data.coins : null,
      onSite: canonicalPathname(data.onSite),
      doi: typeof data.doi === "string" ? data.doi : null,
    });
  }
}

function findPaperForConcept(termSlug, essayUrl) {
  return (
    papers.find(
      (paper) =>
        (paper.coins && slugify(paper.coins) === termSlug) ||
        (essayUrl && paper.onSite && paper.onSite === essayUrl),
    ) || null
  );
}

// 3. Build unified territories & concept list from src/concepts/index.md
const conceptsIndexPath = path.join(ROOT, "src/concepts/index.md");
const { data: conceptsDoc } = matter(readFileSync(conceptsIndexPath, "utf8"), { cache: false });

const list = [];
const territories = [];

for (const territory of conceptsDoc.territories || []) {
  const territoryQuestions = Array.isArray(territory.questions) ? territory.questions : [];
  const territoryConcepts = [];

  (territory.concepts || []).forEach((item, idx) => {
    const slug = slugify(item.term);
    const anchorId = `dfn-${slug}`;
    const defEntry = definitionsBySlug.get(slug) || null;
    const declaredEssayUrl = canonicalPathname(item.essay);
    const essayMeta =
      defEntry?.essay ||
      (declaredEssayUrl ? essaysByPath.get(declaredEssayUrl) : null) ||
      null;
    const essayUrl = essayMeta?.url || declaredEssayUrl || null;
    const declaredStatus = item.status || territory.status || null;
    const status = essayUrl ? "anchored" : declaredStatus || "forming";
    const canonicalUrl = status === "anchored" ? `${essayUrl}#${anchorId}` : `/concepts#${anchorId}`;
    const sourceUrl = item.source || territory.source || null;
    const sourceLabel = item.sourceLabel || territory.sourceLabel || null;
    const paper = findPaperForConcept(slug, essayUrl);
    const pairedQuestion =
      territoryQuestions.length === (territory.concepts || []).length && territoryQuestions[idx]
        ? [territoryQuestions[idx]]
        : [...territoryQuestions];

    const record = Object.freeze({
      term: item.term,
      slug,
      territory: territory.name,
      oneliner: item.oneliner || "",
      status,
      url: canonicalUrl,
      anchorId,
      essayUrl,
      essayTitle: essayMeta?.title || null,
      essaySeries: essayMeta?.series || null,
      essayYear: essayMeta?.year || null,
      date: essayMeta?.date || null,
      authors: essayMeta?.authors || [],
      definition: defEntry?.definition || item.oneliner || "",
      sourceUrl,
      sourceLabel,
      doi: paper?.doi || null,
      paperUrl: paper?.url || null,
      paperVenue: paper?.venue || null,
      paperYear: paper?.year || null,
      openQuestions: Object.freeze(pairedQuestion),
    });

    list.push(record);
    territoryConcepts.push(record);
  });

  territories.push(
    Object.freeze({
      name: territory.name,
      slug: slugify(territory.name),
      concepts: Object.freeze(territoryConcepts),
      questions: Object.freeze([...territoryQuestions]),
    }),
  );
}

const bySlug = Object.freeze(Object.fromEntries(list.map((c) => [c.slug, c])));
const anchoredCount = list.filter((c) => c.status === "anchored").length;
const groundedCount = list.filter((c) => c.status === "grounded").length;
const formingCount = list.filter((c) => c.status === "forming").length;

export default {
  list: Object.freeze(list),
  bySlug,
  territories: Object.freeze(territories),
  anchoredCount,
  groundedCount,
  formingCount,
};
