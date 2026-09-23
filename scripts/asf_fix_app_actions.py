from pathlib import Path
p=Path('index.html')
s=p.read_text()
repls={
"<a href=\"#\" class=\"see-all\" onclick=\"event.preventDefault();return false\">Ver todos →</a>":"<a href=\"https://acarolmourad-commits.github.io/asf-comunidade/\" class=\"see-all\">Ver comunidade →</a>",
"showToast('🎯 Troca de recompensas em breve! Continue acumulando pontos.')":"window.location.href='https://acarolmourad-commits.github.io/asf-clube/'",
"showToast('💬 Comentários em breve na comunidade ASF!')":"window.location.href='sessoes-interativas.html'",
"function asfToastNews(t){showToast('📰 '+t+' — em breve: ler artigo completo!')}":"function asfToastNews(t){window.location.href='aprender/'}",
"showToast('📍 Guia de Praias em breve!')":"window.location.href='praias/melhores-praias-iniciantes-litoral-norte-sp.html'",
"<button class=\"btn btn-primary\" style=\"width: 100%; margin-top: 12px; font-size: 13px;\">Acessar Calculadora</button>":"<button class=\"btn btn-primary\" style=\"width: 100%; margin-top: 12px; font-size: 13px;\" onclick=\"event.stopPropagation();showSurfCalculator()\">Acessar Calculadora</button>"
}
changed=[]
for old,new in repls.items():
    if old in s:
        s=s.replace(old,new)
        changed.append(old[:60])
marker='''            <div style="margin:0 20px 12px;padding:10px 12px;border:1px solid #FCD34D;background:#FEF3C7;color:#92400E;border-radius:12px;font-size:12px;line-height:1.5"><strong>Demonstração:</strong> as publicações abaixo ilustram o formato da comunidade. Use “Publicar” para criar conteúdo local neste dispositivo.</div>'''
anchor='            <!-- User Posts -->\n            <div id="user-posts"></div>'
if marker not in s and anchor in s:
    s=s.replace(anchor,anchor+'\n'+marker)
    changed.append('aviso-demonstracao-comunidade')
if changed:
    p.write_text(s)
print('Alterações aplicadas:',len(changed))
for c in changed: print('-',c)
