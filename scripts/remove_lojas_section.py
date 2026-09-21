#!/usr/bin/env python3
"""Remove o conteúdo da seção #lojas da home e deixa placeholder para futuras marcas parceiras."""
import sys

with open('index.html', encoding='utf-8') as f:
    html = f.read()

start_marker = '        <div class="section" id="lojas">'
end_marker = '        <!-- Progresso Section - Gamification -->'

if start_marker not in html or end_marker not in html:
    print('Marcadores não encontrados; nada a fazer.')
    sys.exit(0)

start = html.index(start_marker)
end = html.index(end_marker)

new_section = '''        <div class="section" id="lojas">
            <div class="section-header">
                <h2 class="section-title">🤝 Marcas Parceiras</h2>
            </div>

            <!-- Placeholder: futuras marcas parceiras serão exibidas aqui.
                 Para adicionar um parceiro, copie o template abaixo dentro de .cards-grid:

                 <div class="card">
                     <span class="card-tag green">PARCEIRO</span>
                     <h3>NOME DA MARCA</h3>
                     <p>Descrição curta da marca</p>
                     <p style="font-size: 13px; color: var(--gray-600);">📍 Cidade • Categorias</p>
                     <div style="display: flex; gap: 8px; margin-top: 10px;">
                         <a href="LINK" target="_blank" class="btn btn-secondary" style="flex: 1; font-size: 12px; text-align: center; text-decoration: none; display: inline-block;">CTA</a>
                     </div>
                 </div>
            -->
            <div class="cards-grid">
                <!-- Em breve: marcas parceiras ASF -->
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; background: var(--light); border-radius: 16px;">
                <p style="font-size: 14px; color: var(--gray-600);">Sua loja não está aqui? <strong style="color: var(--primary);">Cadastre-se!</strong></p>
                <button class="btn btn-secondary" style="margin-top: 10px;">Quero ser parceiro</button>
            </div>
        </div>

'''

html2 = html[:start] + new_section + html[end:]

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html2)

print(f'OK: {len(html)} -> {len(html2)} bytes')
