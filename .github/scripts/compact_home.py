"""Fase 2 — home compacta: adiciona js/home-compact.js e o carrega no index.html.
Nenhuma seção é removida; apenas o estado inicial muda (showSection reexibe ao navegar)."""
import pathlib

compact_js = '''/* Home compacta (fase 2): esconde as seções SPA secundárias no carregamento inicial.
   A home passa a mostrar: hero + caminhos/jornada/rede + cards + seção ativa + parceiros.
   Segurança: só age se o showSection real do app.js estiver disponível (ele reexibe
   a seção escolhida ao navegar). Se apenas o shim de rolagem existir, não faz nada.
   Nenhuma seção, funcionalidade ou URL é removida. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    if (typeof window.showSection !== 'function') return;
    if (window.showSection.toString().indexOf("querySelectorAll('.section')") === -1) return;
    document.querySelectorAll('.section').forEach(function (s) {
      if (!s.classList.contains('active') && s.id !== 'parceiros') {
        s.style.setProperty('display', 'none', 'important');
      }
    });
  } catch (e) { /* falha silenciosa: home segue como antes */ }
});
'''

js = pathlib.Path("js/home-compact.js")
js.write_text(compact_js, encoding="utf-8")

idx = pathlib.Path("index.html")
src = idx.read_text(encoding="utf-8")
anchor = '<script defer src="app.js"></script>'
assert anchor in src, "âncora app.js não encontrada"
assert "home-compact.js" not in src, "patch já aplicado"
src = src.replace(anchor, anchor + '\n<script defer src="js/home-compact.js"></script>', 1)
for sec in ['dicas','comunidade','carteirinha','parceiros','praias','progresso','brandhub','premium','assinantes','surf-culture']:
    assert f'id="{sec}"' in src, sec
idx.write_text(src, encoding="utf-8")
print("home compacta aplicada:", len(src), "bytes")
