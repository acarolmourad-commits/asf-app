#!/usr/bin/env python3
"""Corrige ASF_BASE hardcoded '/asf-app/' -> deteccao automatica de dominio.
O site roda em asf.surf (raiz) E em acarolmourad-commits.github.io/asf-app/.
Idempotente."""
import pathlib

OLD_UX = "window.ASF_BASE = window.ASF_BASE || '/asf-app/';"
OLD_BN = 'var base = window.ASF_BASE || "./";'
NEW = "(location.pathname.indexOf('/asf-app') === 0 ? '/asf-app/' : '/')"
NEW_UX = "window.ASF_BASE = window.ASF_BASE || " + NEW + ";"
NEW_BN = "var base = window.ASF_BASE || " + NEW + ";"

changed = []
for path, old, new in [
    ("asf-ux.js", OLD_UX, NEW_UX),
    ("asf-redesign.js", OLD_UX, NEW_UX),
    ("asf-bottomnav.js", OLD_BN, NEW_BN),
]:
    p = pathlib.Path(path)
    t = p.read_text(encoding="utf-8")
    if old in t:
        t = t.replace(old, new)
        p.write_text(t, encoding="utf-8")
        changed.append(path)
        print(f"{path}: base corrigida")
    elif NEW_UX in t or NEW_BN in t:
        print(f"{path}: ja corrigido")
    else:
        raise SystemExit(f"ERRO: marcador nao encontrado em {path}")

print("CHANGED:" + ",".join(changed) if changed else "NOTHING_TO_DO")
