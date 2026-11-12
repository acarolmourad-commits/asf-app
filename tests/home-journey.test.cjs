// DOM-only regression coverage. No browser rendering or remote requests.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'js/home-journey.js'), 'utf8');
function fixture(hash = '') {
  const dom = new JSDOM(`<!doctype html><body><section class="hero"></section><div id="parcerias-destaque">Parceiros</div><nav class="asfv2-nav"></nav><div class="asfv2-band" id="asfv2-explorar"><h2 class="asfv2-band-title">Explorar</h2><nav id="comecar"></nav><div id="asf-home-search"></div><section id="dicas"><input id="personal" value="Preservado"><button id="action">Ação</button></section></div><footer>Antigo</footer><footer role="contentinfo">Institucional</footer><div id="last-content">Mais conteúdo</div><a id="jump" href="#dicas">Dicas</a></body>`, {url:'https://asf.review.invalid/'+hash,runScripts:'outside-only'});
  const w=dom.window; w.runtimeErrors=[]; w.addEventListener('error',event=>{w.runtimeErrors.push(event.message);event.preventDefault();}); w.HTMLElement.prototype.scrollIntoView=function(){};
  w.localStorage.setItem('asf-card-v2','registro que não deve mudar');
  w.calls=[]; w.showSection=function(id){w.calls.push(id); return 42;};
  w.asfNav=function(id){w.calls.push(id);};
  w.document.getElementById('action').addEventListener('click',()=>w.calls.push('action'));
  const ids=[...w.document.querySelectorAll('[id]')].map(n=>n.id);
  vm.runInContext(source,dom.getInternalVMContext());
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  return {dom,w,d:w.document,ids};
}
test('journey preserves IDs, fields, event handlers and personal records',()=>{
 const {dom,w,d,ids}=fixture();try{
  ids.forEach(id=>assert.ok(d.getElementById(id),id));
  assert.equal(d.getElementById('personal').value,'Preservado');
  assert.equal(w.localStorage.getItem('asf-card-v2'),'registro que não deve mudar');
  d.getElementById('action').click(); assert.deepEqual([...w.calls],['action']);
  assert.equal(d.querySelector('.hero').nextElementSibling.id,'comecar');
  assert.ok(d.getElementById('comecar').compareDocumentPosition(d.getElementById('parcerias-destaque')) & w.Node.DOCUMENT_POSITION_FOLLOWING);
  assert.equal(d.body.lastElementChild.tagName,'FOOTER');
  assert.equal(d.body.lastElementChild.getAttribute('role'),'contentinfo');
 } finally{dom.window.close();}
});
test('anchor and programmatic navigation open disclosure; repeated initialization is harmless',()=>{
 const {dom,w,d}=fixture();try{
  const details=d.querySelector('details');assert.equal(details.open,false);
  d.getElementById('jump').dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true}));assert.equal(details.open,true);
  details.open=false;assert.equal(w.showSection('dicas'),42);assert.equal(details.open,true);
  details.open=false;w.asfNav('dicas');assert.equal(details.open,true);
  vm.runInContext(source,dom.getInternalVMContext());d.dispatchEvent(new w.Event('DOMContentLoaded'));
  assert.equal(d.querySelectorAll('#asf-explore-directory').length,1);
 } finally{dom.window.close();}
});
test('deep-linked section opens on initial render',()=>{
 const {dom,d}=fixture('#dicas');try{assert.equal(d.getElementById('dicas').closest('details').open,true);}finally{dom.window.close();}
});
test('real home scripts preserve search and open a matching section inside disclosure',async()=>{
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(fs.readFileSync(path.join(root,'index.html'),'utf8'),{url:'https://asf.review.invalid/',runScripts:'outside-only',virtualConsole:vc,beforeParse(w){
  w.fetch=async input=>{const url=new URL(typeof input==='string'?input:input.url,'https://asf.review.invalid/');const file=path.join(root,url.pathname);if(url.origin!=='https://asf.review.invalid'||!file.startsWith(root+'/')||!fs.existsSync(file)||!fs.statSync(file).isFile())return{ok:false,status:503,json:async()=>({}),text:async()=>''};const text=fs.readFileSync(file,'utf8');return{ok:true,status:200,json:async()=>JSON.parse(text),text:async()=>text};};
  w.XMLHttpRequest=class{open(){throw Error('XHR intentionally blocked');}};w.navigator.sendBeacon=()=>false;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=function(){};w.matchMedia=()=>({matches:false,addListener(){},addEventListener(){},removeEventListener(){}});w.IntersectionObserver=class{observe(){}disconnect(){}};
 }});
 try{
  const w=dom.window,d=w.document;const scripts=[...d.scripts].filter(s=>s.type!=='application/ld+json');
  for(const script of [...scripts.filter(s=>!s.defer),...scripts.filter(s=>s.defer)]){let content=script.textContent,filename='inline';if(script.src){const url=new URL(script.src);if(url.origin!=='https://asf.review.invalid')continue;filename=path.join(root,url.pathname);if(!fs.existsSync(filename))continue;content=fs.readFileSync(filename,'utf8');}vm.runInContext(content,dom.getInternalVMContext(),{filename});}
  await new Promise(r=>setTimeout(r,1700));
  assert.deepEqual(errors,[]);
  assert.ok(d.getElementById('asf-explore-directory'));
  const tips=d.getElementById('dicas');assert.ok(tips);
  const disclosure=tips.closest('details');assert.ok(disclosure,'tips kept in thematic disclosure');
  w.handleSearch('leash');
  const row=d.querySelector('#searchResults .search-result-item[data-section-target="dicas"]');assert.ok(row,'search retains tips index');
  row.click();assert.equal(disclosure.open,true,'search result opens hidden parent disclosure');
  assert.equal(d.querySelector('.hero').nextElementSibling.id,'comecar');
  assert.equal(d.body.lastElementChild.getAttribute('role'),'contentinfo');
 }finally{dom.window.close();}
});

test('hash changes reveal the requested topic without changing stored records',()=>{
 const {dom,w,d}=fixture();try{
  const details=d.getElementById('dicas').closest('details');
  details.open=false;w.history.replaceState(null,'','#dicas');w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  assert.equal(details.open,true);assert.equal(w.localStorage.getItem('asf-card-v2'),'registro que não deve mudar');
 }finally{dom.window.close();}
});
test('malformed URL fragment does not throw during initialization or navigation',()=>{
 const {dom,w}=fixture('#%E0%A4%A');try{
  assert.deepEqual([...w.runtimeErrors],[]);
  w.dispatchEvent(new w.HashChangeEvent('hashchange'));assert.deepEqual([...w.runtimeErrors],[]);
 }finally{dom.window.close();}
});
