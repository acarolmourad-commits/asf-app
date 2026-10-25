#!/usr/bin/env python3
"""Fase 1 (2026-10-25): carteirinha via RPC emitir_carteirinha + higiene.

- Substitui os dois trechos de REST direto em /rest/v1/associadas por
  sbRpc('emitir_carteirinha', {p_*}) em registrar(d) e em salvar().
- Remove proposal_price dos arquivos publicos de campanha e deduplica
  Smart Fit em docs/brand-emails.json (preserva todos os demais dados).
- Registra a correcao de estado em docs/carteirinhas-sync.md e
  docs/carteirinhas-sync-log.json.
Idempotente: se nao houver REST direto, nada muda em carteirinha.js.
"""
import json
import re

# ---------- carteirinha.js ----------
PATH = "carteirinha.js"
js = open(PATH, encoding="utf-8").read()

NEW_REGISTRAR = '''  /* Registro na rede ASF via RPC 'emitir_carteirinha' (SECURITY DEFINER).
     A RPC existe e retorna apenas numero, validade e status; a tabela
     'associadas' nao deve ser acessada diretamente pelo cliente anonimo.
     Opt-in LGPD: registrada apenas se card-registrar estiver marcado.
     emailHash ja foi gerado em salvar() e salvo no localStorage. */
  registrar(d) {
    try {
      const cb = document.getElementById('card-registrar');
      const quer = (cb && cb.checked) || d.registrada;
      if (!quer) return;
      if (!this.supabaseOn || !d.emailHash || d.registrada) return;
      this.sbRpc('emitir_carteirinha', {
        p_numero: d.numero,
        p_email_hash: d.emailHash,
        p_nome: d.nome,
        p_apelido: d.apelido || null,
        p_nivel: d.nivel || null,
        p_praia: d.praia || null,
        p_cidade: d.cidade || null,
        p_insta: d.insta || null,
      }).then((res) => {
        const result = Array.isArray(res) ? (res[0] || {}) : (res || {});
        if (result && result.numero) {
          d.numero = result.numero;
          if (result.validade) d.validade = String(result.validade).split('-').reverse().join('/');
          d.registrada = new Date().toISOString();
          this.save(d);
          if (typeof showToast === 'function') showToast('Carteirinha registrada na rede ASF!');
        } else {
          console.warn('Supabase registro sem retorno de carteirinha.');
        }
      }).catch((e) => {
        console.warn('Supabase registro erro:', e.message);
      });
    } catch (e) {
      console.warn('registrar() error:', e);
    }
  },
'''

NEW_SALVAR = '''      /* -- caminho servidor (Supabase): RPC 'emitir_carteirinha' (SECURITY DEFINER).
          A RPC existe; emite/renova, registra em 'emissoes' e retorna apenas
          numero, validade e status. Nunca acessar diretamente a tabela
          'associadas' com a chave anonima neste fluxo. -- */
      if (central && this.supabaseOn) {
        try {
          const emailHash = atual.emailHash || await this.sha256(email);
          d.emailHash = emailHash;
          const res = await this.sbRpc('emitir_carteirinha', {
            p_numero: d.numero,
            p_email_hash: emailHash,
            p_nome: d.nome,
            p_apelido: d.apelido || null,
            p_nivel: d.nivel || null,
            p_praia: d.praia || null,
            p_cidade: d.cidade || null,
            p_insta: d.insta || null,
          });
          const result = Array.isArray(res) ? (res[0] || {}) : (res || {});
          if (result.numero) {
            d.numero = result.numero;
            if (result.validade) d.validade = String(result.validade).split('-').reverse().join('/');
            d.registrada = new Date().toISOString();
            this.registrarEmissao(d.numero);
            this.save(d);
            this.render('carteirinha-content');
            showToast('Carteirinha registrada na ASF!');
            if (typeof ASF_GAMIFICATION !== 'undefined') ASF_GAMIFICATION.checkAll();
            return;
          } else {
            throw new Error('Supabase RPC emitir_carteirinha sem numero de retorno');
          }
        } catch (e) {
          console.warn('Supabase registro erro:', e.message);
          showToast('Registro indisponivel. Sua carteirinha sera salva neste dispositivo; tente registrar depois.');
        }
      }
'''

if "/rest/v1/associadas" in js:
    a = js.index("  /* Registro na rede ASF")
    b = js.index("  escape(v) {")
    js = js[:a] + NEW_REGISTRAR + js[b:]
    central = js.index("      if (central && this.supabaseOn) {")
    a2 = js.rindex("      /*", 0, central)
    b2 = js.index("      /* cai no fluxo local abaixo */")
    js = js[:a2] + NEW_SALVAR + js[b2:]
    assert "/rest/v1/associadas" not in js, "REST direto ainda presente"
    open(PATH, "w", encoding="utf-8").write(js)
    print("carteirinha.js: RPC aplicada")
else:
    print("carteirinha.js: nada a fazer (ja usa RPC)")

# ---------- campanha: sem valores, sem duplicados ----------
def clean_campaign(path, note):
    data = json.load(open(path, encoding="utf-8"))
    seen = set()
    out = []
    for item in data.get("brand_emails", []):
        key = ((item.get("name") or "").strip().lower(),
               (item.get("email") or "").strip().lower())
        if key in seen:
            continue
        seen.add(key)
        out.append({k: v for k, v in item.items() if k != "proposal_price"})
    data["brand_emails"] = out
    data["campaign_data_note"] = note
    json.dump(data, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
    open(path, "a", encoding="utf-8").write("\n")
    print(path, "limpo:", len(out), "marcas unicas, sem valores")

clean_campaign("docs/brand-emails.json",
               "Arquivo publico de campanha: nao contem valores de proposta. "
               "Valores comerciais ficam apenas em sistema privado (CRM/Notion). "
               "Fonte principal de marcas pendentes de envio.")
clean_campaign("docs/brand-emails-confirmed.json",
               "Arquivo publico: sem valores de proposta. "
               "Valores comerciais apenas em sistema privado.")

# ---------- documentacao de estado ----------
md_path = "docs/carteirinhas-sync.md"
md = open(md_path, encoding="utf-8").read()
md = re.sub(r"(?m)^.*SELECT na.*associadas.*$",
            "| SELECT na `associadas` | Aberto temporariamente (policy publica) | "
            "Apenas para o painel legado; fechar na Fase 3 com painel autenticado |", md)
if "Atualizacao 2026-10-25" not in md:
    md += """

## Atualizacao 2026-10-25 - Fases 1 e 2 (Carteirinha + Supabase)

- A RPC `emitir_carteirinha` EXISTE (SECURITY DEFINER, parametros `p_*`):
  o 404 anterior era chamada sem o prefixo `p_`. Emissao/renovacao e
  verificacao passam a ser feitas somente via RPC (`sbRpc`).
- `carteirinha.js` nao acessa mais diretamente `/rest/v1/associadas`.
- Fase 2 (2026-10-25): removidas as policies publicas de INSERT e UPDATE
  em `associadas`. A RPC continua emitindo por ser SECURITY DEFINER.
- SELECT publico permanece TEMPORARIAMENTE apenas porque o painel legado
  `carteirinhas.html` lista associadas via anon. Fase 3: painel com
  autenticacao de admin e remocao do SELECT publico.
- Nada foi apagado: registros de associadas e emissoes preservados.
"""
open(md_path, "w", encoding="utf-8").write(md)
print("docs/carteirinhas-sync.md atualizado")

log_path = "docs/carteirinhas-sync-log.json"
log = json.load(open(log_path, encoding="utf-8"))
log["date"] = "2026-10-25"
st = log.setdefault("supabase_status", {})
st["rpc_emitir_carteirinha"] = ("EXISTS (SECURITY DEFINER) - usado via "
    "POST /rest/v1/rpc/emitir_carteirinha com parametros p_*")
st["anon_select"] = ("FUNCIONA (policy publica TEMPORARIA apenas para o "
    "painel legado; fechar na Fase 3 com painel autenticado)")
st["anon_insert"] = "Policy removida na Fase 2 (2026-10-25); emissao via RPC"
st["anon_update"] = "Policy removida na Fase 2 (2026-10-25); emissao via RPC"
log["pending_actions"] = [
    {"action": "Migrar painel carteirinhas.html para autenticacao de admin "
               "e remover o SELECT publico de associadas (Fase 3)",
     "owner": "Supabase Admin", "priority": "high"},
    {"action": "Configurar .env.sync (service_role key)",
     "owner": "Carol", "priority": "medium"},
    {"action": "Publicar ASF_Carteirinhas_Registry.gs no Apps Script",
     "owner": "Carol", "priority": "medium"},
]
json.dump(log, open(log_path, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
open(log_path, "a", encoding="utf-8").write("\n")
print("docs/carteirinhas-sync-log.json atualizado")
print("Fase 1 aplicada.")
