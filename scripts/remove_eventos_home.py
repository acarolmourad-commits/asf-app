#!/usr/bin/env python3
"""One-shot (01/10/2026): remove o ASF Eventos da home.

O app asf-eventos foi descontinuado (nao ha eventos proprios programados;
quando houver, serao divulgados no mural das manas). Remove:
1) item de menu 'Eventos' (showSection eventos)
2) secao 'Calendario de Eventos' (id="eventos")
3) link 'ASF Eventos - calendario completo' nos links de destaque
4) ajusta contagem '53 apps' -> '52 apps'
Idempotente.
"""
INDEX = "index.html"

OLD_BTN = """        <button class="menu-item" role="menuitem" onclick="showSection('eventos');closeMenu()"><span>\U0001F4C5</span> Eventos</button>\n"""
SECTION_START = "    <!-- CALENDARIO DE EVENTOS -->"
SECTION_END = "    <!-- ASSISTENTE VIRTUAL ASF -->"
OLD_LINK = """                <a data-app="eventos" data-app="eventos" href="https://acarolmourad-commits.github.io/asf-eventos/" style="display:block; text-align:center; background: linear-gradient(135deg, #00b4d8, #0077b6); color: white; padding: 12px; border-radius: 12px; text-decoration: none; font-weight: 600; margin-top: 8px;">\U0001F4C5 ASF Eventos — calendário completo →</a>\n"""

def main():
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()

    if "asf-eventos" not in html and 'showSection(\'eventos\')' not in html:
        print("Nada a fazer (ASF Eventos ja removido da home)")
        return

    mudancas = 0

    if OLD_BTN in html:
        html = html.replace(OLD_BTN, "")
        mudancas += 1
    else:
        print("AVISO: botao de menu Eventos nao encontrado")

    i = html.find(SECTION_START)
    e = html.find(SECTION_END)
    if i != -1 and e != -1 and i < e:
        html = html[:i] + html[e:]
        mudancas += 1
    else:
        print("AVISO: secao Calendario de Eventos nao encontrada")

    if OLD_LINK in html:
        html = html.replace(OLD_LINK, "")
        mudancas += 1
    else:
        print("AVISO: link de destaque ASF Eventos nao encontrado")

    if "Todos os 53 apps" in html:
        html = html.replace("Todos os 53 apps", "Todos os 52 apps")
        mudancas += 1

    restantes = html.count("asf-eventos")
    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"OK: {mudancas} edicoes aplicadas; referencias restantes a asf-eventos: {restantes}")
    if restantes:
        raise SystemExit(3)

if __name__ == "__main__":
    main()
