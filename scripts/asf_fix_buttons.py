# ASF - Patch: botoes de acao (Ondas, Clima, Mares, Calculadora, Competicoes)
import json
import re

src = open('index.html', encoding='utf-8').read()
orig = src

# 1) Utility buttons -> correct sections / scroll to cards
pat = re.compile(
    r'<button class="utility-btn" onclick="showSection\(\'dicas\'\)">\s*'
    r'<span class="icon">\U0001F30A</span>\s*'
    r'<span class="label">Ondas</span>\s*'
    r'</button>\s*'
    r'<button class="utility-btn" onclick="showSection\(\'utilities\'\)">\s*'
    r'<span class="icon">\U0001F321\uFE0F</span>\s*'
    r'<span class="label">Clima</span>\s*'
    r'</button>\s*'
    r'<button class="utility-btn" onclick="showSection\(\'utilities\'\)">\s*'
    r'<span class="icon">\U0001F5D3\uFE0F</span>\s*'
    r'<span class="label">Mar.s</span>\s*'
    r'</button>\s*'
    r'<button class="utility-btn" onclick="showSection\(\'utilities\'\)">\s*'
    r'<span class="icon">\U0001F9EE</span>\s*'
    r'<span class="label">Calculadora</span>\s*'
    r'</button>'
)

new_buttons = (
    '<button class="utility-btn" onclick="showSection(\'surf-conditions\')">\n'
    '            <span class="icon">\U0001F30A</span>\n'
    '            <span class="label">Ondas</span>\n'
    '        </button>\n'
    '        <button class="utility-btn" onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-clima\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)">\n'
    '            <span class="icon">\U0001F321\uFE0F</span>\n'
    '            <span class="label">Clima</span>\n'
    '        </button>\n'
    '        <button class="utility-btn" onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-mare\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)">\n'
    '            <span class="icon">\U0001F5D3\uFE0F</span>\n'
    '            <span class="label">Mar\u00E9s</span>\n'
    '        </button>\n'
    '        <button class="utility-btn" onclick="showSection(\'utilities\');setTimeout(function(){var el=document.getElementById(\'card-calc\');if(el)el.scrollIntoView({behavior:\'smooth\',block:\'start\'});},80)">\n'
    '            <span class="icon">\U0001F9EE</span>\n'
    '            <span class="label">Calculadora</span>\n'
    '        </button>'
)
src, n = pat.subn(new_buttons, src)
assert n == 1, 'buttons block not found'

# 2) Add ids to Mares and Calculadora cards
src, n = re.subn(
    r'(<!-- Mar\u00E9s -->\s*)<div class="card utility-card">',
    r'\1<div class="card utility-card" id="card-mare">',
    src,
)
assert n == 1, 'mare card not found'

src, n = re.subn(
    r'<!-- Calculadora de Prancha --> -->\s*<div class="card utility-card">',
    '<!-- Calculadora de Prancha -->\n                <div class="card utility-card" id="card-calc">',
    src,
)
assert n == 1, 'calc card not found'

# 3) Fill surf-conditions section with real content
pat4 = re.compile(
    r'<div class="section" id="surf-conditions">.*?</div>\s*'
    r'<div class="section-header"><h2 class="section-title">\U0001F30A Condi\u00E7\u00F5es das Ondas</h2></div>\s*'
    r'<div id="surf-conditions-container-2" style="padding:0 16px;"></div>\s*'
    r'</div>',
    re.S,
)
new_section = '''<div class="section" id="surf-conditions">
      <div class="section-header"><h2 class="section-title">\U0001F30A Condi\u00E7\u00F5es das Ondas</h2></div>
      <p style="padding:0 16px;font-size:13px;color:var(--gray-600);margin-bottom:12px;">Verifique as condi\u00E7\u00F5es antes de surfar: altura das ondas, per\u00EDodo, dire\u00E7\u00E3o do vento e mar\u00E9. Dados ao vivo via Open-Meteo.</p>
      <div id="surf-conditions-container-2" style="padding:0 16px;">
        <p style="text-align:center;padding:16px;font-size:13px;color:var(--gray-400)">Carregando condi\u00E7\u00F5es ao vivo\u2026</p>
      </div>
      <div style="padding:0 16px 16px;">
        <div class="card" style="margin-top:8px;">
          <h4 style="margin-bottom:8px;">\U0001F4D6 Como ler as condi\u00E7\u00F5es</h4>
          <ul style="font-size:13px;color:var(--gray-600);padding-left:18px;line-height:1.7;">
            <li><strong>Altura das ondas:</strong> 0,3\u20130,6m ideal para iniciantes; 1m+ pede experi\u00EAncia.</li>
            <li><strong>Per\u00EDodo:</strong> acima de 10s = ondas mais organizadas e potentes (groundswell).</li>
            <li><strong>Vento:</strong> terral/offshore (vindo da terra) deixa o mar limpo; maral/onshore bagun\u00E7a.</li>
            <li><strong>Mar\u00E9:</strong> cada pico tem sua mar\u00E9 ideal \u2014 beach breaks costumam gostar de mar\u00E9 m\u00E9dia.</li>
            <li><strong>Seguran\u00E7a:</strong> cheque correntes de retorno, bandeiras dos guarda-vidas e nunca surfe sozinha.</li>
          </ul>
        </div>
        <button class="btn btn-primary" style="width:100%;margin-top:12px;" onclick="showSection('utilities')">\U0001F321\uFE0F Ver clima, mar\u00E9s e UV detalhados \u2192</button>
      </div>
    </div>'''
src, n = pat4.subn(new_section, src)
assert n == 1, 'surf-conditions block not found'

# 4) Define renderSurfConditions() and hook both containers
js = '''
async function renderSurfConditions(containerId){
  const el=document.getElementById(containerId);
  if(!el) return;
  el.dataset.loaded='1';
  const keys=Object.keys(beaches);
  el.innerHTML='<div class="cards-grid">'+keys.map(k=>'<div class="card utility-card" id="sc-card-'+k+'"><div class="icon">\U0001F3D6\uFE0F</div><h4>'+beaches[k].name+'</h4><p style="font-size:13px;color:var(--gray-400)">Carregando\u2026</p></div>').join('')+'</div>';
  for(const k of keys){
    const card=document.getElementById('sc-card-'+k);
    try{
      const m=await fetchMarine(k);
      if(m&&m.current){
        const c=m.current;
        const r=surfRating(c.wave_height);
        card.innerHTML='<div class="icon">\U0001F30A</div><h4>'+beaches[k].name+'</h4>'
          +'<p style="font-size:22px;font-weight:700;color:var(--primary);margin:4px 0;">'+c.wave_height.toFixed(1)+'m</p>'
          +'<p style="font-size:13px;color:'+r.color+';font-weight:600;">'+r.text+'</p>'
          +'<div style="font-size:12px;color:var(--gray-600);margin-top:6px;">Per\u00EDodo: '+c.wave_period.toFixed(0)+'s | Dire\u00E7\u00E3o: '+windDir(c.wave_direction)+'</div>'
          +(c.swell_wave_height?'<div style="font-size:12px;color:var(--gray-600);">Swell: '+c.swell_wave_height.toFixed(1)+'m</div>':'')
          +'<button class="btn btn-secondary" style="width:100%;margin-top:10px;font-size:12px;" onclick="showSection(\\'utilities\\')">Detalhes \u2192</button>';
      } else {
        card.innerHTML='<div class="icon">\U0001F3D6\uFE0F</div><h4>'+beaches[k].name+'</h4><p style="font-size:13px;color:var(--gray-400)">Dados indispon\u00EDveis no momento</p>';
      }
    }catch(e){
      card.innerHTML='<div class="icon">\U0001F3D6\uFE0F</div><h4>'+beaches[k].name+'</h4><p style="font-size:13px;color:var(--gray-400)">Erro ao carregar</p>';
    }
  }
}
function asfInitFeatures(){'''
assert src.count('function asfInitFeatures(){') == 1, 'asfInitFeatures not unique'
src = src.replace('function asfInitFeatures(){', js, 1)

old6 = "const sc=document.getElementById('surf-conditions-container');if(sc&&!sc.dataset.loaded){sc.dataset.loaded='1';if(typeof renderSurfConditions!=='undefined')renderSurfConditions('surf-conditions-container')}"
assert old6 in src, 'sc loader not found'
new6 = old6 + "\n    const sc2=document.getElementById('surf-conditions-container-2');if(sc2&&!sc2.dataset.loaded){sc2.dataset.loaded='1';if(typeof renderSurfConditions!=='undefined')renderSurfConditions('surf-conditions-container-2')}"
src = src.replace(old6, new6)

open('index.html', 'w', encoding='utf-8').write(src)
print('index.html patched:', len(orig), '->', len(src))

# 5) events.json: add upcoming events (idempotent)
ev = json.load(open('data/events.json', encoding='utf-8'))
titles = [e['titulo'] for e in ev['eventos']]
add = [
    {"titulo": "\U0001F3C4 ASF Surf Day Feminino", "local": "Bertioga - Praia de Indai\u00E1", "inicio": "2026-10-04", "fim": "2026-10-04", "descricao": "Encontro gratuito da comunidade ASF: aula para iniciantes, free surf e roda de conversa.", "fonte": "ASF", "status": "FUTURO"},
    {"titulo": "\U0001F3C6 Copa Litoral Paulista - Etapa 4", "local": "Guaruj\u00E1 - Praia da Enseada", "inicio": "2026-11-07", "fim": "2026-11-08", "descricao": "Circuito estadual feminino - pen\u00FAltima etapa do ranking", "fonte": "spsurf.com.br", "status": "FUTURO"},
]
for e in reversed(add):
    if e['titulo'] not in titles:
        ev['eventos'].insert(0, e)
ev['updated'] = '2026-09-16'
ev['ultima_atualizacao'] = '2026-09-16T15:15:00Z'
json.dump(ev, open('data/events.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('events.json updated')
