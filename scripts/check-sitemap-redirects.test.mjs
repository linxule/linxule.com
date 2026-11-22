import { afterEach, describe, expect, it } from 'bun:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {
  checkOptimizedImageReferences,
  checkRedirectFragmentTargets,
  checkSingleH1,
  checkSitemapInvariants,
  checkSourceHygiene,
  checkTrailingSlashLinks,
  findBuiltHtmlRedirectCollisions,
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

describe('built HTML redirect collision, fragment target, and optimized image guards', () => {
  it('flags built HTML routes (including /tag/*) shadowed by eleventy/redirects.mjs redirects', async () => {
    const dir = await makeTemp('xule-html-redir-');
    await mkdir(path.join(dir, 'tag/research-methods'), { recursive: true });
    await mkdir(path.join(dir, 'tag/research-methodology'), { recursive: true });
    await writeFile(path.join(dir, 'tag/research-methods/index.html'), '<h1>Methods</h1>');
    await writeFile(path.join(dir, 'tag/research-methodology/index.html'), '<h1>Methodology</h1>');

    const { collisions, htmlCount } = findBuiltHtmlRedirectCollisions(dir, [
      { source: '/tag/research-methods', destination: '/tag/research-methodology' },
    ]);
    expect(htmlCount).toBe(2);
    expect(collisions).toEqual([
      {
        path: '/tag/research-methods',
        source: '/tag/research-methods',
        destination: '/tag/research-methodology',
      },
    ]);
  });

  it('verifies internal redirect #fragment targets exist on destination HTML pages', async () => {
    const dir = await makeTemp('xule-frag-');
    await mkdir(path.join(dir, 'cv'), { recursive: true });
    await writeFile(
      path.join(dir, 'cv/index.html'),
      '<html><body><h2 id="publications">Publications</h2><script>var x = \'id="missing"\';</script></body></html>',
    );

    const issues = checkRedirectFragmentTargets(dir, [
      { source: '/publications', destination: '/cv#publications' },
      { source: '/old-section', destination: '/cv#missing' },
      { source: '/gone', destination: '/nonexistent#top' },
      { source: '/ext', destination: 'https://example.org/page#anchor' },
    ]);
    expect(issues.some((m) => m.includes('/publications -> /cv#publications'))).toBe(false);
    expect(issues.some((m) => m.includes('/old-section -> /cv#missing'))).toBe(true);
    expect(issues.some((m) => m.includes('/gone -> /nonexistent#top'))).toBe(true);
    expect(issues.some((m) => m.includes('example.org'))).toBe(false);
  });

  it('verifies every /assets/images/optimized/* reference in built HTML and Markdown exists on disk', async () => {
    const dir = await makeTemp('xule-opt-img-');
    await mkdir(path.join(dir, 'assets/images/optimized'), { recursive: true });
    await mkdir(path.join(dir, 'writing/post'), { recursive: true });

    await writeFile(path.join(dir, 'assets/images/optimized/attachments-good-400w.jpeg'), 'ok');
    await writeFile(
      path.join(dir, 'writing/post/index.html'),
      '<img src="/assets/images/optimized/attachments-good-400w.jpeg" srcset="/assets/images/optimized/attachments-missing-html-800w.webp 800w">',
    );
    await writeFile(
      path.join(dir, 'writing/post.md'),
      [
        '![Good](/assets/images/optimized/attachments-good-400w.jpeg)',
        '![Bad](https://linxule.com/assets/images/optimized/attachments-missing-md-1200w.jpeg)',
        '```md',
        '![Ignored in code](/assets/images/optimized/attachments-in-code-1200w.jpeg)',
        '```',
      ].join('\n'),
    );

    const { problems, refsChecked } = checkOptimizedImageReferences(dir);
    expect(refsChecked).toBe(3);
    expect(problems).toHaveLength(2);
    expect(problems.some((m) => m.includes('attachments-missing-html-800w.webp'))).toBe(true);
    expect(problems.some((m) => m.includes('attachments-missing-md-1200w.jpeg'))).toBe(true);
    expect(problems.some((m) => m.includes('attachments-in-code-1200w.jpeg'))).toBe(false);
  });
});
