/** ASF newsletter receiver. Deploy as Web App; execute as owner. */
const SPREADSHEET_ID = '10xygyYPpfDcpPAnHcaALPwFyMviybZC03PkyeXNarww';
const TAB_NAME = 'Página1';
const HEADERS = ['E-mail', 'Data de inscrição (UTC)', 'Consentimento', 'Origem', 'Status'];

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (String(p.website || '').trim()) return json_({ ok: true }); // honeypot
    const email = String(p.email || '').trim().toLowerCase();
    const consent = String(p.consent || '').toLowerCase() === 'true';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) return json_({ ok: false, error: 'invalid_input' });
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(TAB_NAME);
    if (!sheet) throw new Error('Destination tab not found');
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    const last = sheet.getLastRow();
    if (last > 1) {
      const existing = sheet.getRange(2, 1, last - 1, 1).getDisplayValues().flat().map(v => String(v).trim().toLowerCase());
      if (existing.includes(email)) return json_({ ok: true, duplicate: true });
    }
    sheet.appendRow([email, new Date().toISOString(), 'Sim', String(p.source || 'ASF app').slice(0, 120), 'Ativo']);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}
function doGet() { return json_({ service: 'ASF newsletter', ready: true }); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
