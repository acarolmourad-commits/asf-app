/*
=====================================
ASF CARTEIRINHAS - Registro de Associadas
=====================================
Controle de quem criou carteirinha no app ASF.

PASSO 1: No Google Sheets, crie (ou deixe o script criar) a aba "Carteirinhas"
PASSO 2: Extensoes > Apps Script > cole este codigo
PASSO 3: Troque TOKEN_ABAIXO por um segredo seu
PASSO 4: Deploy > Novo app web (Executar como: voce; Acesso: Anyone)
PASSO 5: Copie a Deployment URL e cole em:
         - carteirinha.js  -> ASF_CARD.REGISTRY_URL
         - carteirinhas.html -> REGISTRY_URL
*/

var TOKEN = 'TROQUE-POR-UM-SEGREDO'; // senha do painel de controle
var ABA = 'Carteirinhas';

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(ABA);
  if (!sh) {
    sh = ss.insertSheet(ABA);
    sh.appendRow(['Data_Hora', 'Numero', 'Nome', 'Apelido', 'Nivel', 'Praia', 'Cidade', 'Instagram']);
  }
  return sh;
}

// Recebe registro do app (opt-in da usuaria)
function doPost(e) {
  var sh = sheet_();
  var p = e.parameter;
  var numero = (p.numero || '').trim();
  if (!numero) {
    return ContentService.createTextOutput(JSON.stringify({status:'ERRO', message:'numero obrigatorio'}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // upsert: se o numero ja existe, atualiza a linha
  var vals = sh.getDataRange().getValues();
  for (var i = 1; i < vals.length; i++) {
    if (vals[i][1] === numero) {
      sh.getRange(i+1, 1, 1, 8).setValues([[
        Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd HH:mm:ss'),
        numero, p.nome || '', p.apelido || '', p.nivel || '', p.praia || '', p.cidade || '', p.insta || ''
      ]]);
      return ContentService.createTextOutput(JSON.stringify({status:'OK', acao:'atualizado'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  sh.appendRow([
    Utilities.formatDate(new Date(), 'GMT-3', 'yyyy-MM-dd HH:mm:ss'),
    numero, p.nome || '', p.apelido || '', p.nivel || '', p.praia || '', p.cidade || '', p.insta || ''
  ]);
  return ContentService.createTextOutput(JSON.stringify({status:'OK', acao:'criado'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// Painel de controle (protegido por token)
function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.action === 'list') {
    if (p.token !== TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({status:'ERRO', message:'token invalido'}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var vals = sheet_().getDataRange().getValues();
    var rows = vals.slice(1).map(function(r){
      return {data: r[0], numero: r[1], nome: r[2], apelido: r[3], nivel: r[4], praia: r[5], cidade: r[6], insta: r[7]};
    });
    return ContentService.createTextOutput(JSON.stringify({status:'OK', total: rows.length, carteirinhas: rows}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return HtmlService.createHtmlOutput('<h2>ASF Carteirinhas - Registro OK ✅</h2><p>Use ?action=list&token=SEU_TOKEN para o painel.</p>');
}
