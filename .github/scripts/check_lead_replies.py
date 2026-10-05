#!/usr/bin/env python3
"""Checa respostas de leads no Gmail (ultimas 24h) e gera relatorio markdown.

Secrets necessarios (repo Settings > Secrets):
  GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN
Fonte dos leads (ordem de prioridade):
  1) Variavel de repo LEAD_EMAILS (lista separada por virgula)
  2) Arquivo .github/lead-emails.txt (1 e-mail por linha, # = comentario)
Saidas:
  lead_replies_report.md + HOT_REPLIES=true/false no GITHUB_ENV
"""
import os, sys, base64, datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

HOT_KEYWORDS = ["interesse", "proposta", "orçamento", "orcamento", "reunião",
                "reuniao", "vamos fechar", "quero", "negoci", "whatsapp", "quanto"]
LEADS_FILE = os.environ.get("LEAD_EMAILS_FILE", ".github/lead-emails.txt")

def gmail_service():
    creds = Credentials(
        token=None,
        refresh_token=os.environ["GMAIL_REFRESH_TOKEN"],
        client_id=os.environ["GMAIL_CLIENT_ID"],
        client_secret=os.environ["GMAIL_CLIENT_SECRET"],
        token_uri="https://oauth2.googleapis.com/token",
        scopes=["https://www.googleapis.com/auth/gmail.readonly"],
    )
    return build("gmail", "v1", credentials=creds, cache_discovery=False)

def load_leads():
    env = os.environ.get("LEAD_EMAILS", "").strip()
    if env:
        return [e.strip().lower() for e in env.split(",") if e.strip()]
    if os.path.exists(LEADS_FILE):
        with open(LEADS_FILE, encoding="utf-8") as f:
            return [l.strip().lower() for l in f
                    if l.strip() and not l.startswith("#")]
    return []

def get_body(payload):
    if payload.get("body", {}).get("data"):
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8", "ignore")
    for part in payload.get("parts", []):
        text = get_body(part)
        if text:
            return text
    return ""

def main():
    leads = load_leads()
    report_path = os.environ.get("REPORT_PATH", "lead_replies_report.md")
    now = datetime.datetime.now(datetime.timezone.utc)
    lines = [f"# 📬 Relatório de respostas de leads — {now:%d/%m/%Y %H:%M UTC}", ""]
    hot = False

    if not leads:
        lines.append("⚠️ Nenhum lead configurado (variável LEAD_EMAILS ou .github/lead-emails.txt).")
    else:
        svc = gmail_service()
        query = "newer_than:1d in:inbox from:({})".format(" OR ".join(leads))
        res = svc.users().messages().list(userId="me", q=query).execute()
        msgs = res.get("messages", [])
        lines.append(f"**{len(msgs)} resposta(s)** nas últimas 24h de {len(leads)} leads monitorados.")
        lines.append("")
        for m in msgs:
            msg = svc.users().messages().get(userId="me", id=m["id"], format="full").execute()
            headers = {h["name"].lower(): h["value"] for h in msg["payload"]["headers"]}
            sender = headers.get("from", "?")
            subject = headers.get("subject", "(sem assunto)")
            date = headers.get("date", "")
            body = get_body(msg["payload"])[:600]
            is_hot = any(k in body.lower() for k in HOT_KEYWORDS)
            hot = hot or is_hot
            tag = "🔥 QUENTE" if is_hot else "📩 resposta"
            lines += [f"## {tag} — {sender}",
                      f"- **Assunto:** {subject}",
                      f"- **Data:** {date}",
                      f"- **Snippet:** {msg.get('snippet','')}",
                      "", "<details><summary>Corpo (trecho)</summary>", "",
                      body, "", "</details>", ""]
        if not msgs:
            lines.append("Nenhuma resposta nova. Próxima checagem em 6h.")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    with open(os.environ.get("GITHUB_ENV", "/dev/null"), "a") as f:
        f.write(f"HOT_REPLIES={'true' if hot else 'false'}\n")

    print(f"Relatorio salvo em {report_path}. Leads: {len(leads)}. Hot replies: {hot}")

if __name__ == "__main__":
    sys.exit(main())
