const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { brasiliaDay, updateCalendar } = require('../calendario/calendario.js');
const html = fs.readFileSync(path.join(__dirname, '../calendario/index.html'), 'utf8');
const sitemap = fs.readFileSync(path.join(__dirname, '../sitemap.xml'), 'utf8');
const rows = [...html.matchAll(/<article data-end="([^"]+)"[^>]*>([\s\S]*?)<\/article>/g)];
test('curates four concrete records with distinct dates and primary sources', () => {
  const url = 'https://asf.surf/calendario/';
  assert.ok(html.includes('<link rel="canonical" href="' + url + '">'));
  assert.equal(sitemap.split('<loc>' + url + '</loc>').length - 1, 1);
  assert.equal(rows.length, 4);
  const expected = [
    ['2026-11-28', /Maresias Shootout/, /Entrada 20/, /categoria feminina/, /gratuita/, /por convite/, /Sem link direto/, /href="https:\/\/maresiasshootout\.com\.br\//],
    ['2026-11-29', /Surf Brasil Pro/, /Janela oficial/, /início de baterias em 22/, /href="https:\/\/www\.surfbrasil\.org\.br\//],
    ['2026-11-29', /Ubatuba Pro Surf/, /Programado pela Prefeitura/, /Praia Vermelha do Centro/, /href="https:\/\/www\.ubatuba\.sp\.gov\.br\//],
    ['2026-12-06', /Circuito Guarujaense/, /Programado na agenda municipal/, /Praia do Tombo/, /href="https:\/\/portalguaruja\.tur\.br\//]
  ];
  for (let i = 0; i < rows.length; i++) {
    const [, end, contents] = rows[i];
    const [date, ...patterns] = expected[i];
    assert.equal(end, date);
    assert.ok(contents.includes('datetime="' + end + '"'));
    for (const p of patterns) assert.match(contents, p);
  }
  assert.doesNotMatch(html, /href="[^"]*(youtu\.be|youtube\.com)|participação da ASF|data confirmada de transmissão/i);
  assert.match(html, /Nenhum evento sem data definida foi verificado/);
});
test('retains the endpoint day through midnight in Brasília', () => {
  assert.equal(brasiliaDay(new Date('2026-11-29T02:59:00Z')), '2026-11-28');
  assert.equal(brasiliaDay(new Date('2026-11-29T03:00:00Z')), '2026-11-29');
});
test('moves expired cards out of the confirmed and planned lists without claiming occurrence', () => {
  const c=[], p=[], hist=[], els={
    'confirmed-events': {children:c}, 'planned-events': {children:p},
    'history-events': {children:hist, appendChild(card){
      const src=c.includes(card)?c:p;
      hist.push(...src.splice(src.indexOf(card),1));
    }},
    historico:{hidden:true}, 'confirmed-empty':{hidden:true}, 'planned-empty':{hidden:true}
  };
  const cards=rows.map((row,i)=>{
    const label={textContent:'original'};
    const card={dataset:{end:row[1]},querySelector:()=>label,label};
    (i<2?c:p).push(card);
    return card;
  });
  const dom={getElementById:id=>els[id],querySelectorAll:()=>[...c,...p]};
  updateCalendar(dom,'2026-11-28'); assert.deepEqual(hist,[]);
  updateCalendar(dom,'2026-11-29'); assert.deepEqual(hist,[cards[0]]);
  updateCalendar(dom,'2026-11-30'); assert.deepEqual(hist,cards.slice(0,3));
  assert.equal(els['confirmed-empty'].hidden,false);
  assert.equal(els['planned-empty'].hidden,true);
  updateCalendar(dom,'2026-12-07'); assert.deepEqual(hist,cards);
  assert.equal(els['planned-empty'].hidden,false);
  assert.equal(els.historico.hidden,false);
  assert.ok(cards.every(card=>card.label.textContent==='Data já passada'));
  assert.match(html,/não confirma que a competição ocorreu/);
});
