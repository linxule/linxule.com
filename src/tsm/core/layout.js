// Pure layout math. No DOM reads, no DOM writes.
//
// Given a v0.3 matrix object, compute the cell grid and contiguous region
// spans the renderer needs to mount the matrix.
//
// This module is forbidden from calling getBoundingClientRect or touching the
// DOM. Layout must be testable as pure data transformation.

/**
 * Build a transfer lookup map from a matrix's transfers array.
 * Key: "fromId->toId"; Value: the transfer object.
 */
export function buildTransferMap(transfers) {
  const map = new Map();
  for (const t of transfers) {
    map.set(`${t.from}->${t.to}`, t);
  }
  return map;
}

/**
 * Compute the cell grid metadata for a v0.3 matrix.
 *
 * @param {object} matrix — { tasks, transfers, regions } from a tsm-scene
 * @returns {{
 *   n: number,
 *   cells: Array<{ row, col, kind: "diagonal"|"transfer"|"empty", task?, transfer?, fromTask?, toTask? }>,
 *   groupSpans: Map<string, { start: number, end: number }>,
 *   taskById: object,
 *   groupById: object,
 * }}
 *
 * `groupSpans` is keyed by region.id (built from `task.region`);
 * `groupById` is the matrix's regions keyed by id.
 */
export function computeGrid(matrix) {
  const n = matrix.tasks.length;
  const taskById = Object.fromEntries(matrix.tasks.map((t, i) => [t.id, { ...t, index: i }]));
  const groupById = Object.fromEntries((matrix.regions ?? []).map((r) => [r.id, r]));
  const transferMap = buildTransferMap(matrix.transfers ?? []);

  const cells = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (row === col) {
        cells.push({ row, col, kind: "diagonal", task: matrix.tasks[row] });
      } else {
        const fromTask = matrix.tasks[col];
        const toTask = matrix.tasks[row];
        const transfer = transferMap.get(`${fromTask.id}->${toTask.id}`);
        if (transfer) {
          cells.push({ row, col, kind: "transfer", transfer, fromTask, toTask });
        } else {
          cells.push({ row, col, kind: "empty" });
        }
      }
    }
  }

  const groupSpans = new Map();
  for (let i = 0; i < n; i++) {
    const rid = matrix.tasks[i].region;
    if (!groupSpans.has(rid)) {
      groupSpans.set(rid, { start: i, end: i });
    } else {
      groupSpans.get(rid).end = i;
    }
  }

  return { n, cells, groupSpans, taskById, groupById };
}
