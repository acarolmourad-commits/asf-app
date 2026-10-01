"""Adiciona a regra .search-results.active{display:block} ausente no CSS.
Causa raiz: handleSearch renderiza resultados e adiciona a classe 'active',
mas nenhuma regra CSS exibe o container (display:none base)."""
import pathlib

p = pathlib.Path("assets/css/asf-inline.css")
css = p.read_text(encoding="utf-8")
assert ".search-results {" in css, "base .search-results não encontrada"
assert ".search-results.active" not in css, "patch já aplicado"

css += """
        /* fix: resultados da busca só aparecem quando .active (regra ausente) */
        .search-results.active {
            display: block;
        }
        .search-no-results {
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: var(--gray-400, #666);
        }
"""
p.write_text(css, encoding="utf-8")
print("css corrigido:", len(css), "bytes")
