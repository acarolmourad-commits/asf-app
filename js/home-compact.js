/* home-compact: oculta secoes SPA secundarias no load inicial */

document.addEventListener('DOMContentLoaded', function () {
  try {
    if (typeof window.showSection !== 'function') return;
    if (window.showSection.toString().indexOf("querySelectorAll('.section')") === -1) return;
    document.querySelectorAll('.section').forEach(function (s) {
      if (!s.classList.contains('active') && s.id !== 'parceiros') {
        s.style.setProperty('display', 'none', 'important');
      }
    });
  } catch (e) { /* falha silenciosa: home segue como antes */ }
});

/* banner destaque: Nossa Historia (timeline + fotos reais do Instagram) */
document.addEventListener('DOMContentLoaded', function () {
  try {
    var hero = document.querySelector('.hero');
    if (!hero || document.getElementById('historia-banner')) return;
    var a = document.createElement('a');
    a.id = 'historia-banner';
    a.href = 'sobre.html';
    a.style.cssText = 'display:block;margin:0 20px 20px;padding:16px 18px;border-radius:16px;text-decoration:none;color:#fff;background:linear-gradient(135deg,#833AB4,#FD1D1D,#F77737);box-shadow:0 2px 10px rgba(0,0,0,.08)';
    a.innerHTML = '<b style="display:block;font-size:15px">\uD83C\uDF0A Nossa Hist\u00F3ria \u2014 com fotos reais da ASF</b><small style="opacity:.95">Da funda\u00E7\u00E3o em 2017 aos campeonatos: reviva a jornada das manas \u2192</small>';
    hero.parentNode.insertBefore(a, hero.nextSibling);
  } catch (e) { /* falha silenciosa */ }
});
