#!/usr/bin/env python3
"""MISSÃO-MESTRA ASF — Fase 1+2:
1) Consolida seções duplicadas/orfãs (praias-guia, surf-news-2, comunidade-hidden, mobilidade-extra)
2) Camada temporal em Competições: eventos estáticos expirados -> data/events.json + render dinâmico com status
Idempotente. Aborta com erro se algo inesperado."""
import sys, re

s = open('index.html', encoding='utf-8').read()
orig = s

# ---------- helpers ----------
def section_span(text, sid):
    m = re.search(r'<div class="section" id="%s"[^>]*>' % re.escape(sid), text)
    if not m:
        return None
    pos = m.start(); depth = 0
    for mm in re.finditer(r'<(/?)div\b[^>]*>', text[pos:]):
        depth += 1 if not mm.group(1) else -1
        if depth == 0:
            return (pos, pos + mm.end())
    raise SystemExit("❌ seção desbalanceada: " + sid)

def remove_section(text, sid):
    sp = section_span(text, sid)
    if not sp:
        print(f"⏭️  #{sid} já removida")
        return text
    # remove também linhas em branco imediatamente após
    end = sp[1]
    while text[end:end+1] == '\n':
        end += 1
    print(f"🗑️  removida #{sid} ({sp[1]-sp[0]} bytes)")
    return text[:sp[0]] + text[end:]

# ---------- 2) SEÇÕES DUPLICADAS/ÓRFÃS ----------
for sid in ['praias-guia', 'surf-news-2', 'comunidade-hidden', 'mobilidade-extra']:
    s = remove_section(s, sid)

# tab "📍 Praias" apontava para praias-guia -> reponta para o guia completo (#praias)
old_tab = '''<button class="tab" role="tab" aria-selected="false" aria-controls="praias-guia" onclick="showSection('praias-guia')">'''
new_tab = '''<button class="tab" role="tab" aria-selected="false" aria-controls="praias" onclick="showSection('praias')">'''
if old_tab in s:
    s = s.replace(old_tab, new_tab)
    print("🔀 tab Praias repontada para #praias")

# ---------- 1) COMPETIÇÕES: camada temporal ----------
EV_START = "<!-- Próximos Eventos -->"
BANNER_MARK = '<div style="background: linear-gradient(135deg, #00A8CC, #0E2439); padding: 16px; border-radius: 12px; margin-top: 16px; color: white; text-align: center;">'

NEW_BLOCK = '''<!-- Próximos Eventos — dinâmico via data/events.json (camada temporal) -->
            <div style="margin-bottom: 20px;">
                <h3 style="font-size: 16px; margin-bottom: 12px; color: var(--secondary);">📅 Eventos & Competições</h3>
                <p style="font-size: 12px; color: var(--gray-500); margin-bottom: 8px;">Fonte: calendário oficial <a href="https://www.spsurf.com.br/" target="_blank" style="color:var(--primary);">spsurf.com.br</a> — eventos podem ser alterados</p>
                <div id="eventos-list"><p style="font-size:13px;color:var(--gray-400);">Carregando eventos…</p></div>
            </div>
            <script>
(function(){
  var MESES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  function fmt(d){var p=d.split('-');return String(parseInt(p[2],10))+' '+MESES[parseInt(p[1],10)-1]+' '+p[0];}
  function st(ev){var h=new Date();h.setHours(0,0,0,0);var i=new Date(ev.inicio+'T00:00:00');var f=new Date((ev.fim||ev.inicio)+'T23:59:59');
    if(h>f)return 'ENCERRADO';if(h>=i&&h<=f)return 'ATIVO';return 'FUTURO';}
  function card(ev,cor,tag){var datas=(!ev.fim||ev.inicio===ev.fim)?fmt(ev.inicio):fmt(ev.inicio)+' → '+fmt(ev.fim);
    return '<div class="card" style="border-left:4px solid '+cor+';margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:start;gap:8px;"><div><h4 style="font-size:15px;">'+ev.titulo+'</h4><p style="font-size:13px;color:var(--gray-600);margin-top:4px;">📍 '+ev.local+'</p><p style="font-size:13px;color:var(--gray-600);">🗓️ '+datas+'</p></div><span style="background:'+cor+';color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600;white-space:nowrap;">'+tag+'</span></div><p style="font-size:12px;color:var(--gray-400);margin-top:8px;">'+ev.descricao+'</p></div>';}
  fetch('data/events.json').then(function(r){return r.json();}).then(function(data){
    var el=document.getElementById('eventos-list');if(!el)return;
    var fut=[],atv=[],hist=[];
    (data.eventos||[]).forEach(function(ev){var t=st(ev);
      if(t==='FUTURO')fut.push(ev);else if(t==='ATIVO')atv.push(ev);else hist.push(ev);});
    fut.sort(function(a,b){return a.inicio<b.inicio?-1:1;});
    var html='';
    atv.forEach(function(ev){html+=card(ev,'#2ECC71','🟢 Acontecendo agora');});
    fut.forEach(function(ev){html+=card(ev,'var(--primary)','Confirmado');});
    if(!atv.length&&!fut.length){html+='<div class="card" style="text-align:center;padding:20px;"><p style="font-size:14px;color:var(--gray-600);margin:0;">📅 Nenhum evento futuro confirmado no momento.</p><p style="font-size:12px;color:var(--gray-400);margin:8px 0 0;">Acompanhe o calendário oficial da <a href="https://www.spsurf.com.br/" target="_blank" style="color:var(--primary);">SPSurf</a> e o Instagram <a href="https://instagram.com/asf.surffeminino" target="_blank" style="color:var(--primary);">@asf.surffeminino</a>.</p></div>';}
    if(hist.length){html+='<details style="margin-top:8px;"><summary style="font-size:13px;color:var(--gray-400);cursor:pointer;">📁 Histórico ('+hist.length+' evento'+(hist.length>1?'s':'')+' encerrado'+(hist.length>1?'s':'')+')</summary><div style="margin-top:8px;opacity:0.75;">'+hist.map(function(ev){return card(ev,'var(--gray-400)','Encerrado');}).join('')+'</div></details>';}
    el.innerHTML=html;
  }).catch(function(){var el=document.getElementById('eventos-list');if(el)el.innerHTML='<p style="font-size:13px;color:var(--gray-400);">Não foi possível carregar os eventos agora.</p>';});
})();
            </script>
            '''

if EV_START in s:
    i = s.index(EV_START)
    j = s.index(BANNER_MARK, i)
    old_block = s[i:j]
    for t in ["WQS 5000", "Copa Litoral Paulista", "Etapa Municipal Bertioga", "calendario-2025"]:
        assert t in old_block, "bloco de eventos inesperado: falta " + t
    s = s[:i] + NEW_BLOCK + s[j:]
    print("📅 eventos estáticos substituídos por camada temporal (data/events.json)")
else:
    print("⏭️  bloco de eventos já dinâmico")

# countdown estático "16 dias" -> neutro
old_cd = '<p style="font-size: 13px; opacity: 0.9;">Próxima competição em</p>\n                        <p style="font-size: 28px; font-weight: 800;" id="countdown">16 dias</p>\n                        <p style="font-size: 12px; opacity: 0.8;">Circuito Paulista - Santos</p>'
new_cd = '<p style="font-size: 13px; opacity: 0.9;">Próxima competição</p>\n                        <p style="font-size: 22px; font-weight: 800;" id="countdown">A definir</p>\n                        <p style="font-size: 12px; opacity: 0.8;">Aguardando calendário oficial SPSurf</p>'
if old_cd in s:
    s = s.replace(old_cd, new_cd)
    print("⏳ countdown estático '16 dias' neutralizado")


# ---------- 1b) ASF_CALENDAR: remover eventos expirados (exceto futuros) ----------
EXPIRED_CAL = [
 '{id:1,title:"WQS 5000 - Praia do Tombo",date:"2026-08-15",endDate:"2026-08-17",type:"competicao",icon:"&#x1F3C6;",location:"Bertioga",confirmed:true,participants:12,maxParticipants:24,description:"Etapa feminina do World Qualifying Series",category:"Competicao"},\n',
 '{id:2,title:"Aula Coletiva de Surf",date:"2026-08-23",type:"aula",icon:"&#x1F3C4;",location:"Maresias",confirmed:true,participants:8,maxParticipants:15,description:"Aula para iniciantes — 7h na praia",category:"Aula"},\n',
 '{id:3,title:"Encontro Mulheres no Mar",date:"2026-09-05",type:"encontro",icon:"&#x1F469;",location:"Guaruja",confirmed:false,participants:5,maxParticipants:30,description:"Encontro de mulheres surfistas - networking + surf",category:"Encontro"},\n',
 '{id:4,title:"Surf Trip - Feriada^o",date:"2026-09-07",endDate:"2026-09-10",type:"trip",icon:"&#x1F697;",location:"Joaquina/SC",confirmed:false,participants:6,maxParticipants:12,description:"Surf trip de feriada^o — 4 dias de ondas!",category:"Surf Trip"},\n',
]
for line in EXPIRED_CAL:
    if line in s:
        s = s.replace(line, '')
        print("🗓️  evento expirado removido do calendário:", line[6:60])
    else:
        print("⏭️  evento de calendário já removido:", line[6:40])

# ---------- 1c) Assistente ASF: resposta citava evento expirado ----------
old_qa = "{q:['competicao','wqs','evento','campeonato','torneio de surf','inscricao'],a:'&#x1F3C6; Maiores eventos ASF: WQS 5000 Praia do Tombo (ago), etapas regionais em Bertioga e Guaruja. Inscricoes pela aba &#x1F3C6; Competicoes no menu principal. Iniciantes — comecando por classificatorias locais!'}"
new_qa = "{q:['competicao','wqs','evento','campeonato','torneio de surf','inscricao'],a:'&#x1F3C6; Eventos e competicoes: acompanhe a aba &#x1F3C6; Competicoes (atualizada pelo calendario oficial SPSurf) e o Instagram @asf.surffeminino. Iniciantes — comecando por classificatorias locais!'}"
if old_qa in s:
    s = s.replace(old_qa, new_qa)
    print("🤖 resposta da Assistente ASF atualizada (sem evento expirado)")

# ---------- validações ----------
assert s != orig, "nada mudou?"
for gone in ['id="praias-guia"', 'id="surf-news-2"', 'id="comunidade-hidden"', 'id="mobilidade-extra"',
             "showSection('praias-guia')", 'WQS 5000', 'Copa Litoral Paulista', 'Etapa Municipal Bertioga',
             'calendario-2025', '16 dias']:
    assert gone not in s, "referência restante: " + gone
assert s.count('<style') == s.count('</style>'), "style desbalanceado"
delta_orig = orig.count('<div') - orig.count('</div>')
delta_new = s.count('<div') - s.count('</div>')
assert delta_new <= delta_orig and delta_new >= delta_orig - 1, f"balanço de divs inesperado: {delta_orig} -> {delta_new}"
print(f"⚖️  balanço de divs: {delta_orig} -> {delta_new} (div órfã pré-existente corrigida)")
assert 'id="competicoes"' in s and 'id="eventos-list"' in s
assert 'id="praias"' in s and 'id="loja"' in s and 'id="conquistas-secretas"' in s, "seção preservada afetada!"

open('index.html', 'w', encoding='utf-8').write(s)
print(f"✅ index.html: {len(orig)-len(s)} bytes removidos — todas as validações passaram")
