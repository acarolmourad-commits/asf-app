// Integration with every first-party script from the actual home. Network blocked.
// JSDOM verifies behavior only, never browser rendering or visual accessibility.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.resolve(__dirname, '..');
const feed = JSON.parse(fs.readFileSync(path.join(root, 'docs/generated/surf-tips.json'), 'utf8'));
// This integration consumes the changing generated feed, so its clock must follow
// that fixture rather than freezing before the next daily selection is published.
const generatedAt = Date.parse(feed.generated_at);
assert.ok(Number.isFinite(generatedAt), 'Generated feed must have a valid timestamp');
async function withHome(now, check) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://asf.review.invalid/', runScripts: 'outside-only', virtualConsole,
    beforeParse(w) {
      const RealDate = w.Date;
      w.Date = class extends RealDate { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } };
      w.fetch = async input => {
        const url = new URL(typeof input === 'string' ? input : input.url, 'https://asf.review.invalid/');
        const file = path.join(root, url.pathname);
        if (url.origin !== 'https://asf.review.invalid' || !file.startsWith(root + '/') || !fs.existsSync(file) || !fs.statSync(file).isFile()) return { ok: false, status: 503, json: async () => ({}), text: async () => '' };
        const text = fs.readFileSync(file, 'utf8');
        return { ok: true, status: 200, json: async () => JSON.parse(text), text: async () => text };
      };
      w.XMLHttpRequest = class { open() { throw Error('XHR intentionally blocked'); } };
      w.navigator.sendBeacon = () => false;
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function () {};
      w.matchMedia = () => ({ matches: false, addListener() {}, addEventListener() {}, removeEventListener() {} });
      w.IntersectionObserver = class { observe() {} disconnect() {} };
    }
  });
  try {
    const scripts = [...dom.window.document.scripts].filter(script => script.type !== 'application/ld+json');
    for (const script of [...scripts.filter(script => !script.defer), ...scripts.filter(script => script.defer)]) {
      let content = script.textContent;
      let filename = 'inline';
      if (script.src) {
        const url = new URL(script.src);
        if (url.origin !== 'https://asf.review.invalid') continue;
        filename = path.join(root, url.pathname);
        if (!fs.existsSync(filename)) continue;
        content = fs.readFileSync(filename, 'utf8');
      }
      vm.runInContext(content, dom.getInternalVMContext(), { filename });
    }
    await new Promise(resolve => setTimeout(resolve, 1600));
    await check(dom.window, dom.window.document);
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
}

test('real app search reveals a matching tip excluded by the current category', async () => {
  await withHome(generatedAt, (w, doc) => {
    assert.equal(doc.getElementById('surf-tips-filters').hidden, false);
    assert.equal(w.normalizedSearchIndex.filter(item => item.sectionId === 'dicas').length, 11);
    for (const query of ['Aparência tranquila', 'leash']) {
      doc.querySelector('[data-tips-category="Treino"]').click();
      assert.notEqual(doc.querySelectorAll('#surf-tips-grid article').length, 10);
      w.handleSearch(query);
      const row = doc.querySelector('#searchResults .search-result-item[data-section-target="dicas"]');
      assert.ok(row, `Missing real search result for ${query}`);
      assert.equal(row.dataset.sectionTarget, 'dicas');
      assert.equal(row.hasAttribute('onclick'), false);
      row.click();
      assert.equal(doc.querySelectorAll('#surf-tips-grid article').length, 10);
      assert.equal(doc.querySelector('[data-tips-category="Todas"]').getAttribute('aria-pressed'), 'true');
    }
  });
});

test('real app keeps reference tips and offers retry for a future-dated feed', async () => {
  await withHome(generatedAt - 24 * 60 * 60 * 1000, (w, doc) => {
    assert.equal(doc.getElementById('surf-tips-filters').hidden, true);
    assert.equal(doc.querySelectorAll('#surf-tips-grid article').length, 3);
    assert.equal(doc.getElementById('surf-tip-title').textContent, 'Comece com orientação');
    assert.match(doc.getElementById('surf-tips-status').textContent, /Não foi possível/);
    assert.equal(doc.getElementById('surf-tips-retry').hidden, false);
    assert.equal(doc.getElementById('surf-tips-retry').disabled, false);
  });
});
