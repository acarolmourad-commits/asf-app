// Offline DOM/event checks, not rendering, native keyboard defaults or touch.
// Run: NODE_PATH=<jsdom installation>/node_modules node --test tests/navigation-dom.test.cjs
// Layout is simulated here; navigation-browser.cjs checks real browser hit targets.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = process.env.ASF_ROOT || path.resolve(__dirname, '..');
const expected = ['Comece aqui', 'Explore o mar', 'Treine e evolua', 'Comunidade', 'ASF e benefícios'];

test('grouped navigation with the real local homepage scripts', async t => {
  const errors = [];
  const observers = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => errors.push(e.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://asf.review.invalid/', runScripts: 'outside-only', virtualConsole: vc,
    beforeParse(w) {
      const NativeObserver = w.MutationObserver;
      w.MutationObserver = class {
        constructor(callback) {
          let deliveries = 0;
          this.observer = new NativeObserver(records => {
            if (++deliveries > 250) {
              this.observer.disconnect();
              errors.push('MutationObserver exceeded its delivery limit');
              return;
            }
            callback(records);
          });
          observers.push(this.observer);
        }
        observe(...args) { this.observer.observe(...args); }
        disconnect() { this.observer.disconnect(); }
      };
      w.fetch = async input => {
        const url = new URL(typeof input === 'string' ? input : input.url, 'https://asf.review.invalid/');
        const file = path.join(root, url.pathname);
        if (url.origin !== 'https://asf.review.invalid' || !file.startsWith(root + '/') || !fs.existsSync(file) || !fs.statSync(file).isFile())
          return {ok:false,status:503,json:async()=>({}),text:async()=>''};
        const text = fs.readFileSync(file, 'utf8');
        return {ok:true,status:200,json:async()=>JSON.parse(text),text:async()=>text};
      };
      w.XMLHttpRequest = class {open(){throw Error('XHR blocked for offline review');}};
      w.navigator.sendBeacon = () => false;
      w.scrollTo = () => {};
      w.HTMLElement.prototype.scrollIntoView = function() {};
      // jsdom has no layout: explicitly model only item eligibility for focus.
      w.HTMLElement.prototype.getClientRects = function() {
        const panel = this.closest('#asf-sat-nav-panel');
        if (panel) return panel.style.display === 'block' ? [{width:100,height:44}] : [];
        const menu = this.closest('#header-menu');
        return menu && menu.classList.contains('open') && !this.hidden ? [{width:100,height:44}] : [];
      };
      w.matchMedia = () => ({matches:false,addListener(){},addEventListener(){},removeEventListener(){}});
      w.IntersectionObserver = class {observe(){} disconnect(){}};
    }
  });
  const w = dom.window, d = w.document;
  const tick = () => new Promise(resolve => setTimeout(resolve, 15));
  try {
    const scripts = [...d.scripts].filter(s => s.type !== 'application/ld+json');
    for (const script of [...scripts.filter(s=>!s.defer), ...scripts.filter(s=>s.defer)]) {
      let content = script.textContent, filename = 'inline';
      if (script.src) {
        const url = new URL(script.src);
        if (url.origin !== 'https://asf.review.invalid') continue;
        filename = path.join(root, url.pathname);
        if (!fs.existsSync(filename)) continue;
        content = fs.readFileSync(filename, 'utf8');
      }
      vm.runInContext(content, dom.getInternalVMContext(), {filename});
    }
    await new Promise(resolve => setTimeout(resolve, 1700));
    const menu = d.getElementById('header-menu'), toggle = d.getElementById('menu-toggle');
    const items = [...menu.querySelectorAll('.menu-item')];
    const key = (target, value) => {
      const event = new w.KeyboardEvent('keydown', {key:value,bubbles:true,cancelable:true});
      target.dispatchEvent(event); return event;
    };
    const state = open => {
      assert.equal(menu.classList.contains('open'), open);
      assert.equal(menu.getAttribute('aria-hidden'), String(!open));
      assert.equal(toggle.getAttribute('aria-expanded'), String(open));
      assert.equal(toggle.getAttribute('aria-label'), open ? 'Fechar menu' : 'Abrir menu');
    };
    await t.test('all local scripts initialize without errors and keep the five groups', () => {
      assert.deepEqual(errors, []);
      assert.deepEqual([...menu.querySelectorAll('.asf-menu-group')].map(g=>g.getAttribute('aria-label')), expected);
      assert.equal(items.length, 23);
      assert.equal(menu.querySelectorAll('[role="menuitem"]').length, 0);
      assert.equal(menu.hasAttribute('role'), false);
      assert.equal(menu.parentElement, d.body, 'legacy relocation to body is retained');
    });
    await t.test('opening moves focus to the first button and updates ARIA', async () => {
      state(false); toggle.click(); await tick(); state(true);
      assert.equal(d.activeElement, items[0]);
    });
    await t.test('Down/Up cross every group and wrap at both ends', () => {
      for (let i=1;i<=23;i++) {
        assert.equal(key(d.activeElement, 'ArrowDown').defaultPrevented, true);
        assert.equal(d.activeElement, items[i%23]);
      }
      for (let i=22;i>=0;i--) {
        key(d.activeElement, 'ArrowUp'); assert.equal(d.activeElement, items[i]);
      }
    });
    await t.test('Home and End address the whole navigation and Tab is not trapped', () => {
      key(d.activeElement, 'End'); assert.equal(d.activeElement, items[22]);
      assert.equal(key(d.activeElement, 'Tab').defaultPrevented, false);
      key(d.activeElement, 'Home'); assert.equal(d.activeElement, items[0]);
      assert.equal(items.every(item=>item.tabIndex===0), true);
    });
    await t.test('Escape closes before the legacy handler and restores toggle focus', async () => {
      assert.equal(key(d.activeElement, 'Escape').defaultPrevented, true);
      await tick(); state(false); assert.equal(d.activeElement, toggle);
      toggle.click(); await tick(); d.body.focus(); key(d, 'Escape');
      await tick(); state(false); assert.equal(d.activeElement, toggle);
    });
    await t.test('toggle and outside click close; scrolling keeps navigation usable', async () => {
      toggle.click(); await tick(); state(true);
      toggle.click(); await tick(); state(false);
      toggle.click(); await tick(); d.body.click(); await tick(); state(false);
      toggle.click(); await tick(); w.dispatchEvent(new w.Event('scroll')); await tick(); state(true);
      key(d, 'Escape'); await tick(); state(false);
    });
    await t.test('internal action still opens the requested section and closes the menu', async () => {
      toggle.click(); await tick();
      const section = d.getElementById('dicas'); const disclosure = section.closest('details');
      if (disclosure) disclosure.open=false;
      items[0].click(); await tick(); state(false);
      if (disclosure) assert.equal(disclosure.open, true);
      assert.deepEqual(errors, []);
    });
    await t.test('all 16 internal menu destinations exist', () => {
      for (const id of ['dicas','conteudo','surf-culture','surfer-profile','praias','surf-news',
        'mobilidade','metas','desafios','utilities','seguranca','comunidade',
        'assinantes','assistente','carteirinha','premium']) {
        assert.ok(d.getElementById(id), id);
      }
    });
    await t.test('all competition shortcuts target the dedicated Events app', () => {
      const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
      assert.equal((html.match(/location.href='https:\/\/eventos.asf.surf\/'/g) || []).length, 3);
      assert.doesNotMatch(html, /showSection\('competicoes'\)/);
      assert.equal(d.querySelector('#eventos-cta a').href, 'https://eventos.asf.surf/');
    });
    await t.test('network opens repeatedly without an observer loop and restores gallery state', async () => {
      const button = d.getElementById('asf-sat-nav');
      const panel = d.getElementById('asf-sat-nav-panel');
      const backdrop = d.getElementById('asf-sat-nav-backdrop');
      const gallery = d.querySelector('#asf-galeria-btn a');
      gallery.setAttribute('aria-hidden', 'false');
      gallery.setAttribute('tabindex', '0');
      for (let iteration = 0; iteration < 3; iteration++) {
        button.click(); await tick();
        assert.equal(button.getAttribute('aria-expanded'), 'true');
        assert.equal(panel.style.display, 'block');
        assert.equal(gallery.style.visibility, 'hidden');
        assert.equal(gallery.getAttribute('aria-hidden'), 'true');
        assert.equal(gallery.tabIndex, -1);
        assert.ok(panel.contains(d.activeElement));
        if (iteration === 1) key(d.activeElement, 'Escape');
        else backdrop.click();
        await tick();
        assert.equal(button.getAttribute('aria-expanded'), 'false');
        assert.equal(panel.style.display, 'none');
        assert.equal(gallery.style.visibility, '');
        assert.equal(gallery.getAttribute('aria-hidden'), 'false');
        assert.equal(gallery.getAttribute('tabindex'), '0');
        assert.equal(d.activeElement, button);
      }
      assert.deepEqual(errors, []);
    });
    await t.test('network keyboard focus wraps within the dialog', async () => {
      const button = d.getElementById('asf-sat-nav');
      const panel = d.getElementById('asf-sat-nav-panel');
      button.click(); await tick();
      const controls = [...panel.querySelectorAll('button, a[href]')];
      const first = controls[0], last = controls.at(-1);
      last.focus(); assert.equal(key(last, 'Tab').defaultPrevented, true);
      assert.equal(d.activeElement, first);
      first.dispatchEvent(new w.KeyboardEvent('keydown', {key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));
      assert.equal(d.activeElement, last);
      key(last, 'Escape'); await tick();
      assert.equal(d.activeElement, button);
    });
    await t.test('fixed footer retains all five routes and gallery retains its destination', () => {
      assert.deepEqual([...d.querySelectorAll('.asf-bottom-nav a')].map(a=>new URL(a.href).pathname),
        ['/index.html','/previsao-surf/','/mural/','/diario/','/carteirinhas.html']);
      assert.equal(d.querySelector('#asf-galeria-btn a').href, 'https://galeria.asf.surf/');
      assert.deepEqual(errors, []);
    });
  } finally {observers.forEach(observer=>observer.disconnect()); w.close();}
});
