(function(){
  var MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  function fmt(d){var p=d.split('-');return String(parseInt(p[2],10))+' '+MESES[parseInt(p[1],10)-1]+' '+p[0];}
  function st(ev){var h=new Date();h.setHours(0,0,0,0);var i=new Date(ev.inicio+'T00:00:00');var f=new Date((ev.fim||ev.inicio)+'T23:59:59');
    if(h>f)return 'ENCERRADO';if(h>=i&&h<=f)return 'ATIVO';return 'FUTURO';}
  function card(ev,cor,tag){var datas=(!ev.fim||ev.inicio===ev.fim)?fmt(ev.inicio):fmt(ev.inicio)+' → '+fmt(ev.fim);
    return '<div class="card" style="border-left:4px solid '+cor+';margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:start;gap:8px;"><div><h4 style="font-size:15px;">'+ev.titulo+'</h4><p style="font-size:13px;color:var(--gray-600);margin-top:4px;">📍 '+ev.local+'</p><p style="font-size:13px;color:var(--gray-600);">🗓️ '+datas+'</p></div><span style="background:'+cor+';color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;">'+tag+'</span></div><p style="font-size:12px;color:var(--gray-400);margin-top:8px;">'+ev.descricao+'</p></div>';}
  fetch('data/events.json').then(function(r){return r.json();}).then(function(data){
    var el=document.getElementById('eventos-list');if(!el)return;
    var fut=[],atv=[],hist=[];
    (data.eventos||[]).forEach(function(ev){var t=st(ev);
      if(t==='FUTURO')fut.push(ev);else if(t==='ATIVO')atv.push(ev);else hist.push(ev);});
    fut.sort(function(a,b){return a.inicio<b.inicio?-1:1;});
    var html='';
    atv.forEach(function(ev){html+=card(ev,'#2ECC71','🟢 Acontecendo agora');});
    fut.forEach(function(ev){html+=card(ev,'var(--primary)','Confirmado');});
    if(!atv.length&&!fut.length){html+='<div class="card" style="text-align:center;padding:20px;"><p style="font-size:14px;color:var(--gray-600);margin:0;">📅 Nenhum evento futuro confirmado no momento.</p><p style="font-size:12px;color:var(--gray-400);margin:8px 0 0;">Acompanhe o calendário oficial da <a href="https://www.spsurf.com.br/" target="_blank" style="color:var(--primary);">SPSurf</a> e o Instagram <a href="https://instagram.com/asf.surffeminino" target="_blank" style="color:var(--primary);">@asf.surffeminino</a>.</p></div>';}
    if(hist.length){html+='<details style="margin-top:8px;"><summary style="font-size:13px;color:var(--gray-400);cursor:pointer;">📁 Histórico ('+hist.length+' evento'+(hist.length>1?'s':'')+' encerrado'+(hist.length>1?'s':'')+')</summary><div style="margin-top:8px;opacity:0.75;">'+hist.map(function(ev){return card(ev,'var(--gray-400)','Encerrado');}).join('')+'</div></details>';}
    el.innerHTML=html;
  }).catch(function(){var el=document.getElementById('eventos-list');if(el)el.innerHTML='<p style="font-size:13px;color:var(--gray-400);">Não foi possível carregar os eventos agora.</p>';});
})();
            
