/**
 * ASF Newsletter - inscricoes + envio semanal automatico.
 * Fonte de verdade: Google Sheets (Inscritas, Envios, Conteudo, Config).
 * Distribuicao: 1x por semana, somente com envio_ativado=sim na Config.
 */
const ASF_SPREADSHEET_ID = '1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg';
const ASF_TABS = { subs: 'Inscritas', sends: 'Envios', content: 'Conteudo', config: 'Config' };

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};
    if (String(p.website || '').trim()) return json_({ ok: true }); // honeypot anti-spam
    const email = String(p.email || '').trim().toLowerCase();
    const consent = String(p.consent || '').toLowerCase() === 'true';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) return json_({ ok: false, error: 'invalid_input' });
    const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
    const sheet = ss.getSheetByName(ASF_TABS.subs);
    if (!sheet) throw new Error('Aba Inscritas nao encontrada');
    const now = new Date().toISOString();
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (String(rows[i][1] || '').trim().toLowerCase() === email) {
        sheet.getRange(i + 1, 6).setValue('ativo');
        sheet.getRange(i + 1, 8).setValue(now);
        return json_({ ok: true, duplicate: true, reactivated: true });
      }
    }
    const token = Utilities.getUuid().replace(/-/g, '');
    sheet.appendRow([now, email, String(p.name || '').slice(0, 80), String(p.source || 'ASF app newsletter').slice(0, 120), 'sim', 'ativo', token, now]);
    return json_({ ok: true });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'server_error' });
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'unsubscribe') return unsubscribe_(p.email, p.token);
  return json_({ service: 'ASF newsletter', ready: true, version: '2026-11-05' });
}

function unsubscribe_(emailRaw, token) {
  const email = String(emailRaw || '').trim().toLowerCase();
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  const sheet = ss.getSheetByName(ASF_TABS.subs);
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][1] || '').trim().toLowerCase() === email && String(rows[i][6] || '') === String(token || '')) {
      sheet.getRange(i + 1, 6).setValue('cancelado');
      sheet.getRange(i + 1, 8).setValue(new Date().toISOString());
      return HtmlService.createHtmlOutput('<h2>Inscricao cancelada</h2><p>Voce nao recebera mais a newsletter da ASF.</p>');
    }
  }
  return HtmlService.createHtmlOutput('<h2>Link invalido</h2><p>Este link de cancelamento nao foi reconhecido.</p>');
}

function config_() {
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  const values = ss.getSheetByName(ASF_TABS.config).getDataRange().getValues();
  const cfg = {};
  for (let i = 1; i < values.length; i++) cfg[String(values[i][0] || '')] = String(values[i][1] || '');
  return cfg;
}

function isoWeekId_(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return d.getUTCFullYear() + '-W' + String(week).padStart(2, '0');
}

function approvedContent_(week) {
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  const rows = ss.getSheetByName(ASF_TABS.content).getDataRange().getValues();
  const items = [];
  for (let i = 1; i < rows.length; i++) {
    const ok = ['sim', 'true', 'yes', '1'].indexOf(String(rows[i][5] || '').trim().toLowerCase()) >= 0;
    if (String(rows[i][0] || '') === week && ok) {
      items.push({ category: rows[i][1], title: rows[i][2], summary: rows[i][3], link: rows[i][4], order: Number(rows[i][6] || 99) });
    }
  }
  return items.sort((a, b) => a.order - b.order);
}

function recipients_() {
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  const rows = ss.getSheetByName(ASF_TABS.subs).getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][5] || '').toLowerCase() === 'ativo' && String(rows[i][4] || '').toLowerCase() === 'sim') {
      out.push({ email: String(rows[i][1]).trim().toLowerCase(), token: String(rows[i][6] || '') });
    }
  }
  return out;
}

function sentKeys_() {
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  const rows = ss.getSheetByName(ASF_TABS.sends).getDataRange().getValues();
  const set = {};
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][4] || '') === 'enviado') set[String(rows[i][0]) + '|' + String(rows[i][2]).toLowerCase()] = true;
  }
  return set;
}

function logSend_(week, email, subject, status, mode, error) {
  const ss = SpreadsheetApp.openById(ASF_SPREADSHEET_ID);
  ss.getSheetByName(ASF_TABS.sends).appendRow([week, new Date().toISOString(), email, subject, status, mode, error || '']);
}

function buildEmail_(cfg, week, items, unsubscribeUrl) {
  const base = cfg.url_base || 'https://asf.surf';
  let text = 'ASF - Novidades da semana (' + week + ')\n\n';
  let html = '<div style="font-family:Arial,sans-serif;color:#0E2439;line-height:1.6"><h1>ASF - Novidades da semana</h1>';
  items.forEach(it => {
    text += '[' + it.category + '] ' + it.title + '\n' + it.summary + '\n' + it.link + '\n\n';
    html += '<h2 style="font-size:18px">' + escapeHtml_(it.title) + '</h2><p><strong>' + escapeHtml_(it.category) + '</strong></p><p>' + escapeHtml_(it.summary) + '</p><p><a href="' + it.link + '">Abrir</a></p>';
  });
  text += 'Cancelar inscricao: ' + unsubscribeUrl + '\nASF - ' + base;
  html += '<hr><p style="font-size:12px">Voce recebe porque se inscreveu na newsletter da ASF. <a href="' + unsubscribeUrl + '">Cancelar inscricao</a>.</p></div>';
  return { text, html };
}

function sendWeeklyNewsletter() {
  const cfg = config_();
  const week = isoWeekId_(new Date());
  const subject = (cfg.assunto_padrao || 'ASF - Novidades da semana') + ' - ' + week;
  if (String(cfg.envio_ativado || '').toLowerCase() !== 'sim') { console.log('envio_ativado nao esta sim'); return; }
  const items = approvedContent_(week);
  if (!items.length) { logSend_(week, '', subject, 'sem_conteudo', 'automatico', ''); return; }
  const recipients = recipients_();
  if (!recipients.length) { logSend_(week, '', subject, 'sem_inscritas', 'automatico', ''); return; }
  const sent = sentKeys_();
  const endpoint = cfg.apps_script_url || ScriptApp.getService().getUrl();
  recipients.forEach(r => {
    if (sent[week + '|' + r.email]) return;
    const unsub = endpoint + '?action=unsubscribe&email=' + encodeURIComponent(r.email) + '&token=' + encodeURIComponent(r.token);
    const built = buildEmail_(cfg, week, items, unsub);
    try {
      MailApp.sendEmail({ to: r.email, subject: subject, body: built.text, htmlBody: built.html, name: cfg.remetente_nome || 'ASF' });
      logSend_(week, r.email, subject, 'enviado', 'automatico', '');
    } catch (err) {
      logSend_(week, r.email, subject, 'erro', 'automatico', String(err));
    }
  });
}

function sendTestNewsletter() {
  const cfg = config_();
  let week = isoWeekId_(new Date());
  let items = approvedContent_(week);
  if (!items.length) { // usa a proxima semana com conteudo aprovado, util para testar antes de segunda
    const next = new Date(); next.setDate(next.getDate() + 7);
    week = isoWeekId_(next); items = approvedContent_(week);
  }
  if (!items.length) throw new Error('Sem conteudo aprovado na semana atual/proxima para testar');
  const to = cfg.remetente_email || Session.getActiveUser().getEmail();
  const endpoint = cfg.apps_script_url || ScriptApp.getService().getUrl();
  const built = buildEmail_(cfg, week, items, endpoint + '?action=unsubscribe&email=' + encodeURIComponent(to) + '&token=teste');
  const subject = '[TESTE] ' + (cfg.assunto_padrao || 'ASF - Novidades da semana') + ' - ' + week;
  MailApp.sendEmail({ to: to, subject: subject, body: built.text, htmlBody: built.html, name: cfg.remetente_nome || 'ASF' });
  logSend_(week, to, subject, 'teste', 'teste', '');
}

function createWeeklyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'sendWeeklyNewsletter').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('sendWeeklyNewsletter').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(9).inTimezone('America/Sao_Paulo').create();
}

function removeWeeklyTriggers() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'sendWeeklyNewsletter').forEach(t => ScriptApp.deleteTrigger(t));
}

function escapeHtml_(s) { return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
