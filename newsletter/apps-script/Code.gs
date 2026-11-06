/**
 * ASF Newsletter — Google Apps Script Web App
 * Database: ASF — Newsletter (controle de inscritas e envios)
 * Run setup() once from the Apps Script editor before deploying.
 */
const SHEET_ID = '1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg';
const SHEET_TAB = 'Inscritas';
const HEADERS = ['created_at', 'email', 'name', 'source', 'consentimento', 'status', 'token', 'updated_at'];

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_TAB);
  if (!sh) sh = ss.insertSheet(SHEET_TAB);
  const lastRow = sh.getLastRow();
  const lastCol = sh.getLastColumn();
  if (lastRow === 0 || lastCol === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    return 'Aba Inscritas preparada com cabeçalhos.';
  }
  const existing = sh.getRange(1, 1, 1, Math.max(lastCol, HEADERS.length)).getValues()[0];
  const matches = HEADERS.every((h, i) => String(existing[i] || '').trim() === h);
  if (!matches) throw new Error('Aba Inscritas já contém dados ou cabeçalhos diferentes. Nenhuma célula foi alterada.');
  return 'Aba Inscritas já está configurada.';
}

function getSheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sh = ss.getSheetByName(SHEET_TAB);
  if (!sh) throw new Error('Aba Inscritas não encontrada. Execute setup() primeiro.');
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function validEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function findRow_(sh, email) {
  const last = sh.getLastRow();
  if (last < 2) return null;
  const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][1] || '').trim().toLowerCase() === email) {
      return { row: i + 2, values: values[i] };
    }
  }
  return null;
}

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot
    const email = String(p.email || '').trim().toLowerCase();
    const name = String(p.nome || p.name || '').trim().slice(0, 120);
    const source = String(p.origem || p.source || 'site').trim().slice(0, 60);
    if (!validEmail_(email)) return json_({ ok: false, error: 'email_invalido' });
    if (String(p.consent || '') !== 'sim') return json_({ ok: false, error: 'consentimento_obrigatorio' });

    const sh = getSheet_();
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const found = findRow_(sh, email);
      if (found && String(found.values[5]) === 'ativa') {
        return json_({ ok: true, status: 'ja_inscrita' });
      }

      const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
      const now = new Date();
      const row = [now, email, name, source, 'sim', 'pendente', token, now];
      if (found) sh.getRange(found.row, 1, 1, HEADERS.length).setValues([row]);
      else sh.appendRow(row);

      const base = ScriptApp.getService().getUrl();
      if (!base) throw new Error('Web App ainda não foi implantado.');
      const confirmUrl = base + '?action=confirm&token=' + encodeURIComponent(token);
      MailApp.sendEmail({
        to: email,
        subject: 'Confirme sua inscrição na Newsletter ASF',
        body: 'Olá! Para confirmar sua inscrição gratuita na Newsletter ASF, acesse: ' + confirmUrl +
          '\n\nSe não foi você, ignore esta mensagem.\n\nASF — Associação de Surf Feminino\nhttps://asf.surf',
        name: 'ASF — Associação de Surf Feminino'
      });
      return json_({ ok: true, status: 'confirmacao_enviada' });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'erro_interno' });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  const token = String(p.token || '');
  const action = String(p.action || '');
  if (!token || !['confirm', 'unsubscribe'].includes(action)) {
    return HtmlService.createHtmlOutput('<p>Link inválido ou expirado.</p>');
  }

  const sh = getSheet_();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const last = sh.getLastRow();
    if (last < 2) return HtmlService.createHtmlOutput('<p>Link inválido ou expirado.</p>');
    const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
    for (let i = 0; i < values.length; i++) {
      if (String(values[i][6] || '') !== token) continue;
      const row = i + 2;
      const currentStatus = String(values[i][5] || '');
      if (action === 'confirm' && currentStatus === 'pendente') {
        sh.getRange(row, 6).setValue('ativa');\n        sh.getRange(row, 8).setValue(new Date());
        return HtmlService.createHtmlOutput('<p>Inscrição confirmada! Bem-vinda à Newsletter ASF.</p>');
      }
      if (action === 'unsubscribe' && currentStatus !== 'cancelada') {
        sh.getRange(row, 6).setValue('cancelada');\n        sh.getRange(row, 8).setValue(new Date());
        return HtmlService.createHtmlOutput('<p>Inscrição cancelada. Você não receberá novos e-mails da ASF.</p>');
      }
      if (action === 'confirm' && currentStatus === 'ativa') {
        return HtmlService.createHtmlOutput('<p>Sua inscrição já está confirmada. Obrigada!</p>');
      }
      if (action === 'unsubscribe' && currentStatus === 'cancelada') {
        return HtmlService.createHtmlOutput('<p>Sua inscrição já estava cancelada.</p>');
      }
    }
    return HtmlService.createHtmlOutput('<p>Link inválido ou expirado.</p>');
  } finally {
    lock.releaseLock();
  }
}
