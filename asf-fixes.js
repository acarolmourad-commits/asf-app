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
