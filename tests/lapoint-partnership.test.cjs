// Offline checks: no requests, email sends or private benefit data.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const page = read('parcerias/lapoint/index.html');
const catalog = read('parcerias/index.html');
const approved = [
  'Lapoint | ASF · Surf camps',
  'Quer planejar uma viagem de surf com a Lapoint? Quem tem carteirinha ASF válida pode solicitar à associação as condições do benefício para os surf camps da parceira.',
  'Como consultar seu benefício',
  'Escreva à ASF e informe que deseja usar o benefício Lapoint. A equipe orienta você por mensagem privada antes da reserva.',
  'Consultar a ASF por e-mail',
  'Antes de reservar',
  'Com as orientações em mãos, confirme com a Lapoint as condições para o destino, o pacote e a data da sua viagem.'
];
test('approved Portuguese copy is available without JavaScript', () => {
  for (const text of approved) assert.ok(page.includes(text), text);
  assert.match(page, /<html lang="pt-BR">/);
  assert.doesNotMatch(page, /<script|<noscript|hidden\b|display:\s*none/i);
});
test('only private ASF email consultation, no sales or third-party assets', () => {
  const hrefs = [...page.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  assert.deepEqual(hrefs.filter(v => v.startsWith('mailto:')), ['mailto:asf.surffeminino@gmail.com']);
  assert.deepEqual(hrefs.filter(v => /^https?:/.test(v)), ['https://asf.surf/parcerias/lapoint/']);
  assert.doesNotMatch(page, /<img|<iframe|<form|<video|<svg|\b(?:cupom|código|percentual|desconto)\b|\d\s*%/i);
});
test('semantic headings, skip navigation and anchors remain accessible', () => {
  assert.equal((page.match(/<h1>/g) || []).length, 1);
  assert.match(page, /<main id="conteudo" tabindex="-1"/);
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const m of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(m[1]));
  assert.match(page, /<link rel="stylesheet" href="\/parcerias\/parcerias.css">/);
});
test('catalog links the new page and preserves every existing partner', () => {
  assert.equal((catalog.match(/id="parceria-lapoint"/g) || []).length, 1);
  assert.match(catalog, /href="\.\/lapoint\/"/);
  for (const slug of ['surfside-maresias', 'villa-blu', 'surferinhas', 'surfmappers', 'yoko-acupuntura']) {
    assert.match(catalog, new RegExp('href="\\./' + slug + '/"'));
    assert.ok(fs.existsSync(path.join(root, 'parcerias', slug, 'index.html')));
  }
});
test('canonical and sitemap point to one Portuguese page only', () => {
  const url = 'https://asf.surf/parcerias/lapoint/';
  assert.ok(page.includes('<link rel="canonical" href="' + url + '">'));
  assert.match(page, /name="robots" content="index,follow"/);
  assert.equal(read('sitemap.xml').split('<loc>' + url + '</loc>').length - 1, 1);
  assert.doesNotMatch(page, /hreflang|English|lang="en"/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'parcerias/lapoint')), ['index.html']);
});
