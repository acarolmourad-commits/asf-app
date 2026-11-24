/* ASF home quality layer. Deliberately does not read/write storage or change card logic. */
(function () {
  'use strict';

  function organizeMainMenu() {
    var menu = document.getElementById('header-menu');
    if (!menu || menu.dataset.asfGrouped === 'true') return;
    var items = Array.prototype.filter.call(menu.children, function (node) {
      return node.matches && node.matches('.menu-item');
    });
    if (!items.length) return;

    var groups = [
      { label: 'SURF E APRENDIZADO', keys: ['Dicas', 'Mobilidade', 'Praias', 'News', 'Cultura', 'Ondas', 'ASF Tempo', 'Surftrips', 'Utilitários', 'Quiz', 'Guias', 'Conteúdo'] },
      { label: 'COMUNIDADE', keys: ['Desafios', 'Perfil', 'Comunidade', 'Sessões', 'Competições', 'Destaques'] },
      { label: 'ASF E SERVIÇOS', keys: ['Parceiros & benefícios', 'Assistente', 'Carteirinha', 'Segurança'] }
    ];
    var wrappers = groups.map(function (group) {
      var wrapper = document.createElement('div');
      wrapper.className = 'asf-menu-group';
      wrapper.setAttribute('role', 'group');
      wrapper.setAttribute('aria-label', group.label);
      var heading = document.createElement('p');
      heading.className = 'asf-menu-group-title';
      heading.textContent = group.label;
      wrapper.appendChild(heading);
      menu.appendChild(wrapper);
      return { keys: group.keys, wrapper: wrapper };
    });

    items.forEach(function (item) {
      var label = (item.textContent || '').replace(/^\s*\S+\s*/, '').trim();
      var target = wrappers.find(function (group) {
        return group.keys.some(function (key) { return label.indexOf(key) !== -1; });
      });
      if (target) target.wrapper.appendChild(item);
      else menu.appendChild(item); // Keep any unclassified item visible and functional.
    });
    menu.dataset.asfGrouped = 'true';
  }

  function applyHomeQuality() {
    if (document.documentElement.dataset.asfHomeQuality === 'applied') return;
    document.documentElement.dataset.asfHomeQuality = 'applied';

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

    document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
      var rel = new Set((link.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      rel.add('noopener');
      rel.add('noreferrer');
      link.setAttribute('rel', Array.from(rel).join(' '));
    });

    organizeMainMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHomeQuality, { once: true });
  } else {
    applyHomeQuality();
  }
})();
