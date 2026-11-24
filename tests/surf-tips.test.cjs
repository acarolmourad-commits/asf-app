const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validateFeed, saoPauloDate, dateLabel } = require('../js/surf-tips.js');
const now = new Date('2026-11-05T19:00:00Z');
function fixture() {
  return { schema_version: 1, catalog_version: '2026-11-05', selection_date: '2026-11-05', generated_at: '2026-11-05T15:00:00Z', featured_id: 'safe-start', tips: [{ id: 'safe-start', category: 'Começar', title: 'Comece com orientação', summary: 'Converse sobre seus limites antes da aula.', action: 'Leve uma pergunta.', label: 'Explorar guias', href: '/aprender/' }] };
}
test('accepts safe feed and never mutates it', () => {
  const feed = fixture(); const before = JSON.stringify(feed);
  assert.equal(validateFeed(feed, now), feed); assert.equal(JSON.stringify(feed), before);
});
test('uses Sao Paulo date at UTC day boundary', () => {
  assert.equal(saoPauloDate(new Date('2026-11-06T02:59:59Z')), '2026-11-05');
  assert.equal(saoPauloDate(new Date('2026-11-06T03:00:00Z')), '2026-11-06');
});
test('formats calendar dates without timezone shifts', () => assert.equal(dateLabel('2026-11-05'), '05/11/2026'));
test('allows explicitly dated prior selection but refuses future or invalid dates', () => {
  const old = fixture(); old.catalog_version = '2026-10-01'; old.selection_date = '2026-11-04'; assert.doesNotThrow(() => validateFeed(old, now));
  for (const date of ['2026-02-30', '2026-11-06', '05/11/2026']) { const f = fixture(); f.selection_date = date; assert.throws(() => validateFeed(f, now)); }
});
test('refuses future generation and missing featured identity', () => {
  const f = fixture(); f.generated_at = '2027-01-01T00:00:00Z'; assert.throws(() => validateFeed(f, now));
  f.generated_at = '2026-11-05T15:00:00Z'; f.featured_id = 'unknown'; assert.throws(() => validateFeed(f, now));
});
test('rejects duplicate IDs, unsupported categories and content too long', () => {
  const duplicate = fixture(); duplicate.tips.push({ ...duplicate.tips[0] }); assert.throws(() => validateFeed(duplicate, now));
  const category = fixture(); category.tips[0].category = 'Apneia'; assert.throws(() => validateFeed(category, now));
  const long = fixture(); long.tips[0].summary = 'x'.repeat(701); assert.throws(() => validateFeed(long, now));
});
test('rejects markup, unsafe URLs and misleading domains', () => {
  for (const value of ['<script>alert(1)</script>', '<img src=x onerror=alert(1)>']) { const f = fixture(); f.tips[0].summary = value; assert.throws(() => validateFeed(f, now)); }
  for (const href of ['javascript:alert(1)', '//evil.test', 'https://asf.surf.evil.test/', '/aprender/../admin/', '/aprender/?next=evil', 'https://treino.asf.surf/#anything']) { const f = fixture(); f.tips[0].href = href; assert.throws(() => validateFeed(f, now)); }
});
test('feature cannot inject HTML, write storage or trigger remote actions', () => {
  const source = fs.readFileSync(path.join(__dirname, '../js/surf-tips.js'), 'utf8');
  assert.doesNotMatch(source, /innerHTML|outerHTML|localStorage|sessionStorage|method:\s*['"]POST/);
  assert.match(source, /docs\/generated\/surf-tips\.json/);
  assert.match(source, /textContent/);
});
test('home offers useful fallback, accessible controls and scoped styling', () => {
  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../assets/css/surf-tips.css'), 'utf8');
  assert.match(html, /id="surf-tips-grid"/); assert.match(html, /id="surf-tips-status" role="status" aria-live="polite"/);
  assert.match(html, /aria-label="Filtrar dicas por tema"/); assert.match(html, /data-tips-category="Todas" aria-pressed="true"/);
  assert.match(css, /min-height: 44px/); assert.match(css, /:focus-visible/); assert.match(css, /max-width: 600px/);
  assert.match(css, /#dicas \.tips-feature h3 \{ color: #fff !important; \}/);
  for (const selector of ['.tips-feature p', '.tips-feature .tips-eyebrow', '.tips-feature .tips-pill', '.tips-feature aside p', '.tips-feature .tips-action']) {
    assert.ok(css.includes('#dicas ' + selector));
  }
});
