/* Fonte única do número de apps ativos da Rede ASF.
   Catálogo ativo: data/apps.json (49 aplicativos). */
window.ASF_TOTAL_APPS = 49;
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-asf-apps-count]').forEach(function (el) {
    el.textContent = window.ASF_TOTAL_APPS;
  });

  /* Card de destaque: A Matemática do Surf (asf-matematica) */
  var cards = document.querySelectorAll('a[href="previsao-surf/"]');
  cards.forEach(function (a) {
    if (a.textContent.indexOf('Previsão de Ondas') !== -1 && !document.getElementById('matematica-surf-card')) {
      a.insertAdjacentHTML('afterend', '<a id="matematica-surf-card" href="https://acarolmourad-commits.github.io/asf-matematica/" style="display:flex;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:18px;margin:12px 20px;text-decoration:none;color:#0E2439;box-shadow:0 2px 10px rgba(0,0,0,.06);border:1px solid rgba(244,208,63,0.45)"><span style="font-size:2rem">📐</span><span><b style="display:block">A Matemática do Surf</b><small style="color:#666">Velocidade de remada × onda, pontos de pressão na parede e ângulo de takeoff — a física do surf explicada com números</small></span></a>');
    }
  });

  /* Catálogo do Guia: os destinos consolidados são apresentados uma única vez
     como ASF Previsão no próprio HTML. Nenhum card legado é injetado aqui. */
  var isGuia = !!document.querySelector('.cat[data-cat]') && !!document.getElementById('busca');
  if (isGuia) {
    var cont = document.getElementById('cont');
    if (cont) cont.textContent = String(document.querySelectorAll('.cat[data-cat] .app').length);
    if (location.hostname === 'asf.surf') {
      var linkOk = document.querySelector('link[href="/asf-site-redesign.css"]');
      if (!linkOk) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/asf-site-redesign.css'; document.head.appendChild(l); }
      var scriptOk = document.querySelector('script[src="/asf-redesign.js"]');
      if (!scriptOk) { var s = document.createElement('script'); s.src = '/asf-redesign.js'; s.defer = true; document.body.appendChild(s); }
    }
  }

  /* Link morto (2026-10-20): spsurf.com.br está sem DNS (verificado por
     getent/curl). As referências na home passam a apontar para o Instagram
     oficial já usado na própria página, mantendo a usuária em canal ativo. */
  document.querySelectorAll('a[href*="spsurf.com.br"]').forEach(function (a) {
    a.href = 'https://www.instagram.com/spsurfoficial/';
    if (a.textContent.indexOf('spsurf.com.br') !== -1) a.textContent = '📷 @spsurfoficial';
  });
});
