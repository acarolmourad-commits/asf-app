/*
Google Apps Script - ASF App Data Collection
1. Create Google Sheet
2. Extensions > Apps Script
3. Paste this code
4. Deploy > New Web App
5. Copy the URL and paste below in the app
*/

function doGet(e) {
  return HtmlService.createHtmlOutput("ASF Data Collection - Working!");
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dados') || 
              SpreadsheetApp.getActiveSpreadsheet().insertSheet('Dados');
  
  var timestamp = new Date();
  var name = e.parameter.name || '';
  var phone = e.parameter.phone || '';
  var points = e.parameter.points || '0';
  var quizzes = e.parameter.quizzes || '0';
  var votes = e.parameter.votes || '0';
  var sessions = e.parameter.sessions || '0';
  var nivel = e.parameter.nivel || '1';
  
  sheet.appendRow([timestamp, name, phone, points, quizzes, votes, sessions, nivel]);
  
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

// Para usar no app, CHAME ESTA URL:
// https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
// nome=Carol&phone=11999999999&points=100&quizzes=5&votes=3&sessions=10&nivel=2
