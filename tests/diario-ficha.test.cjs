const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');

const key = 'asf-diario-surf';
const draftKey = 'asf-ficha-para-diario';
function openPage(path, setup = () => {}, hash = '') {
  const html = readFileSync(join(__dirname, '..', path, 'index.html'), 'utf8');
  return new JSDOM(html, {
    url: 'https://asf.surf/' + path + '/' + hash,
    runScripts: 'dangerously',
    virtualConsole: new VirtualConsole(),
    beforeParse: setup
  }).window;
}

test('abrir uma ficha preenchida traz as notas uma vez e só salva após confirmação', () => {
  const sheet = openPage('guias/boletim-das-ondas');
  const transfer = sheet.document.querySelector('#transferir-ficha');
  transfer.click();
  assert.match(sheet.document.querySelector('#aviso-ficha').textContent, /Preencha/);
  const fields = sheet.document.querySelectorAll('.ficha-campos input, .ficha-campos textarea');
  fields[0].value = 'Santos';
  fields[3].value = 'Notas <em>literais</em> em duas\nlinhas';
  transfer.click();
  const draft = sheet.sessionStorage.getItem(draftKey);
  const diary = openPage('diario', w => w.sessionStorage.setItem(draftKey, draft), '#da-ficha');
  assert.equal(diary.sessionStorage.getItem(draftKey), null);
  assert.equal(diary.localStorage.getItem(key), null);
  assert.match(diary.document.querySelector('#fNotas').value, /Praia e ponto de referência: Santos/);
  const duration = diary.document.querySelector('#fDur');
  duration.value = '2';
  diary.document.querySelector('[type=submit]').click();
  assert.equal(diary.localStorage.getItem(key), null);
  duration.value = '45';
  diary.document.querySelector('[type=submit]').click();
  assert.equal(JSON.parse(diary.localStorage.getItem(key))[0].dur, 45);
  assert.equal(diary.document.querySelector('#entries em'), null);
  assert.match(diary.document.querySelector('#entries').textContent, /Notas <em>literais<\/em>/);
  sheet.close(); diary.close();
});

test('excluir uma sessão fora de ordem mantém o outro registro legado', () => {
  const entries = ['2026-11-12','2026-11-20'].map(data => ({data, praia:'Ubatuba', dur:50, mar:'Pequeno', notas:data}));
  const diary = openPage('diario', w => w.localStorage.setItem(key, JSON.stringify(entries)));
  const button = diary.document.querySelector('.entry button');
  assert.match(button.getAttribute('aria-label'), /20\/11\/2026/);
  diary.confirm = () => false;
  button.click();
  assert.equal(JSON.parse(diary.localStorage.getItem(key)).length, 2);
  diary.confirm = () => true;
  button.click();
  assert.deepEqual(JSON.parse(diary.localStorage.getItem(key)), [entries[0]]);
  diary.close();
});

test('mudança em outra aba e histórico ilegível preservam o conteúdo existente', () => {
  const e = {data:'2026-11-12', praia:'Ubatuba', dur:50, mar:'Pequeno', notas:'Antigo'};
  const diary = openPage('diario', w => w.localStorage.setItem(key, JSON.stringify([e])));
  diary.confirm = () => true;
  diary.localStorage.setItem(key, JSON.stringify([e, {...e, notas:'Outra aba'}]));
  diary.document.querySelector('.entry button').click();
  assert.equal(JSON.parse(diary.localStorage.getItem(key)).length, 2);
  diary.localStorage.setItem(key, 'histórico ilegível');
  diary.document.querySelector('#fNotas').value = 'manter no campo';
  diary.document.querySelector('[type=submit]').click();
  assert.equal(diary.localStorage.getItem(key),'histórico ilegível');
  assert.equal(diary.document.querySelector('#fNotas').value,'manter no campo');
  diary.close();
});

test('histórico permite rever e excluir sessões anteriores às dez mais recentes', () => {
  const entries = Array.from({ length: 12 }, (_, i) => ({
    data: '2026-11-' + String(i + 1).padStart(2, '0'),
    praia: 'Maresias', dur: 45, mar: 'Pequeno', notas: 'Aula ' + (i + 1)
  }));
  const diary = openPage('diario', w => w.localStorage.setItem(key, JSON.stringify(entries)));
  const doc = diary.document;
  const archive = doc.querySelector('#sessoes-anteriores');
  assert.equal(doc.querySelectorAll('#entries .entry').length, 10);
  assert.equal(archive.hidden, false);
  assert.equal(archive.open, false);
  archive.querySelector('summary').click();
  assert.deepEqual([...archive.querySelectorAll('.meta')].map(el => el.textContent.split(' • ').pop()), ['Aula 2', 'Aula 1']);
  diary.confirm = () => true;
  archive.querySelector('button').click();
  assert.equal(archive.open, true);
  assert.match(archive.textContent, /Aula 1/);
  archive.querySelector('button').click();
  assert.equal(archive.hidden, true);
  assert.deepEqual(JSON.parse(diary.localStorage.getItem(key)), entries.slice(2));
  diary.close();
});
