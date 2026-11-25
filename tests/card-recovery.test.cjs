const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('recuperar-carteirinha.html', 'utf8');
const script = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const url = 'https://asf.surf/recuperar-carteirinha.html';
const row = { nome: 'Associada de teste', numero: 'ASF-EXEMPLO2', ativo: true, validade: '2030-12-31' };

async function page(suffix, session, card = row) {
  const dom = new JSDOM(html, { url: url + suffix, runScripts: 'outside-only' });
  const { window } = dom;
  const document = window.document;
  const calls = [];
  window.supabase = { createClient() {
    // The SDK consumes the return URL before getSession resolves.
    window.history.replaceState(null, '', url);
    return {
      auth: {
        async getSession() { return { data: { session } }; },
        async signInWithOtp(payload) { calls.push(payload); return {}; }
      },
      async rpc(...args) { calls.push(args); return { data: card ? [card] : [] }; }
    };
  }};
  window.eval(script);
  await new Promise(resolve => setImmediate(resolve));
  return { document, window, calls };
}

test('a fresh email-return tab recovers the authenticated card without a new issuance', async () => {
  const signed = { user: { email: 'teste@example.invalid' } };
  for (const suffix of ['#access_token=fixture', '?code=fixture']) {
    const { document, calls } = await page(suffix, signed);
    assert.deepEqual(calls, [['recuperar_carteirinha']]);
    assert.equal(document.querySelector('#card').hidden, false);
    assert.equal(document.querySelector('#member-number').textContent, row.numero);
    assert.equal(document.querySelector('#verify-link').href, 'https://asf.surf/verificar.html?numero=' + row.numero);
    assert.equal(document.querySelector('#member-validity').textContent, 'Validade: 31/12/2030');
  }
});

test('ordinary visits and failed links keep the card hidden, including on a previously signed-in device', async () => {
  for (const suffix of ['', '#error=access_denied', '?error=access_denied']) {
    const { document, calls } = await page(suffix, { user: { email: 'teste@example.invalid' } });
    assert.deepEqual(calls, []);
    assert.equal(document.querySelector('#card').hidden, true);
    if (suffix) assert.match(document.querySelector('#status').textContent, /Solicite outro link/);
  }
});

test('a missing session or membership keeps the form available', async () => {
  const noSession = await page('#access_token=fixture', null);
  const noCard = await page('?code=fixture', { user: { email:'teste@example.invalid' } }, null);
  for (const { document } of [noSession, noCard]) {
    assert.equal(document.querySelector('#card').hidden, true);
    assert.equal(document.querySelector('#recover-form').hidden, false);
    assert.equal(document.querySelector('#status').className, 'error');
  }
});

test('requesting a link calls the provider once with the supplied email', async () => {
  const { window, document, calls } = await page('', null);
  document.querySelector('#email').value = 'Teste@example.invalid';
  document.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(calls.length, 1);
  assert.equal(calls[0].email, 'teste@example.invalid');
  assert.equal(calls[0].options.emailRedirectTo, url);
});
