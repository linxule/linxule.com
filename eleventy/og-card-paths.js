/** Shared social-card paths and visible copy, used by templates and generator. */
export const OG_CARDS_DIR = "/assets/og-cards";
export const AUTO_DIR = `${OG_CARDS_DIR}/auto`;
// Existing assets stay available: their URLs are cached for a year, immutable.
// r3: readable ink titles with a cyan dot; paper and series cards.
export const CARD_REV = "-r3";
export const DEFAULT_CARD = `${OG_CARDS_DIR}/default-r2.jpg`;
export const RASTER_CARD_REV = "-r2";
export const BRAND_CARD = {
  name: "Xule Lin", kicker: "LINXULE.COM",
  taglineLines: ["What becomes impossible to see when", "algorithms enter organizational life —", { text: "not as tools.", accent: true }],
};
const brandTagline = () => BRAND_CARD.taglineLines.map((ln) => (typeof ln === "string" ? ln : ln.text)).join(" ");
export const SECTION_CARDS = {
  making: ["Portraits as poems, artifacts made by AI,", "and research tools."],
  writing: ["Essays on human–AI collaboration", "in qualitative research."],
  talks: ["On human–AI collaboration and", "the future of organizing."],
  thinking: ["What becomes impossible to see when", "AI carries implicit theories of organizing."],
  concepts: ["A working vocabulary — naming is", "how you make a noticing portable."],
  teaching: ["Methods, cases, and tools for", "teaching and researching with AI."],
  builds: ["Open-source tools and public", "infrastructure built alongside the research."],
  cv: ["Organization scholar and", "human–AI collaboration researcher."],
  papers: ["Published research and working papers", "on human–AI collaboration and organizing."],
};
export const SERIES_CARDS = {
  loom: ["LOOM", "Human–AI collaboration in research"],
  seam: ["SEAM", "Patterns rhyming across paradigms"],
  "research-with-ai": ["Research with AI", "Building thinking partners"],
  singles: ["Singles", "Standalone notes on the AI moment"],
  "ai-whispers": ["AI Whispers", "Techniques for steering AI"],
  "epistemic-voids": ["Epistemic Voids", "Gaps in AI discourse"],
  "organizational-futures": ["Organizational Futures", "Coordination after AGI"],
  thinking: ["Thinking", "Periodic notes from the work"],
  archive: ["Archive", "Earlier tutorials and foundations"],
};
const AUTO_LAYOUTS = new Set(["layouts/writing.njk", "layouts/artifact.njk", "layouts/talk.njk", "layouts/paper.njk"]);

export function sectionCardPath(section) {
  if (!(section in SECTION_CARDS)) return null;
  return `${OG_CARDS_DIR}/${section}${section === "making" ? "-r2" : ""}.jpg`;
}
export function seriesCardPath(slug) {
  return slug ? `${OG_CARDS_DIR}/series/${slug}${CARD_REV}.jpg` : null;
}
export function autoCardPath(fileSlug, layout, pageUrl = "") {
  if (!fileSlug || !AUTO_LAYOUTS.has(layout)) return null;
  // Eleventy's fileSlug is "index" for both papers. Use the canonical directory.
  if (layout === "layouts/paper.njk") {
    const slug = pageUrl.match(/^\/papers\/([^/]+)\/?$/)?.[1];
    return slug ? `${AUTO_DIR}/paper-${slug}${CARD_REV}.jpg` : null;
  }
  return `${AUTO_DIR}/${fileSlug}${CARD_REV}.jpg`;
}
export function fileSlugOf(filename) {
  const base = filename.replace(/\.[^.]+$/, "");
  const m = base.match(/\d{4}-\d{2}-\d{2}-?(.+)$/);
  return m ? m[1] : base;
}

/** Preserve existing art cards; normalize raw artifact rasters without cropping. */
export function ogCard(src) {
  if (!src || typeof src !== "string") return src;
  if (src === `${OG_CARDS_DIR}/default.jpg`) return DEFAULT_CARD;
  if (src === `${OG_CARDS_DIR}/making.jpg`) return sectionCardPath("making");
  const artifactSvg = src.match(/^(\/assets\/images\/artifacts\/.+)\.svg$/i);
  if (artifactSvg) return `${artifactSvg[1]}-og.jpg`;
  const portrait = src.match(/^(\/assets\/images\/portraits\/[^/]+)\/[^/]+\.(?:png|webp|jpe?g)$/i);
  if (portrait) return `${portrait[1]}/og.jpg`;
  // Authored final cards, including Hortus, keep their source URLs.
  if (/(?:\/og|[-]og(?:-r\d+)?)\.jpe?g$/i.test(src)) return src;
  const artifactRaster = src.match(/^(\/assets\/images\/artifacts\/.+)\.(?:png|webp|jpe?g|gif)$/i);
  if (artifactRaster) return `${artifactRaster[1]}-og${RASTER_CARD_REV}.jpg`;
  const cover = src.match(/^\/writing\/attachments\/([^/]+)\.(?:png|webp)$/i);
  if (cover) return `/writing/attachments/${cover[1]}-og.jpg`;
  return src;
}

// `accident` mirrors the page: a title that is cyan on the HTML surface is cyan on its card.
export function titleCardOptions(data) {
  const accident = data.accident === true;
  if (data.layout === "layouts/paper.njk") return {
    title: data.paperTitle || data.title,
    kicker: ["PAPER", data.year].filter(Boolean).join(" · "),
    subtitle: data.venue,
    accident,
  };
  if (data.layout === "layouts/artifact.njk") return { title: data.title, kicker: "MAKING · ARTIFACT", accident };
  if (data.layout === "layouts/talk.njk") {
    const year = data.date instanceof Date ? data.date.getUTCFullYear() : String(data.date || "").slice(0, 4);
    return { title: data.title, kicker: ["TALKS", year].filter(Boolean).join(" · "), accident };
  }
  return { title: data.title, kicker: typeof data.series === "string" ? `WRITING · ${data.series.toUpperCase()}` : "WRITING", accident };
}
export function textCardAlt({ kicker, title, subtitle, brand = "LINXULE.COM" }) {
  return [kicker, title, subtitle, brand].filter(Boolean).join(". ");
}

/** Resolve the image and its alternative together, so a text fallback cannot inherit an artwork description. */
export function resolveSocialCard(data, coverAlt = "") {
  const firstImage = data.images?.[0];
  const isImage = (src) => typeof src === "string" && /\.(?:png|webp|jpe?g|gif|svg)(?:[?#].*)?$/i.test(src);
  const hero = data.ogImage || (isImage(firstImage?.src) ? firstImage.src : null) || (isImage(data.src) ? data.src : null);
  const url = data.page?.url || "";
  const section = Object.keys(SECTION_CARDS).find((key) => hero === `${OG_CARDS_DIR}/${key}.jpg` || hero === sectionCardPath(key) || (!hero && url === `/${key}/`));
  if (section) return {
    src: sectionCardPath(section),
    alt: data.ogImageAlt || ["XULE LIN", section, SECTION_CARDS[section].join(" ")].join(". "),
  };
  if (hero === DEFAULT_CARD || hero === `${OG_CARDS_DIR}/default.jpg`) return {
    src: DEFAULT_CARD, alt: data.ogImageAlt || [BRAND_CARD.name, brandTagline(), BRAND_CARD.kicker].join(". "),
  };
  if (hero) {
    const galleryImage = data.images?.find((img) => img.src === hero);
    return {
      src: ogCard(hero),
      alt: data.ogImageAlt || galleryImage?.alt || (hero === data.thumbnail ? data.thumbnailAlt : null) || (hero === data.src ? data.alt : null) || coverAlt || `${data.title || "Untitled"} — artwork.`,
    };
  }
  if (/^\/writing\/series\//.test(url) && data.series?.slug) {
    const [title, subtitle] = SERIES_CARDS[data.series.slug] || [data.series.name, ""];
    return { src: seriesCardPath(data.series.slug), alt: data.ogImageAlt || textCardAlt({ kicker: "WRITING · SERIES", title, subtitle }) };
  }
  const auto = autoCardPath(data.page?.fileSlug, data.layout, url);
  if (auto) return { src: auto, alt: data.ogImageAlt || textCardAlt(titleCardOptions(data)) };
  return { src: DEFAULT_CARD, alt: data.ogImageAlt || [BRAND_CARD.name, brandTagline(), BRAND_CARD.kicker].join(". ") };
}
