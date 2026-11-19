const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const page = fs.readFileSync('parcerias/surferinhas/index.html','utf8');
const catalog = fs.readFileSync('parcerias/index.html','utf8');
test('review status distinguishes agreed collaboration from active offer', () => {
 assert.match(page,/Colaboração acordada · página em revisão/);
 assert.match(page,/Collaboration agreed · page under review/);
 assert.match(page,/Não há calendário ativo, benefício permanente/);
 assert.doesNotMatch(page,/wa\.me|whatsapp|\d+%|\d{2}\/\d{2}\/\d{4}|cupom/i);
});
test('static bilingual preview preserves shared design and navigation', () => {
 assert.match(page,/<section id="english" lang="en"/);
 assert.match(page,/href="#english"/);
 assert.match(page,/href="\/parcerias\/parcerias.css"/);
 assert.match(page,/href="\/parcerias\/"/);
 assert.doesNotMatch(page,/<script|<form|<img/);
 const ids=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
 for(const a of page.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(a[1]));
});
test('preview is noindex and absent from sitemap; catalog identifies review', () => {
 assert.match(page,/name="robots" content="noindex,follow"/);
 assert.match(page,/rel="canonical" href="https:\/\/asf.surf\/parcerias\/surferinhas\/"/);
 assert.doesNotMatch(fs.readFileSync('sitemap.xml','utf8'),/https:\/\/asf.surf\/parcerias\/surferinhas\//);
 const card=catalog.match(/<article[^>]*id="parceria-surferinhas"[\s\S]*?<\/article>/)[0];
 assert.match(card,/Colaboração acordada · página em revisão/);
 assert.match(card,/href=".\/surferinhas\/"/);
 assert.doesNotMatch(card,/desconto|cupom|\d+%/i);
});
