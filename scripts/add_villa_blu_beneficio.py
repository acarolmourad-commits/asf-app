# ASF - Publica beneficio Pousada Villa Blu na secao "Beneficios ASF" do index.html
# Fonte: e-mail contato@villablumaresias.com.br em 07/10/2026 (parceria aceita + cupom ASF5OFF)
import io, sys

path = "index.html"
h = io.open(path, encoding="utf-8").read()

anchor = """        <div class="card" style="border-left: 4px solid var(--primary); text-align: center; padding: 24px;">
            <div style="font-size: 32px; margin-bottom: 8px;">\U0001F30A</div>
            <p style="font-size: 14px; margin: 0 0 8px;"><strong>Em breve: os primeiros benef\u00edcios para associadas!</strong></p>"""

card = """        <!-- Parceria confirmada por e-mail em 07/10/2026 (contato@villablumaresias.com.br) -->
        <div class="card" style="border-left: 4px solid var(--primary); padding: 20px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <div style="font-size: 26px;">\U0001F3E1</div>
                <div>
                    <h4 style="color: #0E2439; margin: 0;">Pousada Villa Blu \u2014 Maresias</h4>
                    <span style="font-size: 12px; color: var(--gray-600);">Hospedagem parceira \u00b7 Litoral Norte SP</span>
                </div>
            </div>
            <p style="font-size: 14px; margin: 0 0 10px;"><strong>5% de desconto</strong> sobre todas as tarifas, em qualquer data, para reservas a partir de 2 di\u00e1rias.</p>
            <div style="background: rgba(0,168,204,0.08); border: 1px dashed var(--primary); border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; text-align: center;">
                <span style="font-size: 12px; color: var(--gray-600); display: block;">Use o cupom</span>
                <strong style="font-size: 18px; letter-spacing: 1px; color: var(--primary);">ASF5OFF</strong>
            </div>
            <p style="font-size: 12px; color: var(--gray-600); margin: 0 0 12px;">V\u00e1lido exclusivamente no site da pousada ou no motor de reservas oficial.</p>
            <a href="https://www.villablumaresias.com.br" target="_blank" rel="noopener" class="btn btn-primary" style="display: inline-block; font-size: 13px; padding: 10px 18px; text-decoration: none;">Reservar com desconto \u2192</a>
        </div>
"""

if "ASF5OFF" in h:
    print("Beneficio Villa Blu ja publicado - nada a fazer")
    sys.exit(0)
if anchor not in h:
    print("ERRO: ancora da secao Beneficios ASF nao encontrada", file=sys.stderr)
    sys.exit(1)

h = h.replace(anchor, card + anchor, 1)
io.open(path, "w", encoding="utf-8").write(h)
print("Beneficio Villa Blu publicado na secao Beneficios ASF")
