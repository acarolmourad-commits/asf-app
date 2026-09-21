import re

p = 'index.html'
h = open(p, encoding='utf-8').read()
orig = h
log = []

# 1) Remover card de sorteio de surftrip (recompensa inexistente)
pat = re.compile(r'\s*<div class="card">\s*<span class="card-tag purple">\U0001F3AF RECOMPENSA</span>\s*<h3>\U0001F30D Viagem Internacional</h3>.*?</div>\s*(?=</div>|<div)', re.S)
h2, n = pat.subn('\n', h)
if n == 0:
    start = h.find('<h3>\U0001F30D Viagem Internacional</h3>')
    if start != -1:
        cs = h.rfind('<div class="card">', 0, start)
        ce = h.find('</div>', h.find('</button>', start)) + 6
        h = h[:cs] + h[ce:]
        n = 1
        h2 = h
if n:
    log.append('sorteio card removido')
h = h2 if n else h

# 2) Link de privacidade do banner de cookies -> pagina publica canonica
if 'docs/privacy-policy.html' in h:
    h = h.replace('href="docs/privacy-policy.html"', 'href="privacidade.html"')
    log.append('link privacidade do banner corrigido')

# 3) Botao "Quero ser parceiro" -> pagina de contato
old = '<button class="btn btn-secondary" style="margin-top: 10px;">Quero ser parceiro</button>'
if old in h:
    h = h.replace(old, '<button class="btn btn-secondary" style="margin-top: 10px;" onclick="window.location.href=\'contato.html\'">Quero ser parceiro</button>')
    log.append('botao parceiro ligado ao contato')

# 4) Botao "Responder" (check-in diario) -> diario de surf
old = '<button class="btn btn-secondary" style="width: 100%; margin-top: 12px;">Responder</button>'
if old in h:
    h = h.replace(old, '<button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="window.location.href=\'diario/\'">Responder</button>')
    log.append('botao responder ligado ao diario')

# 5) Botoes "Ver Detalhes" de recompensas -> toast informativo
old = '<button class="btn btn-secondary" style="width: 100%; margin-top: 12px;">Ver Detalhes</button>'
c = h.count(old)
if c:
    h = h.replace(old, '<button class="btn btn-secondary" style="width: 100%; margin-top: 12px;" onclick="showToast(\'\U0001F3AF Troca de recompensas em breve! Continue acumulando pontos.\')">Ver Detalhes</button>')
    log.append(f'{c} botoes Ver Detalhes com feedback')

# 6) Botoes de comentario dos posts -> toast
pat = re.compile(r'(<button[^>]*class="post-action"[^>]*)(><span>\U0001F4AC</span>)')
h, n = pat.subn(r'\1 onclick="showToast(\'\U0001F4AC Coment\u00e1rios em breve na comunidade ASF!\')"\2', h)
if n:
    log.append(f'{n} botoes de comentario com feedback')

# 7) Botoes "Conectar" (template JS) -> toast
old = '<button class="btn btn-primary" style="font-size: 12px; padding: 8px 12px;">Conectar</button>'
c = h.count(old)
if c:
    h = h.replace(old, '<button class="btn btn-primary" style="font-size: 12px; padding: 8px 12px;" onclick="showToast(\'\U0001F91D Conex\u00f5es entre surfistas em breve!\')">Conectar</button>')
    log.append(f'{c} botoes Conectar com feedback')

if h != orig:
    open(p, 'w', encoding='utf-8').write(h)
print('\n'.join(log) or 'NADA A FAZER')
print('sorteio restante:', h.count('sorteio'))
