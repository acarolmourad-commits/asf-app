// ASF Fixes — rede de apps (atualizado em 25/09/2026)
// 1) Menu "Trips" estava morto (não existe seção #trips): redireciona para o guia Surf Trip.
// 2) Home: corrige contagem da rede para 53 apps (52 satélites + hub).
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

// 3) Conquistas: badge "Estudiosa" pede 3 quizzes no rótulo, mas o código exigia 5.
//    Wrap de checkBadge alinha o critério para 3.
// 4) Conquistas Secretas: botão "Desbloquear" desbloqueava sem critério.
//    Agora o 1º toque explica o requisito e o 2º confirma a conquista.
(function () {
  function patchBadges() {
    if (typeof window.checkBadge === 'function' && !window.checkBadge.__asfPatched) {
      var origCheck = window.checkBadge;
      var wrapped = function (type) {
        if (type === 'quiz') {
          var quizzes = (JSON.parse(localStorage.getItem('quizzes-done') || '[]')).length;
          if (quizzes >= 3) { if (typeof showToast === 'function') showToast('📚 Badge Estudiosa desbloqueado! 🎉'); }
          else if (typeof showToast === 'function') showToast('📚 Progresso: ' + quizzes + '/3 quizzes (faça o ASF Quiz!)');
          return;
        }
        return origCheck.apply(this, arguments);
      };
      wrapped.__asfPatched = true;
      window.checkBadge = wrapped;
    }
    if (typeof window.unlockConquista === 'function' && !window.unlockConquista.__asfPatched) {
      var reqs = {
        'longboard-wave': 'Surfar 5 ondas em longboard',
        'tide-timing': 'Surfar em 3 marés diferentes',
        'wax-wizard': 'Usar a parafina correta 5x',
        'sun-guardian': 'Usar protetor solar 7 dias seguidos'
      };
      var origUnlock = window.unlockConquista;
      var armed = {};
      var wrappedU = function (type, btn) {
        if (!armed[type]) {
          armed[type] = true;
          var r = reqs[type] || 'Complete a atividade';
          if (typeof showToast === 'function') showToast('🔓 ' + r + '. Toque de novo para confirmar que completou!');
          btn.textContent = 'Confirmar ✅';
          return;
        }
        return origUnlock.apply(this, arguments);
      };
      wrappedU.__asfPatched = true;
      window.unlockConquista = wrappedU;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', patchBadges);
  else patchBadges();
})();

// 5) Carteirinha unificada (25/09/2026): a seção interativa #carteirinha ficava
//    visível no fim da home, duplicando o card "Carteirinha ASF" do topo.
//    Agora a seção só aparece quando aberta (pelo card do topo ou menu).
(function () {
  function fixCarteirinha() {
    var sec = document.getElementById('carteirinha');
    if (!sec || sec.__asfUnified) return;
    sec.__asfUnified = true;
    // Esconde a seção na home até ser aberta explicitamente
    if (!sec.classList.contains('active')) {
      sec.style.setProperty('display', 'none', 'important');
    }
    // Garante que o card do topo abre a seção e rola para o topo dela
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

/* ---------- REORG HOME v2 (01/10/2026) ----------
   A home ja possui blocos Hero/Comecar/Jornada/Rede ASF/Sobre (commit anterior).
   Este script apenas AGRUPA as secoes restantes com cabecalhos de grupo e
   reordena: Aprender > Comunidade > Parceiros > Mundo. Nada e removido.
   Idempotente: roda uma unica vez. */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    try{
      if(document.querySelector('.asf-grupo-hdr')) return; // ja aplicado
      var content=document.querySelector('div.content');
      if(!content) return;
      content.setAttribute('role','main');
      function hdr(t){var d=document.createElement('div');d.className='section-header asf-grupo-hdr';d.style.margin='36px 20px 0';d.innerHTML='<h2 class="section-title">'+t+'</h2>';return d;}
      function byId(id){return document.getElementById(id);}
      function move(parent,item){var n=(typeof item==='string')?byId(item):item;if(n)parent.appendChild(n);}
      // .content: Aprender > Comunidade > Parceiros
      [hdr('📚 Aprenda e Evolua'),'dicas','tecnica','mobilidade','saude','alimentacao','mental',
       hdr('👭 Comunidade'),'manas-proximas','progresso','badges',
       hdr('🤝 Parceiros ASF'),'lojas','loja','brandhub']
        .forEach(function(x){move(content,x);});
      // body: apos .content
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

/* ---------- FIX FOOTER OVERLAP (02/10/2026) ----------
   Footer era sobreposto por elementos fixos (.asf-bottom-nav, #asf-cookie-banner).
   Adiciona padding-bottom dinamico = soma das alturas das barras fixas no rodape. */
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
    // re-aplica quando o cookie banner for aceito/removido
    new MutationObserver(apply).observe(document.body,{childList:true});
    document.addEventListener('click',function(){setTimeout(apply,300);},true);
  });
})();

/* ---------- FIX FAB x BOTTOM NAV (02/10/2026) ----------
   Botoes flutuantes (Rede ASF, Galeria das Manas etc.) ficavam sobrepostos
   a barra inferior .asf-bottom-nav. Agora sobem para cima dela. */
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
        if(!h||h>90) continue; // so botoes pequenos (FABs), nao paineis
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

/* -------------- FIX STACK FABs + OVERFLOW-X (02/10/2026) --------------
   1) Os botoes flutuantes do canto direito (Galeria das Manas, FAB +, share,
      back-to-top) colidiam ENTRE SI: o fix anterior subia todos para o mesmo
      bottom (bnH+12), mas .fab (56px de altura, bottom:88px) nao era tocado e
      cobria o botao da Galeria. Agora os botoes visiveis sao empilhados
      dinamicamente: cada um acima do anterior, 12px de respiro, tudo acima da
      .asf-bottom-nav.
   2) Guarda anti-overflow horizontal: nenhum elemento pode estourar a largura
      da viewport (fonte do scroll horizontal de ~1500px em mobile). */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function () {
    // 1) Empilhamento dinamico dos FABs
    var applying=false;
    function stack(){
      if(applying) return;
      applying=true;
      try{
        var bn=document.querySelector('.asf-bottom-nav');
        var bnH=(bn && getComputedStyle(bn).position==='fixed') ? bn.offsetHeight : 0;
        var nextBottom=(bnH||0)+12; // base: logo acima da barra inferior
        var sels=['#asf-galeria-btn','.fab','.fab-share','#back-to-top'];
        var els=[];
        sels.forEach(function(s){
          document.querySelectorAll(s).forEach(function(el){
            if(el.offsetHeight>0 && getComputedStyle(el).position==='fixed') els.push(el);
          });
        });
        // ordem desejada de baixo para cima: galeria, fab, share, back-to-top
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

    // 2) Guarda anti-overflow horizontal
    var st=document.createElement('style');
    st.id='asf-overflow-guard';
    st.textContent='html,body{overflow-x:hidden;max-width:100vw;}'+
      'img,video,table,canvas,iframe{max-width:100%;height:auto;}'+
      '*[style*="width:"]{max-width:100vw;}';
    document.head.appendChild(st);
  });
})();

/* ------------ Destaque editorial: "Presenca no Mar" na home (02/10/2026) ------------
   Injetado via asf-fixes.js (carregado com defer na home).
   Aditivo e idempotente: so injeta o card na pagina inicial, sem tocar no HTML estatico. */
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
