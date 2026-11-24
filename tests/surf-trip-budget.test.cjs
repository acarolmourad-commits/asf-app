const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const test = require('node:test');
const { createContext, runInContext } = require('node:vm');

const html = readFileSync(join(__dirname, '../surf-trip/index.html'), 'utf8');

function loadPlanner() {
  const elements = new Map();
  const listeners = new Map();
  for (const [, tag, attrs] of html.matchAll(/<([\w-]+)\b([^>]*\bid="[^"]*"[^>]*)>/g)) {
    const [, id] = attrs.match(/\bid="([^"]+)"/);
    assert.ok(!elements.has(id), `duplicate id: ${id}`);
    elements.set(id, {
      value: attrs.match(/\bvalue="([^"]*)"/)?.[1] ??
        (tag === 'select' ? html.match(/<select\s+id="fDest"[^>]*>\s*<option\s+value="([^"]+)"/)?.[1] : ''),
      style: { display: attrs.match(/(?:style="|;)\s*display:([^;"]+)/)?.[1] || '' },
      textContent: '',
      addEventListener(type, fn) { listeners.set(`${id}:${type}`, fn); },
    });
  }
  const [, handler] = html.match(/<button\b[^>]*\bonclick="([^"]+)">\s*Calcular orçamento/);
  const [, script] = html.match(/<script>([\s\S]*?)<\/script>/);
  const context = createContext({
    document: { getElementById: id => elements.get(id) ?? null },
    localStorage: { getItem: () => null },
  });
  runInContext(script, context);
  return {
    get: id => elements.get(id),
    click: () => runInContext(handler, context),
    change: id => listeners.get(`${id}:change`)(),
  };
}

test('Calcular orçamento reveals every default result', () => {
  const { get, click } = loadPlanner();
  assert.equal(get('res').style.display, 'none');

  click();

  assert.equal(get('res').style.display, 'block');
  assert.equal(get('rGas').textContent, 'R$ 19');
  assert.equal(get('rHosp').textContent, 'R$ 80');
  assert.equal(get('rFood').textContent, 'R$ 140');
  assert.equal(get('rPed').textContent, 'R$ 6');
  assert.equal(get('rTotal').textContent, 'Total: R$ 245');
  assert.equal(get('rPP').textContent, 'R$ 245 por pessoa');
});

test('a second click refreshes the visible total after input changes', () => {
  const { get, click, change } = loadPlanner();
  click();
  get('fDias').value = '3';
  click();
  assert.equal(get('res').style.display, 'block');
  assert.equal(get('rTotal').textContent, 'Total: R$ 395');
  assert.equal(get('rPP').textContent, 'R$ 395 por pessoa');

  get('fDest').value = '0';
  change('fDest');
  assert.equal(get('customKm').style.display, 'block');
  get('fKm').value = '240';
  get('fPessoas').value = '2';
  click();
  assert.equal(get('rGas').textContent, 'R$ 58');
  assert.equal(get('rPed').textContent, 'R$ 12');
  assert.equal(get('rTotal').textContent, 'Total: R$ 440');
  assert.equal(get('rPP').textContent, 'R$ 440 por pessoa');
  assert.equal(get('res').style.display, 'block');
});
