#!/usr/bin/env python3
"""One-shot (25/09/2026): unifica o glossario da home com o app asf-glossario.

A lista inline de termos da home (incluindo entradas imprecisas como 'CCC',
'EPO', 'Futura onda') e substituida por um card-resumo com os 5 termos
essenciais + link para o dicionario completo canonico (asf-glossario, 30
termos com busca). Idempotente.
"""
INDEX = "index.html"

NEW_CARD = """<!-- Glossário de Surf — unificado com o app ASF Glossário (25/09/2026) -->
                <div class="card" style="border-left: 4px solid var(--primary);">
                    <span class="card-tag">📖 Referência</span>
                    <h3>📖 Glossário do Surf</h3>
                    <p>Termos que toda surfista precisa saber!</p>
                    <div style="margin-top: 12px; font-size: 13px; line-height: 1.8; color: var(--gray-600);">
                        <div style="padding: 4px 0; border-bottom: 1px solid var(--gray-100);"><strong>Line-up</strong> — área além da arrebentação onde as surfistas esperam as ondas</div>
                        <div style="padding: 4px 0; border-bottom: 1px solid var(--gray-100);"><strong>Drop</strong> — o momento de ficar de pé na prancha e descer a face da onda</div>
                        <div style="padding: 4px 0; border-bottom: 1px solid var(--gray-100);"><strong>Swell</strong> — ondulação gerada por ventos distantes que vira onda na costa</div>
                        <div style="padding: 4px 0; border-bottom: 1px solid var(--gray-100);"><strong>Marolinha</strong> — onda pequena e fraca, perfeita para o primeiro dia de surf</div>
                        <div style="padding: 4px 0;"><strong>Vaca</strong> — cair da prancha e ser revolvida pela onda (faz parte!)</div>
                    </div>
                    <p style="margin-top: 12px;"><a href="https://acarolmourad-commits.github.io/asf-glossario/" style="color: var(--primary); font-weight: 700;">📖 Ver o dicionário completo com 30 termos e busca no ASF Glossário →</a></p>
                </div>"""

def main():
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()

    if "asf-glossario" in html:
        print("Nada a fazer (glossario ja unificado)")
        return

    start = html.find("<!-- Glossário de Surf -->")
    if start == -1:
        print("ERRO: marcador do glossario nao encontrado")
        raise SystemExit(2)

    end_marker = '<div class="card-meta" style="margin-top: 12px;">'
    meta = html.find(end_marker, start)
    if meta == -1:
        print("ERRO: fim do card do glossario nao encontrado")
        raise SystemExit(2)

    close = html.find("</div>", meta)
    close = html.find("</div>", close + 6) + len("</div>")

    novo = html[:start] + NEW_CARD + html[close:]
    removidos = html[start:close].count("<strong>")
    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(novo)
    print(f"OK: card do glossario unificado ({removidos} entradas inline substituidas por resumo + link ao app)")

if __name__ == "__main__":
    main()
