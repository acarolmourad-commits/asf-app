#!/usr/bin/env python3
"""Checa respostas de leads no Gmail (ultimas 24h) via Composio API.

Usa a conexao Gmail ja autenticada no Composio (OAuth gerenciado) —
nao precisa de refresh token proprio.

Secrets necessarios (repo Settings > Secrets):
  COMPOSIO_API_KEY - chave da API do Composio (dashboard > Settings > API Keys)
Fonte dos leads (ordem de prioridade):
  1) Variavel de repo LEAD_EMAILS (lista separada por virgula)
  2) Arquivo .github/lead-emails.txt (1 e-mail por linha, # = comentario)
Saidas:
  lead_replies_report.md + HOT_REPLIES=true/false no GITHUB_ENV
"""
import os, sys, datetime, time, requests

API_KEY = os.environ["COMPOSIO_API_KEY"]
BASE = "https://backend.composio.dev/api/v3/tools/execute/GMAIL_FETCH_EMAILS"
HEADERS = {"x-api-key": API_KEY, "Content-Type": "application/json"}
ENTITY_ID = os.environ.get("COMPOSIO_ENTITY_ID", "default_user")

HOT_KEYWORDS = ["interesse", "proposta", "orçamento", "orcamento", "reunião",
                "reuniao", "vamos fechar", "quero", "negoci", "whatsapp", "quanto"]
LEADS_FILE = os.environ.get("LEAD_EMAILS_FILE", ".github/lead-emails.txt")

def load_leads():
    env = os.environ.get("LEAD_EMAILS", "").strip()
    if env:
        return [e.strip().lower() for e in env.split(",") if e.strip()]
    if os.path.exists(LEADS_FILE):
        with open(LEADS_FILE, encoding="utf-8") as f:
            return [l.strip().lower() for l in f
                    if l.strip() and not l.startswith("#")]
    return []

def gmail_fetch(query, page_token=None):
    args = {"user_id": "me", "query": query, "max_results": 100,
            "verbose": False, "include_payload": False}
    if page_token:
        args["page_token"] = page_token
    r = requests.post(BASE, headers=HEADERS,
                      json={"user_id": ENTITY_ID, "arguments": args}, timeout=60)
    r.raise_for_status()
    data = r.json()
    if not data.get("successful", True):
        raise RuntimeError(f"Composio error: {data.get('error')}")
    return data.get("data", data)

def main():
    leads = load_leads()
    report_path = os.environ.get("REPORT_PATH", "lead_replies_report.md")
    now = datetime.datetime.now(datetime.timezone.utc)
    yesterday = (now - datetime.timedelta(days=1)).strftime("%Y/%m/%d")
    lines = [f"# 📬 Relatório de respostas de leads — {now:%d/%m/%Y %H:%M UTC}", ""]
    hot = False

    if not leads:
        lines.append("⚠️ Nenhum lead configurado (LEAD_EMAILS ou .github/lead-emails.txt).")
    else:
        msgs, token = [], None
        query = f"in:inbox after:{yesterday} from:({' OR '.join(leads)})"
        while True:
            res = gmail_fetch(query, token)
            msgs.extend(res.get("messages") or [])
            token = res.get("nextPageToken")
            if not token:
                break
            time.sleep(0.5)

        lines.append(f"**{len(msgs)} resposta(s)** nas últimas 24h de {len(leads)} leads monitorados.")
        lines.append("")
        for m in msgs:
            sender = m.get("sender", "?")
            subject = m.get("subject", "(sem assunto)")
            ts = m.get("messageTimestamp", "")
            snippet = (m.get("preview") or {}).get("body", "")[:600]
            link = m.get("display_url", "")
            is_hot = any(k in (snippet + subject).lower() for k in HOT_KEYWORDS)
            hot = hot or is_hot
            tag = "🔥 QUENTE" if is_hot else "📩 resposta"
            lines += [f"## {tag} — {sender}",
                      f"- **Assunto:** {subject}",
                      f"- **Data:** {ts}",
                      f"- **Link:** {link}",
                      "", "<details><summary>Trecho</summary>", "",
                      snippet, "", "</details>", ""]
        if not msgs:
            lines.append("Nenhuma resposta nova. Próxima checagem em 6h.")

    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    with open(os.environ.get("GITHUB_ENV", "/dev/null"), "a") as f:
        f.write(f"HOT_REPLIES={'true' if hot else 'false'}\n")

    print(f"Relatorio salvo em {report_path}. Leads: {len(leads)}. Hot replies: {hot}")

if __name__ == "__main__":
    sys.exit(main())
