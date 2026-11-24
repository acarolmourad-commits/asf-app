const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const url = 'https://asf.surf/parcerias/surfmappers/';
const page = read('parcerias/surfmappers/index.html');
const catalog = read('parcerias/index.html');
const benefits = read('beneficios/index.html');

test('catalog opens the single indexable partnership page, not a preview or an app', () => {
  const [active, pending] = catalog.split('<h2 id="previas">');
  const card = active.match(/<article[^>]*id="parceria-surfmappers".*?<\/article>/s)[0];
  assert.match(card, /href="\.\/surfmappers\/"\/?>/);
  assert.match(card, /Não há benefício individual anunciado para associadas/);
  assert.doesNotMatch(pending, /parceria-surfmappers/);
  for (const name of ['surferinhas', 'yoko-acupuntura']) assert.match(pending, new RegExp('id="parceria-' + name + '"'));
  assert.ok(page.includes('<link rel="canonical" href="' + url + '">'));
  assert.match(page, /name="robots" content="index,follow"/);
  assert.equal(read('sitemap.xml').split('<loc>' + url + '</loc>').length - 1, 1);
});

test('public copy remains photography collaboration in PT and EN, without a member offer', () => {
  const [pt, en] = page.split('<section id="english" lang="en"');
  assert.match(pt, /Colaboração ativa · Fotografia de surf/);
  assert.match(pt, /Não há benefício individual anunciado para associadas/);
  assert.match(en, /No benefit for individual members has been announced/);
  assert.doesNotMatch(page, /prévia|noindex|page under review|awaiting review|cupom|coupon|desconto|discount|\d\s*%|<script\b|<form\b|<iframe\b/i);
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), id);
  for (const link of ['/emitir.html', '/parcerias/#parceiros', 'https://blog.surfmappers.com/sou-surfista', 'https://experience.surfmappers.com/']) {
    assert.ok(page.includes('href="' + link + '"'), link);
  }
  assert.match(page, /Photographers set their own prices/);
  assert.match(page, /Combine com o fotógrafo os créditos e o uso pretendido/);
});

test('benefits page links photography only in its separate no-benefit section', () => {
  assert.equal((benefits.match(/href="\/parcerias\/surfmappers\/"/g) || []).length, 1);
  const section = benefits.match(/<section class="connection" aria-labelledby="colaboracoes">.*?<\/section>/s)[0];
  assert.match(section, /Colaborações sem benefício individual anunciado/);
  assert.match(section, /href="\/parcerias\/surfmappers\/"/);
});

test('existing entry points continue to link the partnership without claiming an app launch', () => {
  for (const file of ['novidades.html', 'apps/index.html']) {
    const html = read(file);
    const link = html.split('href="').find(x => /^(?:\.\.\/)?parcerias\/surfmappers\//.test(x));
    assert.ok(link, file);
    assert.doesNotMatch(link.split('</a>')[0], /revisão|lançamento|novo app/i, file);
    if (file==='novidades.html') assert.match(html, /Conheça a colaboração de fotografia de surf com a ASF e saiba como encontrar os álbuns por data e local/);
  }
});
