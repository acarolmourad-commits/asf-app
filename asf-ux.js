/* ASF UX Overlay — camada ADITIVA e defensiva.
   Regras: nao remove, nao oculta, nao desativa nada. So adiciona.
   Cada bloco verifica se o alvo existe antes de agir. */
(function () {
  'use strict';

  function el(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function ready(fn) { document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

  /* 1) FAIXA DE JORNADA na Home (secao dicas, ativa por padrao)
        Encontrar -> Explorar -> Aprender -> Surfar -> Registrar -> Evoluir -> Voltar */
  function journey() {
    var home = document.getElementById('dicas');
    if (!home || home.querySelector('.asf-journey')) return;
    var steps = [
      { ico: '🏖️', t: 'Encontrar', s: 'Praias', act: "showSection('praias')" },
      { ico: '🌊', t: 'Explorar', s: 'Mar e clima', href: 'previsao-surf/' },
      { ico: '📚', t: 'Aprender', s: 'Guias', href: 'aprender/' },
      { ico: '🏄', t: 'Surfar', s: 'Eventos', act: "showSection('eventos')" },
      { ico: '✍️', t: 'Registrar', s: 'Diario', href: 'diario/' },
      { ico: '📈', t: 'Evoluir', s: 'Progresso', act: "showSection('progresso')" },
      { ico: '💬', t: 'Voltar', s: 'Comunidade', act: "showSection('comunidade')" }
    ];
    var html = '<nav class="asf-journey" aria-label="Jornada ASF">' + steps.map(function (x) {
      return x.href
        ? '<a href="' + x.href + '"><span class="j-ico">' + x.ico + '</span><span class="j-step">' + x.t + '</span><span>' + x.s + '</span></a>'
        : '<a href="#" onclick="' + x.act + ';return false;"><span class="j-ico">' + x.ico + '</span><span class="j-step">' + x.t + '</span><span>' + x.s + '</span></a>';
    }).join('') + '</nav>';
    var header = home.querySelector('.section-header');
    (header && header.nextSibling) ? home.insertBefore(el(html), header.nextSibling) : home.insertBefore(el(html), home.firstChild);
  }

  /* 2) SELO DE DEMONSTRACAO em conteudos mock (ex.: Manas) */
  function demoLabels() {
    ['manas', 'manas-proximas'].forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.querySelector('.asf-demo-badge')) return;
      var header = sec.querySelector('.section-header') || sec.firstChild;
      var badge = el('<span class="asf-demo-badge">🧪 Conteudo demonstrativo — perfis de exemplo</span>');
      header && header.parentNode ? header.parentNode.insertBefore(badge, header.nextSibling) : sec.insertBefore(badge, sec.firstChild);
    });
  }

  /* 3) CONEXOES entre secoes (rodape de atalhos relacionados) */
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

  /* 4) FONTE DOS DADOS de mar/clima (transparencia) */
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

  ready(function () {
    try { journey(); demoLabels(); related(); sources(); } catch (e) { console.error('asf-ux:', e); }
  });
})();
