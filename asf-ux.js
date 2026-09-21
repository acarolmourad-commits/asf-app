/* ASF UX Overlay — camada ADITIVA e defensiva.
   Regras: nao remove, nao oculta, nao desativa nada. So adiciona.
   Cada bloco verifica se o alvo existe antes de agir. */
(function () {
  'use strict';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }
  function go(id) { return "showSection('" + id + "');return false;"; }

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
    var html = '<nav class="asf-journey" aria-label="Jornada ASF">' + steps.map(function (x) {
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
    function ls(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
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

  /* ---------- init ---------- */
  ready(function () {
    try { journey(); quickActions(); subtitles(); demoLabels(); related(); sources(); idCard(); } catch (e) { console.error('asf-ux:', e); }
  });
})();
