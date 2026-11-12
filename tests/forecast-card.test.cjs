// DOM-only forecast tests; Open-Meteo is simulated and no network is used.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(path.join(__dirname,'../asf-previsao-card.js'),'utf8');
const NOW=Date.UTC(2026,10,12,12,0,0);
const good=[{current:{wave_height:1.2,wave_period:8}},{current:{wind_speed_10m:4}}];
async function fixture(responses=good, cache){
 const dom=new JSDOM('<!doctype html><main><div id="card-clima"></div></main>',{url:'https://asf.review.invalid/',runScripts:'outside-only'});
 const w=dom.window;const DateReal=w.Date;w.Date=class extends DateReal{constructor(...args){super(...(args.length?args:[NOW]));}static now(){return NOW;}};
 let calls=0;w.fetch=async()=>({ok:true,json:async()=>responses[calls++]});
 if(cache!==undefined)w.localStorage.setItem('asf_previsao_cache',JSON.stringify(cache));
 vm.runInContext(source,dom.getInternalVMContext());w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
 await new Promise(r=>setTimeout(r,0));
 return{dom,w,calls,text:w.document.getElementById('card-previsao-live').textContent};
}
for(const field of ['wave_height','wave_period','wind_speed_10m'])for(const value of [null,undefined])test(`missing forecast ${field}=${value} is not converted to zero`,async()=>{
 const responses=JSON.parse(JSON.stringify(good));responses[field==='wind_speed_10m'?1:0].current[field]=value;
 const f=await fixture(responses);try{assert.match(f.text,/Sem sinal|indispon/i);assert.doesNotMatch(f.text,/0\.0 m|0 km\/h|Perfeitas|Seguro/);assert.equal(f.w.localStorage.getItem('asf_previsao_cache'),null);}finally{f.dom.window.close();}
});
test('numeric zero is valid, timestamp is visible, and complete result is cached',async()=>{
 const f=await fixture([{current:{wave_height:0,wave_period:0}},{current:{wind_speed_10m:0}}]);try{assert.match(f.text,/0\.0 m/);assert.match(f.text,/Consultado:/);assert.match(f.text,/não uma garantia de segurança/);assert.equal(JSON.parse(f.w.localStorage.getItem('asf_previsao_cache')).data.consultedAt,NOW);}finally{f.dom.window.close();}
});
test('fresh valid cache avoids requests and preserves original consultation time',async()=>{
 const when=NOW-600000;const f=await fixture(good,{ts:when,data:{swell:1.2,periodo:8,vento:4,consultedAt:when}});try{assert.equal(f.calls,0);assert.match(f.text,/Consultado:/);assert.ok(f.text.includes(new f.w.Date(when).toLocaleString('pt-BR')));}finally{f.dom.window.close();}
});
test('old and legacy timestamp-less caches are refreshed',async()=>{
 for(const cache of [{ts:NOW-1800001,data:{swell:1,periodo:8,vento:4,consultedAt:NOW-1800001}},{ts:NOW,data:{swell:1,periodo:8,vento:4}}]){
  const f=await fixture(good,cache);try{assert.equal(f.calls,2);assert.match(f.text,/1\.2 m/);}finally{f.dom.window.close();}
 }
});
test('future cache timestamp cannot masquerade as fresh observation',async()=>{
 const f=await fixture(good,{ts:NOW+86400000,data:{swell:9,periodo:8,vento:4,consultedAt:NOW+86400000}});try{assert.equal(f.calls,2);assert.doesNotMatch(f.text,/9\.0 m/);}finally{f.dom.window.close();}
});
