/* Fonte única do número de apps da Rede ASF.
   Valor verificado em app-status.json (github_io_ok = 54 apps online). */
window.ASF_TOTAL_APPS = 54;
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-asf-apps-count]').forEach(function (el) {
    el.textContent = window.ASF_TOTAL_APPS;
  });
});
