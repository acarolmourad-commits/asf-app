#!/usr/bin/env python3
"""Remove informacoes falsas dos cards da home (picos secretos, metricas inventadas)
e substitui por links reais para apps satelites existentes + teasers honestos."""
import io, sys

p = "index.html"
html = io.open(p, encoding="utf-8").read()
orig = html

old_prev = """                <ul style="font-size: 13px; color: var(--gray-600); padding-left: 18px; margin: 10px 0;">
                    <li>\U0001F4CD Praias secretas de Bertioga</li>
                    <li>\U0001F4CD Melhores hor\u00e1rios de mar\u00e9</li>
                    <li>\U0001F4CD Swell direction otimizada</li>
                </ul>"""
new_prev = """                <ul style="font-size: 13px; color: var(--gray-600); padding-left: 18px; margin: 10px 0;">
                    <li>\U0001F30A <a href="https://acarolmourad-commits.github.io/asf-previsao/" style="color: inherit;">Ondas, vento e mar\u00e9 \u2014 7 dias</a></li>
                    <li>\U0001F319 <a href="https://acarolmourad-commits.github.io/asf-mare/" style="color: inherit;">Melhores hor\u00e1rios de mar\u00e9</a></li>
                    <li>\U0001F9ED Dire\u00e7\u00e3o de swell por pico <em>(em breve: ASF Swell)</em></li>
                </ul>"""

old_tech = """                <div style="font-size: 13px; color: var(--gray-600);">
                    <div style="margin-bottom: 4px;">\U0001F30A Breaking angle: <b>45\u00b0 \u00b1 5\u00b0</b></div>
                    <div style="margin-bottom: 4px;">\u23f1 Peak period: <b>14:30-16:00</b></div>
                    <div>\U0001F4CF Face height: <b>1.2-1.8m</b></div>
                </div>"""
new_tech = """                <div style="font-size: 13px; color: var(--gray-600);">
                    <div style="margin-bottom: 4px;">\U0001F4D0 <a href="https://acarolmourad-commits.github.io/asf-matematica/" style="color: inherit;">Ondas, remada e prancha em n\u00fameros</a></div>
                    <div style="margin-bottom: 4px;">\U0001F9ED Dire\u00e7\u00e3o de swell, \u00e2ngulo de quebra e janela de pico por spot <em>(em breve: ASF Swell)</em></div>
                    <div>\U0001F3A5 An\u00e1lise de v\u00eddeo da sua sess\u00e3o com leitura de imagem <em>(em breve: ASF V\u00eddeo)</em></div>
                </div>"""

old_spots = """                <div style="font-size: 12px; color: var(--gray-600);">
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Secret Reef</span><span style="color: var(--success);">\u2705</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Sunset Peak</span><span style="color: var(--success);">\u2705</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Moon Beach</span><span style="color: var(--coral);">\U0001F512</span>
                    </div>
                </div>"""
new_spots = """                <div style="font-size: 12px; color: var(--gray-600);">
                    <div style="margin: 8px 0;">\U0001F3D6\uFE0F <a href="https://acarolmourad-commits.github.io/asf-praias/" style="color: inherit;">ASF Praias \u2014 guia do litoral norte de SP</a></div>
                    <div style="margin: 8px 0;">\U0001F5FA\uFE0F <a href="https://acarolmourad-commits.github.io/asf-mapa/" style="color: inherit;">ASF Mapa \u2014 picos interativos</a></div>
                    <div style="margin: 8px 0;">\U0001F9ED <a href="https://acarolmourad-commits.github.io/asf-atlas/" style="color: inherit;">ASF Atlas \u2014 atlas completo dos picos</a></div>
                </div>"""

for old, new in [(old_prev, new_prev), (old_tech, new_tech), (old_spots, new_spots)]:
    n = html.count(old)
    if n != 1:
        print(f"ERRO: trecho encontrado {n}x (esperado 1)")
        sys.exit(1)
    html = html.replace(old, new)

if html != orig:
    io.open(p, "w", encoding="utf-8").write(html)
    print("OK: home corrigida — picos falsos removidos, links reais adicionados")
else:
    print("Sem mudancas")
