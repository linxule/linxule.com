import { MD_PATHS } from './eleventy/shapes.mjs';
import { DISCOVERY_LINK_HEADER, matchRedirect, prefersMarkdown } from './eleventy/redirects.mjs';

interface Fetcher {
  fetch(input: Request | URL | string, init?: RequestInit): Promise<Response>;
}

interface ExportedHandler<Env = unknown> {
  fetch(request: Request, env: Env): Promise<Response>;
}

const PAGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';

const EXACT_CONTENT_TYPES = new Map<string, string>([
  ['/feed.xml', 'application/atom+xml; charset=utf-8'],
  ['/llms.txt', 'text/plain; charset=utf-8'],
  ['/.well-known/api-catalog', 'application/linkset+json; charset=utf-8'],
  ['/.well-known/ai-catalog.json', 'application/json; charset=utf-8'],
  ['/.well-known/mcp/server-card.json', 'application/json; charset=utf-8'],
  ['/.well-known/agent-skills/index.json', 'application/json; charset=utf-8'],
  ['/.build-manifest.json', 'application/json; charset=utf-8'],
  ['/site-index.json', 'application/json; charset=utf-8'],
  ['/license.xml', 'application/rsl+xml; charset=utf-8'],
]);

function isExcludedFromPageHeaders(pathname: string): boolean {
  return (
    pathname.startsWith('/cdn-cgi/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/writing/attachments/') ||
    pathname.startsWith('/pagefind/')
  );
}

function getContentTypeOverride(pathname: string): string | null {
  const exact = EXACT_CONTENT_TYPES.get(pathname);
  if (exact) return exact;
  if (pathname.endsWith('.md')) return 'text/markdown; charset=utf-8';
  return null;
}

export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const url = new URL(request.url);
    const isPreviewHost = url.hostname.endsWith('.workers.dev');

    // Host canonicalization: www.linxule.com -> https://linxule.com
    if (url.hostname === 'www.linxule.com') {
      return new Response(null, {
        status: 301,
        headers: {
          Location: `https://linxule.com${url.pathname}${url.search}`,
        },
      });
    }

    // Legacy redirects (preserves relative paths and #fragment anchors)
    const hit = matchRedirect(url.pathname);
    if (hit) {
      return new Response(null, {
        status: hit.statusCode,
        headers: {
          Location: hit.destination,
          ...(isPreviewHost ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
        },
      });
    }

    // Trailing-slash canonicalization (308 to slashless canonical path)
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      const canonicalPath = url.pathname.replace(/\/+$/, '') || '/';
      return new Response(null, {
        status: 308,
        headers: {
          Location: `${canonicalPath}${url.search}`,
          ...(isPreviewHost ? { 'X-Robots-Tag': 'noindex, nofollow' } : {}),
        },
      });
    }

    const pathname = url.pathname;

    // Accept: text/markdown negotiation on GET or HEAD
    if (
      (request.method === 'GET' || request.method === 'HEAD') &&
      !pathname.endsWith('.md') &&
      (pathname === '/' || MD_PATHS.test(pathname)) &&
      prefersMarkdown(request.headers.get('accept') || '')
    ) {
      const mdPath = pathname === '/' ? '/index.md' : `${pathname}.md`;
      const mdUrl = new URL(`${mdPath}${url.search}`, url.origin);
      const mdRes = await env.ASSETS.fetch(new Request(mdUrl, request));
      if (mdRes.status === 200) {
        const headers = new Headers(mdRes.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Cache-Control', PAGE_CACHE_CONTROL);
        headers.set('Vary', 'Accept');
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Link', DISCOVERY_LINK_HEADER);
        if (isPreviewHost) {
          headers.set('X-Robots-Tag', 'noindex, nofollow');
        }
        return new Response(request.method === 'HEAD' ? null : mdRes.body, {
          status: 200,
          statusText: mdRes.statusText,
          headers,
        });
      }
      await mdRes.body?.cancel().catch(() => {});
    }

    // Default static asset fetch
    const assetRes = await env.ASSETS.fetch(request);

    if (assetRes.status >= 300 && assetRes.status < 400) {
      if (!isPreviewHost) return assetRes;
      const headers = new Headers(assetRes.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(
        request.method === 'HEAD' || assetRes.status === 304 ? null : assetRes.body,
        {
          status: assetRes.status,
          statusText: assetRes.statusText,
          headers,
        },
      );
    }

    const headers = new Headers(assetRes.headers);

    if (!isExcludedFromPageHeaders(pathname)) {
      headers.set('Link', DISCOVERY_LINK_HEADER);
      headers.set('Cache-Control', PAGE_CACHE_CONTROL);
      headers.set('Vary', 'Accept');
      headers.set('Access-Control-Allow-Origin', '*');
    }

    if (assetRes.status === 200) {
      const contentType = getContentTypeOverride(pathname);
      if (contentType) {
        headers.set('Content-Type', contentType);
      }
    }

    if (isPreviewHost) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return new Response(request.method === 'HEAD' ? null : assetRes.body, {
      status: assetRes.status,
      statusText: assetRes.statusText,
      headers,
    });
  },
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;
