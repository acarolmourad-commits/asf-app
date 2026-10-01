import io, sys

p = "index.html"
s = io.open(p, encoding="utf-8").read()

repls = []

repls.append((
"""                <ul style="font-size: 13px; color: var(--gray-600); padding-left: 18px; margin: 10px 0;">
                    <li>📍 Praias secretas de Bertioga</li>
                    <li>📍 Melhores horários de maré</li>
                    <li>📍 Swell direction otimizada</li>
                </ul>""",
"""                <ul style="font-size: 13px; color: var(--gray-600); padding-left: 18px; margin: 10px 0;">
                    <li>📍 <a href="https://acarolmourad-commits.github.io/asf-previsao/" style="color: inherit;">Ondas, vento e maré — 7 dias</a></li>
                    <li>📍 <a href="https://acarolmourad-commits.github.io/asf-mare/" style="color: inherit;">Melhores horários de maré</a></li>
                    <li>📍 <a href="https://acarolmourad-commits.github.io/asf-swell/" style="color: inherit;">Direção de swell por spot</a></li>
                </ul>"""))

repls.append((
"""                <div style="font-size: 13px; color: var(--gray-600);">
                    <div style="margin-bottom: 4px;">🌊 Breaking angle: <b>45° ± 5°</b></div>
                    <div style="margin-bottom: 4px;">⏱ Peak period: <b>14:30-16:00</b></div>
                    <div>📏 Face height: <b>1.2-1.8m</b></div>
                </div>""",
"""                <div style="font-size: 13px; color: var(--gray-600);">
                    <div style="margin-bottom: 4px;">🌊 <a href="https://acarolmourad-commits.github.io/asf-swell/" style="color: inherit;"><b>Direção e período do swell</b> por spot</a></div>
                    <div style="margin-bottom: 4px;">⏱ <a href="https://acarolmourad-commits.github.io/asf-goldenhour/" style="color: inherit;"><b>Janela de pico do dia</b> — maré, vento e luz</a></div>
                    <div>📏 <a href="https://acarolmourad-commits.github.io/asf-previsao/" style="color: inherit;"><b>Altura de onda</b> e condições ao vivo</a></div>
                </div>"""))

repls.append((
"""                <div style="font-size: 12px; color: var(--gray-600);">
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Secret Reef</span><span style="color: var(--success);">✅</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Sunset Peak</span><span style="color: var(--success);">✅</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span>Moon Beach</span><span style="color: var(--coral);">🔒</span>
                    </div>
                </div>""",
"""                <div style="font-size: 12px; color: var(--gray-600);">
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span><a href="https://acarolmourad-commits.github.io/asf-praias/" style="color: inherit;">Guia de Praias do litoral norte</a></span><span style="color: var(--success);">✅</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span><a href="https://acarolmourad-commits.github.io/asf-mapa/" style="color: inherit;">Mapa interativo dos picos</a></span><span style="color: var(--success);">✅</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin: 8px 0;">
                        <span><a href="https://acarolmourad-commits.github.io/asf-atlas/" style="color: inherit;">Atlas dos picos de surf</a></span><span style="color: var(--success);">✅</span>
                    </div>
                </div>"""))

changed = 0
for old, new in repls:
    if old in s:
        s = s.replace(old, new)
        changed += 1
    else:
        print("BLOCO NAO ENCONTRADO:", old[:80])

io.open(p, "w", encoding="utf-8").write(s)
print("Substituicoes aplicadas:", changed)
if changed == 0:
    sys.exit(0)
