# ASF - Patch onda 4: adiciona Carteirinha Digital v2 (aba, secao, script tag)

src = open('index.html', encoding='utf-8').read()

reps = [
    ("<button class=\"tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"conteudo\" onclick=\"showSection('conteudo')\">\n            <span class=\"tab-icon\">📖</span> Conteúdo\n        </button>",
     "<button class=\"tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"conteudo\" onclick=\"showSection('conteudo')\">\n            <span class=\"tab-icon\">📖</span> Conteúdo\n        </button>\n        <button class=\"tab\" role=\"tab\" aria-selected=\"false\" aria-controls=\"carteirinha\" onclick=\"showSection('carteirinha');ASF_CARD.init()\">\n            <span class=\"tab-icon\">🪪</span> Carteirinha\n        </button>"),
    ("<div style=\"padding:0 16px;\" id=\"conteudo-content\"></div>\n    </div>",
     "<div style=\"padding:0 16px;\" id=\"conteudo-content\"></div>\n    </div>\n\n    <!-- CARTEIRINHA DIGITAL -->\n    <div class=\"section\" id=\"carteirinha\" style=\"display:none\">\n        <div class=\"section-header\">\n            <h2 class=\"section-title\" style=\"display:block\">🪪 Carteirinha ASF</h2>\n        </div>\n        <p style=\"text-align:center;padding:4px 16px 16px;font-size:14px;color:var(--gray-400);margin:0\">Sua identidade de surfista: gratuita, digital e personalizada.</p>\n        <div style=\"padding:0 16px;\" id=\"carteirinha-content\"></div>\n    </div>"),
    ("<script src=\"surf-culture.js\"></script>",
     "<script src=\"surf-culture.js\"></script>\n<script src=\"carteirinha.js\"></script>"),
]

for old, new in reps:
    n = src.count(old)
    assert n == 1, f'Ancora deveria aparecer 1x, apareceu {n}: {old[:60]}'
    src = src.replace(old, new)

assert 'carteirinha.js' in src and 'id="carteirinha"' in src
open('index.html', 'w', encoding='utf-8').write(src)
print('index.html patcheado: carteirinha v2 adicionada')
