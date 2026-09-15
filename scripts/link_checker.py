#!/usr/bin/env python3
"""
ASF Link Checker (REAL) - Hermes
Extrai links de index.html e verifica de verdade (HTTP HEAD/GET).
Nunca simula resultados. Se um link nao pode ser verificado (ex.: rate-limit),
ele e marcado como "skipped", nunca como "ok".
Saida: docs/generated/link-audit.json + docs/generated/link-audit-dashboard.html
"""

import os
import re
import json
from datetime import datetime, timezone

import urllib.request
import urllib.error
import ssl

BASE_URL = "https://acarolmourad-commits.github.io/asf-app/"
RAW_INDEX = "https://raw.githubusercontent.com/acarolmourad-commits/asf-app/main/index.html"

# Dominios sensiveis a rate-limit/bloqueio de bots: reportar como skipped
SKIP_DOMAINS = ("instagram.com", "tiktok.com", "facebook.com", "wa.me", "api.whatsapp.com")
# URLs de preconnect/tecnica que nao sao links navegaveis
TECHNICAL_PREFIXES = ("https://fonts.googleapis.com", "https://fonts.gstatic.com",
                      "https://www.googletagmanager.com", "https://pagead2.googlesyndication.com",
                      "https://resources.infolinks.com", "https://api.open-meteo.com",
                      "https://marine-api.open-meteo.com")

CTX = ssl.create_default_context()
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; ASF-LinkChecker/1.0)"}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20, context=CTX) as r:
        return r.read().decode("utf-8", errors="replace")


def check(url):
    """Retorna (status, http_code). status: ok | broken | skipped"""
    if any(url.startswith(p) for p in TECHNICAL_PREFIXES):
        return "skipped", None
    if any(d in url for d in SKIP_DOMAINS):
        return "skipped", None
    for method in ("HEAD", "GET"):
        try:
            req = urllib.request.Request(url, headers=HEADERS, method=method)
            with urllib.request.urlopen(req, timeout=15, context=CTX) as r:
                code = r.getcode()
                return ("ok", code) if code < 400 else ("broken", code)
        except urllib.error.HTTPError as e:
            if method == "HEAD" and e.code in (403, 405, 429):
                continue  # tenta GET
            return "broken", e.code
        except Exception as e:
            if method == "HEAD":
                continue
            return "broken", str(type(e).__name__)
    return "skipped", None


def main():
    print("ASF Link Checker (real) - Hermes")
    html = fetch(RAW_INDEX)
    hrefs = set(re.findall(r"""href=["']([^"']+)["']""", html)) | set(re.findall(r"""src=["']([^"']+)["']""", html))
    ext = sorted({h for h in hrefs if h.startswith("http") and "${" not in h})
    loc = sorted({h.split("#")[0].split("?")[0] for h in hrefs
                  if not h.startswith(("http", "#", "javascript", "data:", "mailto:", "tel:")) and "${" not in h and h.split("#")[0]})

    results, broken = [], []
    for u in ext:
        status, code = check(u)
        results.append({"url": u, "status": status, "http": code})
        if status == "broken":
            broken.append(u)
        print(f"  [{status:7}] {code or '-'} {u}")
    for l in loc:
        u = BASE_URL + l
        try:
            req = urllib.request.Request(u, headers=HEADERS, method="HEAD")
            with urllib.request.urlopen(req, timeout=15, context=CTX) as r:
                code = r.getcode()
        except Exception as e:
            code = getattr(e, "code", str(type(e).__name__))
        ok = isinstance(code, int) and code < 400
        results.append({"url": l, "status": "ok" if ok else "broken", "http": code, "local": True})
        if not ok:
            broken.append(l)
        print(f"  [{'ok' if ok else 'broken':7}] {code} {l} (local)")

    report = {
        "date": datetime.now(timezone.utc).isoformat(),
        "total": len(results),
        "ok": sum(1 for r in results if r["status"] == "ok"),
        "skipped": sum(1 for r in results if r["status"] == "skipped"),
        "broken_count": len(broken),
        "broken": broken,
        "results": results,
    }
    os.makedirs("docs/generated", exist_ok=True)
    with open("docs/generated/link-audit.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    rows = "".join(
        f'<div class="link-item"><span style="word-break:break-all">{r["url"]}</span>'
        f'<span class="status-{r["status"]}">{r["status"].upper()} {r["http"] or ""}</span></div>'
        for r in results)
    dash = f"""<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ASF Link Audit</title><style>
body{{font-family:-apple-system,sans-serif;padding:20px;background:#f5f5f5}}
.container{{max-width:900px;margin:0 auto;background:#fff;padding:30px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.1)}}
h1{{color:#0E2439}} .link-item{{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #eee;font-size:13px}}
.status-ok{{color:#27ae60;font-weight:700}} .status-broken{{color:#e74c3c;font-weight:700}} .status-skipped{{color:#95a5a6}}
</style></head><body><div class="container">
<h1>ASF Link Audit (Hermes)</h1>
<p>{report["date"]} - Total: {report["total"]} | OK: {report["ok"]} | Quebrados: {report["broken_count"]} | Ignorados: {report["skipped"]}</p>
{rows}</div></body></html>"""
    with open("docs/generated/link-audit-dashboard.html", "w", encoding="utf-8") as f:
        f.write(dash)

    print(f"Relatorio: {report['ok']} ok, {report['broken_count']} quebrados, {report['skipped']} ignorados")
    if broken:
        print("LINKS QUEBRADOS:")
        for b in broken:
            print("  -", b)
        with open(os.environ.get("GITHUB_OUTPUT", "/dev/stdout"), "a") as f:
            f.write(f"broken_count={len(broken)}\n")
    else:
        with open(os.environ.get("GITHUB_OUTPUT", "/dev/stdout"), "a") as f:
            f.write("broken_count=0\n")


if __name__ == "__main__":
    main()
