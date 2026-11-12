/* Progressive disclosure: preserve existing sections, IDs and personal records. */
(function () {
  'use strict';
  function reveal(id) {
    var target = document.getElementById(id);
    for (var node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    return target;
  }
  function init() {
    if (document.getElementById('asf-explore-directory')) return;
    var hero = document.querySelector('.hero');
    var start = document.getElementById('comecar');
    var footer = document.querySelector('footer[role="contentinfo"]');
    if (!hero || !start || !footer) return;
    hero.insertAdjacentElement('afterend', start);
    var search = document.getElementById('asf-home-search');
    if (search) start.insertAdjacentElement('afterend', search);
    var directory = document.createElement('section');
    directory.id = 'asf-explore-directory';
    directory.className = 'asf-journey-directory';
    directory.setAttribute('aria-labelledby', 'asf-directory-title');
    var title = document.createElement('h2');
    title.id = 'asf-directory-title'; title.textContent = 'Explore no seu ritmo';
    var intro = document.createElement('p');
    intro.textContent = 'Abra um tema para encontrar os conteúdos e ferramentas. Seus registros e aplicativos continuam disponíveis.';
    directory.append(title, intro);
    (search || start).insertAdjacentElement('afterend', directory);
    document.querySelectorAll('.asfv2-band').forEach(function (band) {
      var heading = band.querySelector('.asfv2-band-title');
      var details = document.createElement('details');
      details.className = 'asf-journey-topic';
      var summary = document.createElement('summary');
      summary.textContent = heading ? heading.textContent : 'Mais conteúdos';
      details.append(summary, band); directory.append(details);
      if (heading) heading.classList.add('asf-topic-repeated-title');
    });
    var nav = document.querySelector('.asfv2-nav');
    if (nav) { directory.insertBefore(nav, directory.firstChild); nav.classList.add('asf-directory-nav'); }
    // A single institutional footer ends the document's content, after legacy modules.
    document.body.appendChild(footer);
    document.querySelectorAll('footer:not([role="contentinfo"])').forEach(function (old) { old.classList.add('asf-legacy-footer'); });
    document.addEventListener('click', function (event) {
      var anchor = event.target.closest('a[href*="#"]');
      if (!anchor) return;
      var url = new URL(anchor.href, location.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
        reveal(decodeURIComponent(url.hash.slice(1)));
      }
    }, true);
    ['showSection', 'asfNav'].forEach(function (name) {
      var original = window[name];
      if (typeof original !== 'function') return;
      window[name] = function (id) { reveal(id); return original.apply(this, arguments); };
    });
    window.addEventListener('hashchange', function () { reveal(decodeURIComponent(location.hash.slice(1))); });
    if (location.hash) {
      var target = reveal(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView({block:'start'});
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
