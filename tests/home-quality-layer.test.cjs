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

// Contract for PR #117: retain all actions while grouping ordinary navigation
// buttons, without reviving the menu/menuitem roles removed by PR #120.
const menu = html.match(/<nav\b[^>]*id="header-menu"[^>]*>[\s\S]*?<\/nav>/)[0];
const expectedGroups = [
  ['Comece aqui', ['dicas', 'conteudo', 'surf-culture', 'quiz/', 'surfer-profile']],
  ['Explore o mar', ['praias', 'previsao-surf/', 'https://tempo.asf.surf/', 'sessoes-interativas.html', 'surf-news']],
  ['Treine e evolua', ['mobilidade', 'metas', 'desafios', 'surf-trip/', 'utilities', 'seguranca']],
  ['Comunidade', ['comunidade', 'https://eventos.asf.surf/', 'assinantes', 'assistente']],
  ['ASF e benefícios', ['parcerias/', 'carteirinha', 'premium']]
];

test('main navigation keeps five named groups and all 23 destinations in order', () => {
  const groups = [...menu.matchAll(/<div class="asf-menu-group"[^>]*aria-label="([^"]+)"[^>]*>\s*<div[^>]*>[\s\S]*?<\/div>([\s\S]*?)<\/div>/g)];
  assert.deepEqual(groups.map(group => [group[1], [...group[2].matchAll(/onclick="([^"]+)"/g)].map(action =>
    action[1].match(/(?:showSection\('|location\.href=')([^']+)/)?.[1]
  )]), expectedGroups);
  assert.equal((menu.match(/<button\b/g) || []).length, 23);
  assert.equal(new Set(expectedGroups.flatMap(group => group[1])).size, 23);
});

test('grouped navigation retains native buttons and accessible group labels', () => {
  assert.match(menu, /aria-label="Navegação principal"/);
  assert.doesNotMatch(menu, /role="(?:menu|menuitem|menubar)"/);
  assert.equal((menu.match(/role="group"/g) || []).length, 5);
  for (const button of menu.matchAll(/<button\b[^>]*>/g)) {
    assert.match(button[0], /type="button"/);
    assert.doesNotMatch(button[0], /tabindex="-1"/);
    assert.match(button[0], /closeMenu\(\)/);
  }
  assert.match(menu, /showSection\('carteirinha'\);ASF_CARD\.init\(\);closeMenu\(\)/);
});

test('authored groups opt out of legacy regrouping and retain the accessibility layer', () => {
  assert.match(menu, /data-asf-grouped="true"/);
  assert.match(html, /asf-navigation-a11y\.css\?v=/);
  assert.match(html, /asf-navigation-a11y\.js\?v=/);
  assert.ok(html.indexOf('asf-navigation-a11y.css') > html.indexOf('asf-home-quality.css'));
});
