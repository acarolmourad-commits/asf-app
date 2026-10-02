// ASF Fixes — rede de apps (atualizado em 02/10/2026)
// 1) Menu "Trips" estava morto: redireciona para Surf Trip.
// 2) Conta de apps na home para 53 (52 satélites + hub).
// 3) Carteirinha unificada: seção só aparece quando clicada.
// 4) Reorg home v2: agrupa seções com cabeçalhos.
// 5) Fix footer overlap + FAB stacking + overflow-x guard.
// 6) FIX SEARCH BAR: .search-results.active { display:block } (Issue #38).

(function () {
  function patchTrips() {
    if (typeof window.showSection !== 'function') return;
    if (window.showSection.__asfTripsPatched) return;
    var orig = window.showSection;
    var patched = function (sectionId) {
      if (sectionId === 'trips') { window.location.href = 'surf-trip/'; return; }
      return orig.apply(this, arguments);
    };
    patched.__asfTripsPatched = true;
    window.showSection = patched;
  }
  function fixCount() {
    patchTrips();
    var nodes = document.querySelectorAll('small, p, span');
    nodes.forEach(function (el) {
      if (el.children.length === 0 && el.textContent.indexOf('Todos os 52 apps') !== -1) {
        el.textContent = el.textContent.replace('Todos os 52 apps', 'Todos os 53 apps');
      }
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixCount);
  } else { fixCount(); }
})();

/* ---------- FIX SEARCH BAR (02/10/2026) ----------
   Issue #38: .search-results tinha display:none, mas faltava
   .search-results.active { display:block } — resultados
   renderizavam invisíveis. */
(function () {
  function ready(fn) {
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  }
  function apply() {
    if (document.getElementById('asf-search-fix')) return;
    var st = document.createElement('style');
    st.id = 'asf-search-fix';
    st.textContent =
      '.search-results.active{display:block!important}\n' +
      '.search-results{display:none}';
    document.head.appendChild(st);
  }
  ready(apply);
})();

/* ---------- FIX CARTCEIRINHA (25/09/2026) ---------- */
(function () {
  function fixCarteirinha() {
    var sec = document.getElementById('carteirinha');
    if (!sec || sec.__asfUnified) return;
    sec.__asfUnified = true;
    if (!sec.classList.contains('active')) {
      sec.style.setProperty('display', 'none', 'important');
    }
    var card = document.getElementById('carteirinha-home-card');
    if (card && !card.__asfUnified) {
      card.__asfUnified = true;
      card.addEventListener('click', function () {
        setTimeout(function () {
          sec.classList.add('active');
          sec.style.removeProperty('display');
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fixCarteirinha);
  else fixCarteirinha();
})();

/* ---------- REORG HOME v2 (01/10/2026) ---------- */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    try{
      if(document.querySelector('.asf-grupo-hdr')) return;
      var content=document.querySelector('div.content');
      if(!content) return;
      content.setAttribute('role','main');
      function hdr(t){var d=document.createElement('div');d.className='section-header asf-grupo-hdr';d.style.margin='36px 20px 0';d.innerHTML='<h2 class="section-title">'+t+'</h2>';return d;}
      function byId(id){return document.getElementById(id);}
      function move(parent,item){var n=(typeof item==='string')?byId(item):item;if(n)parent.appendChild(n);}
      [hdr('📚 Aprenda e Evolua'),'dicas','tecnica','mobilidade','saude','alimentacao','mental',
       hdr('👭 Comunidade'),'manas-proximas','progresso','badges',
       hdr('🤝 Parceiros ASF'),'lojas','loja','brandhub']
        .forEach(function(x){move(content,x);});
      var anchor=content;
      [hdr('⭐ Guias & Praias'),'premium','praias',
       hdr('👭 Comunidade — continue explorando'),'comunidade','surfer-profile','pos-surf','desafios','competicoes','surf-news','metas',
       hdr('🤝 Parceiros ASF — cadastro e destaques'),'parceiros','assinantes',
       hdr('🌎 ASF pelo Mundo'),'surf-culture',
       'utilities','surf-conditions-section','seguranca','assistente','conteudo','carteirinha']
        .forEach(function(x){var n=(typeof x==='string')?byId(x):x;if(!n)return;
          if(n.parentNode)n.parentNode.removeChild(n);
          anchor.parentNode.insertBefore(n,anchor.nextSibling);anchor=n;});
    }catch(e){console.error('reorg home v2:',e);}
  });
})();

/* ---------- FIX FOOTER OVERLAP (02/10/2026) ---------- */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    var f=document.querySelector('footer'); if(!f) return;
    function apply(){
      var pad=24;
      var bn=document.querySelector('.asf-bottom-nav');
      var bnH=(bn && getComputedStyle(bn).position==='fixed') ? bn.offsetHeight : 0;
      var cb=document.getElementById('asf-cookie-banner');
      var cbH=(cb && cb.offsetHeight>0 && getComputedStyle(cb).position==='fixed') ? cb.offsetHeight : 0;
      pad=Math.max(pad, bnH+cbH+16);
      f.style.paddingBottom=pad+'px';
    }
    apply();
    window.addEventListener('resize',apply);
    new MutationObserver(apply).observe(document.body,{childList:true});
    document.addEventListener('click',function(){setTimeout(apply,300);},true);
  });
})();

/* ---------- FIX FAB x BOTTOM NAV (02/10/2026) ---------- */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    function apply(){
      var bn=document.querySelector('.asf-bottom-nav');
      var bnH=(bn && getComputedStyle(bn).position==='fixed') ? bn.offsetHeight : 0;
      if(!bnH) return;
      var alvo=bnH+12;
      var all=document.querySelectorAll('body *');
      for(var i=0;i<all.length;i++){
        var el=all[i];
        if(bn.contains(el)||el===bn) continue;
        if(el.closest('#asf-cookie-banner,#cookie-consent-banner')) continue;
        var cs=getComputedStyle(el);
        if(cs.position!=='fixed') continue;
        var h=el.offsetHeight, w=el.offsetWidth;
        if(!h||h>90) continue;
        var b=parseFloat(cs.bottom);
        if(isNaN(b)||b>=alvo-4) continue;
        if(cs.bottom==='auto') continue;
        el.style.bottom=alvo+'px';
      }
    }
    apply();
    window.addEventListener('resize',apply);
    new MutationObserver(function(){apply();}).observe(document.body,{childList:true});
  });
})();

/* ---------- FIX STACK FABs + OVERFLOW-X (02/10/2026) ---------- */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function () {
    var applying=false;
    function stack(){
      if(applying) return;
      applying=true;
      try{
        var bn=document.querySelector('.asf-bottom-nav');
        var bnH=(bn && getComputedStyle(bn).position==='fixed') ? bn.offsetHeight : 0;
        var nextBottom=(bnH||0)+12;
        var sels=['#asf-galeria-btn','.fab','.fab-share','#back-to-top'];
        var els=[];
        sels.forEach(function(s){
          document.querySelectorAll(s).forEach(function(el){
            if(el.offsetHeight>0 && getComputedStyle(el).position==='fixed') els.push(el);
          });
        });
        els.sort(function(a,b){return sels.findIndex(function(s){return a.matches(s);})-sels.findIndex(function(s){return b.matches(s);});});
        els.forEach(function(el){
          el.style.bottom=nextBottom+'px';
          nextBottom+=el.offsetHeight+12;
        });
      }catch(e){console.warn('asf stack fabs:',e);}
      finally{setTimeout(function(){applying=false;},50);}
    }
    stack();
    window.addEventListener('resize',stack);
    new MutationObserver(function(){stack();}).observe(document.body,{childList:true,attributes:true,subtree:true,attributeFilter:['style','class']});

    var st=document.createElement('style');
    st.id='asf-overflow-guard';
    st.textContent='html,body{overflow-x:hidden;max-width:100vw;}'+
      'img,video,table,canvas,iframe{max-width:100%;height:auto;}'+
      '*[style*="width:"]{max-width:100vw;}';
    document.head.appendChild(st);
  });
})();

/* ---------- Destaque editorial: "Presenca no Mar" (02/10/2026) ---------- */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var isHome = /(\/asf-app\/)?(index\.html)?$/.test(location.pathname) || location.pathname === '/';
    if (!isHome || document.getElementById('asf-destaque-presenca')) return;
    var ref = document.querySelector('a[href="apps-em-destaque.html"]');
    if (!ref) return;
    var base = (location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/');
    var a = document.createElement('a');
    a.id = 'asf-destaque-presenca';
    a.href = base + 'bem-estar/presenca-no-mar-beneficios-da-pratica.html';
    a.style.cssText = 'display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#0E2439,#00A8CC);border-radius:16px;padding:18px;margin:12px 20px;text-decoration:none;color:#fff;box-shadow:0 4px 14px rgba(0,168,204,.3)';
    a.innerHTML = '<span style="font-size:2rem">\u{1F305}</span><span><b style="display:block">Presen\u00e7a no Mar <span style="background:#f4d03f;color:#0E2439;font-size:10px;padding:2px 8px;border-radius:10px;vertical-align:middle;margin-left:6px">NOVO</span></b><small style="color:rgba(255,255,255,.9)">\u00c1gua com sal, sol nascendo no line-up, vida marinha ao lado \u2014 por que a pr\u00e1tica \u00e9 o que manda na evolu\u00e7\u00e3o</small></span>';
    ref.insertAdjacentElement('afterend', a);
  });
})();
