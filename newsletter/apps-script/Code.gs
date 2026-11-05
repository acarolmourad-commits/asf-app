/**
 * ASF Newsletter - endpoint gratuito de inscricao (Google Apps Script).
 * Planilha: ASF - Newsletter (controle de inscritas e envios)
 * Passos: Extensoes > Apps Script > colar este codigo > Implantar > Web app
 * Executar como: eu | Acesso: qualquer pessoa. Copie a URL /exec para
 * newsletter/config.js (ASF_NEWSLETTER_ENDPOINT) e para a aba Config.
 */
const SHEET_ID = '1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg';
const TAB = 'Inscritas';

function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(TAB);
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function validEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
function findRow_(sh, email) {
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][1]).trim().toLowerCase() === email) return { row: i + 1, values: values[i] };
  }
  return null;
}
function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot anti-spam
    const email = String(p.email || '').trim().toLowerCase();
    const nome = String(p.nome || '').slice(0, 120);
    const origem = String(p.origem || 'home').slice(0, 60);
    if (!validEmail_(email)) return json_({ ok: false, error: 'email_invalido' });
    if (p.consent !== 'sim') return json_({ ok: false, error: 'sem_consentimento' });
    const sh = sheet_();
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const found = findRow_(sh, email);
      if (found && found.values[5] === 'ativa') return json_({ ok: true, status: 'ja_inscrita' });
      const token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
      const now = new Date();
      if (found) {
        sh.getRange(found.row, 1, 1, 8).setValues([[now, email, nome, origem, 'sim', 'pendente', token, now]]);
      } else {
        sh.appendRow([now, email, nome, origem, 'sim', 'pendente', token, now]);
      }
      const base = ScriptApp.getService().getUrl();
      const confirmUrl = base + '?action=confirm&token=' + token;
      MailApp.sendEmail(email, 'Confirme sua inscrição na Newsletter ASF',
        'Olá! Para confirmar sua inscrição gratuita na Newsletter ASF, acesse:\n\n' + confirmUrl + '\n\nSe não foi você, ignore este e-mail.\n\nASF — Associação de Surf Feminino\nhttps://asf.surf');
      return json_({ ok: true, status: 'confirmacao_enviada' });
    } finally { lock.releaseLock(); }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}
function doGet(e) {
  const p = (e && e.parameter) || {};
  const token = String(p.token || '');
  const action = String(p.action || '');
  const sh = sheet_();
  const values = sh.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][6]) === token && token) {
      if (action === 'confirm') sh.getRange(i + 1, 6, 1, 2).setValues([['ativa', new Date()]]);
      if (action === 'unsubscribe') sh.getRange(i + 1, 6, 1, 2).setValues([['cancelada', new Date()]]);
      const msg = action === 'confirm' ? 'Inscrição confirmada. Bem-vinda à Newsletter ASF!' : 'Inscrição cancelada. Você não receberá mais a Newsletter ASF.';
      return HtmlService.createHtmlOutput('<meta charset="utf-8"><p style="font-family:Arial;padding:24px">' + msg + ' <a href="https://asf.surf">Voltar à ASF</a></p>');
    }
  }
  return HtmlService.createHtmlOutput('<meta charset="utf-8"><p style="font-family:Arial;padding:24px">Link inválido ou expirado.</p>');
}
