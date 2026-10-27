#!/usr/bin/env python3
from pathlib import Path
import sys
p = Path('carteirinhas-admin.html')
t = p.read_text(encoding='utf-8')
old = 'var cfg = window.ASF_CARD || {};'
new = "var cfg = (typeof ASF_CARD !== 'undefined') ? ASF_CARD : (window.ASF_CARD || {});"
if new in t:
    print('ja corrigido')
elif t.count(old) == 1:
    p.write_text(t.replace(old, new), encoding='utf-8')
    print('cfg corrigido')
else:
    print(f'ERRO: ancora encontrada {t.count(old)}x', file=sys.stderr)
    raise SystemExit(1)
