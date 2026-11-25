const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {JSDOM}=require('jsdom');
const runtime=fs.readFileSync('js/asf-i18n.js','utf8');
function make(saved){const dom=new JSDOM('<!doctype html><html lang="pt-BR"><head></head><body><header><div class="header-actions"></div></header><button id="nav"><span>📚</span> Dicas</button><h2>Sobre a ASF</h2><input id="email" value="teste@exemplo.com" placeholder="Seu e-mail"><a id="guide" href="https://manobras.asf.surf/#guia-cutback-completo">Abrir guia completo no ASF Manobras →</a><div id="user-posts">Sobre a ASF</div></body></html>',{url:'https://asf.surf/',runScripts:'outside-only'});const w=dom.window;Object.defineProperty(w.navigator,'language',{value:'en-US'});w.localStorage.setItem('asf_xp','123');if(saved)w.localStorage.setItem('asf-language',saved);w.eval(runtime);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));return dom;}
test('Portuguese remains default even with an English browser',()=>{const dom=make();assert.equal(dom.window.ASF_I18N.getLanguage(),'pt-BR');assert.equal(dom.window.document.documentElement.lang,'pt-BR');assert.equal(dom.window.localStorage.getItem('asf-language'),null);dom.window.close();});
test('English is explicit and reversible, without changing XP, input values, links, emoji or posts',()=>{const dom=make(),w=dom.window,d=w.document;w.setLanguage('en');assert.equal(d.querySelector('#nav').textContent,'📚 Tips');assert.equal(d.querySelector('h2').textContent,'About ASF');assert.equal(d.querySelector('#email').placeholder,'Your email');assert.equal(d.querySelector('#email').value,'teste@exemplo.com');assert.equal(d.querySelector('#user-posts').textContent,'Sobre a ASF');assert.equal(w.localStorage.getItem('asf_xp'),'123');assert.equal(d.querySelector('#guide').href,'https://manobras.asf.surf/#guia-cutback-completo');assert.equal(w.localStorage.getItem('asf-language'),'en');assert.equal(d.querySelector('[data-asf-lang="en"]').getAttribute('aria-pressed'),'true');w.changeLanguage('pt');assert.equal(d.querySelector('#nav').textContent,'📚 Dicas');assert.equal(d.querySelector('h2').textContent,'Sobre a ASF');assert.equal(d.querySelector('#email').placeholder,'Seu e-mail');assert.equal(w.localStorage.getItem('asf_xp'),'123');dom.window.close();});
test('Saved explicit English choice is restored',()=>{const dom=make('en');assert.equal(dom.window.document.querySelector('h2').textContent,'About ASF');assert.equal(dom.window.document.documentElement.lang,'en');dom.window.close();});
test('Dynamic reviewed labels are translated without modifying controls',async()=>{const dom=make('en'),w=dom.window;const b=w.document.createElement('button');b.textContent='Compartilhar';let clicks=0;b.onclick=()=>clicks++;w.document.body.appendChild(b);await new Promise(r=>w.setTimeout(r,5));assert.equal(b.textContent,'Share');b.click();assert.equal(clicks,1);dom.window.close();});
test('Real home page retains canonical Cutback link and can switch both ways',()=>{const html=fs.readFileSync('index.html','utf8');const dom=new JSDOM(html,{url:'https://asf.surf/',runScripts:'outside-only'}),w=dom.window;w.eval(runtime);w.document.dispatchEvent(new w.Event('DOMContentLoaded'));w.setLanguage('en');assert.match(w.document.querySelector('#header-menu').textContent,/Tips/);assert.ok(w.document.querySelector('#guia-cutback-unificado a').href.endsWith('#guia-cutback-completo'));w.setLanguage('pt-BR');assert.match(w.document.querySelector('#header-menu').textContent,/Dicas/);dom.window.close();});

test('home choices and forecast destination follow the selected language', () => {
  const dom = new JSDOM(fs.readFileSync('index.html', 'utf8'), {url:'https://asf.surf/', runScripts:'outside-only'});
  try {
    const {window:w} = dom;
    w.eval(runtime);
    w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
    const nav = w.document.querySelector('#comecar');
    w.setLanguage('en');
    assert.deepEqual([...nav.querySelectorAll('b')].map(el => el.textContent), ['Go surfing','Build my skills','Meet other surfers','Plan a surf trip']);
    assert.equal(nav.querySelector('a').href, 'https://previsao.asf.surf/?lang=en');
    w.setLanguage('pt-BR');
    assert.equal(nav.querySelector('a').getAttribute('href'), 'previsao-surf/');
  } finally {dom.window.close();}
});

test('local card view preserves existing and pending cards and points new users to official registration', () => {
  const dom = new JSDOM(fs.readFileSync('index.html','utf8'), {url:'https://asf.surf/',runScripts:'outside-only'});
  try {
    const w=dom.window, d=w.document, storage=w.localStorage, session=w.sessionStorage;
    const record=JSON.stringify({numero:'ASF-EXEMPLO',nome:'Nome de exemplo',nivel:'Iniciante',registrada:false});
    storage.setItem('asf-card-v2',record);
    storage.setItem('asf-card-history','{"emissoes":[]}');
    const card = w.eval(fs.readFileSync('carteirinha.js','utf8') + '\nASF_CARD;');
    d.dispatchEvent(new w.Event('DOMContentLoaded'));
    assert.match(d.querySelector('#carteirinha-content').textContent,/ASF-EXEMPLO/);
    assert.equal(storage.getItem('asf-card-v2'),record);
    assert.equal(storage.getItem('asf-card-history'),'{"emissoes":[]}');
    storage.removeItem('asf-card-v2');
    card.init();
    assert.equal(d.querySelector('#card-nome'),null);
    assert.ok(d.querySelector('#carteirinha a[href="emitir.html"]'));
    const pending=JSON.stringify({nome:'Em andamento',createdAt:Date.now()});
    session.setItem('asf_card_pending_registration',pending);
    card.init();
    assert.equal(d.querySelector('#card-nome').value,'Em andamento');
    assert.equal(session.getItem('asf_card_pending_registration'),pending);
  } finally {dom.window.close();}
});
