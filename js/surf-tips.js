/* ASF tips: read-only, text-only rendering from the generated editorial catalog. */
(function (global) {
  'use strict';
  var CATEGORIES = ['Começar', 'Segurança', 'Equipamento', 'Treino'];
  var LINKS = ['/aprender/', '/previsao-surf/', '/diario/', '/guias/previsao-de-ondas/', '/guias/pos-surf-e-aprendizado/', 'https://treino.asf.surf/#plano-30-dias'];
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }
  function text(value, limit) {
    return typeof value === 'string' && value.trim().length > 0 && value.length <= limit && !/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
  }
  function saoPauloDate(now) {
    var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now || new Date());
    function part(type) { return parts.find(function (p) { return p.type === type; }).value; }
    return part('year') + '-' + part('month') + '-' + part('day');
  }
  function validateFeed(feed, now) {
    var today = saoPauloDate(now);
    if (!feed || feed.schema_version !== 1 || !validDate(feed.catalog_version) || !validDate(feed.selection_date) || feed.catalog_version > feed.selection_date || feed.selection_date > today) throw new Error('Invalid tips metadata');
    if (typeof feed.generated_at !== 'string' || !/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|\+00:00)$/.test(feed.generated_at) || !Number.isFinite(Date.parse(feed.generated_at))) throw new Error('Invalid generation time');
    if (Date.parse(feed.generated_at) > (now || new Date()).getTime() + 300000) throw new Error('Future generation time');
    if (!Array.isArray(feed.tips) || feed.tips.length < 1 || feed.tips.length > 30) throw new Error('Invalid tips collection');
    var seen = new Set();
    feed.tips.forEach(function (tip) {
      if (!tip || !/^[a-z][a-z0-9-]{1,63}$/.test(tip.id) || seen.has(tip.id) || CATEGORIES.indexOf(tip.category) === -1) throw new Error('Invalid tip identity');
      seen.add(tip.id);
      if (!text(tip.title, 120) || !text(tip.summary, 700) || !text(tip.action, 400) || !text(tip.label, 100) || LINKS.indexOf(tip.href) === -1) throw new Error('Invalid tip content');
    });
    if (!seen.has(feed.featured_id)) throw new Error('Missing featured tip');
    return feed;
  }
  function dateLabel(value) { return value.split('-').reverse().join('/'); }
  function mount(doc) {
    var root = doc.getElementById('dicas');
    if (!root || root.dataset.tipsMounted) return;
    root.dataset.tipsMounted = 'true';
    var grid = doc.getElementById('surf-tips-grid');
    var status = doc.getElementById('surf-tips-status');
    var count = doc.getElementById('surf-tips-count');
    var filters = doc.getElementById('surf-tips-filters');
    var retry = doc.getElementById('surf-tips-retry');
    var currentFeed = null;
    var currentCategory = 'Todas';
    var loading = false;
    function normalize(value) { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
    function syncSearchIndex() {
      // Replace this section only. Never rebuild other sections from a filtered DOM.
      if (!Array.isArray(global.normalizedSearchIndex)) return;
      var entries = currentFeed.tips.map(function (tip) {
        var searchText = tip.title + ' ' + tip.summary + ' ' + tip.action;
        return { sectionId: 'dicas', section: 'Dicas de Surf', icon: '📖', title: tip.title, text: searchText,
          _titleNorm: normalize(tip.title), _textNorm: normalize(searchText + ' ' + tip.category + ' ' + tip.id.replace(/-/g, ' ')), _sectionNorm: 'dicas de surf' };
      });
      var glossary = root.querySelector('.tips-glossary');
      if (glossary) {
        var content = glossary.textContent.replace(/\s+/g, ' ').trim();
        entries.push({ sectionId: 'dicas', section: 'Dicas de Surf', icon: '📖', title: 'Glossário do Surf', text: content,
          _titleNorm: 'glossario do surf', _textNorm: normalize(content), _sectionNorm: 'dicas de surf' });
      }
      global.normalizedSearchIndex = global.normalizedSearchIndex.filter(function (item) { return item.sectionId !== 'dicas'; }).concat(entries);
      var search = doc.getElementById('searchInput');
      if (search && search.value.trim().length > 1 && typeof global.handleSearch === 'function') global.handleSearch(search.value);
    }
    function element(tag, className, value) {
      var el = doc.createElement(tag);
      if (className) el.className = className;
      if (value) el.textContent = value;
      return el;
    }
    function renderLibrary() {
      var tips = currentFeed.tips.filter(function (tip) { return currentCategory === 'Todas' || tip.category === currentCategory; });
      var fragment = doc.createDocumentFragment();
      tips.forEach(function (tip) {
        var article = element('article', 'tips-card');
        article.appendChild(element('p', 'tips-category', tip.category));
        article.appendChild(element('h4', '', tip.title));
        article.appendChild(element('p', '', tip.summary));
        article.appendChild(element('p', 'tips-next-step', tip.action));
        var link = element('a', '', tip.label + ' →');
        link.href = tip.href;
        article.appendChild(link);
        fragment.appendChild(article);
      });
      grid.replaceChildren(fragment);
      count.textContent = tips.length + (tips.length === 1 ? ' dica' : ' dicas') + (currentCategory === 'Todas' ? ' para explorar' : ' · ' + currentCategory);
    }
    function applyFeed(feed) {
      currentFeed = feed;
      var featured = feed.tips.find(function (tip) { return tip.id === feed.featured_id; });
      doc.getElementById('surf-tip-category').textContent = featured.category;
      doc.getElementById('surf-tip-title').textContent = featured.title;
      doc.getElementById('surf-tip-summary').textContent = featured.summary;
      doc.getElementById('surf-tip-action').textContent = featured.action;
      var link = doc.getElementById('surf-tip-link');
      link.textContent = featured.label + ' →';
      link.href = featured.href;
      status.textContent = (feed.selection_date === saoPauloDate() ? 'Seleção de ' : 'Última seleção disponível: ') + dateLabel(feed.selection_date) + ' · Edição do catálogo: ' + dateLabel(feed.catalog_version) + '.';
      renderLibrary();
      syncSearchIndex();
      filters.hidden = false;
      retry.hidden = true;
    }
    filters.addEventListener('click', function (event) {
      var button = event.target.closest('button[data-tips-category]');
      if (!button || !filters.contains(button) || !currentFeed) return;
      currentCategory = button.dataset.tipsCategory;
      filters.querySelectorAll('button').forEach(function (item) { item.setAttribute('aria-pressed', String(item === button)); });
      renderLibrary();
    });
    var searchResults = doc.getElementById('searchResults');
    if (searchResults) searchResults.addEventListener('click', function (event) {
      var result = event.target.closest('.search-result-item');
      if (!currentFeed || !result || result.dataset.sectionTarget !== 'dicas') return;
      // Searching must reveal every matching tip even after a category filter.
      currentCategory = 'Todas';
      filters.querySelectorAll('button').forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.tipsCategory === 'Todas')); });
      renderLibrary();
    }, true);
    async function load() {
      if (loading) return;
      loading = true;
      retry.disabled = true;
      status.textContent = 'Carregando a seleção. As dicas de referência continuam disponíveis.';
      var controller = new AbortController();
      var timer = global.setTimeout(function () { controller.abort(); }, 8000);
      try {
        var response = await global.fetch('docs/generated/surf-tips.json', { cache: 'no-cache', signal: controller.signal });
        if (!response.ok) throw new Error('Tips unavailable');
        var body = await response.text();
        if (body.length > 60000) throw new Error('Tips response too large');
        applyFeed(validateFeed(JSON.parse(body)));
      } catch (error) {
        status.textContent = 'Não foi possível carregar o destaque automático. As dicas de referência abaixo continuam disponíveis.';
        retry.hidden = false;
      } finally {
        global.clearTimeout(timer);
        loading = false;
        retry.disabled = false;
      }
    }
    retry.addEventListener('click', load);
    load();
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { validateFeed: validateFeed, saoPauloDate: saoPauloDate, dateLabel: dateLabel, mount: mount };
  if (global.document) {
    if (global.document.readyState === 'loading') global.document.addEventListener('DOMContentLoaded', function () { mount(global.document); }, { once: true });
    else mount(global.document);
  }
})(typeof window !== 'undefined' ? window : globalThis);
