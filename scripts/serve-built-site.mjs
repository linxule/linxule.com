import { existsSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.env.SITE_ROOT || "_site");
const PORT = Number(process.env.PORT || 4173);
const TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequest(url) {
  const pathname = decodeURIComponent(new URL(url).pathname);
  const candidate = path.resolve(ROOT, "." + pathname);
  if (candidate !== ROOT && !candidate.startsWith(ROOT + path.sep)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const index = path.join(candidate, "index.html");
  if (existsSync(index) && statSync(index).isFile()) return index;
  const html = candidate + ".html";
  if (existsSync(html) && statSync(html).isFile()) return html;
  return null;
}

Bun.serve({
  hostname: "127.0.0.1",
  port: PORT,
  fetch(request) {
    const file = resolveRequest(request.url);
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(request.method === "HEAD" ? null : Bun.file(file), {
      headers: {
        "content-type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream",
      },
    });
  },
});

console.log(`[serve-built] http://127.0.0.1:${PORT} -> ${ROOT}`);
