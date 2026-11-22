import { MD_PATHS } from './eleventy/shapes.mjs';
import { DISCOVERY_LINK_HEADER, matchRedirect, prefersMarkdown } from './eleventy/redirects.mjs';

interface Fetcher {
  fetch(input: Request | URL | string, init?: RequestInit): Promise<Response>;
}

interface ExportedHandler<Env = unknown> {
  fetch(request: Request, env: Env): Promise<Response>;
}

const PAGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';
const IMMUTABLE_ASSET_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const HSTS_HEADER = 'max-age=63072000';
const MARKDOWN_EXPOSE_HEADERS = 'x-markdown-tokens, Link';
const MEDIA_EXT_RE = /\.(?:mp4|webm|mp3|m4a|wav|ogg|mov)$/i;
const SINGLE_BYTE_RANGE_RE = /^bytes=(\d*)-(\d*)$/i;

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

function isImmutableAssetPath(pathname: string): boolean {
  return pathname.startsWith('/assets/') || pathname.startsWith('/writing/attachments/');
}

function isMediaPath(pathname: string): boolean {
  return MEDIA_EXT_RE.test(pathname);
}

function getContentTypeOverride(pathname: string): string | null {
  const exact = EXACT_CONTENT_TYPES.get(pathname);
  if (exact) return exact;
  if (pathname.endsWith('.md')) return 'text/markdown; charset=utf-8';
  return null;
}

function applySecurityHeaders(headers: Headers): void {
  headers.set('Strict-Transport-Security', HSTS_HEADER);
  headers.set('X-Content-Type-Options', 'nosniff');
}

function applyImmutableAssetHeaders(headers: Headers, pathname: string): void {
  headers.set('Cache-Control', IMMUTABLE_ASSET_CACHE_CONTROL);
  if (pathname.startsWith('/assets/artifacts/if-we-all-had-heads/')) {
    headers.set('Access-Control-Allow-Origin', '*');
  }
}

function estimateMarkdownTokens(byteLength: number): number {
  return Math.max(1, Math.ceil(byteLength / 4));
}

function shouldHandleSingleByteRange(rangeHeader: string | null): rangeHeader is string {
  if (!rangeHeader) return false;
  const raw = rangeHeader.trim();
  return /^bytes=/i.test(raw) && !raw.includes(',');
}

type ByteRangeResult =
  | { kind: 'range'; start: number; end: number }
  | { kind: 'unsatisfiable' };

function parseSingleByteRange(rangeHeader: string, total: number): ByteRangeResult {
  const match = SINGLE_BYTE_RANGE_RE.exec(rangeHeader.trim());
  if (!match) return { kind: 'unsatisfiable' };
  const [, startStr, endStr] = match;
  if ((!startStr && !endStr) || total <= 0) {
    return { kind: 'unsatisfiable' };
  }
  if (!startStr) {
    const suffix = Number.parseInt(endStr, 10);
    if (!Number.isSafeInteger(suffix) || suffix <= 0) {
      return { kind: 'unsatisfiable' };
    }
    return { kind: 'range', start: Math.max(0, total - suffix), end: total - 1 };
  }
  const start = Number.parseInt(startStr, 10);
  if (!Number.isSafeInteger(start) || start < 0 || start >= total) {
    return { kind: 'unsatisfiable' };
  }
  if (!endStr) {
    return { kind: 'range', start, end: total - 1 };
  }
  const parsedEnd = Number.parseInt(endStr, 10);
  if (!Number.isSafeInteger(parsedEnd) || parsedEnd < start) {
    return { kind: 'unsatisfiable' };
  }
  return { kind: 'range', start, end: Math.min(parsedEnd, total - 1) };
}

async function finalizeAssetResponse(
  request: Request,
  pathname: string,
  assetRes: Response,
  isPreviewHost: boolean,
  isDirectMarkdown: boolean,
): Promise<Response> {
  if (assetRes.status >= 300 && assetRes.status < 400) {
    const headers = new Headers(assetRes.headers);
    applySecurityHeaders(headers);
    if (isPreviewHost) {
      headers.set('X-Robots-Tag', 'noindex, nofollow');
    }
    if (request.method === 'HEAD' || assetRes.status === 304) {
      await assetRes.body?.cancel().catch(() => {});
      return new Response(null, {
        status: assetRes.status,
        statusText: assetRes.statusText,
        headers,
      });
    }
    return new Response(assetRes.body, {
      status: assetRes.status,
      statusText: assetRes.statusText,
      headers,
    });
  }

  const headers = new Headers(assetRes.headers);

  if (!isExcludedFromPageHeaders(pathname)) {
    headers.set('Link', DISCOVERY_LINK_HEADER);
    headers.set('Cache-Control', PAGE_CACHE_CONTROL);
    headers.set('Vary', 'Accept');
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (isImmutableAssetPath(pathname) && assetRes.status === 200) {
    applyImmutableAssetHeaders(headers, pathname);
  }

  if (assetRes.status === 200) {
    const contentType = getContentTypeOverride(pathname);
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    if (isMediaPath(pathname)) {
      headers.set('Accept-Ranges', 'bytes');
    }
  }

  applySecurityHeaders(headers);

  if (isPreviewHost) {
    headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  if (isDirectMarkdown && assetRes.status === 200) {
    const bytes = new Uint8Array(await assetRes.arrayBuffer());
    const estTokens = estimateMarkdownTokens(bytes.byteLength);
    headers.delete('content-encoding');
    headers.set('Content-Length', String(bytes.byteLength));
    headers.set('x-markdown-tokens', String(estTokens));
    headers.set('Access-Control-Expose-Headers', MARKDOWN_EXPOSE_HEADERS);
    return new Response(request.method === 'HEAD' ? null : bytes, {
      status: 200,
      statusText: assetRes.statusText,
      headers,
    });
  }

  if (request.method === 'HEAD') {
    await assetRes.body?.cancel().catch(() => {});
    return new Response(null, {
      status: assetRes.status,
      statusText: assetRes.statusText,
      headers,
    });
  }

  return new Response(assetRes.body, {
    status: assetRes.status,
    statusText: assetRes.statusText,
    headers,
  });
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
          'Strict-Transport-Security': HSTS_HEADER,
          'X-Content-Type-Options': 'nosniff',
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
          'Strict-Transport-Security': HSTS_HEADER,
          'X-Content-Type-Options': 'nosniff',
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
          'Strict-Transport-Security': HSTS_HEADER,
          'X-Content-Type-Options': 'nosniff',
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
      const mdReq =
        request.method === 'HEAD'
          ? new Request(mdUrl, { method: 'GET' })
          : new Request(mdUrl, request);
      const mdRes = await env.ASSETS.fetch(mdReq);
      if (mdRes.status === 200) {
        const bytes = new Uint8Array(await mdRes.arrayBuffer());
        const estTokens = estimateMarkdownTokens(bytes.byteLength);
        const headers = new Headers(mdRes.headers);
        headers.delete('content-encoding');
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Content-Length', String(bytes.byteLength));
        headers.set('x-markdown-tokens', String(estTokens));
        headers.set('Access-Control-Expose-Headers', MARKDOWN_EXPOSE_HEADERS);
        headers.set('Cache-Control', PAGE_CACHE_CONTROL);
        headers.set('Vary', 'Accept');
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Link', DISCOVERY_LINK_HEADER);
        applySecurityHeaders(headers);
        if (isPreviewHost) {
          headers.set('X-Robots-Tag', 'noindex, nofollow');
        }
        return new Response(request.method === 'HEAD' ? null : bytes, {
          status: 200,
          statusText: mdRes.statusText,
          headers,
        });
      }
      await mdRes.body?.cancel().catch(() => {});
    }

    // RFC 9110 single-range byte serving for media assets (Safari/iOS <video>/<audio> parity)
    const rangeHeader = request.headers.get('range');
    if (
      (request.method === 'GET' || request.method === 'HEAD') &&
      isMediaPath(pathname) &&
      shouldHandleSingleByteRange(rangeHeader)
    ) {
      const upstream = await env.ASSETS.fetch(new Request(url.toString(), { method: 'GET' }));
      if (upstream.status !== 200) {
        return finalizeAssetResponse(request, pathname, upstream, isPreviewHost, false);
      }

      const buf = new Uint8Array(await upstream.arrayBuffer());
      const total = buf.byteLength;
      const parsed = parseSingleByteRange(rangeHeader, total);

      if (parsed.kind === 'unsatisfiable') {
        const headers = new Headers();
        headers.set('Content-Range', `bytes */${total}`);
        headers.set('Accept-Ranges', 'bytes');
        if (pathname.startsWith('/assets/artifacts/if-we-all-had-heads/')) {
          headers.set('Access-Control-Allow-Origin', '*');
        }
        applySecurityHeaders(headers);
        if (isPreviewHost) {
          headers.set('X-Robots-Tag', 'noindex, nofollow');
        }
        return new Response(null, { status: 416, headers });
      }

      const { start, end } = parsed;
      const slice = buf.subarray(start, end + 1);
      const headers = new Headers();
      const contentType = upstream.headers.get('content-type');
      if (contentType) headers.set('Content-Type', contentType);
      const etag = upstream.headers.get('etag');
      if (etag) headers.set('ETag', etag);
      headers.set('Content-Range', `bytes ${start}-${end}/${total}`);
      headers.set('Content-Length', String(end - start + 1));
      headers.set('Accept-Ranges', 'bytes');
      applyImmutableAssetHeaders(headers, pathname);
      applySecurityHeaders(headers);
      if (isPreviewHost) {
        headers.set('X-Robots-Tag', 'noindex, nofollow');
      }
      return new Response(request.method === 'HEAD' ? null : slice, {
        status: 206,
        headers,
      });
    }

    // Default static asset fetch (on HEAD for direct .md, fetch GET to compute x-markdown-tokens)
    const isDirectMarkdown =
      (request.method === 'GET' || request.method === 'HEAD') && pathname.endsWith('.md');
    const assetReq =
      isDirectMarkdown && request.method === 'HEAD'
        ? new Request(url.toString(), { method: 'GET' })
        : request;
    const assetRes = await env.ASSETS.fetch(assetReq);

    return finalizeAssetResponse(request, pathname, assetRes, isPreviewHost, isDirectMarkdown);
  },
} satisfies ExportedHandler<{ ASSETS: Fetcher }>;
