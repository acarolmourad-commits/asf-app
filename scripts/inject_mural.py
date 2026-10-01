#!/usr/bin/env python3
"""Injeta includes aditivos do modulo Mural/BottomNav/SW (01/10/2026). Idempotente."""
import pathlib

IDX_CSS = '  <link rel="stylesheet" href="./asf-mural.css">\n'
IDX_BODY = '  <!-- ASF Mural/BottomNav/SW includes (aditivo, 01/10/2026) -->\n  <script defer src="./asf-bottomnav.js"></script>\n  <script defer src="./asf-mural.js"></script>\n  <script>\n    if ("serviceWorker" in navigator) {\n      window.addEventListener("load", () =>\n        navigator.serviceWorker.register("./sw.js").catch(() => {}));\n    }\n  </script>\n'
GUIA_CSS = '  <link rel="stylesheet" href="./asf-mural.css">\n'
GUIA_BODY = '  <!-- ASF Hub Filter: chips de categoria + busca sobre data/apps.json (aditivo) -->\n  <script defer src="./asf-bottomnav.js"></script>\n  <script>\n    document.addEventListener("DOMContentLoaded", async () => {\n      const grid = document.querySelector("#apps-grid, .apps-grid, main");\n      if (!grid || !window.asfHubFilter) return;\n      try {\n        const data = await (await fetch("./data/apps.json")).json();\n        const apps = data.apps.map(a => ({ id: a.slug, nome: a.title || a.name,\n          url: a.url, icon: a.icon, cat: a.category }));\n        const wrap = document.createElement("div");\n        wrap.id = "asf-hub-filter";\n        wrap.innerHTML = \'<input type="search" id="asf-hub-busca" placeholder="Buscar app..." \' +\n          \'aria-label="Buscar mini-app" style="width:100%;padding:.6rem;border-radius:10px;\' +\n          \'border:1px solid #ccc;margin-bottom:.5rem"><div id="asf-hub-chips"></div>\' +\n          \'<div id="asf-hub-result"></div>\';\n        grid.parentNode.insertBefore(wrap, grid);\n        const CATS = [...new Set(apps.map(a => a.cat).filter(Boolean))];\n        const chipsEl = wrap.querySelector("#asf-hub-chips");\n        const resEl = wrap.querySelector("#asf-hub-result");\n        const input = wrap.querySelector("#asf-hub-busca");\n        const render = lista => {\n          resEl.innerHTML = lista.map(a =>\n            `<a class="mural-card" style="display:block;text-decoration:none;color:inherit" href="${a.url}">${a.icon || ""} <strong>${a.nome}</strong></a>`).join("");\n        };\n        let catAtiva = "Todos";\n        chipsEl.innerHTML = ["Todos", ...CATS].map(c =>\n          `<button class="chip" data-cat="${c}">${c}</button>`).join("");\n        const apply = () => {\n          const q = input.value.trim().toLowerCase();\n          render(apps.filter(a =>\n            (catAtiva === "Todos" || a.cat === catAtiva) &&\n            (!q || a.nome.toLowerCase().includes(q))));\n        };\n        chipsEl.addEventListener("click", e => {\n          if (!e.target.matches(".chip")) return;\n          chipsEl.querySelectorAll(".chip").forEach(c => c.classList.remove("ativo"));\n          e.target.classList.add("ativo");\n          catAtiva = e.target.dataset.cat;\n          apply();\n        });\n        input.addEventListener("input", apply);\n        render(apps); // mostra todos por padrao; grid original permanece intacto abaixo\n      } catch (e) { /* mantem pagina original se apps.json falhar */ }\n    });\n  </script>\n  <script>\n    if ("serviceWorker" in navigator) {\n      window.addEventListener("load", () =>\n        navigator.serviceWorker.register("./sw.js").catch(() => {}));\n    }\n  </script>\n'

def inject(path, css, body):
    p = pathlib.Path(path)
    t = p.read_text(encoding="utf-8")
    orig = t
    if "asf-mural.css" not in t:
        assert t.count("</head>") == 1, path
        t = t.replace("</head>", css + "</head>")
    if "asf-bottomnav.js" not in t:
        assert t.count("</body>") == 1, path
        t = t.replace("</body>", body + "</body>")
    if t != orig:
        p.write_text(t, encoding="utf-8")
        print(f"{path}: atualizado (+{len(t)-len(orig)} bytes)")
    else:
        print(f"{path}: ja atualizado, nada a fazer")

inject("index.html", IDX_CSS, IDX_BODY)
inject("guia-apps.html", GUIA_CSS, GUIA_BODY)
