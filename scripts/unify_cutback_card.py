# One-shot (10/10/2026): substitui o guia inline do cutback na home por um card-resumo apontando para o ASF Manobras (fonte canonica)
import pathlib

p = pathlib.Path('index.html')
s = p.read_text(encoding='utf-8')

if 'guia-cutback-unificado' in s:
    print('Card unificado ja presente. Nada a fazer.')
    raise SystemExit(0)

NEW = """<!-- Premium Article 1: guia centralizado no ASF Manobras -->
<div class="card" id="guia-cutback-unificado" style="margin-bottom:16px;border-left:4px solid #ff4d8d;">
  <span style="background:#ff4d8d;color:#fff;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:600;">\U0001F4D6 GUIA \u00b7 ASF MANOBRAS</span>
  <h4 style="font-size:15px;margin-top:8px;">\U0001F3C4\u200d\u2640\ufe0f Guia Completo: Como Fazer o Cutback Perfeito</h4>
  <div id="premium-1-full" style="margin-top:12px;">
    <p style="font-size:13px;color:var(--gray-600);line-height:1.8;">Tecnica avancada em 4 passos: velocidade, olhar, peso na traseira e o retorno \u2014 mais os erros comuns e um exercicio no seco com skate. O guia completo agora mora no ASF Manobras, na trilha de manobras com XP.</p>
    <a href="https://manobras.asf.surf/#guia-cutback-completo" style="display:inline-block;margin-top:12px;padding:10px 16px;border-radius:12px;background:#ff4d8d;color:#fff;text-decoration:none;font-weight:600;">Aprender no ASF Manobras \u2192</a>
  </div>
</div>

"""

a = s.index('<!-- Premium Article 1 -->')
b = s.index('<!-- Premium Article 2')
s = s[:a] + NEW + s[b:]
p.write_text(s, encoding='utf-8')
print('Home: guia inline do cutback substituido por card-resumo -> manobras.asf.surf')
