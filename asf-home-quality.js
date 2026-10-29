/* ASF home quality layer. Deliberately does not read/write storage or change card logic. */
(function () {
  'use strict';

  function applyHomeQuality() {
    if (document.documentElement.dataset.asfHomeQuality === 'applied') return;
    document.documentElement.dataset.asfHomeQuality = 'applied';

    // Keyboard users can skip the floating menu and move straight to the primary choices.
    if (!document.querySelector('.skip-link')) {
      var skip = document.createElement('a');
      skip.className = 'skip-link';
      skip.href = '#comecar';
      skip.textContent = 'Pular para o conteúdo principal';
      document.body.insertBefore(skip, document.body.firstChild);
    }

    var start = document.getElementById('comecar');
    var search = document.querySelector('.search-container');
    var incentive = Array.prototype.find.call(document.querySelectorAll('.card'), function (el) {
      return /INCENTIVOS DE UNIÃO/i.test(el.textContent || '');
    });

    // Keep all content, but put the main value proposition before search and gamification.
    // DOM nodes are moved intact; form state remains untouched.
    if (start && search && search.parentNode && search !== start.nextElementSibling) {
      search.id = search.id || 'asf-home-search';
      start.insertAdjacentElement('afterend', search);
    } else if (search && !search.id) {
      search.id = 'asf-home-search';
    }
    if (start && incentive && incentive.parentNode && incentive.previousElementSibling !== search) {
      incentive.classList.add('asf-home-reordered-incentive');
      (search || start).insertAdjacentElement('afterend', incentive);
    }

    var searchInput = document.getElementById('searchInput');
    if (searchInput && !searchInput.hasAttribute('aria-label')) {
      searchInput.setAttribute('aria-label', 'Buscar conteúdos, ferramentas e serviços da ASF');
    }
    var searchClear = document.getElementById('searchClear');
    if (searchClear) searchClear.setAttribute('aria-label', 'Limpar busca');
    var results = document.getElementById('searchResults');
    if (results) {
      if (!results.hasAttribute('role')) results.setAttribute('role', 'status');
      if (!results.hasAttribute('aria-live')) results.setAttribute('aria-live', 'polite');
      if (!results.hasAttribute('aria-atomic')) results.setAttribute('aria-atomic', 'true');
    }
    var chatInput = document.getElementById('chatbot-input');
    if (chatInput && !chatInput.hasAttribute('aria-label')) {
      chatInput.setAttribute('aria-label', 'Mensagem para o assistente virtual ASF');
    }

    // Explicit safe rel for any existing external link that opens a new tab.
    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
      var rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHomeQuality, { once: true });
  } else {
    applyHomeQuality();
  }
})();
