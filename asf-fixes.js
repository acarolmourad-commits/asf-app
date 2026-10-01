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
