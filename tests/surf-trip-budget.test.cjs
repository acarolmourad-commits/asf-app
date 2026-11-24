const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const html = readFileSync(join(__dirname, '../surf-trip/index.html'), 'utf8');

function loadPlanner(t, beforeParse) {
  const dom = new JSDOM(html, { url: 'https://asf.surf/surf-trip/', runScripts: 'dangerously', beforeParse });
  t.after(() => dom.window.close());
  const document = dom.window.document;
  const get = id => document.getElementById(id);
  function set(id, value) {
    get(id).value = value;
    get(id).dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  }
  const submit = () => document.querySelector('button[type="submit"]').click();
  const value = id => get(id).textContent.replace(/\s/g, ' ');
  return { get, set, submit, value, document, window: dom.window };
}

test('default trip displays the group total and each traveler’s share', t => {
  const { get, submit, value } = loadPlanner(t);
  assert.equal(get('res').hidden, true);
  submit();
  assert.equal(get('res').hidden, false);
  assert.equal(value('rGas'), 'R$ 19,33');
  assert.equal(value('rPed'), 'R$ 6,00');
  assert.equal(value('rFood'), 'R$ 140,00');
  assert.equal(value('rHosp'), 'R$ 80,00');
  assert.equal(value('rPP'), 'R$ 245,33');
  assert.equal(value('rTotal'), 'R$ 981,33');
});

test('a day trip has no lodging and adding a night restores the chosen rate', t => {
  const { get, set, submit, value } = loadPlanner(t);
  set('fDest', '0');
  assert.equal(get('fKm').disabled, false);
  set('fKm', '240');
  set('fPessoas', '2');
  set('fHosp', '25.50');
  set('fDias', '1');
  assert.equal(get('fHosp').disabled, true);
  submit();
  assert.equal(value('rHosp'), 'R$ 0,00');
  assert.equal(value('rGas'), 'R$ 58,00');
  assert.equal(value('rPed'), 'R$ 12,00');
  assert.equal(value('rPP'), 'R$ 140,00');
  assert.equal(value('rTotal'), 'R$ 280,00');
  set('fDias', '3');
  assert.equal(get('res').hidden, true);
  assert.equal(get('fHosp').disabled, false);
  submit();
  assert.equal(value('rHosp'), 'R$ 51,00');
  assert.equal(value('rPP'), 'R$ 331,00');
  assert.equal(value('rTotal'), 'R$ 662,00');
});

test('invalid edits hide the previous estimate and hidden distance never blocks a preset', t => {
  const { get, set, submit } = loadPlanner(t);
  submit();
  set('fPessoas', '0');
  submit();
  assert.equal(get('res').hidden, true);
  set('fPessoas', '2');
  set('fDest', '0');
  set('fKm', '-1');
  submit();
  assert.equal(get('res').hidden, true);
  set('fDest', '160');
  assert.equal(get('fKm').disabled, true);
  submit();
  assert.equal(get('res').hidden, false);
  set('fFood', '');
  submit();
  assert.equal(get('res').hidden, true);
});

test('trip checklist restores previous records and keeps keyboard focus after checking an item', t => {
  const { document, get, window } = loadPlanner(t, w => {
    w.localStorage.setItem('asf-trip-checklist', '{"2":true}');
  });
  const boxes = document.querySelectorAll('#checks input');
  assert.equal(boxes.length, 11);
  assert.equal(boxes[2].checked, true);
  boxes[3].focus();
  boxes[3].click();
  assert.equal(document.activeElement, boxes[3]);
  assert.equal(get('bar').value, 2);
  assert.deepEqual(JSON.parse(window.localStorage.getItem('asf-trip-checklist')), { 2: true, 3: true });
  window.localStorage.clear();
  window.dispatchEvent(new window.StorageEvent('storage', { key: null }));
  assert.equal(get('bar').value, 0);
  assert.equal(boxes[2].checked, false);
});

test('unreadable saved JSON leaves the list usable and can be replaced by a valid selection', t => {
  const { document, get, window } = loadPlanner(t, w => {
    w.localStorage.setItem('asf-trip-checklist', '{');
  });
  document.querySelector('#checks input').click();
  assert.equal(get('bar').value, 1);
  assert.deepEqual(JSON.parse(window.localStorage.getItem('asf-trip-checklist')), { 0: true });
});

test('after a storage failure, the next successful save retains both selections', t => {
  let available = false;
  const { document, get, window } = loadPlanner(t, w => {
    const original = w.Storage.prototype.setItem;
    w.Storage.prototype.setItem = function (key, val) {
      if (!available) throw new Error('Unavailable');
      original.call(this, key, val);
    };
  });
  const boxes = document.querySelectorAll('#checks input');
  boxes[0].click();
  assert.equal(get('bar').value, 1);
  assert.match(get('salvamento').textContent, /nesta aba/);
  available = true;
  boxes[1].click();
  assert.deepEqual(JSON.parse(window.localStorage.getItem('asf-trip-checklist')), { 0: true, 1: true });
});

test('blocked storage access keeps the checklist available in the current tab', t => {
  const { document, get } = loadPlanner(t, w => {
    Object.defineProperty(w, 'localStorage', { get() { throw new Error('Storage blocked'); } });
  });
  document.querySelector('#checks input').click();
  assert.equal(get('bar').value, 1);
  assert.match(get('salvamento').textContent, /nesta aba/);
});
