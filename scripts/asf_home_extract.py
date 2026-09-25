import os, re, subprocess, sys

def run(*args):
    subprocess.run(list(args), check=True)

html = open('index.html', encoding='utf-8').read()

# 1) Extract 4 large inline scripts (>8KB, no src) to js/ external files
names = ['js/home-conquistas.js', 'js/home-main.js', 'js/home-articles.js', 'js/home-quiz-i18n.js']
blocks = []
for m in re.finditer(r'<script>(?P<js>.*?)</script>', html, re.S):
    js = m.group('js')
    if len(js) > 8000:
        blocks.append((m.start(), m.end(), js))
blocks.sort(key=lambda b: -len(b[2]))
assert len(blocks) >= 4, f'esperava >=4 scripts grandes, achei {len(blocks)}'
blocks = blocks[:4]
blocks.sort(key=lambda b: b[0])
os.makedirs('js', exist_ok=True)
out, last = [], 0
for (s, e, js), fname in zip(blocks, names):
    open(fname, 'w', encoding='utf-8').write(js.strip('\n') + '\n')
    out.append(html[last:s]); out.append(f'<script src="{fname}"></script>')
    last = e
out.append(html[last:])
open('index.html', 'w', encoding='utf-8').write(''.join(out))
print('index.html:', len(html), '->', sum(len(x) for x in out))

# 2) Breadcrumbs: add standard nav to editorial pages missing it
labels = {'diario':'Diário','hospedagens':'Hospedagens','mareas':'Marés','parcerias':'Parcerias',
          'prancha-ideal':'Prancha Ideal','previsao-surf':'Previsão de Ondas','surf-trip':'Surf Trip','temporada':'Temporada'}
tpl = ('<nav style="position:sticky;top:0;background:#fff;border-bottom:1px solid #E5EEF2;padding:12px 20px;'
       'display:flex;justify-content:space-between;align-items:center;z-index:10">'
       '<a href="../index.html" style="color:#00A8CC;text-decoration:none;font-weight:700;font-size:14px">'
       '<img src="../assets/images/asf-logo-breadcrumb.png" alt="ASF" style="height:20px;width:auto;vertical-align:-4px;margin-right:6px">App ASF</a>'
       '<span style="color:#B9CBD6;font-size:14px">› {lbl}</span>'
       '<a href="../index.html#comunidade" style="color:#00A8CC;text-decoration:none;font-weight:700;font-size:14px">👭 Comunidade</a></nav>')
for d, lbl in labels.items():
    p = f'{d}/index.html'
    h = open(p, encoding='utf-8').read()
    if 'asf-logo-breadcrumb' in h:
        print('skip (ja tem)', p); continue
    assert '<body>' in h, p
    open(p, 'w', encoding='utf-8').write(h.replace('<body>', '<body>\n' + tpl.format(lbl=lbl), 1))
    print('breadcrumb ok', p)

# quiz: add logo to existing nav
p = 'quiz/index.html'
h = open(p, encoding='utf-8').read()
old = '<a href="https://acarolmourad-commits.github.io/asf-app/">🏄 ASF App</a>'
if old in h:
    h = h.replace(old, '<a href="https://acarolmourad-commits.github.io/asf-app/"><img src="../assets/images/asf-logo-breadcrumb.png" alt="ASF" style="height:18px;width:auto;vertical-align:-3px;margin-right:5px">ASF App</a>')
    open(p, 'w', encoding='utf-8').write(h)
    print('quiz ok')

run('git', 'add', '-A')
run('git', '-c', 'user.name=asf-bot', '-c', 'user.email=asf.surffeminino@gmail.com',
    'commit', '-m', 'refactor(home): extrai scripts inline p/ js/ (569KB->287KB) + breadcrumbs c/ logo nas paginas editoriais')
run('git', 'push')
print('DONE')
