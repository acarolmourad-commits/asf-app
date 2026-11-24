#!/usr/bin/env python3
"""ASF Carteirinha - consolidacao RPC unico (Fase A+B, 2026-10-26). Idempotente."""
from pathlib import Path
import sys
ROOT = Path(__file__).resolve().parents[2]
def fail(m):
    print(f'ERRO: {m}', file=sys.stderr); raise SystemExit(1)
# carteirinha.js
p = ROOT / 'carteirinha.js'; t = p.read_text(encoding='utf-8')
if 'async emitirCarteirinha(params)' not in t:
    a = "    if (!r.ok) throw new Error('RPC ' + fn + ': ' + r.status);\n    return r.json();\n  },\n"
    if t.count(a) != 1: fail(f'carteirinha.js ancora sbRpc {t.count(a)}x')
    h = a + "\n  async emitirCarteirinha(params) {\n    let lastError;\n    for (let attempt = 0; attempt < 3; attempt++) {\n      try { return await this.sbRpc('emitir_carteirinha', params); } catch (e) {\n        lastError = e; const msg = String((e && e.message) || e);\n        if (attempt < 2 && /409|23505|duplicate|associadas_numero/i.test(msg)) { params = Object.assign({}, params, { p_numero: this.gerarNumero() }); continue; }\n        throw e; } } throw lastError; },\n"
    t = t.replace(a, h)
    if t.count("this.sbRpc('emitir_carteirinha', {") != 2: fail('carteirinha.js call sites != 2')
    t = t.replace("this.sbRpc('emitir_carteirinha', {", 'this.emitirCarteirinha({')
    p.write_text(t, encoding='utf-8'); print('carteirinha.js atualizado')
# emitir.html
p = ROOT / 'emitir.html'; t = p.read_text(encoding='utf-8')
if 'Caminho oficial unico: RPC emitir_carteirinha' not in t:
    s = t.find('async function issue(payload){'); e = t.find("form.addEventListener('submit'")
    if s < 0 or e <= s: fail('emitir.html issue() nao localizado')
    ni = "async function issue(payload){\n  // Caminho oficial unico: RPC emitir_carteirinha (SECURITY DEFINER).\n  const r0 = await ASF_CARD.emitirCarteirinha({p_numero: payload.numero, p_email_hash: payload.email_hash, p_nome: payload.nome, p_apelido: payload.apelido || null, p_nivel: payload.nivel || null, p_praia: payload.praia || null, p_cidade: payload.cidade || null, p_insta: payload.insta || null});\n  const r = Array.isArray(r0) ? r0[0] : r0;\n  if(!r||!/^ASF-[A-Z0-9]{6,12}$/.test(r.numero)||!/^\\d{4}-\\d{2}-\\d{2}$/.test(r.validade)) throw new Error('resposta invalida');\n  return r;\n}\n"
    t = t[:s] + ni + t[e:]
    for o, n in [('praia:payload.p_praia','praia:payload.praia'),('apelido:payload.p_apelido','apelido:payload.apelido'),('cidade:payload.p_cidade','cidade:payload.cidade'),('insta:payload.p_insta','insta:payload.insta')]:
        if t.count(o) != 1: fail(f'emitir.html {o} {t.count(o)}x')
        t = t.replace(o, n)
    if '/rest/v1/associadas?select=*&on_conflict' in t: fail('emitir.html REST direto residual')
    p.write_text(t, encoding='utf-8'); print('emitir.html atualizado')
# runbook
p = ROOT / 'docs/carteirinhas-production-runbook.md'; t = p.read_text(encoding='utf-8')
m = '## Fase A+B - RPC unico + painel admin (2026-10-26)'
if m not in t:
    t += '\n\n' + m + '\n\n- Emissao oficial UNICA: RPC emitir_carteirinha via ASF_CARD.emitirCarteirinha() (home e emitir.html). Proibido gravar direto em /rest/v1/associadas.\n- Dados preservados: localStorage asf-card-v2/asf-card-history, associadas e emissoes.\n- Painel interno carteirinhas-admin.html: login por link magico, RLS admin, Realtime.\n- Policy publica de SELECT so sai depois do 1o login confirmado (etapa separada).\n- Planilha privada = backup/reconciliacao, nunca fonte.\n- Workflows one-shot antigos removidos.\n'
    p.write_text(t, encoding='utf-8'); print('runbook atualizado')
print('OK')
