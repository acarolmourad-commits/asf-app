# Remove fragmento orfao da aba 'Posts' (span + </button> sem <button> de abertura).
# A secao 'instagram' foi removida intencionalmente; o restante da aba ficou quebrado no nav.
import re

p = 'index.html'
h = open(p, encoding='utf-8').read()
orig = h

frag = '            <span class="tab-icon">📸</span> Posts\n        </button>\n'
if frag in h and 'id="instagram"' not in h:
    h = h.replace(frag, '', 1)
    print('fragmento orfao da aba Posts removido')
else:
    print('nada a fazer')

if h != orig:
    open(p, 'w', encoding='utf-8').write(h)

o = len(re.findall(r'<button[\s>]', h))
c = len(re.findall(r'</button>', h))
print('button balance:', o, c)
