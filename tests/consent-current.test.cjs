const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('assets/js/inline/asf-inline-03.js', 'utf8');
function setup(values={}, denied=false) {
 const store={...values}, events={}, scripts=[];
 const banner={style:{},setAttribute(){},focus(){this.focused=true;}};
 let duplicate={remove(){duplicate=null;}}, reloads=0;
 const document={readyState:'loading',getElementById(id){return id==='cookie-consent-banner'?banner:id==='asf-cookie-banner'?duplicate:scripts.find(s=>s.id===id);},createElement(){return {};},head:{appendChild(s){scripts.push(s);}},addEventListener(k,fn){events[k]=fn;}};
 const window={location:{reload(){reloads++;}},addEventListener(k,fn){events[k]=fn;}};
 const localStorage={getItem(k){if(denied)throw Error();return store[k]??null;},setItem(k,v){if(denied)throw Error();store[k]=v;}};
 vm.runInNewContext(source,{document,window,localStorage});events.DOMContentLoaded();
 return {window,banner,store,scripts,events,get reloads(){return reloads;},get duplicate(){return duplicate;}};
}
test('fresh visit has one banner and no optional provider',()=>{let x=setup();assert.equal(x.scripts.length,0);assert.equal(x.banner.style.display,'flex');assert.equal(x.duplicate,null);});
for(const legacy of ['accepted','all','bogus'])test('legacy '+legacy+' cannot grant optional consent',()=>{let x=setup({'asf-cookie-consent':legacy});assert.equal(x.window.ASFConsent.get(),null);assert.equal(x.scripts.length,0);});
test('legacy refusal is preserved',()=>{let x=setup({'asf-cookie-consent':'essential'});assert.equal(x.window.ASFConsent.get(),'essential');assert.equal(x.scripts.length,0);});
test('essential choice saves and preserves unrelated data',()=>{let x=setup({'asf-card-v2':'card','asf-points':'42'});x.window.essentialCookies();assert.equal(x.store['asf-cookie-consent-v2'],'essential');assert.equal(x.store['asf-card-v2'],'card');assert.equal(x.store['asf-points'],'42');assert.equal(x.scripts.length,0);});
test('accepting twice loads provider once',()=>{let x=setup();x.window.acceptAllCookies();x.window.acceptAllCookies();assert.equal(x.scripts.length,1);assert.equal(x.store['asf-cookie-consent-v2'],'all');});
test('preferences can reopen and revoke without erasing progress',()=>{let x=setup({'asf-cookie-consent-v2':'all',progress:'5'});x.window.openCookiePreferences();assert.equal(x.banner.style.display,'flex');assert.equal(x.banner.focused,true);x.window.essentialCookies();assert.equal(x.reloads,1);assert.equal(x.store.progress,'5');assert.equal(x.store['asf-cookie-consent-v2'],'essential');});
test('storage unavailable fails closed and supports session-only choice',()=>{let x=setup({},true);assert.equal(x.scripts.length,0);x.window.essentialCookies();assert.equal(x.window.ASFConsent.get(),'essential');assert.equal(x.scripts.length,0);});
test('cross-tab revocation stops prior session via reload',()=>{let x=setup({'asf-cookie-consent-v2':'all'});x.events.storage({key:'asf-cookie-consent-v2',newValue:'essential'});assert.equal(x.reloads,1);});
test('invalid consent is ignored',()=>{let x=setup();x.window.ASFConsent.set('accepted');assert.equal(x.scripts.length,0);assert.equal(x.window.ASFConsent.get(),null);});
test('legacy duplicate banner creator was removed',()=>{assert.doesNotMatch(fs.readFileSync('app-posts.js','utf8'),/bar\.id = 'asf-cookie-banner'/);});
for(const filename of ['app.js','js/home-main.js'])test(filename+' analytics are denied before consent',()=>{
 const js=fs.readFileSync(filename,'utf8');
 const fn=js.match(/function gtag\(\)\{[^\n]+/)[0];
 const queue=[];const window={ASFConsent:{get:()=>null}};
 const context={window,dataLayer:queue};vm.createContext(context);vm.runInContext(fn,context);vm.runInContext("gtag('event','test')",context);assert.equal(queue.length,0);
 window.ASFConsent.get=()=> 'essential';vm.runInContext("gtag('event','test')",context);assert.equal(queue.length,0);
 window.ASFConsent.get=()=> 'all';vm.runInContext("gtag('event','test')",context);assert.equal(queue.length,1);
 assert.match(js,/function trackEvent\(e,t,o\)\{if\(!window\.ASFConsent \|\| window\.ASFConsent\.get\(\) !== 'all'\) return;/);
});
