# ASF Newsletter — Google Sheets endpoint setup

The static GitHub Pages app cannot safely write to Sheets directly. This Apps Script is the free receiver.

1. Sign in to [Google Apps Script](https://script.google.com/) using the Google account with edit access to the destination sheet.
2. Create a project named **ASF Newsletter** and replace its editor content with `Code.gs` in this folder.
3. Save; choose **Deploy → New deployment → Web app**.
4. Set **Execute as: Me** and access to **Anyone**; deploy and authorize.
5. Copy the deployed Web App URL ending in `/exec`.
6. Replace `CONFIGURE_GOOGLE_APPS_SCRIPT_WEB_APP_URL` in `app.js` with that exact URL, then commit/deploy GitHub Pages.
7. Test only with an address whose owner explicitly consents. Verify the row in the sheet, then remove test data if desired.

The frontend uses a cross-origin `no-cors` request; browser code cannot inspect the Apps Script response. Its toast is therefore not proof of a write. Verify in the spreadsheet during acceptance testing. The endpoint validates email/consent, uses a honeypot and avoids duplicate email rows.

Sheet: https://docs.google.com/spreadsheets/d/10xygyYPpfDcpPAnHcaALPwFyMviybZC03PkyeXNarww/edit
