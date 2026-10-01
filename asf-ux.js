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
    home.insertBefore(el(html), home.firstChild);
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
    try { quickActions(); subtitles(); demoLabels(); related(); sources(); idCard(); weeklyChallenge(); } catch (e) { console.error('asf-ux:', e); }
  });
})();

/* ASF redesign navigation enhancements: skip nav injection when site header exists */
(function(){'use strict';function ready(fn){document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn):fn()}ready(function(){var main=document.querySelector('main')||document.querySelector('.content')||document.body;if(main&&!document.querySelector('.asf-skip-link')){var skip=document.createElement('a');skip.className='asf-skip-link';skip.href='#asf-main';skip.textContent='Pular para o conteúdo';document.body.prepend(skip);if(!main.id)main.id='asf-main'}var bottom=document.querySelector('.bottom-nav');if(bottom&&!bottom.dataset.asfOverflow){bottom.dataset.asfOverflow='1';var items=[].slice.call(bottom.querySelectorAll(':scope > .nav-item'));if(items.length>6){var more=document.createElement('button');more.type='button';more.className='nav-item asf-more-toggle';more.setAttribute('aria-label','Abrir menu completo');more.setAttribute('aria-expanded','false');more.innerHTML='<span class="icon">☰</span><span class="label">Mais</span>';var menu=document.createElement('div');menu.className='asf-more-menu';menu.setAttribute('aria-label','Mais seções');items.slice(5).forEach(function(item){menu.appendChild(item)});bottom.appendChild(more);document.body.appendChild(menu);more.addEventListener('click',function(){var open=menu.classList.toggle('open');more.setAttribute('aria-expanded',open?'true':'false')});menu.addEventListener('click',function(e){if(e.target.closest('.nav-item')){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}});document.addEventListener('click',function(e){if(!menu.contains(e.target)&&!more.contains(e.target)){menu.classList.remove('open');more.setAttribute('aria-expanded','false')}})}}});})();

/* ---------- FASE 5.1 — Menu principal auto-contido + header sem logo (28/09/2026) ----------
   Motivo: o menu da home dependia de showSection() do app.js (defer, 132KB); se app.js
   falhasse/atrasasse, todos os cliques morriam silenciosamente ("menu morto").
   Aqui o menu fica auto-contido (fallback proprio) e a logo do header e removida,
   apenas na home (paginas com #header-menu). */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  // Navega por ROLAGEM: nunca esconde secoes (combinado: conteudos nao sao modificados/ocultados).
  window.asfNav = function (id) {
    var sec = document.getElementById(id);
    if (sec) {
      sec.classList.add('active');
      sec.style.removeProperty('display');
      if (window.getComputedStyle(sec).display === 'none') {
        sec.style.setProperty('display', 'block', 'important');
      }
      var header = document.querySelector('header');
      var offset = (header ? header.offsetHeight : 0) + 8;
      var y = sec.getBoundingClientRect().top + (window.pageYOffset || 0) - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    }
    if (typeof window.closeMenu === 'function') { try { window.closeMenu(); } catch (e) {} }
    else { var m = document.getElementById('header-menu'); if (m) m.classList.remove('open'); }
  };

  function fixMenu() {
    var menu = document.getElementById('header-menu');
    if (!menu) return; // so na home

    // 1) remove a logo do header (pedido do usuario)
    var logo = document.querySelector('header .logo');
    if (logo) logo.remove();

    if (menu.__asfRebound) return;
    menu.__asfRebound = true;

    // 2) rebind dos itens: extrai o destino do onclick antigo e usa handler proprio
    menu.querySelectorAll('.menu-item').forEach(function (btn) {
      var oc = btn.getAttribute('onclick') || '';
      var mSec = oc.match(/showSection\('([^']+)'\)/);
      var mHref = oc.match(/location\.href='([^']+)'/);
      var needCard = oc.indexOf('ASF_CARD.init') !== -1;
      if (!mSec && !mHref) return;
      btn.removeAttribute('onclick');
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (mSec) window.asfNav(mSec[1]);
        else { window.location.href = mHref[1]; if (typeof window.closeMenu === 'function') try { window.closeMenu(); } catch (e) {} }
        if (needCard && typeof ASF_CARD !== 'undefined') { try { ASF_CARD.init(); } catch (e) {} }
      });
    });

    // 3) toggle robusto (nao depende de inline onclick)
    var t = document.getElementById('menu-toggle');
    if (t && !t.__asfRebound) {
      t.__asfRebound = true;
      t.removeAttribute('onclick');
      t.addEventListener('click', function (ev) {
        ev.stopPropagation();
        var open = menu.classList.toggle('open');
        t.setAttribute('aria-expanded', open ? 'true' : 'false');
        t.textContent = open ? '\u2715' : '\u2630';
      });
    }
  }
  ready(fixMenu);
})();

/* ---------- FASE 7.1 — Busca revive (28/09/2026) ----------
   A barra de pesquisa estava morta: debouncedSearch/handleSearch (js/home-main.js)
   dependem de _searchTimer, normalizedSearchIndex e showSection, que viviam no
   app.js (nao carregado mais na home). Aqui definimos essas dependencias:
   - _searchTimer: timer do debounce
   - normalizedSearchIndex: indice construido do DOM (.section com id)
   - showSection: shim de rolagem via asfNav (nunca esconde secoes) */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function buildSearchIndex() {
    if (window.normalizedSearchIndex && window.normalizedSearchIndex.length) return; // ja existe
    var items = [];
    document.querySelectorAll('.section[id]').forEach(function (sec) {
      var id = sec.id;
      var titleEl = sec.querySelector('.section-title, h2, h3');
      var title = titleEl ? titleEl.textContent.trim() : id;
      var firstToken = title.split(/\s+/)[0] || '';
      var icon = /^[\w\d]/.test(firstToken) ? '🔎' : (firstToken || '🔎');
      // itens de lista/cards dentro da secao viram entradas individuais
      var entries = sec.querySelectorAll('li, .card, .dica-card, h3, h4');
      if (entries.length) {
        entries.forEach(function (el) {
          var t = el.textContent.replace(/\s+/g, ' ').trim();
          if (t.length < 4) return;
          items.push({
            sectionId: id, section: title, icon: icon,
            title: t.length > 60 ? t.substring(0, 60) + '…' : t,
            text: t,
            _titleNorm: norm(t), _textNorm: norm(t), _sectionNorm: norm(title)
          });
        });
      } else {
        var t = sec.textContent.replace(/\s+/g, ' ').trim();
        items.push({
          sectionId: id, section: title, icon: icon, title: title,
          text: t.substring(0, 200),
          _titleNorm: norm(title), _textNorm: norm(t), _sectionNorm: norm(title)
        });
      }
    });
    window.normalizedSearchIndex = items;
  }

  // timer do debounce usado por debouncedSearch()
  if (typeof window._searchTimer === 'undefined') window._searchTimer = null;

  // shim de navegacao para goToSection() e handlers antigos
  if (typeof window.showSection !== 'function') {
    window.showSection = function (id) {
      if (typeof window.asfNav === 'function') window.asfNav(id);
    };
  }

  ready(buildSearchIndex);
})();


/* ---------- FASE 7.1c — Busca: bypass do TDZ (28/09/2026) ----------
   js/home-conquistas.js chama updateNotificationBadge() no top-level ANTES de
   js/home-main.js definir a funcao -> o script morre na linha 68 e as declaracoes
   top-level `const normalizedSearchIndex` e `let _searchTimer` ficam em TDZ para
   sempre. Como const/let top-level criam bindings lexicos globais, eles fazem
   shadow de window.* e QUALQUER referencia bare (dentro de handleSearch etc.)
   lanca ReferenceError. Solucao: sobrescrever as FUNCOES (bindings de window,
   reatribuiveis) para usar window.normalizedSearchIndex explicitamente. */
(function () {
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  window.handleSearch = function (query) {
    var resultsDiv = document.getElementById('searchResults');
    var clearBtn = document.getElementById('searchClear');
    if (!resultsDiv) return;

    if (!query || query.length < 2) {
      resultsDiv.classList.remove('active');
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';
    var q = norm(query);
    var index = window.normalizedSearchIndex || [];
    var results = index.filter(function (item) {
      return item._titleNorm.indexOf(q) !== -1 || item._textNorm.indexOf(q) !== -1 || item._sectionNorm.indexOf(q) !== -1;
    }).slice(0, 8);

    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="search-no-results"><span class="emoji">\ud83c\udfc4\u200d\u2640\ufe0f</span>Nenhum resultado para "' + query + '"<br><small>Tente outro termo</small></div>';
    } else {
      resultsDiv.innerHTML = results.map(function (item) {
        var preview = item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text;
        var highlighted = preview.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
        return '<div class="search-result-item" onclick="goToSection(\'' + item.sectionId + '\', this)">' +
          '<div class="result-title">' + item.icon + ' ' + item.title + '</div>' +
          '<div class="result-section">' + item.section + '</div>' +
          '<div class="result-preview">' + highlighted + '</div></div>';
      }).join('');
    }

    resultsDiv.classList.add('active');
    if (query.length >= 3 && typeof window.saveRecentSearch === 'function') {
      try { window.saveRecentSearch(query); } catch (e) {}
    }
  };

  window.debouncedSearch = function (q) {
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(function () { window.handleSearch(q); }, 150);
  };
})();

/* ASF Galeria — botão flutuante para o mural colaborativo */
(function(){
  if (document.getElementById('asf-galeria-btn')) return;
  function mount(){
    if (document.getElementById('asf-galeria-btn')) return;
    var d=document.createElement('div');
    d.id='asf-galeria-btn';
    d.style.cssText='position:fixed;bottom:18px;right:18px;z-index:99999;';
    d.innerHTML='<a href="https://galeria.asf.surf/" style="display:inline-block;background:linear-gradient(135deg,#00A8CC,#0E2439);color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:50px;box-shadow:0 4px 14px rgba(0,0,0,.35);font-family:Outfit,system-ui,sans-serif;">\uD83D\uDCF8 Galeria das Manas</a>';
    document.body.appendChild(d);
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();

/* ---------- FASE 8 — Menu dropdown sem sobreposição (30/09/2026) ----------
   O #header-menu (filho do header sticky, z-index 999) ficava preso no contexto
   de empilhamento do header: ao rolar a página, seções posicionadas cobriam os
   itens do dropdown. Correção ADITIVA: injeta CSS que sobe o header para
   z-index 1001 e torna o menu fixed com z-index 10001, posicionado logo abaixo
   do header; o menu também fecha automaticamente ao rolar a página. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var menu = document.getElementById('header-menu');
    if (!menu) return; // só na home

    var st = document.createElement('style');
    st.id = 'asf-menu-fix';
    st.textContent =
      'header{z-index:1001!important;}' +
      '#header-menu{position:fixed!important;top:76px;right:12px;z-index:10001!important;max-height:calc(100vh - 90px)!important;background:var(--white,#fff);border-radius:14px;box-shadow:0 12px 32px rgba(14,36,57,.25);padding:8px;min-width:230px;border:1px solid rgba(14,36,57,.08);overflow-y:auto;}' +
      '@media(max-width:480px){#header-menu{top:76px!important;left:12px;right:12px;}}';
    document.head.appendChild(st);

    // move o menu para o <body>: o header sticky tem altura colapsada (2px) e seu
    // contexto de empilhamento quebrado fazia os cards cobrirem o dropdown
    if (menu.parentElement && menu.parentElement.tagName !== 'BODY') {
      document.body.appendChild(menu);
    }

    function placeMenu() {
      var h = document.querySelector('header');
      if (h) menu.style.top = (Math.round(h.getBoundingClientRect().bottom) + 4) + 'px';
    }
    var t = document.getElementById('menu-toggle');
    if (t) t.addEventListener('click', function () { setTimeout(placeMenu, 0); });

    // fecha o menu ao rolar (evita dropdown flutuando sobre conteúdo)
    window.addEventListener('scroll', function () {
      if (!menu.classList.contains('open')) return;
      menu.classList.remove('open');
      if (t) { t.setAttribute('aria-expanded', 'false'); t.textContent = '\u2630'; }
    }, { passive: true });
  });
})();

/* ---------- FASE 8.1 — Busca full-site (30/09/2026) ----------
   Além das seções da home (índice do DOM), indexa as páginas estáticas do site
   (ondas, quiz, surftrips, glossário, galeria etc.) com palavras-chave.
   Itens com `href` abrem a página; itens com `sectionId` rolam até a seção.
   Sobrescreve handleSearch para renderizar os dois tipos. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  var ASF_PAGES = [
    { icon: '🌊', title: 'Previsão das Ondas', desc: 'Altura de ondas, swell, vento e maré ao vivo', href: 'previsao-surf/', kw: 'ondas previsao swell mare vento surf forecast mar' },
    { icon: '📸', title: 'Galeria das Manas', desc: 'Mural colaborativo de fotos e stokes da comunidade', href: 'https://galeria.asf.surf/', kw: 'galeria mural fotos stokes manas comunidade posts' },
    { icon: '🧠', title: 'Quiz de Surf', desc: 'Teste seus conhecimentos e ganhe pontos', href: 'quiz/', kw: 'quiz perguntas conhecimento pontos desafio' },
    { icon: '🚗', title: 'Surftrips', desc: 'Planeje viagens de surf com as manas', href: 'surf-trip/', kw: 'viagem trip surftrip roteiro estrada' },
    { icon: '📖', title: 'Glossário do Surf', desc: 'Dicionário com 30 termos de surf explicados', href: 'https://acarolmourad-commits.github.io/asf-glossario/', kw: 'glossario dicionario termos significado palavras' },
    { icon: '💬', title: 'Sessões Interativas', desc: 'Conversas e atividades guiadas da comunidade', href: 'sessoes-interativas.html', kw: 'sessoes interativas chat atividades' },
    { icon: '🏄‍♀️', title: 'Prancha Ideal', desc: 'Descubra o tamanho e tipo de prancha para você', href: 'prancha-ideal/', kw: 'prancha tamanho volume iniciante board' },
    { icon: '🎓', title: 'Guias e Aprendizado', desc: 'Tutoriais e guias para evoluir no surf', href: 'aprender/', kw: 'aprender guias tutoriais aulas como surfar' },
    { icon: '✍️', title: 'Diário de Surf', desc: 'Registre suas sessões e acompanhe sua evolução', href: 'diario/', kw: 'diario registro sessao sessoes historico' },
    { icon: '📈', title: 'Progresso', desc: 'Seus pontos, nível e evolução no app', href: 'progresso', kw: 'progresso pontos nivel evolucao ranking' }
  ];

  function extendIndex() {
    var idx = window.normalizedSearchIndex;
    if (!idx || !idx.length) return;
    if (idx.some(function (i) { return i.href; })) return; // já estendido
    ASF_PAGES.forEach(function (p) {
      idx.push({
        href: p.href, icon: p.icon,
        title: p.title, section: '🌐 Página do site',
        text: p.title + ' — ' + p.desc + '. ' + p.kw,
        _titleNorm: norm(p.title), _textNorm: norm(p.desc + ' ' + p.kw), _sectionNorm: norm('pagina site')
      });
    });
  }

  // re-render: suporta itens com href (páginas) além de sectionId (seções)
  window.handleSearch = function (query) {
    var resultsDiv = document.getElementById('searchResults');
    var clearBtn = document.getElementById('searchClear');
    if (!resultsDiv) return;

    if (!query || query.length < 2) {
      resultsDiv.classList.remove('active');
      if (clearBtn) clearBtn.style.display = 'none';
      return;
    }

    if (clearBtn) clearBtn.style.display = 'block';
    var q = norm(query);
    var index = window.normalizedSearchIndex || [];
    var results = index.filter(function (item) {
      return item._titleNorm.indexOf(q) !== -1 || item._textNorm.indexOf(q) !== -1 || item._sectionNorm.indexOf(q) !== -1;
    }).slice(0, 8);

    if (results.length === 0) {
      resultsDiv.innerHTML = '<div class="search-no-results"><span class="emoji">🏄‍♀️</span>Nenhum resultado para "' + query + '"<br><small>Tente outro termo</small></div>';
    } else {
      resultsDiv.innerHTML = results.map(function (item) {
        var preview = item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text;
        var highlighted = preview.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
        var action = item.href
          ? 'onclick="window.location.href=\'' + item.href + '\'"'
          : 'onclick="goToSection(\'' + item.sectionId + '\', this)"';
        return '<div class="search-result-item" ' + action + '>' +
          '<div class="result-title">' + item.icon + ' ' + item.title + '</div>' +
          '<div class="result-section">' + item.section + '</div>' +
          '<div class="result-preview">' + highlighted + '</div></div>';
      }).join('');
    }

    resultsDiv.classList.add('active');
    if (query.length >= 3 && typeof window.saveRecentSearch === 'function') {
      try { window.saveRecentSearch(query); } catch (e) {}
    }
  };

  ready(extendIndex);
})();

/* ---------- FASE 8.2 — Menu: mover para o <body> (30/09/2026) ----------
   Mesmo com z-index alto, o #header-menu (filho do header) perdia o hit-test
   para o card "Incentivos de União" (position:relative logo abaixo da busca).
   Correção definitiva e ADITIVA: move o nav para o <body> (raiz), como fixed
   com z-index 999999 — nada mais na página o cobre. O toggle por id e os
   bindings já existentes continuam funcionando (usam getElementById/ref). */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var menu = document.getElementById('header-menu');
    if (!menu || menu.__asfMoved) return;
    menu.__asfMoved = true;

    var st = document.createElement('style');
    st.id = 'asf-menu-fix2';
    st.textContent = '#header-menu{z-index:999999!important;}';
    document.head.appendChild(st);

    function placeMenu() {
      var h = document.querySelector('header');
      if (h) menu.style.top = (Math.round(h.getBoundingClientRect().bottom) + 4) + 'px';
    }
    placeMenu();
    document.body.appendChild(menu); // raiz: fora do contexto do header

    var t = document.getElementById('menu-toggle');
    if (t) t.addEventListener('click', function () { setTimeout(placeMenu, 0); });
    window.addEventListener('resize', placeMenu, { passive: true });
  });
})();

/* ---------- FASE 9 — Comunidade real: remove conteúdo demo (30/09/2026) ----------
   A seção #comunidade exibia posts fictícios (Carol/Grazielle/Márcia) e o card
   placeholder "Mana da Semana". A comunidade real vive na Galeria das Manas
   (galeria.asf.surf). Aqui substituímos o conteúdo da seção por um card de
   entrada para a Galeria e mantemos stubs ocultos (mana-avatar, user-posts)
   para não quebrar js/home-main.js. */
(function () {
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    var sec = document.getElementById('comunidade');
    if (!sec || sec.__asfReal) return;
    sec.__asfReal = true;
    sec.innerHTML =
      '<div class="section-header">' +
        '<h2 class="section-title">👥 Comunidade</h2>' +
        '<a href="https://galeria.asf.surf/" class="see-all">Ver todos →</a>' +
      '</div>' +
      '<div class="card" style="text-align:center; padding: 28px 20px; margin: 0 20px 20px;">' +
        '<div style="font-size: 42px; margin-bottom: 8px;">📸</div>' +
        '<h3 style="margin: 0 0 8px; color: var(--secondary);">Galeria das Manas</h3>' +
        '<p style="font-size: 14px; color: var(--gray-500); margin: 0 0 16px;">O mural oficial da comunidade ASF: posts, fotos e stokes reais das manas. Venha fazer parte! 🏄‍♀️</p>' +
        '<a href="https://galeria.asf.surf/" style="display:inline-block; background: linear-gradient(135deg, #00A8CC, #0E2439); color: white; padding: 12px 28px; border-radius: 24px; font-weight: 700; font-size: 14px; text-decoration: none;">Abrir a Galeria →</a>' +
      '</div>' +
      '<span id="mana-avatar" style="display:none">👩</span>' +
      '<div id="user-posts" style="display:none"></div>';
  });
})();
