'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'), C=require('../diario-core.js');
const DAY='2026-10-10';
const entry=(patch={})=>({data:'2026-10-09',praia:'Maresias',dur:60,mar:'Calmo',notas:'',...patch});
function storage(raw=null) {const map=new Map();if(raw!==null)map.set(C.KEY,raw);return {map,writes:[],getItem(k){return map.has(k)?map.get(k):null;},setItem(k,v){this.writes.push(k);map.set(k,v);}};}
function setup(raw=null) {const s=storage(raw);let n=0;const store=C.createStore(s,{day:()=>DAY,id:()=>`new-${++n}`});store.load();return {s,store};}
test('data local acompanha os componentes locais',()=>assert.equal(C.today(new Date(2026,9,10,0,1)),DAY));
test('ano bissexto correto',()=>{assert(C.validDate('2024-02-29'));assert(!C.validDate('2025-02-29'));});
test('datas impossíveis são rejeitadas',()=>{for(const d of ['2026-02-30','2026-13-01','2026-00-00','26-10-10','1899-12-31'])assert(!C.validDate(d));});
test('data futura nova rejeitada',()=>assert.throws(()=>C.validate(entry({data:'2026-10-11'}),DAY)));
test('duração exige inteiro numérico em intervalo',()=>{for(const dur of [0,-1,1441,1.5,NaN,Infinity,'60'])assert.throws(()=>C.validate(entry({dur}),DAY));});
test('limites inclusivos de duração aceitos',()=>{for(const dur of [1,1440])assert.equal(C.validate(entry({dur}),DAY).dur,dur);});
test('praia obrigatória',()=>assert.throws(()=>C.validate(entry({praia:'  '}),DAY)));
test('limites de texto verificados',()=>{for(const patch of [{praia:'x'.repeat(121)},{notas:'x'.repeat(4001)},{aprendizado:'x'.repeat(2001)},{proximoFoco:'x'.repeat(2001)}])assert.throws(()=>C.validate(entry(patch),DAY));});
test('texto malicioso preservado como texto, sem interpretar',()=>assert.equal(C.validate(entry({notas:'<img src=x onerror=alert(1)>'}),DAY).notas,'<img src=x onerror=alert(1)>'));
test('load vazio não escreve',()=>{const {s,store}=setup();assert.deepEqual(store.entries(),[]);assert.equal(s.writes.length,0);});
test('IDs legados determinísticos e campos extras preservados',()=>{const raw=JSON.stringify([entry({extra:{x:1}})]);assert.equal(C.decode(raw,DAY)[0].id,'legacy-0');assert.deepEqual(C.decode(raw,DAY)[0].extra,{x:1});});
test('IDs legados evitam colisão com IDs existentes',()=>{const list=C.decode(JSON.stringify([entry(),entry({id:'legacy-0'})]),DAY);assert.notEqual(list[0].id,list[1].id);});
test('IDs duplicados bloqueiam carga',()=>assert.throws(()=>C.decode(JSON.stringify([entry({id:'a'}),entry({id:'a'})]),DAY)));
test('JSON corrompido bloqueia escrita e mantém raw',()=>{const s=storage('{bad'),store=C.createStore(s);assert.throws(()=>store.load());assert.throws(()=>store.upsert(entry()));assert.equal(store.raw(),'{bad');assert.equal(s.writes.length,0);});
test('objeto no lugar de array rejeitado',()=>assert.throws(()=>C.decode('{}',DAY)));
test('registro legado inválido bloqueia carga sem reset',()=>{const s=storage('[{"dur":-1}]'),store=C.createStore(s);assert.throws(()=>store.load());assert.equal(s.getItem(C.KEY),'[{"dur":-1}]');});
test('backup raw antes da primeira alteração',()=>{const raw=JSON.stringify([entry()]),{s,store}=setup(raw);store.upsert(entry());assert.equal(s.getItem(C.BACKUP),raw);assert.deepEqual(s.writes,[C.BACKUP,C.KEY]);assert(Array.isArray(JSON.parse(s.getItem(C.KEY))));});
test('backup existente não é sobrescrito',()=>{const {s,store}=setup('[]');s.map.set(C.BACKUP,'original');store.upsert(entry());assert.equal(s.getItem(C.BACKUP),'original');});
test('edição preserva ID/campos extras sem duplicar',()=>{const {store}=setup(JSON.stringify([entry({x:42})]));store.upsert(entry({dur:90}),'legacy-0');assert.equal(store.entries().length,1);assert.equal(store.entries()[0].x,42);assert.equal(store.entries()[0].dur,90);});
test('exclusão usa ID e não posição após ordenação',()=>{const {store}=setup(JSON.stringify([entry({id:'old',data:'2026-10-01'}),entry({id:'new'})]));assert.equal(C.query(store.entries()).items[0].id,'new');store.remove('new');assert.equal(store.entries()[0].id,'old');});
test('edição/exclusão de ID inexistente rejeitada',()=>{const {store}=setup();assert.throws(()=>store.remove('missing'));assert.throws(()=>store.upsert(entry(),'missing'));});
test('desfazer exclusão restaura e só pode ocorrer uma vez',()=>{const {store}=setup(JSON.stringify([entry()]));store.remove('legacy-0');store.undo();assert.equal(store.entries().length,1);assert.throws(()=>store.undo());});
test('desfazer edição recupera duração',()=>{const {store}=setup(JSON.stringify([entry()]));store.upsert(entry({dur:90}),'legacy-0');store.undo();assert.equal(store.entries()[0].dur,60);});
test('conflito entre abas não sobrescreve',()=>{const {s,store}=setup('[]');s.map.set(C.KEY,JSON.stringify([entry({id:'external'})]));assert.throws(()=>store.upsert(entry()),/aba/);assert.equal(JSON.parse(s.getItem(C.KEY))[0].id,'external');});
test('quota de gravação não altera estado em memória',()=>{const {s,store}=setup();s.setItem=()=>{throw new Error('quota');};assert.throws(()=>store.upsert(entry()),/quota/);assert.equal(store.entries().length,0);assert.equal(s.getItem(C.KEY),null);});
test('falha de backup impede alteração original',()=>{const raw=JSON.stringify([entry()]),{s,store}=setup(raw);s.setItem=()=>{throw new Error('backup failure');};assert.throws(()=>store.remove('legacy-0'));assert.equal(s.getItem(C.KEY),raw);assert.equal(store.entries().length,1);});
test('storage negado bloqueia carga',()=>{const store=C.createStore({getItem(){throw new Error('denied');}});assert.throws(()=>store.load());assert(store.status().blocked);});
test('exportação JSON não escreve nem modifica campos',()=>{const {s,store}=setup(JSON.stringify([entry({other:12})]));assert.equal(JSON.parse(store.exportJSON())[0].other,12);assert.equal(s.writes.length,0);});
test('cópia retornada não modifica estado interno',()=>{const {store}=setup(JSON.stringify([entry()]));const x=store.entries();x[0].dur=900;assert.equal(store.entries()[0].dur,60);});
test('busca sem acentos',()=>{const list=C.decode(JSON.stringify([entry({praia:'Guarujá',aprendizado:'Respiração'})]),DAY);assert.equal(C.query(list,{term:'respiracao'}).total,1);assert.equal(C.query(list,{term:'guaruja'}).total,1);});
test('filtro de data inclusivo',()=>{const list=C.decode(JSON.stringify([entry({data:'2026-10-01'}),entry()]),DAY);assert.equal(C.query(list,{from:'2026-10-09',to:'2026-10-09'}).total,1);});
test('intervalo invertido rejeitado',()=>assert.throws(()=>C.query([],{from:'2026-10-10',to:'2026-10-01'})));
test('paginação e ajuste de página',()=>{const list=C.decode(JSON.stringify(Array.from({length:21},(_,i)=>entry({id:'id'+i}))),DAY);assert.equal(C.query(list,{page:2}).items.length,10);assert.equal(C.query(list,{page:100}).page,3);assert.equal(C.query(list,{page:3}).items.length,1);});
test('consulta não reordena array original',()=>{const list=C.decode(JSON.stringify([entry({data:'2026-10-01'}),entry()]),DAY);C.query(list);assert.equal(list[0].data,'2026-10-01');});
test('resumo de 30 dias usa intervalo calendário inclusivo',()=>{const list=C.decode(JSON.stringify([entry({data:'2026-09-11'}),entry({data:'2026-09-10'}),entry({data:'2026-10-11'})]),DAY);const stats=C.summary(list,DAY);assert.equal(stats.recent,1);assert.equal(stats.minutes,180);});
test('máximo de registros impede excesso',()=>assert.throws(()=>C.decode(JSON.stringify(Array.from({length:10001},()=>entry())),DAY)));
test('ID gerado duplicado é rejeitado sem gravar',()=>{const s=storage(JSON.stringify([entry({id:'same'})]));const store=C.createStore(s,{day:()=>DAY,id:()=> 'same'});store.load();assert.throws(()=>store.upsert(entry()));assert.equal(s.writes.length,0);});
test('HTML/interface usam módulos locais e textContent para registros',()=>{const fs=require('node:fs'),path=require('node:path');const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8'),ui=fs.readFileSync(path.join(__dirname,'../diario.js'),'utf8');assert(!/\son\w+=/i.test(html));assert(!ui.includes('innerHTML'));assert(ui.includes('textContent'));assert(html.includes('aria-live="polite"'));assert(html.includes('src="./diario-core.js"'));assert(html.includes('src="./diario.js"'));});
function uiHarness(raw=null) {
 const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
 class El {constructor(tag='div'){this.tag=tag;this.children=[];this.handlers={};this.value='';this.disabled=false;this.hidden=false;this.textContent='';this.attrs={};}append(...els){this.children.push(...els);}replaceChildren(...els){this.children=els;}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,f){this.handlers[k]=f;}focus(){}remove(){}click(){if(this.handlers.click)this.handlers.click({preventDefault(){}});}reset(){for(const id of ['fData','fPraia','fDur','fMar','fNotas','fAprendizado','fFoco'])els[id].value='';els.fDur.value='60';}}
 const ids=['status','session-form','fData','fPraia','fDur','fMar','fNotas','fAprendizado','fFoco','save','cancel','sTotal','sHoras','sPraias','sRecent','search','from','to','entries','page','prev','next','undo','export','raw','reload'];const els=Object.fromEntries(ids.map(x=>[x,new El()])),s=storage(raw),downloads=[];
 const doc={getElementById:id=>els[id],createElement:tag=>new El(tag),body:new El()};
 const win={DiarioCore:C,localStorage:s,confirm:()=>true,setTimeout:f=>f(),addEventListener(){}};
 const crypto=require('node:crypto');
 const core=C.createStore;win.DiarioCore={...C,createStore:(storage)=>core(storage,{day:()=>C.today(),id:()=>crypto.randomUUID()})};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../diario.js'),'utf8'),{window:win,document:doc,URL:{createObjectURL(blob){downloads.push(blob);return 'blob:test';},revokeObjectURL(){}},Blob});
 function submit(patch={}){const input=entry({data:C.today(),...patch});for(const [k,id] of Object.entries({data:'fData',praia:'fPraia',dur:'fDur',mar:'fMar',notas:'fNotas',aprendizado:'fAprendizado',proximoFoco:'fFoco'}))els[id].value=input[k]===undefined?'':String(input[k]);els['session-form'].handlers.submit({preventDefault(){}});}
 return {els,s,submit,downloads,win};
}
test('UI registra texto malicioso sem elementos HTML do usuário',()=>{const {els,s,submit}=uiHarness();submit({notas:'<img src=x onerror=alert(1)>'});assert.equal(JSON.parse(s.getItem(C.KEY)).length,1);assert.equal(els.entries.children[0].children[2].textContent,'Notas: <img src=x onerror=alert(1)>');});
test('UI exclusão confirmada e undo por botão',()=>{const {els,s}=uiHarness(JSON.stringify([entry()]));const card=els.entries.children[0];card.children.at(-1).click();assert.equal(JSON.parse(s.getItem(C.KEY)).length,0);els.undo.click();assert.equal(JSON.parse(s.getItem(C.KEY)).length,1);});
test('UI cancelamento da confirmação não exclui',()=>{const {els,s,win}=uiHarness(JSON.stringify([entry()]));win.confirm=()=>false;els.entries.children[0].children.at(-1).click();assert.equal(s.writes.length,0);});
test('UI edição mantém uma única sessão',()=>{const {els,s,submit}=uiHarness(JSON.stringify([entry()]));els.entries.children[0].children.at(-2).click();submit({dur:120});assert.equal(JSON.parse(s.getItem(C.KEY)).length,1);assert.equal(JSON.parse(s.getItem(C.KEY))[0].dur,120);});
test('UI corrupção bloqueia gravação e permite exportar RAW',()=>{const {els,s,downloads}=uiHarness('{bad');assert(els.save.disabled);assert(els.export.disabled);els.raw.click();assert.equal(downloads.length,1);assert.equal(s.getItem(C.KEY),'{bad');});
test('UI paginação mostra próxima página de registros',()=>{const {els}=uiHarness(JSON.stringify(Array.from({length:11},(_,i)=>entry({id:'s'+i}))));assert.equal(els.entries.children.length,10);els.next.click();assert.equal(els.entries.children.length,1);assert.match(els.page.textContent,/Página 2 de 2/);});

// Regressões: rascunho não salvo, filtros inválidos e recarga bloqueada.
test('UI recarga de sessão nova pede confirmação e cancelar preserva formulário',()=>{
 const {els,s,win}=uiHarness();els.fPraia.value='Rascunho não salvo';els.fNotas.value='Texto privado fictício';let calls=0;
 win.confirm=()=>{calls++;return false;};els.reload.click();assert.equal(calls,1);assert.equal(els.fPraia.value,'Rascunho não salvo');assert.equal(els.fNotas.value,'Texto privado fictício');assert.equal(s.writes.length,0);
});
test('UI recarga confirmada descarta rascunho sem gravar',()=>{
 const {els,s,win}=uiHarness();els.fPraia.value='Rascunho';let calls=0;win.confirm=()=>{calls++;return true;};els.reload.click();assert.equal(calls,1);assert.equal(els.fPraia.value,'');assert.equal(s.writes.length,0);
});
test('UI recarga de formulário limpo não pede confirmação',()=>{
 const {els,win}=uiHarness();let calls=0;win.confirm=()=>{calls++;return false;};els.reload.click();assert.equal(calls,0);
});
test('UI salvar com intervalo inválido não relata falha após gravação',()=>{
 const {els,s,submit}=uiHarness();els.from.value='2026-10-10';els.to.value='2026-10-01';submit();
 assert.equal(JSON.parse(s.getItem(C.KEY)).length,1);assert.match(els.status.textContent,/Sessão salva/);assert.doesNotMatch(els.status.textContent,/Não foi possível salvar/);assert.match(els.page.textContent,/Filtro de datas inválido/);
});
test('UI filtro inválido mantém lista utilizável e anuncia problema',()=>{
 const {els}=uiHarness(JSON.stringify([entry()]));els.from.value='2026-10-10';els.to.value='2026-10-01';els.to.handlers.input();assert.equal(els.entries.children.length,1);assert.match(els.page.textContent,/Filtro de datas inválido/);assert.match(els.status.textContent,/Filtro de datas inválido/);
});
test('UI desfazer com intervalo inválido mantém resultado e mensagem correta',()=>{
 const {els,s,submit}=uiHarness();submit();els.from.value='2026-10-10';els.to.value='2026-10-01';els.undo.click();assert.equal(JSON.parse(s.getItem(C.KEY)).length,0);assert.match(els.status.textContent,/Última alteração desfeita/);
});
test('UI recarga corrompida remove ações obsoletas e desabilita mutações',()=>{
 const {els,s,submit}=uiHarness();submit();assert(!els.undo.disabled);s.map.set(C.KEY,'{bad');els.reload.click();assert(els.undo.disabled);assert(els.save.disabled);assert(els.export.disabled);assert(els.prev.disabled);assert(els.next.disabled);assert.equal(els.entries.children.length,0);assert.equal(s.getItem(C.KEY),'{bad');
});
