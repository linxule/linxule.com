import { readFileSync } from 'node:fs';
import { match } from 'path-to-regexp';

export function findRedirectCollisions(sitemapXml, redirects) {
  const sitemapPaths = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    ([, location]) => decodeURI(new URL(location).pathname),
  );
  const redirectMatchers = redirects.map(({ source }) => ({
    source,
    matches: match(source, {
      sensitive: true,
      end: true,
      decode: decodeURIComponent,
    }),
  }));

  const collisions = sitemapPaths.flatMap((path) =>
    redirectMatchers
      .filter(({ matches }) => matches(path) !== false)
      .map(({ source }) => ({ path, source })),
  );

  return { collisions, redirectCount: redirectMatchers.length, sitemapCount: sitemapPaths.length };
}

if (import.meta.main) {
  const config = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const sitemap = readFileSync('_site/sitemap.xml', 'utf8');
  const { collisions, redirectCount, sitemapCount } = findRedirectCollisions(
    sitemap,
    config.redirects ?? [],
  );

  console.log(
    `[sitemap-redirects] checked ${sitemapCount} sitemap URL(s) against ${redirectCount} redirect rule(s).`,
  );

  if (collisions.length > 0) {
    console.error('[sitemap-redirects] Sitemap URLs must not redirect:');
    for (const { path, source } of collisions) {
      console.error(`  - ${path} matches ${source}`);
    }
    process.exit(1);
  }

  console.log('[sitemap-redirects] OK — no sitemap URL is shadowed by a redirect.');
}
