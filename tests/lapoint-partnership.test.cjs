// Offline checks: no requests, email sends or private benefit data.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const page = read('parcerias/lapoint/index.html');
const catalog = read('parcerias/index.html');
const english = read('parcerias/lapoint/en/index.html');
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
test('approved English copy is available without JavaScript', () => {
  for (const text of [
    'Lapoint | ASF · Surf camps',
    'Planning a surf trip with Lapoint? Anyone with a valid ASF membership card can contact ASF for details of the benefit for Lapoint’s surf camps.',
    'How to ask about your benefit',
    'Write to ASF and tell us you’d like to use the Lapoint benefit. Our team will explain the next steps in a private message before you book.',
    'Contact ASF by email',
    'Before you book',
    'Once you have the details, confirm the conditions for your destination, package and travel dates directly with Lapoint.'
  ]) assert.ok(english.includes(text), text);
  assert.match(english, /<html lang="en">/);
});

for (const [locale, html] of [['pt-BR', page], ['en', english]]) {
  test(locale + ' publishes local photography, editorial sources and private consultation', () => {
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(hrefs.filter(v => v.startsWith('mailto:')), ['mailto:asf.surffeminino@gmail.com']);
    const allowedHosts = ['asf.surf', 'www.lapointcamps.com', 'commons.wikimedia.org', 'creativecommons.org'];
    for (const url of hrefs.filter(v => /^https?:/.test(v))) {
      assert.ok(allowedHosts.includes(new URL(url).hostname), url);
    }
    for (const path of ['portugal/ericeira', 'costa-rica', 'sri-lanka']) {
      assert.ok(hrefs.includes('https://www.lapointcamps.com/surfcamp/' + path + '/'));
    }
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => m[0]);
    assert.equal(images.length, 4);
    for (const image of images) {
      const source = image.match(/src="(\/parcerias\/lapoint\/fotos\/[^"]+\.webp)"/);
      assert.ok(source, image);
      assert.ok(fs.existsSync(path.join(root, source[1])));
      assert.match(image, /alt="[^"]+"/);
    }
    assert.doesNotMatch(html, /<script|<iframe|<form|<video|\b(?:cupom|código|percentual|desconto|coupon|discount|promo code)\b|\d\s*%/i);
  });
  test(locale + ' has accessible headings, working anchors and shared styling', () => {
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /<main id="conteudo" tabindex="-1"/);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(m[1]), m[1]);
    assert.match(html, /<link rel="stylesheet" href="\/parcerias\/parcerias.css">/);
  });
}
test('catalog links the new page and preserves every existing partner', () => {
  assert.equal((catalog.match(/id="parceria-lapoint"/g) || []).length, 1);
  assert.match(catalog, /href="\.\/lapoint\/"/);
  for (const slug of ['surfside-maresias', 'villa-blu', 'surferinhas', 'surfmappers', 'yoko-acupuntura']) {
    assert.match(catalog, new RegExp('href="\\./' + slug + '/"'));
    assert.ok(fs.existsSync(path.join(root, 'parcerias', slug, 'index.html')));
  }
});
test('both language routes are discoverable and link back to one another', () => {
  const pt = 'https://asf.surf/parcerias/lapoint/';
  const en = pt + 'en/';
  const sitemap = read('sitemap.xml');
  assert.notEqual(page.match(/<title>(.*?)<\/title>/)[1], english.match(/<title>(.*?)<\/title>/)[1]);
  for (const [html, canonical, other] of [[page, pt, en], [english, en, pt]]) {
    assert.ok(html.includes('<link rel="canonical" href="' + canonical + '">'));
    assert.match(html, /name="robots" content="index,follow"/);
    assert.ok(html.includes('hreflang="pt-BR" href="' + pt + '"'));
    assert.ok(html.includes('hreflang="en" href="' + en + '"'));
    assert.ok(html.includes('<a class="language" href="' + new URL(other).pathname + '"'));
    assert.equal(sitemap.split('<loc>' + canonical + '</loc>').length - 1, 1);
  }
});
