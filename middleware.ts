import { rewrite, next } from '@vercel/functions';

// Content paths that have .md counterparts
// Matches: /writing/slug, /making/portraits/slug, /making/artifacts/slug,
//          /talks/slug, /cv, /cv-zh, /thinking, /teaching
const MD_PATHS = /^\/(writing\/[^/]+|making\/portraits\/[^/]+|making\/artifacts\/[^/]+|talks\/[^/]+|cv|cv-zh|thinking|teaching)\/?$/;

export default function middleware(request: Request) {
  const accept = request.headers.get('accept') || '';
  const wantsMarkdown = accept.split(',')
    .some(part => part.trim().split(';')[0].trim() === 'text/markdown');
  if (!wantsMarkdown) {
    return next();
  }

  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/$/, '') || '/';

  if (!MD_PATHS.test(pathname)) {
    return next();
  }

  // Rewrite to the .md file, preserving query string
  const mdUrl = new URL(`${pathname}.md${url.search}`, request.url);
  return rewrite(mdUrl);
}

export const config = {
  matcher: [
    '/writing/:path',
    '/making/portraits/:path',
    '/making/artifacts/:path',
    '/talks/:path',
    '/cv',
    '/cv-zh',
    '/thinking',
    '/teaching',
  ],
};
