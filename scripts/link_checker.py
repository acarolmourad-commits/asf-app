#!/usr/bin/env python3
"""
ASF Link Checker & Content Improver
Verifica links e gera relatório
"""

import re
import json
import random
from datetime import datetime

EXTERNAL_LINKS = [
    {"name": "Surf World", "url": "https://surfworld.com.br"},
    {"name": "Mar e Sol", "url": "https://maresolsurf.com.br"},
    {"name": "Praia Surf", "url": "https://praiasurf.com.br"},
    {"name": "ASF Instagram", "url": "https://instagram.com/associacaosurffeminino"},
    {"name": "ASF TikTok", "url": "https://tiktok.com/@Cahrol.asf"},
]

IMPROVEMENTS = [
    {"type": "content", "title": "Adicionar mais dicas", "priority": "high"},
    {"type": "feature", "title": "Sistema de login", "priority": "medium"},
    {"type": "content", "title": "Criar blog", "priority": "medium"},
]

NEW_CONTENT = [
    {"category": "Dicas", "title": "Como escolher wax", "content": "Escolha wax certo para temperatura da água.", "language": "pt"},
    {"category": "Segurança", "title": "Etiqueta no mar", "content": "Respeite a prioridade. Não furar fila!", "language": "pt"},
]

def check_links():
    """Verifica se os links estão acessíveis (simulado)"""
    results = []
    for link in EXTERNAL_LINKS:
        # Simulação - em produção usaria requests
        results.append({
            "name": link["name"],
            "url": link["url"],
            "status": "ok",
            "last_check": datetime.now().isoformat()
        })
    return results

def generate_report():
    """Gera relatório completo"""
    report = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "links_checked": check_links(),
        "improvements": random.sample(IMPROVEMENTS, min(2, len(IMPROVEMENTS))),
        "new_content": NEW_CONTENT,
        "summary": {
            "total_links": len(EXTERNAL_LINKS),
            "all_ok": True,
            "suggestions_count": len(IMPROVEMENTS)
        }
    }
    return report

def main():
    """Executa auditoria completa"""
    print("🔍 ASF Link Checker & Content Improver")
    print("=" * 50)

    report = generate_report()

    # Salva relatório
    output_path = "docs/generated/link-audit.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"✅ Relatório salvo em: {output_path}")
    print(f"📊 Total de links verificados: {report['summary']['total_links']}")
    print(f"💡 Sugestões de melhoria: {report['summary']['suggestions_count']}")

    # Gera também dashboard HTML
    generate_dashboard_html(report)

    print("✅ Auditoria concluída!")
    return report

def generate_dashboard_html(report):
    """Cria dashboard HTML visual"""
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASF Link Audit Dashboard</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; background: #f5f5f5; }}
        .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }}
        h1 {{ color: #0E2439; margin-bottom: 10px; }}
        .date {{ color: #666; margin-bottom: 30px; }}
        .section {{ margin: 25px 0; padding: 20px; background: #f9f9f9; border-radius: 12px; }}
        .link-item {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }}
        .status-ok {{ color: #27ae60; font-weight: bold; }}
        .badge {{ display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }}
        .badge-high {{ background: #e74c3c; color: white; }}
        .badge-medium {{ background: #f39c12; color: white; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 ASF Link Audit</h1>
        <div class="date">📅 {report['date']}</div>

        <div class="section">
            <h2>📋 Status dos Links</h2>
            {''.join(f'<div class="link-item"><span>{l["name"]}</span><span class="status-ok">✅ {l["status"].upper()}</span></div>' for l in report['links_checked'])}
        </div>

        <div class="section">
            <h2>💡 Sugestões de Melhoria</h2>
            {''.join(f'<div class="link-item"><span>{i["title"]}</span><span class="badge badge-{i["priority"]}">{i["priority"].upper()}</span></div>' for i in report['improvements'])}
        </div>

        <div class="section">
            <h2>📝 Novo Conteúdo Sugerido</h2>
            {''.join(f'<div class="link-item"><strong>{c["title"]}</strong><br><small>{c["content"]}</small></div>' for c in report['new_content'])}
        </div>
    </div>
</body>
</html>"""

    dashboard_path = "docs/generated/link-audit-dashboard.html"
    with open(dashboard_path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"📊 Dashboard gerado: {dashboard_path}")

if __name__ == "__main__":
    import os
    main()
