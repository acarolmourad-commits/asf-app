/* Fonte única do número de apps da Rede ASF.
   Valor verificado em app-status.json (github_io_ok = 54 apps online). */
window.ASF_TOTAL_APPS = 54;
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-asf-apps-count]').forEach(function (el) {
    el.textContent = window.ASF_TOTAL_APPS;
  });

  /* Card de destaque: A Matemática do Surf (asf-swell) */
  var cards = document.querySelectorAll('a[href="previsao-surf/"]');
  cards.forEach(function (a) {
    if (a.textContent.indexOf('Previsão de Ondas') !== -1 && !document.getElementById('matematica-surf-card')) {
      a.insertAdjacentHTML('afterend', '<a id="matematica-surf-card" href="https://acarolmourad-commits.github.io/asf-swell/" style="display:flex;gap:14px;align-items:center;background:#fff;border-radius:16px;padding:18px;margin:12px 20px;text-decoration:none;color:#0E2439;box-shadow:0 2px 10px rgba(0,0,0,.06);border:1px solid rgba(244,208,63,0.45)"><span style="font-size:2rem">📐</span><span><b style="display:block">A Matemática do Surf</b><small style="color:#666">Entenda como direção, período e exposição da praia definem a melhor janela do dia — explicado de forma simples</small></span></a>');
    }
  });
});
