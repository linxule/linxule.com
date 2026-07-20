import { describe, expect, it } from 'bun:test';
import { findRedirectCollisions } from './check-sitemap-redirects.mjs';

const sitemap = (...paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset>${paths.map((path) => `<url><loc>https://linxule.com${path}</loc></url>`).join('')}</urlset>`;

describe('sitemap redirect guard', () => {
  it('reports an exact redirect collision', () => {
    const result = findRedirectCollisions(sitemap('/writing/example'), [
      { source: '/writing/example' },
    ]);

    expect(result.collisions).toEqual([
      { path: '/writing/example', source: '/writing/example' },
    ]);
  });

  it('reports wildcard and parameterized redirect collisions', () => {
    const result = findRedirectCollisions(
      sitemap('/writing/example', '/talks/example'),
      [
        { source: '/writing/:path*' },
        { source: '/talks/:slug' },
      ],
    );

    expect(result.collisions).toEqual([
      { path: '/writing/example', source: '/writing/:path*' },
      { path: '/talks/example', source: '/talks/:slug' },
    ]);
  });

  it('keeps route matching case-sensitive', () => {
    const result = findRedirectCollisions(sitemap('/writing'), [
      { source: '/Writing' },
    ]);

    expect(result.collisions).toEqual([]);
  });

  it('passes when redirects do not shadow sitemap URLs', () => {
    const result = findRedirectCollisions(sitemap('/writing/example'), [
      { source: '/old-writing/:path*' },
    ]);

    expect(result).toEqual({ collisions: [], redirectCount: 1, sitemapCount: 1 });
  });
});
