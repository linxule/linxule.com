import { rewrite, next } from '@vercel/functions';
import { MD_PATHS } from './eleventy/shapes.mjs';

function parseQuality(parameters: string[]): number {
  for (const parameter of parameters) {
    const match = parameter.match(/^q\s*=\s*(?:"([^"]*)"|(\S+))$/i);
    if (!match) continue;
    const raw = (match[1] ?? match[2]).trim();
    if (!/^(?:0(?:\.\d+)?|1(?:\.0*)?)$/.test(raw)) return 0;
    return Number(raw);
  }
  return 1;
}

function prefersMarkdown(accept: string): boolean {
  let markdownQ = -1;
  let explicitHtmlQ = -1;
  let textWildcardQ = -1;
  let anyWildcardQ = -1;

  for (const part of accept.split(',')) {
    const [rawMediaType, ...parameters] = part.split(';').map(value => value.trim());
    const mediaType = rawMediaType.toLowerCase();
    if (!mediaType) continue;

    const q = parseQuality(parameters);
    if (mediaType === 'text/markdown') {
      markdownQ = Math.max(markdownQ, q);
    } else if (mediaType === 'text/html') {
      explicitHtmlQ = Math.max(explicitHtmlQ, q);
    } else if (mediaType === 'text/*') {
      textWildcardQ = Math.max(textWildcardQ, q);
    } else if (mediaType === '*/*') {
      anyWildcardQ = Math.max(anyWildcardQ, q);
    }
  }

  if (markdownQ <= 0) return false;

  const htmlQ =
    explicitHtmlQ >= 0
      ? explicitHtmlQ
      : textWildcardQ >= 0
        ? textWildcardQ
        : anyWildcardQ >= 0
          ? anyWildcardQ
          : 0;

  // Explicit text/markdown wins ties against HTML; strictly higher HTML q serves HTML.
  return markdownQ >= htmlQ;
}

export default function middleware(request: Request) {
  const accept = request.headers.get('accept') || '';
  if (!prefersMarkdown(accept)) {
    return next();
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  if (pathname.endsWith('.md')) {
    return next();
  }

  // Root → /index.md
  if (pathname === '/') {
    return rewrite(new URL(`/index.md${url.search}`, request.url));
  }

  if (!MD_PATHS.test(pathname)) {
    return next();
  }

  // Rewrite to the .md file, preserving query string
  const mdUrl = new URL(`${pathname}.md${url.search}`, request.url);
  return rewrite(mdUrl);
}

// Static literal array required by Vercel's AST analyzer.
// Parity with `eleventy/shapes.mjs` (`MIDDLEWARE_MATCHERS`) is verified by
// `scripts/check-renderings.mjs` and `scripts/middleware.test.mjs`.
export const config = {
  matcher: [
    '/',
    '/writing/:path',
    '/writing',
    '/making/portraits/:path',
    '/making/artifacts/:path',
    '/making',
    '/talks/:path',
    '/talks',
    '/papers/:path',
    '/papers',
    '/cv',
    '/cv-zh',
    '/thinking',
    '/teaching',
    '/concepts',
    '/builds',
    '/builds/:path',
    '/connect',
  ],
};
