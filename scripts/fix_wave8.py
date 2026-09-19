# ASF - Patch onda 8: deduplica abas do menu
# 1) Remove a aba '📍 Praias' duplicada (identica a '🏖️ Praias')
# 2) Renomeia aba '⭐ Conteúdo' (premium) -> '⭐ Guias' (sao Guias Completos)

src = open('index.html', encoding='utf-8').read()

# 1) Remove a SEGUNDA aba praias (📍)
tab_dup = """<button class="tab" role="tab" aria-selected="false" aria-controls="praias" onclick="showSection('praias')">
            <span class="tab-icon">📍</span> Praias
        </button>"""
assert src.count(tab_dup) == 1, 'aba praias duplicada nao encontrada'
src = src.replace(tab_dup, '')

# 2) Renomeia aba premium
old_tab = """<button class="tab" role="tab" aria-selected="false" aria-controls="premium" onclick="showSection('premium')">
            <span class="tab-icon">⭐</span> Conteúdo
        </button>"""
new_tab = """<button class="tab" role="tab" aria-selected="false" aria-controls="premium" onclick="showSection('premium')">
            <span class="tab-icon">⭐</span> Guias
        </button>"""
assert src.count(old_tab) == 1, 'aba premium nao encontrada'
src = src.replace(old_tab, new_tab)

# 3) Renomeia o titulo da secao premium para evitar confusao com Conteudo ASF (conteudo)
old_h2 = '<h2 class="section-title">⭐ Conteúdo ASF</h2>'
new_h2 = '<h2 class="section-title">⭐ Guias Completos ASF</h2>'
assert src.count(old_h2) == 1, 'titulo premium nao encontrado'
src = src.replace(old_h2, new_h2)

open('index.html', 'w', encoding='utf-8').write(src)
print('Menu deduplicado: aba 📍 Praias removida; ⭐ Conteúdo -> ⭐ Guias')
