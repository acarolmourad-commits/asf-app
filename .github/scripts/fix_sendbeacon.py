#!/usr/bin/env python3
"""Adiciona navigator.sendBeacon ao registrar(d) da carteirinha (fallback fetch via sbRpc).

Versao 2: usa regex (imune a emoji/encoding). sendBeacon nao aceita headers
customizados, entao a apikey vai como query param (?apikey=, aceito pelo
PostgREST) e o body vai como Blob application/json.
Idempotente: pula se 'navigator.sendBeacon' ja estiver no arquivo.
"""
import re, sys

path = "carteirinha.js"
js = open(path, encoding="utf-8").read()
orig = js

if "navigator.sendBeacon" in js:
    print("SKIP: navigator.sendBeacon ja presente")
else:
    pat = re.compile(
        r"      this\.sbRpc\('emitir_carteirinha', \{\n"
        r"(.*?)"
        r"      \}\)\.then\(\(\) => \{\n"
        r"(.*?)"
        r"      \}\)\.catch\(function\(\)\{\}\);",
        re.S,
    )
    m = pat.search(js)
    if not m:
        print("ERRO: trecho alvo nao encontrado")
        sys.exit(1)
    payload_lines, ok_lines = m.group(1), m.group(2)
    ok_fn = ok_lines.replace("this.save(d)", "self.save(d)").rstrip()
    new_block = (
        "      var payload = {\n"
        + payload_lines
        + "      };\n"
        "      var self = this;\n"
        "      var onOk = () => {\n"
        + ok_fn + "\n"
        "      };\n"
        "      /* sendBeacon (confiavel mesmo com pagina fechando/offline) com fallback fetch */\n"
        "      if (navigator.sendBeacon) {\n"
        "        var beaconUrl = this.SUPABASE_URL + '/rest/v1/rpc/emitir_carteirinha?apikey=' + encodeURIComponent(this.SUPABASE_ANON_KEY);\n"
        "        if (navigator.sendBeacon(beaconUrl, new Blob([JSON.stringify(payload)], { type: 'application/json' }))) { onOk(); return; }\n"
        "      }\n"
        "      this.sbRpc('emitir_carteirinha', payload).then(onOk).catch(function(){});"
    )
    js = js[:m.start()] + new_block + js[m.end():]
    print("OK: registrar(d) agora usa navigator.sendBeacon + fallback fetch")

if js != orig:
    open(path, "w", encoding="utf-8").write(js)
    print("carteirinha.js atualizado")

# bump cache do service worker
sw_path = "sw.js"
sw = open(sw_path, encoding="utf-8").read()
m2 = re.search(r"(asf-[a-z-]*v)(\d+)", sw)
if m2:
    open(sw_path, "w", encoding="utf-8").write(
        sw[:m2.start()] + m2.group(1) + str(int(m2.group(2)) + 1) + sw[m2.end():])
    print(f"sw.js cache bump: {m2.group(1)}{m2.group(2)} -> {m2.group(1)}{int(m2.group(2))+1}")
