const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
test('guides have working quiz paths, editorial context and local assets', () => {
 for (const file of fs.readdirSync(path.join(root,'aprender')).filter(f=>f.endsWith('.html'))) {
  const s=fs.readFileSync(path.join(root,'aprender',file),'utf8');
  assert.ok(!s.includes('index.html#quiz'),file);
  assert.ok(!s.includes('/asf-app/asf-'),file);
  if(file!=='index.html') assert.ok(s.includes('Sobre este guia'),file);
 }
});
test('safety guides avoid unsupported guarantees and universal exercise dosage',()=>{
 const s=['como-comecar-a-surfar-mulheres.html','correntes-de-retorno-seguranca.html','remada-tecnica-e-treinos.html'].map(f=>fs.readFileSync(path.join(root,'aprender',f),'utf8')).join('');
 for(const phrase of ['está provado','flutuação garantida','poucos metros bastam','4 a 6 semanas','5 minutos diários evitam','3 séries de 15']) assert.ok(!s.includes(phrase),phrase);
 assert.ok(s.includes('rnli.org/safety/choose-your-activity/surfing'));
});
test('culture renders native accessible details with sources, no fabricated trivia',()=>{
 const source=fs.readFileSync(path.join(root,'surf-culture.js'),'utf8');
 let container={innerHTML:''};
 const doc={readyState:'loading',addEventListener:()=>{},getElementById:()=>container};
 vm.runInNewContext(source+'; SurfCulture.render("surf-culture-container");',{document:doc});
 assert.equal((container.innerHTML.match(/<details /g)||[]).length,3);
 assert.equal((container.innerHTML.match(/<summary /g)||[]).length,3);
 assert.ok(container.innerHTML.includes('weather.gov/safety/ripcurrent'));
 assert.ok(!container.innerHTML.includes('**'));
 assert.ok(!source.includes('Maggie Walker'));
});
