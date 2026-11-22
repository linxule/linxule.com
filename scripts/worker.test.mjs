import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { match } from 'path-to-regexp';
import worker from '../worker.ts';
import {
  DISCOVERY_LINK_HEADER,
  REDIRECTS,
  matchRedirect,
  prefersMarkdown,
} from '../eleventy/redirects.mjs';
import { MD_PATHS, MIDDLEWARE_MATCHERS, STATIC_TWINS } from '../eleventy/shapes.mjs';

const PAGE_CACHE_CONTROL = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600';

function createMockAssets(routes = {}) {
  const calls = [];
  const defaultRoutes = {
    '/': { status: 200, body: '<html>home</html>', contentType: 'text/html; charset=utf-8' },
    '/index.md': { status: 200, body: '# Home\n', contentType: 'text/plain' },
    '/cv': { status: 200, body: '<html>cv</html>', contentType: 'text/html; charset=utf-8' },
    '/cv.md': { status: 200, body: '# CV\n', contentType: 'application/octet-stream' },
    '/connect': { status: 200, body: '<html>connect</html>', contentType: 'text/html; charset=utf-8' },
    '/connect.md': { status: 200, body: '# Connect\n', contentType: 'text/plain' },
    '/builds/vellum': { status: 200, body: '<html>vellum</html>', contentType: 'text/html; charset=utf-8' },
    '/builds/vellum.md': { status: 200, body: '# Vellum\n', contentType: 'text/plain' },
    '/writing/example': { status: 200, body: '<html>example</html>', contentType: 'text/html; charset=utf-8' },
    '/writing/example.md': { status: 200, body: '# Example\n', contentType: 'text/plain' },
    '/search': { status: 200, body: '<html>search</html>', contentType: 'text/html; charset=utf-8' },
    '/writing/example/attachment': { status: 200, body: '<html>att</html>', contentType: 'text/html; charset=utf-8' },
    '/writing/series/loom': { status: 200, body: '<html>loom</html>', contentType: 'text/html; charset=utf-8' },
    '/writing/attachments/cover.png': {
      status: 200,
      body: 'png-bytes',
      contentType: 'image/png',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
    '/tag/ai-governance': { status: 200, body: '<html>tag</html>', contentType: 'text/html; charset=utf-8' },
    '/making/prompter/claude': { status: 200, body: '<html>prompter</html>', contentType: 'text/html; charset=utf-8' },
    '/making/creator/opus': { status: 200, body: '<html>creator</html>', contentType: 'text/html; charset=utf-8' },
    '/feed.xml': { status: 200, body: '<feed/>', contentType: 'application/xml' },
    '/llms.txt': { status: 200, body: 'llms', contentType: 'text/plain' },
    '/.well-known/api-catalog': { status: 200, body: '{}', contentType: 'application/octet-stream' },
    '/.well-known/ai-catalog.json': { status: 200, body: '{}', contentType: 'application/json' },
    '/.well-known/mcp/server-card.json': { status: 200, body: '{"name":"linxule"}', contentType: 'application/json' },
    '/.well-known/agent-skills/index.json': { status: 200, body: '{}', contentType: 'application/json' },
    '/.well-known/agent-skills/site-reader/SKILL.md': { status: 200, body: '# Skill\n', contentType: 'text/plain' },
    '/.build-manifest.json': { status: 200, body: '{}', contentType: 'application/json' },
    '/site-index.json': { status: 200, body: '{}', contentType: 'application/json' },
    '/license.xml': { status: 200, body: '<rsl/>', contentType: 'application/xml' },
    '/assets/favicon-32.png': {
      status: 200,
      body: 'png',
      contentType: 'image/png',
      headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
    },
    '/pagefind/pagefind.js': { status: 200, body: 'export {};', contentType: 'text/javascript' },
    '/cdn-cgi/rum': { status: 204, body: null, contentType: null },
    ...routes,
  };

  return {
    calls,
    ASSETS: {
      async fetch(input) {
        const req = input instanceof Request ? input : new Request(input);
        const url = new URL(req.url);
        calls.push({ method: req.method, pathname: url.pathname, search: url.search, url: req.url });

        const entry = defaultRoutes[url.pathname];
        if (!entry) {
          return new Response(req.method === 'HEAD' ? null : '<html>404 Not Found</html>', {
            status: 404,
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }

        const headers = new Headers(entry.headers || {});
        if (entry.contentType) {
          headers.set('Content-Type', entry.contentType);
        }
        const body = req.method === 'HEAD' || entry.status === 204 || entry.status === 304 ? null : entry.body;
        return new Response(body, { status: entry.status, headers });
      },
    },
  };
}

async function runWorker(urlOrPath, { method = 'GET', accept, headers = {}, routes } = {}) {
  const fullUrl = urlOrPath.startsWith('http') ? urlOrPath : `https://linxule.com${urlOrPath}`;
  const reqHeaders = new Headers(headers);
  if (accept !== undefined) {
    reqHeaders.set('accept', accept);
  }
  const mock = createMockAssets(routes);
  const response = await worker.fetch(new Request(fullUrl, { method, headers: reqHeaders }), {
    ASSETS: mock.ASSETS,
  });
  return { response, calls: mock.calls };
}

describe('eleventy/redirects.mjs — REDIRECTS & matchRedirect', () => {
  it('contains all 57 frozen redirect rules with valid shape', () => {
    expect(REDIRECTS.length).toBe(57);
    expect(Object.isFrozen(REDIRECTS)).toBe(true);
    for (const rule of REDIRECTS) {
      expect(Object.isFrozen(rule)).toBe(true);
      expect(typeof rule.source).toBe('string');
      expect(typeof rule.destination).toBe('string');
      expect([301, 308]).toContain(rule.statusCode);
    }
  });

  it('agrees 100% with path-to-regexp match() across all 57 redirect rules and negative probes', () => {
    const ptrCompiled = REDIRECTS.map((rule) => ({
      rule,
      matches: match(rule.source, {
        sensitive: true,
        end: true,
        decode: decodeURIComponent,
      }),
    }));

    const ptrMatch = (pathname) => {
      for (const entry of ptrCompiled) {
        if (entry.matches(pathname) !== false) return entry.rule;
      }
      return null;
    };

    const probePaths = new Set([
      '/',
      '/cv',
      '/cv-zh',
      '/writing',
      '/making',
      '/talks',
      '/papers',
      '/thinking',
      '/teaching',
      '/concepts',
      '/builds',
      '/builds/vellum',
      '/connect',
      '/llms.txt',
      '/feed.xml',
      '/license.xml',
      '/sitemap.xml',
      '/.well-known/mcp/server-card.json',
      '/.well-known/mcpXjson',
      '/faviconXico',
      '/llmXtxt',
      '/projectsXmd',
      '/talkmapXhtml',
      '/posts/2020/06/resources-for-dao-research',
      '/posts/2020/06/resources-for-dao-research/extra',
      '/posts/2023/10/macaw/sub',
      '/posts/other-slug',
      '/projects/foo',
      '/projects/foo/bar',
      '/projects-other',
      '/daogov-other',
      '/publication',
      '/publication/2024',
      '/publication-other',
    ]);

    for (const { source } of REDIRECTS) {
      if (source.endsWith('/:path*')) {
        const prefix = source.slice(0, -'/:path*'.length);
        probePaths.add(prefix);
        probePaths.add(`${prefix}/`);
        probePaths.add(`${prefix}/sub`);
        probePaths.add(`${prefix}/a/b/c`);
        probePaths.add(`${prefix}/sub/`);
        probePaths.add(`${prefix}x`);
      } else if (source.endsWith('/:path+')) {
        const prefix = source.slice(0, -'/:path+'.length);
        probePaths.add(prefix);
        probePaths.add(`${prefix}/`);
        probePaths.add(`${prefix}/one`);
        probePaths.add(`${prefix}/one/two`);
        probePaths.add(`${prefix}/one/`);
        probePaths.add(`${prefix}x`);
      } else {
        probePaths.add(source);
        probePaths.add(`${source}/`);
        probePaths.add(`${source}/sub`);
        probePaths.add(`${source}x`);
        if (source.toLowerCase() !== source) {
          probePaths.add(source.toLowerCase());
        }
        if (source.toUpperCase() !== source) {
          probePaths.add(source.toUpperCase());
        }
      }
    }

    for (const pathname of probePaths) {
      expect(matchRedirect(pathname), `mismatch on ${pathname}`).toEqual(ptrMatch(pathname));
    }
  });

  it('matches both raw Unicode and percent-encoded CJK redirect paths (with or without trailing slash)', () => {
    for (const pathname of ['/简历', '/%E7%AE%80%E5%8E%86', '/简历/', '/%E7%AE%80%E5%8E%86/']) {
      expect(matchRedirect(pathname)).toEqual({
        source: '/简历',
        destination: '/cv-zh',
        statusCode: 301,
      });
    }
    for (const pathname of ['/履历', '/%E5%B1%A5%E5%8E%86', '/履历/', '/%E5%B1%A5%E5%8E%86/']) {
      expect(matchRedirect(pathname)).toEqual({
        source: '/履历',
        destination: '/cv-zh',
        statusCode: 301,
      });
    }
  });

  it('handles malformed percent-encoding and encoded slashes safely', () => {
    expect(matchRedirect('/%E0%A4%A')).toBeNull();
    expect(matchRedirect('/%ZZ')).toBeNull();
    expect(matchRedirect('/posts%2Ffoo')).toBeNull();
    expect(matchRedirect('/about%2F')).toBeNull();
    expect(matchRedirect('')).toBeNull();
  });
});

describe('worker.ts — host canonicalization, legacy redirects, and trailing-slash stripping', () => {
  it('canonicalizes www.linxule.com to https://linxule.com with 301 preserving path and query', async () => {
    const { response, calls } = await runWorker('https://www.linxule.com/writing/example?ref=nav');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('https://linxule.com/writing/example?ref=nav');
    expect(response.headers.get('x-robots-tag')).toBeNull();
    expect(await response.text()).toBe('');
    expect(calls).toHaveLength(0);
  });

  it('redirects /CV/ in a single 301 hop directly to /cv', async () => {
    const { response, calls } = await runWorker('/CV/');
    expect(response.status).toBe(301);
    expect(response.headers.get('location')).toBe('/cv');
    expect(calls).toHaveLength(0);
  });

  it('redirects Unicode /简历 and percent-encoded /%E7%AE%80%E5%8E%86 to /cv-zh with 301', async () => {
    for (const target of ['/简历', '/%E7%AE%80%E5%8E%86', '/%E7%AE%80%E5%8E%86/', '/履历', '/%E5%B1%A5%E5%8E%86']) {
      const { response, calls } = await runWorker(target);
      expect(response.status, target).toBe(301);
      expect(response.headers.get('location'), target).toBe('/cv-zh');
      expect(calls).toHaveLength(0);
    }
  });

  it('preserves #publications fragment and external redirect destinations verbatim', async () => {
    const pub = await runWorker('/publications/2024');
    expect(pub.response.status).toBe(301);
    expect(pub.response.headers.get('location')).toBe('/cv#publications');
    expect(pub.calls).toHaveLength(0);

    const ext = await runWorker('/posts/2024/06/openai-discord');
    expect(ext.response.status).toBe(301);
    expect(ext.response.headers.get('location')).toBe(
      'https://github.com/linxule/openai-assistants-discord-bot',
    );
    expect(ext.calls).toHaveLength(0);

    const mcp = await runWorker('/.well-known/mcp.json');
    expect(mcp.response.status).toBe(308);
    expect(mcp.response.headers.get('location')).toBe('/.well-known/mcp/server-card.json');
    expect(mcp.calls).toHaveLength(0);
  });

  it('canonicalizes non-root trailing slashes with 308 preserving query string', async () => {
    const cv = await runWorker('/cv/');
    expect(cv.response.status).toBe(308);
    expect(cv.response.headers.get('location')).toBe('/cv');
    expect(cv.response.headers.get('x-robots-tag')).toBeNull();
    expect(cv.calls).toHaveLength(0);

    const query = await runWorker('/writing/example/?source=agent');
    expect(query.response.status).toBe(308);
    expect(query.response.headers.get('location')).toBe('/writing/example?source=agent');
    expect(query.calls).toHaveLength(0);

    const multi = await runWorker('/builds///?x=1');
    expect(multi.response.status).toBe(308);
    expect(multi.response.headers.get('location')).toBe('/builds?x=1');
    expect(multi.calls).toHaveLength(0);
  });
});

describe('worker.ts — RFC 9110 Accept: text/markdown negotiation', () => {
  it.each([
    'text/markdown',
    'Text/Markdown',
    'TEXT/MARKDOWN; charset=utf-8',
    'text/html, text/markdown',
    'text/html;q=0.5, text/markdown;q=0.9',
    'text/html;q=0.8, text/markdown;q=0.8',
    'text/html;q=0.4, */*;q=0.9, text/markdown;q=0.6',
  ])('negotiates 200 text/markdown directly for %s', async (accept) => {
    expect(prefersMarkdown(accept)).toBe(true);
    const { response, calls } = await runWorker('/writing/example?source=agent&view=full', {
      accept,
    });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('cache-control')).toBe(PAGE_CACHE_CONTROL);
    expect(response.headers.get('vary')).toBe('Accept');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('link')).toBe(DISCOVERY_LINK_HEADER);
    expect(response.headers.get('x-robots-tag')).toBeNull();
    expect(await response.text()).toBe('# Example\n');
    expect(calls).toHaveLength(1);
    expect(calls[0].pathname).toBe('/writing/example.md');
    expect(calls[0].search).toBe('?source=agent&view=full');
  });

  it.each([
    'text/html;q=1.0, text/markdown;q=0.1',
    'text/html;q=1, text/markdown;q=0.1',
    'text/html, text/markdown;q=0.5',
    'text/html, text/markdown;q=0.8',
    'text/*, text/markdown;q=0.5',
    '*/*, text/markdown;q=0.5',
  ])('serves HTML when HTML or wildcard quality strictly exceeds Markdown in %s', async (accept) => {
    expect(prefersMarkdown(accept)).toBe(false);
    const { response, calls } = await runWorker('/writing/example', { accept });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(calls).toHaveLength(1);
    expect(calls[0].pathname).toBe('/writing/example');
  });

  it.each([
    'text/markdown;q=0',
    'text/html, text/markdown;q=0.000',
    'Text/Markdown; charset=utf-8; Q = 0',
    'text/markdown;q="0"',
    'text/markdown;q=1.5',
    'text/markdown;q=invalid',
  ])('respects explicit rejection or malformed q in %s', async (accept) => {
    expect(prefersMarkdown(accept)).toBe(false);
    const { response, calls } = await runWorker('/writing/example', { accept });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(calls).toHaveLength(1);
    expect(calls[0].pathname).toBe('/writing/example');
  });

  it('negotiates root / to /index.md preserving query string', async () => {
    const { response, calls } = await runWorker('/?source=agent', { accept: 'text/markdown' });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(await response.text()).toBe('# Home\n');
    expect(calls).toHaveLength(1);
    expect(calls[0].pathname).toBe('/index.md');
    expect(calls[0].search).toBe('?source=agent');
  });

  it('negotiates /connect and /builds/:slug routes and leaves direct .md and HTML untouched', async () => {
    const connectMd = await runWorker('/connect?source=agent', { accept: 'text/markdown' });
    expect(connectMd.response.status).toBe(200);
    expect(connectMd.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(connectMd.calls[0].pathname).toBe('/connect.md');
    expect(connectMd.calls[0].search).toBe('?source=agent');

    const connectHtml = await runWorker('/connect', { accept: 'text/html' });
    expect(connectHtml.response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(connectHtml.calls[0].pathname).toBe('/connect');

    const connectDirectMd = await runWorker('/connect.md', { accept: 'text/markdown' });
    expect(connectDirectMd.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(connectDirectMd.calls[0].pathname).toBe('/connect.md');

    const vellumMd = await runWorker('/builds/vellum?source=agent', { accept: 'text/markdown' });
    expect(vellumMd.response.status).toBe(200);
    expect(vellumMd.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(vellumMd.calls[0].pathname).toBe('/builds/vellum.md');
    expect(vellumMd.calls[0].search).toBe('?source=agent');

    const vellumHtml = await runWorker('/builds/vellum', { accept: 'text/html' });
    expect(vellumHtml.response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(vellumHtml.calls[0].pathname).toBe('/builds/vellum');

    const vellumDirectMd = await runWorker('/builds/vellum.md', { accept: 'text/markdown' });
    expect(vellumDirectMd.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(vellumDirectMd.calls[0].pathname).toBe('/builds/vellum.md');
  });

  it.each([undefined, 'text/html', '*/*', 'text/*', 'application/markdown'])(
    'requires an explicit Markdown media type for %s',
    async (accept) => {
      const { response, calls } = await runWorker('/', { accept });
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
      expect(calls).toHaveLength(1);
      expect(calls[0].pathname).toBe('/');
    },
  );

  it.each([
    '/writing/example.md',
    '/index.md',
    '/search',
    '/writing/example/attachment',
    '/writing/series/loom',
    '/writing/attachments/cover.png',
    '/tag/ai-governance',
    '/making/prompter/claude',
    '/making/creator/opus',
  ])('passes through existing Markdown file or unsupported route %s without rewriting', async (pathname) => {
    const { response, calls } = await runWorker(pathname, { accept: 'text/markdown' });
    expect(response.status).toBe(200);
    expect(calls).toHaveLength(1);
    expect(calls[0].pathname).toBe(pathname);
  });

  it('supports HEAD negotiation with empty body and skips negotiation on POST', async () => {
    const head = await runWorker('/cv', { method: 'HEAD', accept: 'text/markdown' });
    expect(head.response.status).toBe(200);
    expect(head.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(head.response.headers.get('vary')).toBe('Accept');
    expect(head.response.headers.get('link')).toBe(DISCOVERY_LINK_HEADER);
    expect(await head.response.text()).toBe('');
    expect(head.calls).toHaveLength(1);
    expect(head.calls[0].pathname).toBe('/cv.md');

    const post = await runWorker('/cv', { method: 'POST', accept: 'text/markdown' });
    expect(post.calls).toHaveLength(1);
    expect(post.calls[0].pathname).toBe('/cv');
  });

  it('falls back to proper 404 HTML when a negotiable slug has no .md twin', async () => {
    const { response, calls } = await runWorker('/writing/does-not-exist', {
      accept: 'text/markdown',
    });
    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(await response.text()).toContain('404 Not Found');
    expect(calls.map((c) => c.pathname)).toEqual([
      '/writing/does-not-exist.md',
      '/writing/does-not-exist',
    ]);
  });
});

describe('worker.ts — discovery headers, Content-Type overrides, HEAD, and preview noindex', () => {
  it.each([
    ['/feed.xml', 'application/atom+xml; charset=utf-8'],
    ['/cv.md', 'text/markdown; charset=utf-8'],
    ['/.well-known/agent-skills/site-reader/SKILL.md', 'text/markdown; charset=utf-8'],
    ['/llms.txt', 'text/plain; charset=utf-8'],
    ['/.well-known/api-catalog', 'application/linkset+json; charset=utf-8'],
    ['/.well-known/ai-catalog.json', 'application/json; charset=utf-8'],
    ['/.well-known/mcp/server-card.json', 'application/json; charset=utf-8'],
    ['/.well-known/agent-skills/index.json', 'application/json; charset=utf-8'],
    ['/.build-manifest.json', 'application/json; charset=utf-8'],
    ['/site-index.json', 'application/json; charset=utf-8'],
    ['/license.xml', 'application/rsl+xml; charset=utf-8'],
  ])('sets deterministic Content-Type and page headers for %s', async (pathname, expectedType) => {
    const { response } = await runWorker(pathname);
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe(expectedType);
    expect(response.headers.get('link')).toBe(DISCOVERY_LINK_HEADER);
    expect(response.headers.get('cache-control')).toBe(PAGE_CACHE_CONTROL);
    expect(response.headers.get('vary')).toBe('Accept');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
  });

  it('handles HEAD /.well-known/mcp/server-card.json with 200, JSON Content-Type, CORS, and empty body', async () => {
    const { response } = await runWorker('/.well-known/mcp/server-card.json', { method: 'HEAD' });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json; charset=utf-8');
    expect(response.headers.get('access-control-allow-origin')).toBe('*');
    expect(response.headers.get('link')).toBe(DISCOVERY_LINK_HEADER);
    expect(await response.text()).toBe('');
  });

  it('does not override Content-Type to text/markdown on 404 for missing .md paths', async () => {
    const { response } = await runWorker('/writing/missing.md');
    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toBe('text/html; charset=utf-8');
  });

  it.each(['/assets/favicon-32.png', '/writing/attachments/cover.png', '/pagefind/pagefind.js', '/cdn-cgi/rum'])(
    'does not inject discovery Link or page Cache-Control headers on excluded path %s',
    async (pathname) => {
      const { response } = await runWorker(pathname);
      expect(response.headers.get('link')).toBeNull();
      expect(response.headers.get('vary')).toBeNull();
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
      if (pathname.startsWith('/assets/') || pathname.startsWith('/writing/attachments/')) {
        expect(response.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
      } else {
        expect(response.headers.get('cache-control')).toBeNull();
      }
    },
  );

  it('adds X-Robots-Tag: noindex, nofollow on *.workers.dev preview hosts across all response types', async () => {
    const previewOrigin = 'https://linxule-com-preview.linxule.workers.dev';

    const html = await runWorker(`${previewOrigin}/cv`);
    expect(html.response.status).toBe(200);
    expect(html.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const md = await runWorker(`${previewOrigin}/cv`, { accept: 'text/markdown' });
    expect(md.response.status).toBe(200);
    expect(md.response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(md.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const legacy = await runWorker(`${previewOrigin}/CV`);
    expect(legacy.response.status).toBe(301);
    expect(legacy.response.headers.get('location')).toBe('/cv');
    expect(legacy.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const slash = await runWorker(`${previewOrigin}/cv/`);
    expect(slash.response.status).toBe(308);
    expect(slash.response.headers.get('location')).toBe('/cv');
    expect(slash.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const asset3xx = await runWorker(`${previewOrigin}/play`, {
      routes: {
        '/play': { status: 307, body: null, headers: { Location: '/play/' } },
      },
    });
    expect(asset3xx.response.status).toBe(307);
    expect(asset3xx.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');

    const notFound = await runWorker(`${previewOrigin}/no-such-page`);
    expect(notFound.response.status).toBe(404);
    expect(notFound.response.headers.get('x-robots-tag')).toBe('noindex, nofollow');
  });

  it('passes through 3xx asset responses cleanly without X-Robots-Tag on production host', async () => {
    const { response } = await runWorker('/play', {
      routes: {
        '/play': { status: 307, body: null, headers: { Location: '/play/' } },
      },
    });
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('/play/');
    expect(response.headers.get('x-robots-tag')).toBeNull();
  });
});

describe('shapes.mjs & wrangler.jsonc structural parity', () => {
  it('covers every STATIC_TWINS route in MD_PATHS and MIDDLEWARE_MATCHERS', () => {
    const compiled = MIDDLEWARE_MATCHERS.map((pattern) =>
      match(pattern, { sensitive: true, end: true }),
    );
    for (const shape of STATIC_TWINS) {
      expect(
        compiled.some((fn) => fn(shape.url) !== false),
        `MIDDLEWARE_MATCHERS must match ${shape.url}`,
      ).toBe(true);
      if (shape.url !== '/') {
        expect(MD_PATHS.test(shape.url), `MD_PATHS must match ${shape.url}`).toBe(true);
      }
    }
  });

  it('configures wrangler.jsonc with Worker-first routing covering all static twin routes', () => {
    const raw = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    const config = JSON.parse(raw);
    expect(config.main).toBe('worker.ts');
    expect(config.assets.directory).toBe('./_site');
    expect(config.assets.binding).toBe('ASSETS');
    expect(config.assets.html_handling).toBe('drop-trailing-slash');
    expect(config.assets.not_found_handling).toBe('404-page');
    expect(config.assets.run_worker_first).toEqual([
      '/*',
      '!/assets/*',
      '!/writing/attachments/*',
      '!/pagefind/*',
    ]);
    expect(config.workers_dev).toBe(false);
    expect(config.env.preview.workers_dev).toBe(true);
  });
});
