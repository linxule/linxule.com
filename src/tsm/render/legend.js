// Task legend renderer. Groups a matrix's tasks by `category` and emits a
// scannable mapping from shortLabel → full label for each category.
//
// Pairs with the Phase-1 derived-scene additions (`task.category` +
// `task.shortLabel`). The matrix diagonal displays the short codes; this
// legend resolves them back to full labels so a reader can decode
// "CLI1 / RT3 / SDK2" without leaving the page.
//
// Render contract:
//   - Renders only when at least one task in the matrix has a non-empty
//     `category`. Pure authored scenes (Fig 1/3/6/7A/7B/8/4/18.1 +
//     multi-matrix-smoke) have no categories, so the legend is omitted —
//     no empty container.
//   - Categories appear in first-appearance order. Within each category,
//     tasks preserve their order in `matrix.tasks`.
//   - Category titles are title-cased via a small all-caps/title-case
//     helper (e.g., `cli` → `CLI`, `mcp` → `MCP`, `runtime` → `Runtime`).
//   - DOM shape pins the unit-test contract; the CSS owns the visual.
//
// Lifecycle: returns `{ legendEl, pillByTaskId, destroy }`. The caller
// (main.js) appends `legendEl` to its mount target and invokes `destroy`
// during teardown so repeated mounts (matrix switcher, scene switcher)
// don't leave stale legend nodes in the aside.

const ALL_CAPS_CATEGORIES = new Set(["cli", "sdk", "mcp", "api", "rpc", "ui"]);

/**
 * Title-case helper for category labels. Short codes commonly used as
 * acronyms (cli, sdk, mcp, …) get fully uppercased; everything else gets
 * standard "first letter up, rest lower" treatment.
 *
 * Exported for unit tests.
 *
 * @param {string} category
 * @returns {string}
 */
export function formatCategoryTitle(category) {
  const trimmed = String(category ?? "").trim();
  if (!trimmed) return "";
  const lower = trimmed.toLowerCase();
  if (ALL_CAPS_CATEGORIES.has(lower)) return lower.toUpperCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

/**
 * Group a matrix's tasks by category in first-appearance order. Tasks
 * without a non-empty category are dropped — they don't belong in the
 * legend.
 *
 * Exported for unit tests so the grouping can be exercised without
 * touching the DOM.
 *
 * @param {Array<{ id?: string, label: string, shortLabel?: string, category?: string }>} tasks
 * @returns {{ category: string, tasks: { id: string, shortLabel: string, label: string }[] }[]}
 */
export function groupTasksByCategory(tasks) {
  const groups = new Map();
  for (const task of tasks ?? []) {
    const category = String(task.category ?? "").trim();
    if (!category) continue;
    if (!groups.has(category)) groups.set(category, []);
    const shortLabel = String(task.shortLabel ?? "").trim();
    groups.get(category).push({
      id: String(task.id ?? ""),
      shortLabel: shortLabel || task.label,
      label: task.label,
    });
  }
  return Array.from(groups.entries()).map(([category, tasks]) => ({
    category,
    tasks,
  }));
}

/**
 * Render a category-grouped legend for a matrix's tasks.
 *
 * @param {HTMLElement} container — parent to append the legend into when
 *   the caller chooses to mount it. `renderTaskLegend` does NOT append on
 *   its own; the caller (main.js) inserts `legendEl` at the desired site.
 *   `container` is reserved for future DOM-API use (e.g., delegating
 *   document creation in alternate environments) and ignored today.
 * @param {object} matrix — a decorated matrix (matrices[matrixIndex])
 * @returns {{ legendEl: HTMLElement | null, pillByTaskId: Map<string, HTMLElement>, destroy: () => void }}
 */
export function renderTaskLegend(container, matrix) {
  const groups = groupTasksByCategory(matrix?.tasks ?? []);
  const pillByTaskId = new Map();
  if (groups.length === 0) {
    return { legendEl: null, pillByTaskId, destroy: () => {} };
  }

  const legendEl = document.createElement("div");
  legendEl.className = "task-legend";

  for (const { category, tasks } of groups) {
    const section = document.createElement("section");
    section.className = "task-legend-category";

    const title = document.createElement("h4");
    title.className = "task-legend-category-title";
    title.textContent = formatCategoryTitle(category);
    section.appendChild(title);

    const dl = document.createElement("dl");
    dl.className = "task-legend-list";
    for (const { id, shortLabel, label } of tasks) {
      const dt = document.createElement("dt");
      const badge = document.createElement("span");
      badge.className = "task-legend-short";
      badge.dataset.taskId = id;
      badge.textContent = shortLabel;
      if (id) pillByTaskId.set(id, badge);
      dt.appendChild(badge);

      const dd = document.createElement("dd");
      dd.className = "task-legend-full";
      dd.textContent = label;

      dl.appendChild(dt);
      dl.appendChild(dd);
    }
    section.appendChild(dl);
    legendEl.appendChild(section);
  }

  return {
    legendEl,
    pillByTaskId,
    destroy() {
      if (legendEl.parentNode) legendEl.parentNode.removeChild(legendEl);
    },
  };
}
