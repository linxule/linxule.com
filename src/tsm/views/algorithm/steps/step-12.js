// Algorithm view — Step 12 renderer.
//
// Step 12: "Try your own." Agency closer. The viewer leaves with a tool, not
// just a viewing experience. Three components:
//
//   1. A drop zone that accepts a dependency-observation JSON file. On a
//      successful drop the zone emits a `tsm-try-your-own` CustomEvent with
//      the parsed observation as `detail`. The host page (live deployment,
//      or a test harness) listens on the zone for that event and re-mounts
//      the algorithm view on the new observation.
//   2. A short input-format explainer with a minimal valid snippet, so a
//      viewer who has never seen a dependency-observation can build one.
//   3. Three resource links — SEAM essay (canonical), Carliss's Hidden
//      Structure paper (HBS article page for the published Research Policy
//      version), and Xule's GitHub for the harness-extraction script. Only
//      the harness-script link still carries `data-todo="url-placeholder"`
//      because the standalone artifact has not been published yet — the
//      extraction workflow currently lives inside the TSM-construction
//      skill (skills/tsm-construction/SKILL.md).
//
// The drop zone is decoupled from the algorithm view's internals — it does
// not call `view.step(1)` directly. That keeps step-12 a pure renderer (it
// has no closure over the view's api object) and lets the host page route
// the event however it wants (re-instantiate the view, navigate to a new
// URL, route through a higher-level controller, etc.). Page-glue is
// deliberately deferred to v1.2.x; the contract here is the event name +
// detail payload.

// Stable URLs for the three resource links.
//   - seam-essay: canonical Substack landing per project CLAUDE.md.
//   - hidden-structure-paper: HBS article page for Baldwin / MacCormack /
//     Rusnak, "Hidden Structure: Using Network Methods to Map System
//     Architecture," Research Policy 43 (8), 2014. Considered alternatives:
//     SSRN abstract page (ssrn.com/abstract=2277795) and the DASH handle
//     (dash.harvard.edu/handle/1/10646422); the HBS article page wins
//     because it survives SSRN reorganizations and links out to both.
//   - harness-extraction-script: TODO — link to a standalone harness-
//     extraction artifact when one is published. For now this resolves to
//     Xule's GitHub profile so the link is not dead, and the data-todo
//     flag stays set so a future commit can swap in the specific repo.
const RESOURCE_LINKS = [
  {
    resource: "seam-essay",
    label: "SEAM essay — what TSMs reveal about AI systems",
    href: "https://www.threadcounts.org/t/seam",
    todo: false,
  },
  {
    resource: "hidden-structure-paper",
    label: "Carliss Baldwin — “The Hidden Structure of Open Source Software”",
    href: "https://www.hbs.edu/faculty/Pages/item.aspx?num=48697",
    todo: false,
  },
  {
    // TODO: link to standalone harness-extraction artifact when published.
    resource: "harness-extraction-script",
    label: "Xule's GitHub — harness-extraction script",
    href: "https://github.com/linxule",
    todo: true,
  },
];

const MINIMAL_INPUT_SAMPLE = `{
  "specVersion": "0.3",
  "kind": "dependency-observation",
  "id": "my-system",
  "title": "My system",
  "nodes": [
    { "id": "a", "label": "A", "entityType": "agent" },
    { "id": "b", "label": "B", "entityType": "skill" }
  ],
  "edges": [
    { "from": "a", "to": "b", "relation": "invokes" }
  ]
}`;

/**
 * @param {{ stageEl: HTMLElement }} ctx
 */
export function renderStep12({ stageEl }) {
  const root = document.createElement("div");
  root.className = "algorithm-step-content algorithm-try-your-own";
  root.dataset.step = "12";

  // --- Headline -----------------------------------------------------------
  const headline = document.createElement("h3");
  headline.className = "algorithm-try-your-own-headline";
  headline.textContent = "Try your own.";
  if (headline.style) headline.style.margin = "0 0 0.5rem 0";
  root.appendChild(headline);

  // --- Drop zone ----------------------------------------------------------
  const dropZone = document.createElement("div");
  dropZone.className = "algorithm-drop-zone";
  dropZone.setAttribute("role", "region");
  dropZone.setAttribute("aria-label", "Drop dependency observation JSON");
  dropZone.setAttribute("tabindex", "0");
  dropZone.dataset.state = "idle";
  if (dropZone.style) {
    dropZone.style.padding = "0.75rem";
    dropZone.style.border = "1.5px dashed currentColor";
    dropZone.style.borderRadius = "6px";
    dropZone.style.marginBottom = "0.6rem";
    dropZone.style.cursor = "pointer";
  }

  const dropPrompt = document.createElement("p");
  dropPrompt.className = "algorithm-drop-zone-prompt";
  dropPrompt.textContent =
    "Drop a dependency-observation JSON file here, or click to select. " +
    "We'll re-run the algorithm on your system.";
  if (dropPrompt.style) dropPrompt.style.margin = "0";
  dropZone.appendChild(dropPrompt);

  const dropStatus = document.createElement("p");
  dropStatus.className = "algorithm-drop-zone-status";
  dropStatus.dataset.state = "idle";
  if (dropStatus.style) {
    dropStatus.style.margin = "0.4rem 0 0";
    dropStatus.style.fontSize = "0.85em";
    dropStatus.style.opacity = "0.75";
  }
  dropZone.appendChild(dropStatus);

  // Hidden file input for click-to-select. Same parse path as drop.
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("accept", "application/json,.json");
  fileInput.className = "algorithm-drop-zone-input";
  if (fileInput.style) {
    fileInput.style.position = "absolute";
    fileInput.style.opacity = "0";
    fileInput.style.pointerEvents = "none";
    fileInput.style.width = "0";
    fileInput.style.height = "0";
  }
  dropZone.appendChild(fileInput);

  // Drag-and-drop handlers — prevent default so the browser doesn't
  // navigate to the dropped file, and emit the custom event on a successful
  // parse. dragenter/dragover/dragleave keep the dropZone in a visible
  // hover state via data-state.
  dropZone.addEventListener?.("dragover", (e) => {
    if (typeof e.preventDefault === "function") e.preventDefault();
    dropZone.dataset.state = "hover";
  });
  dropZone.addEventListener?.("dragleave", () => {
    dropZone.dataset.state = "idle";
  });
  dropZone.addEventListener?.("drop", async (e) => {
    if (typeof e.preventDefault === "function") e.preventDefault();
    dropZone.dataset.state = "parsing";
    const file = e.dataTransfer?.files?.[0];
    await handleFile(file, dropZone, dropStatus);
  });

  // Click-to-select wiring. fileInput.change parses the same way.
  dropZone.addEventListener?.("click", () => {
    if (typeof fileInput.click === "function") fileInput.click();
  });
  // Keyboard parity: the drop zone is focusable (tabindex=0), so Enter/Space
  // must fire the picker too — otherwise Tab lands on a dead control.
  dropZone.addEventListener?.("keydown", (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      if (typeof e.preventDefault === "function") e.preventDefault();
      if (typeof fileInput.click === "function") fileInput.click();
    }
  });
  fileInput.addEventListener?.("change", async (e) => {
    const file = e.target?.files?.[0] ?? fileInput.files?.[0];
    dropZone.dataset.state = "parsing";
    await handleFile(file, dropZone, dropStatus);
  });

  root.appendChild(dropZone);

  // --- Input-format explainer --------------------------------------------
  const explainer = document.createElement("div");
  explainer.className = "algorithm-input-format-explainer";
  if (explainer.style) {
    explainer.style.marginBottom = "0.6rem";
    explainer.style.fontSize = "0.9em";
  }

  const explainerTitle = document.createElement("p");
  explainerTitle.className = "algorithm-input-format-title";
  explainerTitle.textContent = "Input format: dependency-observation v0.3";
  if (explainerTitle.style) {
    explainerTitle.style.margin = "0 0 0.3rem 0";
    explainerTitle.style.fontWeight = "600";
  }
  explainer.appendChild(explainerTitle);

  const explainerBody = document.createElement("p");
  explainerBody.className = "algorithm-input-format-body";
  explainerBody.textContent =
    "A dependency-observation lists components (nodes) and directed dependencies (edges). " +
    "Each node carries an id, label, and an entityType (agent / skill / mcp / plugin / runtime). " +
    "Each edge points from a depending component to the one it depends on.";
  if (explainerBody.style) explainerBody.style.margin = "0 0 0.3rem 0";
  explainer.appendChild(explainerBody);

  const code = document.createElement("pre");
  code.className = "algorithm-input-format-sample";
  code.textContent = MINIMAL_INPUT_SAMPLE;
  if (code.style) {
    code.style.margin = "0";
    code.style.padding = "0.5rem";
    code.style.border = "1px solid currentColor";
    code.style.borderRadius = "4px";
    code.style.fontSize = "0.8em";
    code.style.whiteSpace = "pre";
    code.style.overflowX = "auto";
  }
  explainer.appendChild(code);
  root.appendChild(explainer);

  // --- Resource links ----------------------------------------------------
  const linksWrap = document.createElement("div");
  linksWrap.className = "algorithm-resource-links";
  if (linksWrap.style) {
    linksWrap.style.display = "flex";
    linksWrap.style.flexDirection = "column";
    linksWrap.style.gap = "0.3rem";
    linksWrap.style.fontSize = "0.9em";
  }

  for (const item of RESOURCE_LINKS) {
    const a = document.createElement("a");
    a.className = "algorithm-resource-link";
    a.dataset.resource = item.resource;
    if (item.todo) {
      a.dataset.todo = "url-placeholder"; // flag for future URL swap
    }
    a.setAttribute("href", item.href);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
    a.textContent = item.label;
    linksWrap.appendChild(a);
  }
  root.appendChild(linksWrap);

  stageEl.appendChild(root);
}

async function handleFile(file, dropZone, dropStatus) {
  if (!file) {
    setError(dropZone, dropStatus, "No file received.");
    return;
  }
  try {
    const text = await readFileAsText(file);
    const json = JSON.parse(text);
    if (!json || json.kind !== "dependency-observation") {
      throw new Error(
        `Expected kind="dependency-observation", got "${json?.kind ?? "(none)"}"`,
      );
    }
    if (!Array.isArray(json.nodes) || json.nodes.length === 0) {
      throw new Error("Observation has no nodes");
    }
    if (!Array.isArray(json.edges)) {
      throw new Error("Observation is missing the edges array");
    }
    dropZone.dataset.state = "loaded";
    dropStatus.dataset.state = "loaded";
    dropStatus.textContent = `Loaded ${json.id ?? "(unnamed)"} — ${json.nodes.length} nodes, ${json.edges.length} edges.`;
    if (typeof CustomEvent === "function") {
      dropZone.dispatchEvent(
        new CustomEvent("tsm-try-your-own", { detail: json, bubbles: true }),
      );
    }
  } catch (err) {
    setError(dropZone, dropStatus, err?.message ?? String(err));
  }
}

function setError(dropZone, dropStatus, message) {
  dropZone.dataset.state = "error";
  dropStatus.dataset.state = "error";
  dropStatus.textContent = `Could not load file: ${message}`;
}

function readFileAsText(file) {
  if (typeof file.text === "function") return file.text();
  // Fallback for environments without File#text — FileReader API.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("FileReader error"));
    reader.readAsText(file);
  });
}
