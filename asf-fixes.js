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
  // Contagem de apps agora e dinamica via data/apps.json (ver REORG HOME abaixo).
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchTrips);
  } else { patchTrips(); }
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

/* ---------- REORG HOME (01/10/2026) ----------
   Reorganiza a home em nova hierarquia sem remover conteudo:
   caminhos > jornada > rede ASF > aprender > comunidade > parceiros > mundo > sobre.
   Nada e deletado; secoes sao apenas movidas. Nenhum dado inventado. */
(function () {
  function ready(fn){document.readyState!=='loading'?fn():document.addEventListener('DOMContentLoaded',fn);}
  ready(function(){
    try{
      var APP='https://acarolmourad-commits.github.io/';
      var content=document.querySelector('div.content');
      if(!content) return;
      content.setAttribute('role','main');

      // 1) Hero: 2 CTAs
      var hc=document.querySelector('section.hero .hero-cta');
      if(hc){hc.innerHTML='<button class="btn btn-primary" onclick="showSection(\'jornada\')">🌊 Começar agora</button>'+
        '<button class="btn btn-secondary" onclick="showSection(\'caminhos\')">🧭 Explorar a ASF</button>';}

      function el(html){var t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstElementChild;}
      function hdr(t){return el('<div class="section-header" style="margin:36px 20px 0"><h2 class="section-title">'+t+'</h2></div>');}
      function sec(id,title,inner){return el('<div class="section" id="'+id+'"><div class="section-header"><h2 class="section-title">'+title+'</h2></div>'+inner+'</div>');}
      var cardStyle='display:block;background:#fff;border-radius:16px;padding:18px;box-shadow:0 2px 10px rgba(0,0,0,.06);border:1px solid rgba(0,168,204,0.15);text-decoration:none;color:#0E2439;';
      function cam(emoji,title,desc,links){
        var lis=links.map(function(l){return '<a href="'+l[1]+'"'+(l[2]?' onclick="'+l[2]+'"':'')+' style="display:inline-block;font-size:13px;color:var(--primary,#00A8CC);font-weight:600;margin:4px 10px 0 0;text-decoration:none">'+l[0]+' →</a>';}).join('');
        return '<div class="card" style="border-top:4px solid var(--primary,#00A8CC)"><h3 style="margin:0 0 6px;font-size:17px">'+emoji+' '+title+'</h3><p style="font-size:13px;color:#555;margin:0 0 8px">'+desc+'</p><div>'+lis+'</div></div>';
      }
      var caminhos=sec('caminhos','🧭 Por onde você quer começar?',
        '<p style="text-align:center;font-size:14px;color:#555;margin:0 20px 14px">Quatro caminhos para entrar no universo ASF:</p>'+
        '<div class="cards-grid" style="grid-template-columns:repeat(auto-fill,minmax(260px,1fr));padding:0 20px">'+
        cam('🌊','Quero Surfar','Previsão, praias, marés, condições e segurança.',[['Previsão',APP+'asf-previsao/'],['Marés',APP+'asf-mare/'],['Praias',APP+'asf-praias/'],['Segurança',APP+'asf-seguranca/']])+
        cam('🏄','Quero Evoluir','Técnica, treino, yoga, nutrição, mental e aprendizado.',[['Treino',APP+'asf-treino/'],['Yoga',APP+'asf-yoga/'],['Nutrição',APP+'asf-nutricao/'],['Mental',APP+'asf-mental/']])+
        cam('👭','Quero Conhecer Manas','Comunidade, perfil, diário, conquistas e conexão.',[['Comunidade','#',"showSection('comunidade');return false"],['Manas Próximas','#',"showSection('manas-proximas');return false"],['Diário de Surf',APP+'asf-diario/'],['Clube ASF',APP+'asf-clube/']])+
        cam('🌎','Quero Explorar','Surf trips, hospedagens, cultura, destinos e experiências.',[['Viagens',APP+'asf-viagens/'],['Mapa',APP+'asf-mapa/'],['História do Surf',APP+'asf-historia/'],['Atlas',APP+'asf-atlas/']])+
        '</div>');
      var steps=[['1','Conheça a ASF','sobre.html',''],['2','Crie sua identidade ASF','#',"showSection('carteirinha');if(typeof ASF_CARD!=='undefined')ASF_CARD.init();return false"],['3','Descubra seu surf',APP+'asf-quiz/',''],['4','Registre suas sessões',APP+'asf-diario/',''],['5','Encontre suas manas','#',"showSection('manas-proximas');return false"],['6','Evolua','#',"showSection('progresso');return false"]];
      var jornada=sec('jornada','🚀 Comece sua jornada','<ol style="list-style:none;padding:0 20px;margin:0;display:grid;gap:10px">'+steps.map(function(s){
        return '<li><a href="'+s[2]+'"'+(s[3]?' onclick="'+s[3]+'"':'')+' style="'+cardStyle+';display:flex;align-items:center;gap:12px;padding:14px 16px"><span style="min-width:32px;height:32px;border-radius:50%;background:var(--primary,#00A8CC);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">'+s[0]+'</span><span style="font-size:14.5px;font-weight:600">'+s[1]+'</span></a></li>';}).join('')+'</ol>');
      var cats=[['🌊 Mar & Condições',11],['🏄‍♀️ Performance & Treino',8],['🏆 Aprendizado & Jogos',10],['🎨 Cultura & Utilidades',7],['💜 Vida & Comunidade',10],['🛟 Saúde & Segurança',7]];
      var rede=sec('rede-asf','🌐 A Rede ASF',
        '<p style="text-align:center;font-size:14px;color:#555;margin:0 20px 14px">Um ecossistema de <strong><span id="app-count-total">54</span> apps gratuitos</strong> — o hub ASF mais <span id="app-count-sat">53</span> satélites — organizados por tema:</p>'+
        '<div class="cards-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));padding:0 20px">'+
        cats.map(function(c){return '<a class="card" href="guia-apps.html" style="'+cardStyle+'"><h3 style="margin:0 0 4px;font-size:15px">'+c[0]+'</h3><p style="font-size:12.5px;color:#666;margin:0">'+c[1]+' apps</p></a>';}).join('')+
        '</div><div style="text-align:center;margin:16px 0 4px"><a class="btn btn-primary" href="guia-apps.html" style="text-decoration:none;display:inline-block">🧭 Explorar todos os apps</a></div>');
      var sobre=sec('sobre-asf','🏛️ Sobre a ASF','<div style="padding:0 20px"><div class="card" style="border-left:4px solid var(--primary,#00A8CC)">'+
        '<p style="font-size:14px;line-height:1.7;margin:0 0 8px">A <strong>ASF — Associação de Surf Feminino</strong> é a comunidade digital das mulheres que surfam no Brasil. Nosso propósito é conectar, apoiar e fortalecer surfistas em todas as fases — do primeiro banho de mar ao free surf — com conteúdo confiável, ferramentas gratuitas e uma rede de manas.</p>'+
        '<p style="font-size:13.5px;color:#555;margin:0 0 12px">Valores: comunidade, segurança no mar, sororidade, acesso gratuito e respeito ao oceano.</p>'+
        '<a class="btn btn-secondary" href="sobre.html" style="text-decoration:none;display:inline-block">🏄‍♀️ Conheça a ASF</a></div></div>');

      // 2) Reordenar filhos de .content
      function byId(id){return document.getElementById(id);}
      var seq=[caminhos,jornada,rede,hdr('📚 Aprenda e Evolua'),
        'dicas','tecnica','mobilidade','saude','alimentacao','mental',
        hdr('👭 Comunidade'),'manas-proximas','progresso','brandhub','conquistas-secretas','badges',
        hdr('🤝 Parceiros ASF'),'lojas','loja'];
      seq.forEach(function(item){var n=(typeof item==='string')?byId(item):item;if(n)content.appendChild(n);});

      // 3) Blocos fora de .content: inserir logo apos .content na ordem
      var after=[hdr('⭐ Guias Completos'),'premium','seguranca','conteudo',
        hdr('👭 Comunidade — continue explorando'),'comunidade','surfer-profile','pos-surf','desafios','competicoes','surf-news','metas',
        hdr('🤝 Parceiros ASF — cadastro e destaques'),'parceiros','assinantes',
        hdr('🌎 ASF pelo Mundo'),'praias','surf-culture',
        'utilities','surf-conditions-section','assistente','carteirinha',sobre];
      var anchor=content;
      after.forEach(function(item){var n=(typeof item==='string')?byId(item):item;if(!n)return;
        n.parentNode.removeChild(n);anchor.parentNode.insertBefore(n,anchor.nextSibling);anchor=n;});

      // 4) Corrige contagem de apps: fonte unica data/apps.json
      document.querySelectorAll('small').forEach(function(s){
        if(/Todos os \d+ apps/.test(s.textContent)){s.innerHTML=s.innerHTML.replace(/Todos os \d+ apps/,'Todos os <span id="app-count-hero">54</span> apps');}
      });
      fetch('data/apps.json').then(function(r){return r.json();}).then(function(d){
        var sat=(d.apps||[]).length,tot=sat+1;
        [['app-count-total',tot],['app-count-sat',sat],['app-count-hero',tot]].forEach(function(p){var e=document.getElementById(p[0]);if(e)e.textContent=p[1];});
      }).catch(function(){});
    }catch(e){console.error('reorg home:',e);}
  });
})();
