/*
=====================================
ASF APP - Google Apps Script
=====================================
COLETOR DE DADOS AUTOMÁTICO

PASSO 1: No Google Sheets, crie uma aba chamada "Dados"
PASSO 2: Extensões > Apps Script  
PASSO 3: Cole este código
PASSO 4: Deploy > Novo app web (Anyone pode acessar)
PASSO 5: Copie a Deployment URL
PASSO 6: Cole no app ASF (fale comigo!)
*/

// Esta função recebe os dados do app
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dados');
  
  // Se não existir, cria
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Dados');
    // Cabeçalho
    sheet.appendRow(['Data_Hora', 'Nome', 'WhatsApp', 'Pontos', 'Quizzes', 'Votos_Surftrip', 'Sessions', 'Nivel', 'Ultimo_Acesso']);
  }
  
  var timestamp = new Date();
  var name = e.parameter.name || 'Anônimo';
  var phone = e.parameter.phone || '';
  var points = parseInt(e.parameter.points) || 0;
  var quizzes = parseInt(e.parameter.quizzes) || 0;
  var votes = parseInt(e.parameter.votes) || 0;
  var sessions = parseInt(e.parameter.sessions) || 0;
  var nivel = parseInt(e.parameter.nivel) || 1;
  
  // Grava no Sheets
  sheet.appendRow([
    Utilities.formatDate(timestamp, 'GMT-3', 'yyyy-MM-dd HH:mm:ss'),
    name,
    phone,
    points,
    quizzes,
    votes,
    sessions,
    nivel,
    timestamp.toString()
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({'status': 'OK', 'message': 'Dados registrados!'}))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET para testes
function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <h2>ASF App - Dados Coletados ✅</h2>
    <p>Script funcionando! Deploy URL:</p>
    <code>${ScriptApp.getService().getUrl()}</code>
    <h3>Como usar:</h3>
    <pre>URL?nome=Carol&phone=11999999999&points=100&quizzes=5&votes=2&sessions=10&nivel=2</pre>
  `);
}

/*
=====================================
NO APP - CODE TO ADD:
=====================================
function sendDataToGoogleSheets() {
  var profile = JSON.parse(localStorage.getItem('asf-profile') || '{}');
  var points = localStorage.getItem('asf-points') || '0';
  var quizzes = (JSON.parse(localStorage.getItem('quizzes-done') || '[]')).length;
  var votes = (JSON.parse(localStorage.getItem('vote-count') || '0'));
  var sessions = (JSON.parse(localStorage.getItem('surf-sessions') || '[]')).length;
  
  var data = 'nome=' + encodeURIComponent(profile.name) + 
            '&phone=' + encodeURIComponent(profile.phone) +
            '&points=' + points +
            '&quizzes=' + quizzes +
            '&votes=' + votes +
            '&sessions=' + sessions +
            '&nivel=' + Math.floor(points/500 + 1);
  
  // COLE SUA DEPLOYMENT URL AQUI:
  var sheetURL = 'https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec';
  
  fetch(sheetURL + '?' + data, {method: 'POST'});
  showToast('📊 Dados enviados para planilha!');
}

Adicione um botão que chama sendDataToGoogleSheets()
*/
