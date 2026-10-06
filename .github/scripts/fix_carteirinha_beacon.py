#!/usr/bin/env python3
"""Adiciona navigator.sendBeacon (com fallback fetch via sbRpc) na funcao
registrar(d) de carteirinha.js, conforme spec da auditoria. Idempotente."""

path = "carteirinha.js"
js = open(path, encoding="utf-8").read()

if "navigator.sendBeacon" in js:
    print("sendBeacon ja presente, nada a fazer")
    raise SystemExit(0)

old_block = """      this.sbRpc('emitir_carteirinha', {
        p_numero: d.numero,
        p_email_hash: d.emailHash,
        p_nome: d.nome, p_apelido: d.apelido || '', p_nivel: d.nivel,
        p_praia: d.praia || '', p_cidade: d.cidade || '', p_insta: d.insta || '',
      }).then(() => {
        d.registrada = new Date().toISOString();
        this.save(d);
        if (typeof showToast === 'function') showToast('\U0001F4C7 Carteirinha registrada na rede ASF!');
      }).catch(function(){});"""

new_block = """      const payload = {
        p_numero: d.numero,
        p_email_hash: d.emailHash,
        p_nome: d.nome, p_apelido: d.apelido || '', p_nivel: d.nivel,
        p_praia: d.praia || '', p_cidade: d.cidade || '', p_insta: d.insta || '',
      };
      const url = this.SUPABASE_URL + '/rest/v1/rpc/emitir_carteirinha?apikey=' + encodeURIComponent(this.SUPABASE_ANON_KEY);
      const done = () => {
        d.registrada = new Date().toISOString();
        this.save(d);
        if (typeof showToast === 'function') showToast('\U0001F4C7 Carteirinha registrada na rede ASF!');
      };
      /* sendBeacon primeiro (sobrevive a fechamento de aba / offline parcial);
         fallback para fetch via sbRpc se indisponivel ou recusado */
      let sent = false;
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        try {
          sent = navigator.sendBeacon(url, new Blob([JSON.stringify(payload)], { type: 'application/json' }));
        } catch (e) { sent = false; }
      }
      if (sent) { done(); }
      else {
        this.sbRpc('emitir_carteirinha', payload).then(done).catch(function(){});
      }"""

assert old_block in js, "bloco alvo nao encontrado em registrar(d)"
open(path, "w", encoding="utf-8").write(js.replace(old_block, new_block))
print("carteirinha.js atualizado: sendBeacon + fallback fetch")
