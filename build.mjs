/**
 * Produces dist/artifact.html — the single-file build used for hosting.
 *
 * Two things separate it from index.html:
 *   • Images become data: URIs, so the page carries its own photos.
 *   • The Pretendard CDN <link> is dropped; a strict CSP blocks every font
 *     host except Google Fonts, and the stack already falls back cleanly.
 *
 * The output is a fragment (no <html>/<head>/<body>) because the Artifact
 * host supplies that skeleton itself.
 *
 *   node build.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { extname } from 'node:path';

const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

const src = readFileSync('index.html', 'utf8');

const head = src.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = src.match(/<body>([\s\S]*?)<\/body>/)[1];

const keptHead = head
  .split('\n')
  .filter((line) => !/data-local-only/.test(line))
  // The host supplies the viewport tag; charset is kept as a safety net,
  // and og:image can't reference a local file once the page is hosted.
  .filter((line) => !/name="viewport"|og:image/.test(line))
  .join('\n')
  .trim();

// index.html carries a search-oriented title for a real domain; the hosted
// build is listed by name, so it gets the wordmark on its own.
let out = `${keptHead}\n${body}`.replace(
  /<title>[^<]*<\/title>/,
  '<title>오아시스 테니스</title>'
);

let inlined = 0;
out = out.replace(/src="(assets\/[^"]+)"/g, (_, path) => {
  const mime = MIME[extname(path)];
  if (!mime) throw new Error(`no mime type for ${path}`);
  inlined++;
  return `src="data:${mime};base64,${readFileSync(path).toString('base64')}"`;
});

mkdirSync('dist', { recursive: true });
writeFileSync('dist/artifact.html', out);
console.log(`dist/artifact.html — ${inlined} assets inlined, ${(out.length / 1024 / 1024).toFixed(2)} MB`);
