/* ASF UX Overlay — camada ADITIVA e defensiva.
   Regras: nao remove, nao oculta, nao desativa nada. So adiciona.
   Cada bloco verifica se o alvo existe antes de agir. */
(function () {
  'use strict';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  function go(id) { return "showSection('" + id + "');return false;"; }
  function ls(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }

  /* ---------- FASE 1 ---------- */

  function journey() {
    var home = document.getElementById('dicas');
    if (!home || home.querySelector('.asf-journey')) return;
    var steps = [
      { ico: '🏖️', t: 'Encontrar', s: 'Praias', act: go('praias') },
      { ico: '🌊', t: 'Explorar', s: 'Mar e clima', href: 'previsao-surf/' },
      { ico: '📚', t: 'Aprender', s: 'Guias', href: 'aprender/' },
      { ico: '🏄', t: 'Surfar', s: 'Eventos', act: go('eventos') },
      { ico: '✍️', t: 'Registrar', s: 'Diario', href: 'diario/' },
      { ico: '📈', t: 'Evoluir', s: 'Progresso', act: go('progresso') },
      { ico: '💬', t: 'Voltar', s: 'Comunidade', act: go('comunidade') }
    ];
    var logo = '<span class="asf-journey-logo"><img src="assets/images/asf-logo-breadcrumb.png" alt="ASF" width="34" height="34"><span>ASF</span></span>';
    var html = '<nav class="asf-journey" aria-label="Jornada ASF">' + logo + steps.map(function (x) {
      return x.href
        ? '<a href="' + x.href + '"><span class="j-ico">' + x.ico + '</span><span class="j-step">' + x.t + '</span><span>' + x.s + '</span></a>'
        : '<a href="#" onclick="' + x.act + '"><span class="j-ico">' + x.ico + '</span><span class="j-step">' + x.t + '</span><span>' + x.s + '</span></a>';
    }).join('') + '</nav>';
    var header = home.querySelector('.section-header');
    (header && header.nextSibling) ? home.insertBefore(el(html), header.nextSibling) : home.insertBefore(el(html), home.firstChild);
  }

  function demoLabels() {
    ['manas', 'manas-proximas'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector('.asf-demo-badge')) return;
      var header = sec.querySelector('.section-header') || sec.firstChild;
      var badge = el('<span class="asf-demo-badge">🧪 Conteudo demonstrativo — perfis de exemplo</span>');
      header && header.parentNode ? header.parentNode.insertBefore(badge, header.nextSibling) : sec.insertBefore(badge, sec.firstChild);
    });
  }

  var RELATED = {
    praias:      [['🌊 Previsao do mar', 'previsao-surf/'], ['🧭 Prancha ideal', 'prancha-ideal/'], ['📚 Guias', 'aprender/']],
    eventos:     [['🏆 Competicoes', 'competicoes'], ['👥 Manas', 'manas'], ['✍️ Diario', 'diario/']],
    competicoes: [['📅 Eventos', 'eventos'], ['📈 Progresso', 'progresso']],
    progresso:   [['🎯 Metas', 'metas'], ['🏅 Badges', 'badges'], ['🪪 Carteirinha', 'carteirinha']],
    metas:       [['📈 Progresso', 'progresso'], ['✍️ Diario', 'diario/']],
    manas:       [['💬 Comunidade', 'comunidade'], ['🌊 Mar e clima', 'previsao-surf/']],
    comunidade:  [['👥 Manas', 'manas'], ['📅 Eventos', 'eventos']],
    mobilidade:  [['🧘 Pos-surf', 'pos-surf'], ['💚 Saude', 'saude']],
    saude:       [['🧘 Mobilidade', 'mobilidade'], ['🧠 Mental', 'mental']],
    mental:      [['💚 Saude', 'saude'], ['📚 Guias', 'aprender/']],
    seguranca:   [['📚 Guia de correntes', 'aprender/correntes-de-retorno-seguranca.html'], ['🌊 Previsao', 'previsao-surf/']],
    carteirinha: [['📈 Progresso', 'progresso'], ['🏅 Badges', 'badges']]
  };
  function related() {
    Object.keys(RELATED).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector('.asf-related')) return;
      var links = RELATED[id].map(function (r) {
        var isPage = r[1].indexOf('/') >= 0 || r[1].indexOf('.html') >= 0;
        return isPage
          ? '<a href="' + r[1] + '">' + r[0] + '</a>'
          : '<button type="button" onclick="showSection(\'' + r[1] + '\')">' + r[0] + '</button>';
      }).join('');
      sec.appendChild(el('<div class="asf-related"><p>Continue sua jornada</p><div class="rel-links">' + links + '</div></div>'));
    });
  }

  function sources() {
    ['mar-data', 'clima-data', 'mare-data', 'uv-data'].forEach(function (id) {
      var c = document.getElementById(id);
      if (!c || c.querySelector('.asf-source')) return;
      var note = id === 'mare-data'
        ? 'Estimativa local de mare — confirme na tabua de mares da Marinha'
        : 'Fonte: Open-Meteo (atualizado ao abrir o app)';
      c.appendChild(el('<span class="asf-source">' + note + '</span>'));
    });
  }

  /* ---------- FASE 2 — Home orientada a acao ---------- */

  function quickActions() {
    var home = document.getElementById('dicas');
    if (!home || home.querySelector('.asf-quick')) return;
    var html = '<div class="asf-quick" aria-label="Acoes rapidas">'
      + '<a href="diario/"><span class="q-ico">✍️</span><span>Registrar sessao<small>Salve seu surf de hoje</small></span></a>'
      + '<button type="button" onclick="showSection(\'manas\')"><span class="q-ico">👥</span><span>Encontrar manas<small>Surfe acompanhada</small></span></button>'
      + '<a href="previsao-surf/"><span class="q-ico">🌊</span><span>Previsao do mar<small>Ondas, vento e UV</small></span></a>'
      + '<button type="button" onclick="showSection(\'progresso\')"><span class="q-ico">📈</span><span>Meu progresso<small>Pontos e evolucao</small></span></button>'
      + '</div>';
    var j = home.querySelector('.asf-journey');
    j ? j.parentNode.insertBefore(el(html), j.nextSibling) : home.insertBefore(el(html), home.firstChild);
  }

  var SUBTITLES = {
    manas: 'Encontre mulheres que surfam na sua praia e marquem juntas.',
    eventos: 'Encontros, saidas de surf e atividades da comunidade.',
    competicoes: 'Campeonatos e resultados do surf feminino.',
    progresso: 'Seus pontos, nivel e evolucao dentro do app.',
    metas: 'Defina objetivos e acompanhe sua evolucao no surf.',
    carteirinha: 'Sua identidade na comunidade ASF.',
    mobilidade: 'Treinos de mobilidade e preparacao para surfar melhor.',
    seguranca: 'Correntes, etiqueta e cuidados essenciais no mar.',
    praias: 'Condicoes ao vivo das praias e picos da regiao.',
    comunidade: 'Posts, duvidas e conquistas das manas.',
    desafios: 'Desafios para evoluir no surf — valem pontos!'
  };
  function subtitles() {
    Object.keys(SUBTITLES).forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector('.asf-subtitle')) return;
      var header = sec.querySelector('.section-header');
      if (header) header.parentNode.insertBefore(el('<p class="asf-subtitle">' + SUBTITLES[id] + '</p>'), header.nextSibling);
    });
  }

  /* ---------- FASE 3 — Carteirinha como identidade ---------- */

  function idCard() {
    var sec = document.getElementById('carteirinha');
    if (!sec || sec.querySelector('.asf-idcard')) return;
    var pts = ls('asf_points', { total: 0 });
    var sessions = ls('surf-sessions', []);
    var quizzes = ls('quizzes-done', []);
    var profile = ls('asf-profile', null);
    var nome = profile && profile.name ? profile.name : 'Surfista ASF';
    var nivel = (typeof getLevel === 'function') ? getLevel(pts.total || 0) : null;
    var nivelTxt = nivel && nivel.name ? nivel.name : 'Iniciante';
    var card = el('<div class="asf-idcard">'
      + '<h4>🪪 ' + nome + '</h4>'
      + '<div class="id-level">Nivel: ' + nivelTxt + '</div>'
      + '<div class="id-stats">'
      + '<div class="id-stat"><b>' + (pts.total || 0) + '</b><span>pontos</span></div>'
      + '<div class="id-stat"><b>' + sessions.length + '</b><span>sessoes</span></div>'
      + '<div class="id-stat"><b>' + quizzes.length + '</b><span>quizzes</span></div>'
      + '</div></div>');
    var header = sec.querySelector('.section-header');
    header ? header.parentNode.insertBefore(card, header.nextSibling) : sec.insertBefore(card, sec.firstChild);
  }

  /* ---------- FASE 4 — Gamificacao ligada a acoes reais ---------- */

  function weekKey() {
    var d = new Date();
    var onejan = new Date(d.getFullYear(), 0, 1);
    var week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    return d.getFullYear() + '-W' + week;
  }

  function sessionsThisWeek() {
    var sessions = ls('surf-sessions', []);
    var now = Date.now();
    return sessions.filter(function (s) {
      var t = new Date(s.date || s.data || 0).getTime();
      return t && (now - t) < 7 * 86400000;
    }).length;
  }

  window.ASF_UX_CLAIM_CHALLENGE = function () {
    var key = 'asf-challenge-' + weekKey();
    if (localStorage.getItem(key)) return;
    if (sessionsThisWeek() < 3) return;
    localStorage.setItem(key, 'done');
    if (typeof earnPoints === 'function') earnPoints('treino', 50);
    else {
      var p = ls('asf_points', { total: 0 }); p.total = (p.total || 0) + 50;
      localStorage.setItem('asf_points', JSON.stringify(p));
    }
    if (typeof showToast === 'function') showToast('🏆 Desafio semanal completo! +50 pontos');
    weeklyChallenge();
  };

  function weeklyChallenge() {
    var sec = document.getElementById('desafios');
    if (!sec) return;
    var old = sec.querySelector('.asf-challenge');
    if (old) old.remove();
    var count = sessionsThisWeek();
    var goal = 3;
    var pct = Math.min(100, Math.round(count / goal * 100));
    var claimed = !!localStorage.getItem('asf-challenge-' + weekKey());
    var done = count >= goal;
    var action = claimed
      ? '<span class="ch-done">✅ Resgatado esta semana</span>'
      : done
        ? '<button type="button" onclick="ASF_UX_CLAIM_CHALLENGE()">Resgatar +50 pontos</button>'
        : '<button type="button" disabled>Faltam ' + (goal - count) + ' sessao(oes)</button>';
    var card = el('<div class="asf-challenge">'
      + '<h4>🏆 Desafio da semana</h4>'
      + '<p class="ch-desc">Registre ' + goal + ' sessoes de surf em 7 dias (via Diario) e ganhe 50 pontos.</p>'
      + '<div class="ch-bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><div class="ch-fill" style="width:' + pct + '%"></div></div>'
      + '<div class="ch-meta"><span>' + count + '/' + goal + ' sessoes</span>' + action + '</div>'
      + '</div>');
    var header = sec.querySelector('.section-header');
    var anchor = header || sec.firstChild;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(card, anchor.nextSibling);
    else sec.insertBefore(card, sec.firstChild);
  }

  /* ---------- init ---------- */
  ready(function () {
    try { journey(); quickActions(); subtitles(); demoLabels(); related(); sources(); idCard(); weeklyChallenge(); } catch (e) { console.error('asf-ux:', e); }
  });
})();

/* ASF redesign navigation enhancements */
(function(){'use strict';function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}ready(function(){var main=document.querySelector('main')||document.querySelector('.content')||document.body;if(main&&!document.querySelector('.asf-skip-link')){var skip=document.createElement('a');skip.className='asf-skip-link';skip.href='#asf-main';skip.textContent='Pular para o conteúdo';document.body.prepend(skip);if(!main.id)main.id='asf-main'}if(!document.querySelector('.bottom-nav')&&!document.querySelector('.asf-site-nav')){var nav=document.createElement('nav');nav.className='asf-site-nav';nav.setAttribute('aria-label','Navegação principal ASF');nav.innerHTML='<a class="asf-site-brand" href="/asf-app/"><img src="/asf-app/assets/images/asf-logo-breadcrumb.png" alt="" loading="lazy">ASF</a><a href="/asf-app/aprender/">📚 Aprender</a><a href="/asf-app/previsao-surf/">🌊 Previsão</a><a href="/asf-app/quiz/">🏄 Quiz</a><a href="/asf-app/guia-apps.html">🧰 Apps</a><a href="/asf-app/sobre.html">Sobre</a>';document.body.prepend(nav)}var top=document.querySelector('nav.top');if(top&&!top.classList.contains('asf-enhanced')){top.classList.add('asf-enhanced');[['🌊 Previsão','/asf-app/previsao-surf/'],['🧰 Apps','/asf-app/guia-apps.html']].forEach(function(x){if(!top.querySelector('a[href="'+x[1]+'"]')){var a=document.createElement('a');a.href=x[1];a.textContent=x[0];top.appendChild(a)}})}var bottom=document.querySelector('.bottom-nav');if(bottom&&!bottom.dataset.asfOverflow){bottom.dataset.asfOverflow='1';var items=[].slice.call(bottom.querySelectorAll(':scope > .nav-item'));if(items.length>6){var more=document.createElement('button');more.type='button';more.className='nav-item asf-more-toggle';more.setAttribute('aria-label','Abrir menu completo');more.setAttribute('aria-expanded','false');more.innerHTML='<span class="icon">☰</span><span class="label">Mais</span>';var menu=document.createElement('div');menu.className='asf-more-menu';menu.setAttribute('aria-label','Mais seções');items.slice(5).forEach(function(item){menu.appendChild(item)});bottom.appendChild(more);document.body.appendChild(menu);more.addEventListener('click',function(){var open=menu.classList.toggle('open');more.setAttribute('aria-expanded',open?'true':'false')});menu.addEventListener('click',function(e){if(e.target.closest('.nav-item')){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}});document.addEventListener('click',function(e){if(!menu.contains(e.target)&&!more.contains(e.target)){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}})}}});})();
