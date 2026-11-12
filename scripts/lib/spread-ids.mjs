/**
 * spread-ids.mjs — every spread of a scroll book (the Making book, the series
 * and tag books) is addressable: it carries an id equal to its data-book-target,
 * and no other element on the page shares that id.
 *
 * Why the id is the data-book-target ("artifact:unfinished-light"), not the bare
 * slug: portraits and artifacts share slugs (unfinished-light and
 * no-privileged-access exist as both, 2026-11-12), so bare slugs would collide on
 * /making and a link would open the wrong work. A colon is legal in an id and in
 * a URL fragment; getElementById() and :target need no escaping, only a CSS
 * selector written by hand does (#artifact\:slug).
 *
 * Pure: takes HTML text, returns problem strings. check-renderings.mjs runs it on
 * every built page that holds a book; spread-ids.test.mjs pins its behaviour.
 */

const BOOK = /<div class="(?:making-book|writing-book)"/;
const SECTION = /<section\b([^>]*)>/g;
const ID = /<[a-zA-Z][\w-]*\b[^>]*?\sid="([^"]*)"/g;

const attr = (attrs, name) => attrs.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];

function stripInert(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
}

export function isBookPage(html) {
  return BOOK.test(html);
}

export function checkSpreadIds(html, page = "page") {
  if (!isBookPage(html)) return [];
  const body = stripInert(html);
  const problems = [];
  let spreads = 0;

  for (const m of body.matchAll(SECTION)) {
    const attrs = m[1];
    const cls = attr(attrs, "class") || "";
    if (!/(?:^|\s)(?:spread|essay-spread|back-matter)(?:\s|$)/.test(cls)) continue;
    spreads++;
    const id = attr(attrs, "id");
    const target = attr(attrs, "data-book-target");
    const label = target || id || `section.${cls.trim().split(/\s+/).join(".")}`;
    if (!target) problems.push(`[spread-ids] ${page}: spread ${label} has no data-book-target`);
    if (!id) problems.push(`[spread-ids] ${page}: spread ${label} has no id, so it cannot be linked to`);
    else if (target && id !== target) problems.push(`[spread-ids] ${page}: spread id "${id}" differs from its data-book-target "${target}"`);
  }
  if (!spreads) problems.push(`[spread-ids] ${page}: a book with no spreads found`);

  const seen = new Map();
  for (const m of body.matchAll(ID)) seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  for (const [id, n] of seen) {
    if (n > 1) problems.push(`[spread-ids] ${page}: id "${id}" appears ${n} times`);
  }
  return problems;
}
