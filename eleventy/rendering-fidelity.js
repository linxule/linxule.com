/** Shared translation rules for the site's text and structured renderings. */

// JSON-LD lives in an HTML raw-text element: HTML entities do not decode there.
// Escape '<' as JSON Unicode so authored </script> cannot end that element.
export function jsonScript(value) {
  return JSON.stringify(value ?? null)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function absoluteContentUrl(value, siteUrl) {
  return value ? new URL(value, siteUrl).href : "";
}

function names(value) {
  return (Array.isArray(value) ? value : [value])
    .map((author) => typeof author === "string" ? author : author?.name)
    .filter((name) => typeof name === "string" && name.trim());
}

export function feedAuthors(data, type, siteAuthor) {
  let authors = names(data.authors);
  if (!authors.length) {
    authors = names(type === "artifact" ? data.creator
      : type === "portrait" ? data.prompter
      : type === "talk" ? data.speakers : undefined);
  }
  return [...new Set(authors.length ? authors : names(siteAuthor))];
}

// A portrait's prompter authors the prompt; its generator contributes the images.
export function feedContributors(data, type) {
  return type === "portrait" ? [...new Set(names(data.generator))] : [];
}

function caption(lines) {
  if (!Array.isArray(lines)) return "";
  return lines.map((line) => typeof line === "string" ? line : line?.text)
    .filter((line) => typeof line === "string" && line.length)
    .join("\n");
}

// Feed summaries are plain text: keep every shaped caption line in source order.
// The text survives; the HTML surface carries its stagger and accident styling.
export function feedSummary(data, type) {
  if (type === "writing") return data.subtitle || data.description || "";
  if (type === "portrait") return caption(data.prompt) || data.description || "";
  if (type === "artifact") return caption(data.contextExcerpt) || data.description || data.mediaDescription || "";
  if (type === "talk") {
    const speakers = names(data.speakers);
    return data.event ? data.event + (speakers.length ? ` — ${speakers.join(", ")}` : "") : data.description || "";
  }
  if (type === "paper") return data.abstract || data.description || "";
  return data.description || "";
}

export default function renderingFidelity(eleventyConfig) {
  for (const [name, filter] of Object.entries({
    jsonScript, absoluteContentUrl, feedAuthors, feedContributors, feedSummary,
  })) eleventyConfig.addFilter(name, filter);
}
