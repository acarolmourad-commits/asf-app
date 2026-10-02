# -*- coding: utf-8 -*-
"""Restaura guia-apps.html completo a partir do blob c097e4a (versao com 53 apps)
e reaplica o script de chips se ausente. Idempotente."""
import io, subprocess, sys

BLOB = "c097e4a4fcc9edb7fedbc5e586ffcf5d49f38ea6"
original = subprocess.check_output(["git", "cat-file", "blob", BLOB]).decode("utf-8")
assert 'data-cat' in original and original.count('class="app"') >= 50, "blob inesperado"

CHIPS = open("scripts/asf_guia_chips.html", encoding="utf-8").read()
atual = io.open("guia-apps.html", encoding="utf-8").read()

base = original  # sempre parte da versao completa
novo = base if "chips-cat" in base else base.replace("</body>", CHIPS + "</body>", 1)

if novo != atual:
    io.open("guia-apps.html", "w", encoding="utf-8").write(novo)
    print("CHANGED:guia-apps.html", len(atual), "->", len(novo))
else:
    print("NOTHING_TO_DO")
    sys.exit(0)
