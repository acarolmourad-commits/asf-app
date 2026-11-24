#!/usr/bin/env python3
"""ASF weekly newsletter - safe by design.
Modes: preview (default, never sends), test (only TEST_EMAIL), send (real list).
Send gates: approved content for current ISO week, active+consented subscribers,
Brevo key, Google credentials, unsubscribe base URL and ALLOW_SEND=true.
Content is never fabricated: only approved rows from the Conteudo tab + ASF links
+ optional RSS configured in NEWS_RSS_URLS.
"""
import datetime as dt, html, json, os, sys, urllib.request, xml.etree.ElementTree as ET

DEFAULT_SHEET_ID = '1V4aepr98rLiQi2_tM0LavJSWAha23RDz0eQ84n5m6pg'
BASE = 'https://asf.surf'

def week_key():
    if os.getenv('NEWSLETTER_WEEK'): return os.environ['NEWSLETTER_WEEK']
    y, w, _ = dt.date.today().isocalendar(); return f'{y}-W{w:02d}'

def sheets_service():
    cred_json = os.getenv('GOOGLE_SERVICE_ACCOUNT_JSON', '')
    path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS', '')
    if cred_json:
        path = '/tmp/google-service-account.json'; open(path, 'w').write(cred_json)
    if not path or not os.path.exists(path): return None
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    creds = service_account.Credentials.from_service_account_file(path, scopes=['https://www.googleapis.com/auth/spreadsheets'])
    return build('sheets', 'v4', credentials=creds)

def get_values(svc, sheet_id, rng):
    return svc.spreadsheets().values().get(spreadsheetId=sheet_id, range=rng).execute().get('values', [])

def rows_as_dicts(values):
    if not values: return []
    head = values[0]
    return [{head[i]: (row[i] if i < len(row) else '') for i in range(len(head))} for row in values[1:] if row]

def rss_items():
    items = []
    for url in [u.strip() for u in os.getenv('NEWS_RSS_URLS', '').split(',') if u.strip()]:
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'ASF-Newsletter/1.0'}), timeout=15).read()
            root = ET.fromstring(data)
            for node in root.findall('.//item')[:3]:
                title = (node.findtext('title') or '').strip(); link = (node.findtext('link') or '').strip()
                if title and link: items.append({'categoria': 'Notícias de surf', 'titulo': title, 'resumo': '', 'link': link})
        except Exception as exc:
            print(f'RSS ignored ({url}): {exc}')
    return items[:6]

def build_html(week, items, unsubscribe_url):
    cards = ''
    for it in items:
        cards += f"<article style='border:1px solid #d9eef5;border-radius:14px;padding:16px;margin:12px 0'><small>{html.escape(it.get('categoria',''))}</small><h3 style='margin:6px 0'><a href='{html.escape(it.get('link',''))}'>{html.escape(it.get('titulo',''))}</a></h3><p>{html.escape(it.get('resumo',''))}</p></article>"
    if not cards:
        cards = "<p>Semana de maré calma na curadoria — aproveite para explorar os apps e guias da ASF abaixo.</p>"
    return f"""<html><body style='font-family:Arial,sans-serif;color:#0E2439;max-width:680px;margin:auto'>
<header style='background:#0E2439;color:#fff;padding:24px;border-radius:16px'><h1>Newsletter ASF — {week}</h1><p>Novidades, dicas de surf e vida na comunidade.</p></header>
<main>{cards}<section><h2>Na ASF nesta semana</h2><ul>
<li><a href='{BASE}/novidades.html'>Novidades da rede ASF</a></li>
<li><a href='{BASE}/previsao-surf/'>Previsão de ondas</a></li>
<li><a href='{BASE}/parcerias/'>Parceiros e benefícios</a></li>
<li><a href='{BASE}/guia-apps.html'>Guia de apps gratuitos</a></li></ul></section></main>
<footer style='font-size:12px;color:#567'><p>Você recebe porque confirmou a inscrição na Newsletter ASF.</p><p><a href='{unsubscribe_url}'>Cancelar inscrição</a> · <a href='{BASE}'>asf.surf</a></p></footer></body></html>"""

def brevo_send(api_key, to_email, subject, body):
    import requests
    r = requests.post('https://api.brevo.com/v3/smtp/email', headers={'api-key': api_key, 'content-type': 'application/json'}, json={
        'sender': {'name': 'ASF — Associação de Surf Feminino', 'email': 'asf.surffeminino@gmail.com'},
        'to': [{'email': to_email}], 'subject': subject, 'htmlContent': body}, timeout=30)
    if r.status_code >= 300: raise RuntimeError(f'Brevo {r.status_code}: {r.text[:300]}')

def main():
    mode = os.getenv('MODE', 'preview').lower(); week = week_key(); sheet_id = os.getenv('SHEET_ID') or DEFAULT_SHEET_ID
    if mode not in ('preview', 'test', 'send'):
        print(f'Blocked: unsupported MODE={mode!r}. Use preview, test or send.'); return 2
    svc = sheets_service(); config, subscribers, content = {}, [], []
    if svc:
        config = {r[0]: r[1] for r in get_values(svc, sheet_id, 'Config!A2:B50') if len(r) >= 2}
        subscribers = [r for r in rows_as_dicts(get_values(svc, sheet_id, 'Inscritas!A1:H10000')) if r.get('status') == 'ativa' and r.get('consentimento') == 'sim' and '@' in r.get('email', '')]
        content = [r for r in rows_as_dicts(get_values(svc, sheet_id, 'Conteudo!A1:G1000')) if r.get('semana') == week and str(r.get('aprovado', '')).lower() in ('sim', 'yes', 'true')]
        content.sort(key=lambda r: int(r.get('ordem') or 99))
    else:
        print('Google credentials missing: sheet not read.')
    items = content + rss_items()
    subject = config.get('assunto_padrao') or f'ASF — Novidades da semana {week}'
    unsub_base = os.getenv('UNSUBSCRIBE_BASE_URL') or config.get('apps_script_url', '')
    preview = build_html(week, items, (unsub_base + '?action=unsubscribe&token=SEU_TOKEN') if unsub_base else '#')
    open('newsletter-preview.html', 'w').write(preview)
    print(f'MODE={mode} WEEK={week} subscribers={len(subscribers)} approved_items={len(content)} rss_items={len(items)-len(content)}')
    if mode == 'preview':
        print('Preview generated only. No email sent.'); return 0
    if not svc: print('Blocked: Google credentials missing.'); return 1
    if mode == 'send':
        if os.getenv('ALLOW_SEND') != 'true': print('Blocked: ALLOW_SEND is not true.'); return 1
        if config.get('envio_ativado') != 'sim': print('Blocked: Config envio_ativado is not sim.'); return 1
        if not content: print('Blocked: no approved Conteudo row for this week.'); return 1
    api_key = os.getenv('BREVO_API_KEY', '')
    if not api_key: print('Blocked: BREVO_API_KEY missing.'); return 1
    if not unsub_base: print('Blocked: unsubscribe URL missing (Apps Script).'); return 1
    targets = [{'email': os.environ['TEST_EMAIL'], 'token_cancelamento': 'teste'}] if mode == 'test' else subscribers
    if mode == 'test' and not os.getenv('TEST_EMAIL'): print('Blocked: TEST_EMAIL missing.'); return 1
    sent_log = {(r.get('semana'), r.get('email')) for r in rows_as_dicts(get_values(svc, sheet_id, 'Envios!A1:G10000')) if r.get('status') == 'enviado'}
    logs, sent = [], 0
    for sub in targets:
        email = sub['email']
        if mode == 'send' and (week, email) in sent_log: continue
        body = build_html(week, items, f"{unsub_base}?action=unsubscribe&token={sub.get('token','')}")
        try:
            brevo_send(api_key, email, ('[TESTE] ' if mode == 'test' else '') + subject, body); status, err = 'enviado', ''
        except Exception as exc:
            status, err = 'erro', str(exc)[:300]
        logs.append([week, dt.datetime.utcnow().isoformat() + 'Z', email, subject, status, mode, err]); sent += status == 'enviado'
    if logs:
        svc.spreadsheets().values().append(spreadsheetId=sheet_id, range='Envios!A1', valueInputOption='RAW', body={'values': logs}).execute()
    print(f'Finished: {sent}/{len(targets)} sent.'); return 0

if __name__ == '__main__': sys.exit(main())
