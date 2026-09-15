#!/usr/bin/env python3
"""HERMES: remove definitivamente 6 módulos imobiliários de index.html.
Idempotente: se já removido, sai sem alterações. Falha com erro se algo inesperado."""
import sys, re

PATH = "index.html"
s = open(PATH, encoding="utf-8").read()

HTML_START = "<!-- ████ IMÓVEIS NO LITORAL — 6 Cards ████ -->"
HTML_END   = "<!-- Fim dos cards de imóveis -->"
JS_START   = "// ── UTILITÁRIOS IMOBILIÁRIOS"
JS_END_FN  = """function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return r + ',' + g + ',' + b;
}"""

TERMS = ["Porto Norte Imobiliária","Coastal Realty","Litoral Imóveis",
 "(13) 99999-9999","(13) 98888-8888","(12) 97777-7777",
 "Simulador de Financiamento","Comparador de Cidades","Checklist de Visita a Imóvel",
 "Calendário Sazonal do Mercado","Guia de Bairros por Cidade",
 "calcularFinanciamento","compararCidades","mostrarGuiaBairros","mostrarTemporada",
 "saveVisitaChecklist","resetVisitaChecklist","CIDADES_DATA","BAIRROS_DATA","TEMPORADAS",
 "hexToRgb","sim-valor","sim-entrada","sim-prazo","sim-taxa","sim-resultado","sim-parcela",
 "comp-cidade1","comp-cidade2","comp-resultado","comp-veredicto","visita-checklist",
 "visita-count","visita-progress","guia-cidade-select","guia-bairros-content",
 "temporada-content","tempo-btn-alta","asf-visita-checklist","Revisados:",
 "Sazonalidade extrema","Melhor para VENDER","Vista Linda","Guaratuba"]

def must_once(hay, needle):
    n = hay.count(needle)
    if n != 1:
        print(f"❌ marker not unique ({n}x): {needle[:60]!r}"); sys.exit(1)
    return hay.index(needle)

if all(t not in s for t in TERMS):
    print("✅ Módulos já removidos — nada a fazer"); sys.exit(0)

# --- bloco HTML ---
h_start = must_once(s, HTML_START)
h_end   = must_once(s, HTML_END) + len(HTML_END)
assert h_end > h_start, "html markers fora de ordem"
html_block = s[h_start:h_end]
for t in ["Simulador de Financiamento","Comparador de Cidades","Checklist de Visita a Imóvel",
          "Guia de Bairros por Cidade","Calendário Sazonal do Mercado","Imobiliárias e Corretores",
          "Porto Norte Imobiliária","Coastal Realty","Litoral Imóveis"]:
    assert t in html_block, f"módulo ausente no bloco HTML: {t}"
assert html_block.count('<div') == html_block.count('</div>'), "bloco HTML desbalanceado"
assert 'Pre-Surf' not in html_block and 'pre-surf' not in html_block, "bloco inclui checklist pré-surf!"

# --- bloco JS ---
j_start = must_once(s, JS_START)
j_end   = must_once(s, JS_END_FN) + len(JS_END_FN)
assert j_end > j_start, "js markers fora de ordem"
js_block = s[j_start:j_end]
for t in ["calcularFinanciamento","compararCidades","saveVisitaChecklist","resetVisitaChecklist",
          "CIDADES_DATA","BAIRROS_DATA","TEMPORADAS","mostrarTemporada","hexToRgb"]:
    assert t in js_block, f"função ausente no bloco JS: {t}"
assert 'setTimerPreset' not in js_block and 'resetChecklist' not in js_block, "bloco JS inclui código de outro módulo!"

s2 = s[:j_start] + s[j_end:]  # remove JS (mais adiante no arquivo)
s2 = s2[:h_start] + s2[h_end:]  # depois HTML
# limpa linhas em branco excedentes deixadas pelos cortes
s2 = re.sub(r"\n{4,}", "\n\n\n", s2)

# --- validações pós-remoção ---
leftover = [t for t in TERMS if t in s2]
if leftover:
    print("❌ termos restantes:", leftover); sys.exit(1)
assert s2.count('<style') == s2.count('</style>'), "style tags desbalanceados"
assert s.count('<div') - s.count('</div>') == s2.count('<div') - s2.count('</div>'), "balanço de <div> mudou"
assert "function setTimerPreset" in s2, "código seguinte ao bloco JS perdido"
assert "resetChecklist()" in s2, "checklist pré-surf afetado"

open(PATH, "w", encoding="utf-8").write(s2)
print(f"✅ Removidos {len(s)-len(s2)} bytes ({s.count(chr(10))-s2.count(chr(10))} linhas)")
print("✅ Todas as validações passaram")
