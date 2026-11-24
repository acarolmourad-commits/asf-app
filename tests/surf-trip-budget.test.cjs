const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const html = readFileSync(join(__dirname, '../surf-trip/index.html'), 'utf8');

function loadPlanner(t) {
  const dom = new JSDOM(html, { url: 'https://asf.surf/surf-trip/', runScripts: 'dangerously' });
  t.after(() => dom.window.close());
  const document = dom.window.document;
  const get = id => document.getElementById(id);
  function set(id, value) {
    get(id).value = value;
    get(id).dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  }
  const submit = () => document.querySelector('button[type="submit"]').click();
  const value = id => get(id).textContent.replace(/\s/g, ' ');
  return { get, set, submit, value };
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
