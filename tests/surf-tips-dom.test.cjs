// DOM integration only. No real browser layout, network, forms or analytics run.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(root, 'js/surf-tips.js'), 'utf8');
const real = JSON.parse(fs.readFileSync(path.join(root, 'docs/generated/surf-tips.json'), 'utf8'));
function fixture() { return { ...structuredClone(real), generated_at: '2026-11-05T18:00:00Z', selection_date: '2026-11-05' }; }
async function until(predicate) {
  for (let i=0; i<50; i++) { if (predicate()) return; await new Promise(r => setTimeout(r, 2)); }
  assert.ok(predicate(), 'DOM state did not settle');
}
function environment(fetcher) {
  const dom = new JSDOM(html, { url: 'https://asf.surf/', runScripts: 'outside-only' });
  const w = dom.window;
  const RealDate = w.Date;
  w.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : ['2026-11-05T19:00:00Z'])); } static now() { return new RealDate('2026-11-05T19:00:00Z').getTime(); } };
  w.AbortController = AbortController;
  const requests=[];
  w.fetch = async (url, options) => { requests.push({ url, options }); return fetcher(url, options); };
  w.localStorage.setItem('asf-card-v2', 'preserve-me');
  w.localStorage.setItem('asf-points', '123');
  w.normalizedSearchIndex = [{ sectionId:'dicas', title:'Old fallback tip' }, { sectionId:'outra', title:'Keep other content' }];
  const forms = [...w.document.querySelectorAll('form,input,select,textarea')].map(el => el.outerHTML);
  w.eval(source);
  return { dom, w, doc: w.document, requests, forms };
}
function response(feed=fixture()) { return { ok:true, text:async()=>JSON.stringify(feed) }; }
test('real feed fills the visible feature and every category filter', async () => {
  const f=environment(async()=>response());
  await until(()=>!f.doc.getElementById('surf-tips-filters').hidden);
  const selected=fixture().tips.find(t=>t.id===fixture().featured_id);
  assert.equal(f.doc.getElementById('surf-tip-title').textContent,selected.title);
  assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,10);
  for(const category of ['Começar','Segurança','Equipamento','Treino','Todas']){
    const button=f.doc.querySelector(`[data-tips-category="${category}"]`); button.click();
    assert.equal(button.getAttribute('aria-pressed'),'true');
    assert.equal(f.doc.querySelectorAll('#surf-tips-filters [aria-pressed="true"]').length,1);
    assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,category==='Todas'?10:fixture().tips.filter(t=>t.category===category).length);
  }
  assert.match(f.doc.getElementById('surf-tips-status').textContent,/Seleção de 05\/11\/2026 · Edição do catálogo: 05\/11\/2026/);
  assert.equal(f.requests.length,1);assert.equal(f.requests[0].url,'docs/generated/surf-tips.json');
  assert.equal(f.requests[0].options.cache,'no-cache');
  assert.deepEqual([...f.doc.querySelectorAll('form,input,select,textarea')].map(el=>el.outerHTML),f.forms);
  assert.equal(f.w.localStorage.getItem('asf-card-v2'),'preserve-me');assert.equal(f.w.localStorage.getItem('asf-points'),'123');
  f.dom.window.close();
});
test('network failure preserves fallback and successful retry replaces it', async () => {
  let available=false;
  const f=environment(async()=>{if(!available)throw Error('offline');return response();});
  await until(()=>!f.doc.getElementById('surf-tips-retry').hidden);
  assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,3);
  assert.match(f.doc.getElementById('surf-tips-status').textContent,/Não foi possível/);
  available=true;f.doc.getElementById('surf-tips-retry').click();
  await until(()=>!f.doc.getElementById('surf-tips-filters').hidden);
  assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,10);assert.equal(f.requests.length,2);
  assert.equal(f.doc.getElementById('surf-tips-retry').hidden,true);f.dom.window.close();
});
test('failed status, malformed JSON, bad URLs and markup never replace fallback', async () => {
  const xss=fixture();xss.tips[0].title='<img src=x onerror=alert(1)>';
  const unsafe=fixture();unsafe.tips[0].href='javascript:alert(1)';
  const cases=[{ok:false,text:async()=>''},{ok:true,text:async()=>'{broken'},response(xss),response(unsafe),{ok:true,text:async()=> 'x'.repeat(60001)}];
  for(const reply of cases){const f=environment(async()=>reply);await until(()=>!f.doc.getElementById('surf-tips-retry').hidden);assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,3);assert.equal(f.doc.getElementById('surf-tip-title').textContent,'Comece com orientação');assert.equal(f.doc.getElementById('surf-tips-filters').hidden,true);f.dom.window.close();}
});
test('older selection is explicitly dated and future selection is rejected', async () => {
  const old=fixture();old.catalog_version='2026-10-01';old.selection_date='2026-11-04';
  const f=environment(async()=>response(old));await until(()=>!f.doc.getElementById('surf-tips-filters').hidden);
  assert.match(f.doc.getElementById('surf-tips-status').textContent,/Última seleção disponível: 04\/11\/2026/);f.dom.window.close();
  const future=fixture();future.selection_date='2026-11-06';const g=environment(async()=>response(future));await until(()=>!g.doc.getElementById('surf-tips-retry').hidden);assert.equal(g.doc.querySelectorAll('#surf-tips-grid article').length,3);g.dom.window.close();
});
test('duplicate script initialization does not refetch or duplicate event listeners', async () => {
  const f=environment(async()=>response());await until(()=>!f.doc.getElementById('surf-tips-filters').hidden);
  f.w.eval(source);await new Promise(r=>setTimeout(r,5));assert.equal(f.requests.length,1);assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,10);f.dom.window.close();
});
test('timeout aborts fetch and leaves a usable retry button', async () => {
  const dom=new JSDOM(html,{url:'https://asf.surf/',runScripts:'outside-only'});const w=dom.window;w.AbortController=AbortController;
  const original=w.setTimeout.bind(w);w.setTimeout=(fn,ms)=>original(fn,ms===8000?0:ms);
  w.fetch=(url,opts)=>new Promise((resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(Error('timeout'))));
  w.eval(source);await until(()=>!w.document.getElementById('surf-tips-retry').hidden);
  assert.equal(w.document.getElementById('surf-tips-retry').disabled,false);assert.equal(w.document.querySelectorAll('#surf-tips-grid article').length,3);dom.window.close();
});
test('search indexes the complete feed across filters and reveals all tips on result click', async () => {
  const f=environment(async()=>response());await until(()=>!f.doc.getElementById('surf-tips-filters').hidden);
  assert.equal(f.w.normalizedSearchIndex.some(i=>i.title==='Old fallback tip'),false);
  assert.equal(f.w.normalizedSearchIndex.some(i=>i.title==='Keep other content'),true);
  assert.equal(f.w.normalizedSearchIndex.filter(i=>i.sectionId==='dicas').length,11);
  assert.ok(f.w.normalizedSearchIndex.some(i=>i._textNorm?.includes('limites')));
  f.doc.querySelector('[data-tips-category="Equipamento"]').click();
  assert.equal(f.w.normalizedSearchIndex.filter(i=>i.sectionId==='dicas').length,11);
  const result=f.doc.createElement('button');result.className='search-result-item';result.dataset.sectionTarget='dicas';
  f.doc.getElementById('searchResults').appendChild(result);result.click();
  assert.equal(f.doc.querySelectorAll('#surf-tips-grid article').length,10);
  assert.equal(f.doc.querySelector('[data-tips-category="Todas"]').getAttribute('aria-pressed'),'true');f.dom.window.close();
});
