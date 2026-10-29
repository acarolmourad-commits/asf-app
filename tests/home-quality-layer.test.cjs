const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const js = fs.readFileSync(path.join(root, 'asf-home-quality.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'asf-home-quality.css'), 'utf8');
const card = fs.readFileSync(path.join(root, 'carteirinha.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('home quality layer never accesses browser storage or card API', () => {
  assert.doesNotMatch(js, /localStorage|sessionStorage|ASF_CARD|asf-card-v2|asf-card-history|supabase|emitir_carteirinha/i);
});

test('membership storage keys and card code remain present', () => {
  assert.match(card, /KEY:\s*'asf-card-v2'/);
  assert.match(card, /HIST_KEY:\s*'asf-card-history'/);
  assert.match(html, /src="carteirinha\.js"/);
  assert.match(html, /id="carteirinha"/);
});

test('quality layer provides keyboard skip link, labels and safe external links', () => {
  assert.match(js, /skip-link/);
  assert.match(js, /aria-label/);
  assert.match(js, /aria-live/);
  assert.match(js, /noopener/);
  assert.match(html, /asf-home-quality\.css/);
  assert.match(html, /asf-home-quality\.js/);
});

test('responsive and reduced-motion styles exist', () => {
  assert.match(css, /max-width:\s*480px/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /:focus-visible/);
});

test('existing content is rearranged, not removed', () => {
  assert.match(js, /insertAdjacentElement\('afterend'/);
  assert.doesNotMatch(js, /\.remove\(|innerHTML\s*=|outerHTML\s*=/);
});

test('institutional footer has explicit readable colors and visible link focus', () => {
  assert.match(css, /footer\[role="contentinfo"\][\s\S]*?background:\s*#0E2439\s*!important/i);
  assert.match(css, /footer\[role="contentinfo"\] p[\s\S]*?opacity:\s*1\s*!important/i);
  assert.match(css, /footer\[role="contentinfo"\] nav a[\s\S]*?color:\s*#8BE3F7\s*!important/i);
  assert.match(css, /footer\[role="contentinfo"\] nav a:focus-visible[\s\S]*?outline:\s*3px solid #FFD166/i);
});

