import { describe, expect, it } from 'bun:test';
import { match } from 'path-to-regexp';
import middleware, { config } from '../middleware.ts';
import { MD_PATHS, MIDDLEWARE_MATCHERS, STATIC_TWINS } from '../eleventy/shapes.mjs';

function negotiate(pathname, accept) {
  return middleware(new Request(`https://linxule.com${pathname}`, {
    headers: accept === undefined ? {} : { accept },
  }));
}

function expectPassThrough(response) {
  expect(response.headers.get('x-middleware-next')).toBe('1');
  expect(response.headers.get('x-middleware-rewrite')).toBeNull();
}

describe('Markdown content negotiation', () => {
  it.each([
    'text/markdown',
    'Text/Markdown',
    'TEXT/MARKDOWN; charset=utf-8',
    'text/html, text/markdown',
    'text/html;q=0.5, text/markdown;q=0.9',
    'text/html;q=0.8, text/markdown;q=0.8',
    'text/html;q=0.4, */*;q=0.9, text/markdown;q=0.6',
  ])('keeps explicit Markdown opt-in for %s', accept => {
    const response = negotiate('/writing/example/?source=agent&view=full', accept);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://linxule.com/writing/example.md?source=agent&view=full',
    );
    expect(response.headers.get('x-middleware-next')).toBeNull();
  });

  it.each([
    'text/html;q=1.0, text/markdown;q=0.1',
    'text/html;q=1, text/markdown;q=0.1',
    'text/html, text/markdown;q=0.5',
    'text/html, text/markdown;q=0.8',
    'text/*, text/markdown;q=0.5',
    '*/*, text/markdown;q=0.5',
  ])('serves HTML when HTML or wildcard quality strictly exceeds Markdown in %s', accept => {
    expectPassThrough(negotiate('/writing/example', accept));
  });

  it.each([
    'text/markdown;q=0',
    'text/html, text/markdown;q=0.000',
    'Text/Markdown; charset=utf-8; Q = 0',
    'text/markdown;q="0"',
  ])('respects explicit rejection in %s', accept => {
    expectPassThrough(negotiate('/writing/example', accept));
  });

  it('rewrites the root and preserves its query', () => {
    expect(negotiate('/?source=agent', 'text/markdown').headers.get('x-middleware-rewrite'))
      .toBe('https://linxule.com/index.md?source=agent');
  });

  it('negotiates /connect and /builds/:slug routes', () => {
    expect(negotiate('/connect/?source=agent', 'text/markdown').headers.get('x-middleware-rewrite'))
      .toBe('https://linxule.com/connect.md?source=agent');
    expect(negotiate('/connect', 'text/markdown').headers.get('x-middleware-rewrite'))
      .toBe('https://linxule.com/connect.md');
    expectPassThrough(negotiate('/connect', 'text/html'));
    expectPassThrough(negotiate('/connect.md', 'text/markdown'));

    expect(negotiate('/builds/vellum/?source=agent', 'text/markdown').headers.get('x-middleware-rewrite'))
      .toBe('https://linxule.com/builds/vellum.md?source=agent');
    expectPassThrough(negotiate('/builds/vellum', 'text/html'));
    expectPassThrough(negotiate('/builds/vellum.md', 'text/markdown'));
  });

  it.each([undefined, 'text/html', '*/*', 'text/*', 'application/markdown'])
    ('requires an explicit Markdown media type for %s', accept => {
      expectPassThrough(negotiate('/', accept));
    });

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
  ])('passes through an existing Markdown file or unsupported route %s', pathname => {
    expectPassThrough(negotiate(pathname, 'text/markdown'));
  });

  it('keeps config.matcher in exact parity with MIDDLEWARE_MATCHERS and covers every static shape', () => {
    expect(config.matcher).toEqual([...MIDDLEWARE_MATCHERS]);
    const compiled = config.matcher.map((pattern) => match(pattern, { sensitive: true, end: true }));
    for (const shape of STATIC_TWINS) {
      expect(
        compiled.some((fn) => fn(shape.url) !== false),
        `config.matcher must match ${shape.url}`,
      ).toBe(true);
      if (shape.url !== '/') {
        expect(MD_PATHS.test(shape.url), `MD_PATHS must match ${shape.url}`).toBe(true);
      }
    }
  });
});
