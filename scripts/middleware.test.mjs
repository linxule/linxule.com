import { describe, expect, it } from 'bun:test';
import middleware from '../middleware.ts';

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
    'text/html;q=1, text/markdown;q=0.1',
  ])('keeps explicit Markdown opt-in for %s', accept => {
    const response = negotiate('/writing/example/?source=agent&view=full', accept);
    expect(response.headers.get('x-middleware-rewrite')).toBe(
      'https://linxule.com/writing/example.md?source=agent&view=full',
    );
    expect(response.headers.get('x-middleware-next')).toBeNull();
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

  it.each([undefined, 'text/html', '*/*', 'text/*', 'application/markdown'])
    ('requires an explicit Markdown media type for %s', accept => {
      expectPassThrough(negotiate('/', accept));
    });

  it.each(['/writing/example.md', '/index.md', '/search', '/writing/example/attachment'])
    ('passes through an existing Markdown file or unsupported route %s', pathname => {
      expectPassThrough(negotiate(pathname, 'text/markdown'));
    });
});
