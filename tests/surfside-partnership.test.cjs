const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const [pt, en] = ["Para reservar no Surfside Maresias, fale com a hospedagem por telefone ou pelo site oficial e informe que é associada da ASF. A equipe confirma as condições para as suas datas e orienta como apresentar a carteirinha em particular.","To book at Surfside Maresias, contact the property by phone or through its official website and mention that you are an ASF member. The team will confirm the terms for your dates and explain how to show your membership card privately."];
const page = read('parcerias/surfside-maresias/index.html');
const catalog = read('parcerias/index.html');
const benefits = read('beneficios/index.html');
const card = catalog.match(/<article[^>]*\bid="parceria-surfside-maresias"[^>]*>[\s\S]*?<\/article>/)[0];

test('the booking guidance is exact in both languages, in the partner page and catalog', () => {
  const reservation = page.match(/<section aria-labelledby="reserva">[\s\S]*?<\/section>/)[0];
  const english = page.match(/<section id="english" lang="en"[\s\S]*?<\/section>/)[0];
  assert.ok(reservation.includes('<p>' + pt + '</p>'));
  assert.ok(english.includes('<p>' + en + '</p>'));
  assert.ok(card.includes('<p>' + pt + '</p>'));
  assert.ok(card.includes('<details lang="en"><summary>English</summary><p>' + en + '</p></details>'));
  assert.doesNotMatch(page, /<script\b|<form\b|<iframe\b/i);
  const ids = [...page.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id), id);
  for (const section of [reservation, english]) {
    assert.match(section, /href="https:\/\/www\.surfsidemaresias\.com(?:\/pt)?"/);
    assert.match(section, /href="\/emitir\.html"/);
  }
});

test('other partners remain distinct and no private Surfside terms appear in public surfaces', () => {
  const [active, pending] = catalog.split('<h2 id="previas">');
  for (const slug of ['surfside-maresias', 'lapoint', 'villa-blu']) assert.match(active, new RegExp('id="parceria-' + slug + '"'));
  for (const slug of ['surferinhas', 'surfmappers', 'yoko-acupuntura']) {
    assert.match(pending, new RegExp('id="parceria-' + slug + '"'));
    assert.doesNotMatch(active, new RegExp('id="parceria-' + slug + '"'));
  }
  const surfsideBenefit = benefits.match(/<section class="offer" aria-labelledby="surfside-title">[\s\S]*?<\/section>/)[0];
  const surfsideGuide = benefits.match(/<li><a href="\/parcerias\/surfside-maresias\/#reserva"[\s\S]*?<\/li>/)[0];
  for (const text of [page, card, surfsideBenefit, surfsideGuide]) {
    assert.doesNotMatch(text, /em revisão|are reviewing|\b\d+\s*%|ASF5OFF|wa\.me|WhatsApp|late checkout|mínimo de diárias|minimum stay/i);
  }
  for (const text of [surfsideBenefit, surfsideGuide]) assert.match(text, /href="\/parcerias\/surfside-maresias\/#reserva"/);
  assert.match(catalog, /href="\.\/surfside-maresias\/"/);
  assert.ok(read('emitir.html').includes('<html'));
});
