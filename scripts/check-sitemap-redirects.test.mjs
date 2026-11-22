import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  checkSingleH1,
  checkSitemapInvariants,
  checkSourceHygiene,
  checkTrailingSlashLinks,
  findRedirectCollisions,
} from './check-sitemap-redirects.mjs';

const tempDirs = [];
afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

async function makeTemp(prefix) {
  const dir = await mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

const sitemap = (...paths) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset>${paths.map((p) => `<url><loc>https://linxule.com${p}</loc></url>`).join('')}</urlset>`;

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

describe('sitemap invariants', () => {
  it('flags /assets/ leaks and missing series pages', () => {
    const xml = sitemap('/writing', '/assets/slides/deck-01', '/writing/series/loom');
    const issues = checkSitemapInvariants(xml, ['loom', 'seam']);
    expect(issues.some((m) => m.includes('/assets/slides/deck-01'))).toBe(true);
    expect(issues.some((m) => m.includes('/writing/series/seam'))).toBe(true);
  });

  it('passes when all expected series exist and no /assets/ URL leaks', () => {
    const xml = sitemap('/writing', '/writing/series/loom', '/writing/series/seam');
    expect(checkSitemapInvariants(xml, ['loom', 'seam'])).toEqual([]);
  });
});

describe('trailing-slash canonical link guard', () => {
  it('flags internal trailing slashes across HTML, JSON-LD, feed.xml, and .md twins while allowing /, /play/, /tsm/, /assets/slides/*/', async () => {
    const dir = await makeTemp('xule-slash-');
    await mkdir(path.join(dir, 'writing'), { recursive: true });
    await mkdir(path.join(dir, 'tsm'), { recursive: true });

    await writeFile(
      path.join(dir, 'index.html'),
      `<html><head><script type="application/ld+json">{"@id":"https://linxule.com/concepts/","url":"https://linxule.com/"}</script></head>
       <body>
         <a href="/">home</a>
         <a href="/play/">play</a>
         <a href="/tsm/">tsm</a>
         <a href="/assets/slides/deck/">slides</a>
         <a href="/writing">clean</a>
         <a href="/writing/">bad-html</a>
         <a href="https://example.org/foo/">external-ok</a>
       </body></html>`,
    );
    await writeFile(
      path.join(dir, 'feed.xml'),
      `<feed><entry><link href="https://linxule.com/writing/post/"/><id>https://linxule.com/writing/post/</id></entry></feed>`,
    );
    await writeFile(
      path.join(dir, 'writing/post.md'),
      `Canonical: [HTML](https://linxule.com/writing/post/)\n\n\`\`\`\nhttps://linxule.com/writing/code-ok/\n\`\`\`\n`,
    );
    // _site/tsm is excluded
    await writeFile(path.join(dir, 'tsm/index.html'), '<a href="/writing/">ignored</a>');

    const issues = checkTrailingSlashLinks(dir);
    expect(issues.some((m) => m.includes('JSON-LD "@id": https://linxule.com/concepts/'))).toBe(true);
    expect(issues.some((m) => m.includes('<a href="/writing/">'))).toBe(true);
    expect(issues.some((m) => m.includes('feed.xml <link href="https://linxule.com/writing/post/">'))).toBe(true);
    expect(issues.some((m) => m.includes('writing/post.md') && m.includes('https://linxule.com/writing/post/'))).toBe(true);
    expect(issues.some((m) => m.includes('code-ok'))).toBe(false);
    expect(issues.some((m) => m.includes('/play/'))).toBe(false);
    expect(issues.some((m) => m.includes('/tsm/'))).toBe(false);
    expect(issues.some((m) => m.includes('/assets/slides/deck/'))).toBe(false);
  });
});

describe('single <h1> guard', () => {
  it('requires exactly one <h1> per site page and skips _site/tsm/ and _site/assets/', async () => {
    const dir = await makeTemp('xule-h1-');
    await mkdir(path.join(dir, 'tsm'), { recursive: true });
    await mkdir(path.join(dir, 'assets/slides/d'), { recursive: true });
    await writeFile(path.join(dir, 'ok.html'), '<html><body><h1>One</h1><script>"<h1>ignored</h1>"</script></body></html>');
    await writeFile(path.join(dir, 'zero.html'), '<html><body><h2>None</h2></body></html>');
    await writeFile(path.join(dir, 'two.html'), '<html><body><h1>A</h1><h1>B</h1></body></html>');
    await writeFile(path.join(dir, 'tsm/index.html'), '<html><body></body></html>');
    await writeFile(path.join(dir, 'assets/slides/d/index.html'), '<html><body><h1>1</h1><h1>2</h1></body></html>');

    const { problems, pagesChecked } = checkSingleH1(dir);
    expect(pagesChecked).toBe(3);
    expect(problems).toHaveLength(2);
    expect(problems.some((m) => m.includes('zero.html') && m.includes('0 <h1>'))).toBe(true);
    expect(problems.some((m) => m.includes('two.html') && m.includes('2 <h1>'))).toBe(true);
  });
});

describe('source hygiene guard', () => {
  it('verifies slide <base href>, bans remote writing images, and requires thumbnails on HTML artifacts', async () => {
    const src = await makeTemp('xule-src-');
    await mkdir(path.join(src, 'assets/slides/my-deck'), { recursive: true });
    await mkdir(path.join(src, 'writing'), { recursive: true });
    await mkdir(path.join(src, 'making/artifacts'), { recursive: true });

    await writeFile(path.join(src, 'assets/slides/my-deck/index.html'), '<html><head><title>Deck</title></head></html>');
    await writeFile(
      path.join(src, 'writing/essay.md'),
      '---\ntitle: Test\n---\n![remote](https://example.com/pic.png)\n```md\n![code](https://example.com/ok.png)\n```',
    );
    await writeFile(
      path.join(src, 'making/artifacts/demo.md'),
      '---\ntitle: Demo\nsrc: /assets/artifacts/demo/index.html\n---\n',
    );

    const issues = checkSourceHygiene(src);
    expect(issues.some((m) => m.includes('[slides]') && m.includes('my-deck'))).toBe(true);
    expect(issues.some((m) => m.includes('[remote-image]') && m.includes('pic.png'))).toBe(true);
    expect(issues.some((m) => m.includes('ok.png'))).toBe(false);
    expect(issues.some((m) => m.includes('[artifact-thumbnail]') && m.includes('demo.md'))).toBe(true);
  });

  it('passes against the real src/ tree', () => {
    expect(checkSourceHygiene('src')).toEqual([]);
  });
});
