/**
 * Shared string & collaborator-credit helpers.
 *
 * Pure ESM (zero Node.js imports) so collections, filters, data catalogs, and
 * transforms all share one slugification and model-family normalization contract.
 */

export function slugify(str) {
  if (str == null) return "";
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function normalizeCredit(credit) {
  if (credit == null) return "";
  const trimmed = String(credit).trim().replace(/\s+/g, " ");
  if (!trimmed) return "";
  // Merge hyphenated "gpt-6 astra" / "gpt-5.6 sol" with space-separated "gpt 6 astra"
  // so family resolves to "gpt" (eliminating orphan "/making/creator/gpt-6/" splits)
  // while slugify("gpt-6 astra") and slugify("gpt 6 astra") both stay "gpt-6-astra".
  return trimmed.replace(/^gpt-(\S)/i, "gpt $1");
}

export function creditFamily(credit) {
  const normalized = normalizeCredit(credit);
  if (!normalized) return null;
  return normalized.split(" ")[0].toLowerCase();
}

export function creditModel(credit) {
  const normalized = normalizeCredit(credit);
  if (!normalized) return null;
  const parts = normalized.split(" ");
  return parts.slice(1).join(" ") || null;
}
