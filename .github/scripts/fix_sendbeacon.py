#!/usr/bin/env python3
"""Adiciona navigator.sendBeacon ao registrar(d) da carteirinha (com fallback fetch via sbRpc).

Conforme auditoria 06/10: spec exige sendBeacon + fallback. sendBeacon nao aceita
headers customizados, entao a apikey vai como query param (PostgREST aceita
?apikey=) e o body vai como Blob application/json.
Idempotente.
"""
import re

path = "carteirinha.js"
js = open(path, encoding="utf-8").read()
orig = js

OLD = """      this.sbRpc('emitir_carteirinha', {
        p_numero: d.numero,
        p_email_hash: d.emailHash,
        p_nome: d.nome, p_apelido: d.apelido || '', p_nivel: d.nivel,
        p_praia: d.praia || '', p_cidade: d.cidade || '', p_insta: d.insta || '',
      }).then(() => {
        d.registrada = new Date().toISOString();
        this.save(d);
        if (typeof showToast === 'function') showToast('""" + "\ud83d\udcc7" + """ Carteirinha registrada na rede ASF!');
      }).catch(function(){});"""

NEW = """      var payload = {
        p_numero: d.numero,
        p_email_hash: d.emailHash,
        p_nome: d.nome, p_apelido: d.apelido || '', p_nivel: d.nivel,
        p_praia: d.praia || '', p_cidade: d.cidade || '', p_insta: d.insta || '',
      };
      var self = this;
      var onOk = function() {
        d.registrada = new Date().toISOString();
        self.save(d);
        if (typeof showToast === 'function') showToast('""" + "\ud83d\udcc7" + """ Carteirinha registrada na rede ASF!');
      };
      /* sendBeacon (confiavel mesmo com pagina fechando/offline) com fallback fetch */
      if (navigator.sendBeacon) {
        var beaconUrl = this.SUPABASE_URL + '/rest/v1/rpc/emitir_carteirinha?apikey=' + encodeURIComponent(this.SUPABASE_ANON_KEY);
        var ok = navigator.sendBeacon(beaconUrl, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        if (ok) { onOk(); return; }
      }
      this.sbRpc('emitir_carteirinha', payload).then(onOk).catch(function(){});"""

if OLD in js:
    js = js.replace(OLD, NEW)
    print("OK: registrar(d) agora usa sendBeacon + fallback fetch")
elif "sendBeacon" in js:
    print("SKIP: sendBeacon ja presente")
else:
    print("ERRO: trecho alvo nao encontrado")
    raise SystemExit(1)

if js != orig:
    open(path, "w", encoding="utf-8").write(js)
    print("carteirinha.js atualizado")

# bump cache do service worker
sw_path = "sw.js"
sw = open(sw_path, encoding="utf-8").read()
m = re.search(r"(asf-[a-z-]*v)(\d+)", sw)
if m:
    open(sw_path, "w", encoding="utf-8").write(
        sw[:m.start()] + m.group(1) + str(int(m.group(2)) + 1) + sw[m.end():])
    print(f"sw.js cache bump: {m.group(1)}{m.group(2)} -> {m.group(1)}{int(m.group(2))+1}")
