/* Interface: conteúdo de registros sempre inserido com textContent. */
(function () {
  'use strict';
  const C = window.DiarioCore, $ = id => document.getElementById(id);
  let store, editId = null, page = 1;
  const fields = {data:'fData',praia:'fPraia',dur:'fDur',mar:'fMar',notas:'fNotas',aprendizado:'fAprendizado',proximoFoco:'fFoco'};
  const say = message => { $('status').textContent = message; };
  function node(tag, content, className) {
    const el = document.createElement(tag); el.textContent = content;
    if(className) el.className = className; return el;
  }
  function clear() {
    editId = null; $('session-form').reset(); $('fData').value = C.today();
    $('save').textContent = 'Salvar sessão'; $('cancel').hidden = true;
  }
  function render() {
    if(!store) return;
    const entries = store.entries(), stats = C.summary(entries);
    $('sTotal').textContent = stats.total; $('sHoras').textContent = (stats.minutes/60).toFixed(1)+' h';
    $('sPraias').textContent = stats.beaches; $('sRecent').textContent = stats.recent;
    const result = C.query(entries,{term:$('search').value,from:$('from').value,to:$('to').value,page}); page = result.page;
    $('entries').replaceChildren();
    if(!result.total) $('entries').append(node('p','Nenhuma sessão corresponde aos filtros.'));
    for(const entry of result.items) {
      const card = node('article','', 'entry');
      card.append(node('h3',entry.praia),node('p',entry.data.split('-').reverse().join('/')+' · '+entry.dur+' min · '+entry.mar));
      for(const [key,label] of [['notas','Notas'],['aprendizado','Aprendizado'],['proximoFoco','Próximo foco']]) {
        if(entry[key]) card.append(node('p',label+': '+entry[key]));
      }
      const edit = node('button','Editar'); edit.type='button'; edit.disabled=store.status().blocked;
      edit.setAttribute('aria-label','Editar sessão de '+entry.praia+' em '+entry.data);
      edit.addEventListener('click',()=>{
        editId=entry.id; for(const [key,id] of Object.entries(fields)) $(id).value=entry[key] === undefined ? '' : entry[key];
        $('save').textContent='Salvar edição'; $('cancel').hidden=false; $('fPraia').focus(); say('Editando uma sessão existente.');
      });
      const del = node('button','Excluir'); del.type='button'; del.className='danger'; del.disabled=store.status().blocked;
      del.setAttribute('aria-label','Excluir sessão de '+entry.praia+' em '+entry.data);
      del.addEventListener('click',()=>{
        if(!window.confirm('Excluir a sessão de '+entry.praia+' em '+entry.data+'? Você poderá desfazer a última alteração.')) return;
        try {store.remove(entry.id); if(editId===entry.id) clear(); render(); say('Sessão excluída. Você pode desfazer.');} catch(e){say(e.message);}
      });
      card.append(edit,del); $('entries').append(card);
    }
    $('page').textContent='Página '+result.page+' de '+result.pages+' · '+result.total+' sessões';
    $('prev').disabled=result.page===1; $('next').disabled=result.page===result.pages;
    $('undo').disabled=!store.canUndo();
    $('save').disabled=store.status().blocked; $('export').disabled=store.status().blocked;
  }
  function download(content, filename, type) {
    const url=URL.createObjectURL(new Blob([content],{type})), a=document.createElement('a');
    a.href=url; a.download=filename; document.body.append(a); a.click(); a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function boot() {
    clear(); $('fData').max=C.today();
    try {store=C.createStore(window.localStorage); store.load(); render(); say('Diário carregado. Faça backups periódicos.');}
    catch(e) {say('Não foi possível carregar: '+e.message+' Nenhum dado foi apagado.'); $('save').disabled=true; $('export').disabled=true;}
  }
  $('session-form').addEventListener('submit',event=>{
    event.preventDefault();
    try {
      const entry={}; for(const [key,id] of Object.entries(fields)) entry[key]=key==='dur' ? Number($(id).value) : $(id).value;
      store.upsert(entry,editId); clear(); page=1; render(); say('Sessão salva neste navegador.');
    } catch(e) {say('Não foi possível salvar: '+e.message);}
  });
  $('cancel').addEventListener('click',()=>{clear(); say('Edição cancelada.');});
  $('undo').addEventListener('click',()=>{try{store.undo(); clear(); render(); say('Última alteração desfeita.');}catch(e){say(e.message);}});
  for(const id of ['search','from','to']) $(id).addEventListener('input',()=>{page=1; try{render();}catch(e){say(e.message);}});
  for(const [id,step] of [['prev',-1],['next',1]]) $(id).addEventListener('click',()=>{page+=step; try{render();}catch(e){say(e.message);}});
  $('reload').addEventListener('click',()=>{
    if(editId!==null && !window.confirm('Recarregar e descartar a edição ainda não salva?')) return;
    boot();
  });
  $('export').addEventListener('click',()=>{try{download(store.exportJSON(),'asf-diario-'+C.today()+'.json','application/json'); say('Backup JSON gerado. Guarde-o em local privado.');}catch(e){say(e.message);}});
  $('raw').addEventListener('click',()=>{
    try{const raw=store ? store.raw() : window.localStorage.getItem(C.KEY); if(raw===null){say('Não há dados originais para exportar.');return;} download(raw,'asf-diario-original.txt','text/plain'); say('Cópia original gerada sem modificar o armazenamento.');}catch(e){say('Armazenamento indisponível: '+e.message);}
  });
  window.addEventListener('storage',event=>{if(event.key===C.KEY || event.key===null) say('O armazenamento mudou em outra aba. Recarregue antes de salvar.');});
  boot();
})();
