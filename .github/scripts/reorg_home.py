"""Reorganiza a home ASF: hero com 2 CTAs, blocos de caminhos/jornada/rede/sobre,
fonte única do número de apps (54, verificado em app-status.json).
Com asserts: falha antes de escrever se qualquer âncora não existir."""
import pathlib, sys

idx = pathlib.Path("index.html")
src = idx.read_text(encoding="utf-8")

CARD = "display:block;background:#fff;border-radius:16px;padding:18px;text-decoration:none;color:#0E2439;box-shadow:0 2px 10px rgba(0,0,0,.06);border:1px solid rgba(0,168,204,0.15)"

old_cta = """        <div class="hero-cta">
            <button class="btn btn-primary" onclick="showSection('dicas')">
                📚 Ver Dicas
            </button>
            <button class="btn btn-secondary" onclick="showSection('comunidade')">
                👥 Comunidade
            </button>
            <a class="btn btn-secondary" href="aprender/como-comecar-a-surfar-mulheres.html" style="display:inline-flex;align-items:center;text-decoration:none;">
                📖 Guia: como começar
            </a>
        </div>"""

new_cta = """        <div class="hero-cta">
            <a class="btn btn-primary" href="#comecar" style="text-decoration:none;">
                🏄‍♀️ Começar agora
            </a>
            <a class="btn btn-secondary" href="guia-apps.html" style="text-decoration:none;">
                🗺️ Explorar a ASF
            </a>
        </div>"""

bloco2 = """
    <!-- BLOCO 2 - Por onde voce quer comecar? -->
    <nav id="comecar" aria-label="Caminhos principais" style="margin: 8px 20px 24px;">
        <h2 class="section-title" style="text-align:center;">Por onde você quer começar?</h2>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <a href="previsao-surf/" style="CARDSTYLE"><span style="font-size:1.8rem" aria-hidden="true">🌊</span><b style="display:block;margin:6px 0 2px">Quero Surfar</b><small style="color:#666">Previsão, praias, marés, condições e segurança.</small></a>
            <a href="aprender/index.html" style="CARDSTYLE"><span style="font-size:1.8rem" aria-hidden="true">🏄</span><b style="display:block;margin:6px 0 2px">Quero Evoluir</b><small style="color:#666">Técnica, treino, yoga, nutrição e bem-estar.</small></a>
            <a href="sessoes-interativas.html" style="CARDSTYLE"><span style="font-size:1.8rem" aria-hidden="true">👭</span><b style="display:block;margin:6px 0 2px">Quero Conhecer Manas</b><small style="color:#666">Comunidade, diário, eventos e conquistas.</small></a>
            <a href="surf-trip/" style="CARDSTYLE"><span style="font-size:1.8rem" aria-hidden="true">🌎</span><b style="display:block;margin:6px 0 2px">Quero Explorar</b><small style="color:#666">Surf trips, hospedagens, cultura e destinos.</small></a>
        </div>
    </nav>

    <!-- BLOCO 3 - Comece sua jornada -->
    <div class="card" style="margin: 0 20px 20px; padding: 18px 20px; border-radius: 16px;">
        <h2 class="section-title">Comece sua jornada</h2>
        <ol style="margin:0;padding-left:20px;line-height:2;font-size:14px;">
            <li><a href="sobre.html" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Conheça a ASF</a></li>
            <li><a href="#carteirinha" onclick="showSection('carteirinha');if(typeof ASF_CARD!=='undefined')ASF_CARD.init();return false" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Crie sua identidade ASF (Carteirinha gratuita)</a></li>
            <li><a href="previsao-surf/" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Descubra seu surf</a></li>
            <li><a href="https://acarolmourad-commits.github.io/asf-diario/" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Registre suas sessões no Diário</a></li>
            <li><a href="sessoes-interativas.html" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Encontre suas manas</a></li>
            <li><a href="aprender/index.html" style="color:var(--primary,#00A8CC);text-decoration:none;font-weight:600">Evolua com os guias</a></li>
        </ol>
    </div>

    <!-- BLOCO 4 - A Rede ASF -->
    <div class="card" style="margin: 0 20px 20px; padding: 18px 20px; border-radius: 16px;">
        <h2 class="section-title">A Rede ASF</h2>
        <p style="font-size:13px;margin:0 0 12px;color:#666;">Todos os <span data-asf-apps-count>54</span> apps gratuitos da rede de surf feminino, organizados por categoria:</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:13px;">
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🌊 Mar &amp; Condições</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🏄 Corpo &amp; Treino</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🧠 Mente &amp; Bem-estar</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🛟 Segurança</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">👭 Comunidade</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🏆 Gamificação</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🌎 Cultura &amp; Viagens</span>
            <span style="background:rgba(0,168,204,0.08);padding:6px 12px;border-radius:20px;">🎒 Equipamentos &amp; Parcerias</span>
        </div>
        <a href="guia-apps.html" style="display:block;text-align:center;margin-top:14px;background:linear-gradient(135deg,#0E2439,#00A8CC);color:#fff;padding:12px;border-radius:12px;text-decoration:none;font-weight:600;">🗺️ Explorar todos os apps →</a>
    </div>
""".replace("CARDSTYLE", CARD)

sobre = """    <!-- BLOCO 11 - Sobre a ASF -->
    <div class="card" style="margin: 0 20px 24px; padding: 18px 20px; border-radius: 16px;">
        <h2 class="section-title">Sobre a ASF</h2>
        <p style="font-size:13.5px;margin:0 0 12px;color:#444;line-height:1.6;">A ASF – Associação de Surf Feminino conecta mulheres ao surf, à comunidade e à evolução dentro do esporte — do primeiro banho de mar ao free surf.</p>
        <a href="sobre.html" style="display:block;text-align:center;background:#fff;border:1px solid rgba(0,168,204,0.3);color:var(--primary,#00A8CC);padding:12px;border-radius:12px;text-decoration:none;font-weight:600;">Conheça a ASF →</a>
    </div>

"""

edits_index = [
    (old_cta, new_cta),
    (new_cta + "\n    </section>", new_cta + "\n    </section>\n" + bloco2),
    ('<h3 style="margin: 0 0 4px; font-size: 16px; color: var(--secondary, #0E2439);">📖 Guias ASF</h3>',
     '<h3 style="margin: 0 0 4px; font-size: 16px; color: var(--secondary, #0E2439);">📚 Aprenda e Evolua</h3>'),
    ("""o que o mar faz pela mente</a>
        </div>""",
     """o que o mar faz pela mente</a>
            <a href="aprender/index.html" style="display:block; padding: 12px 14px; border-radius: 12px; background: linear-gradient(135deg,#0E2439,#00A8CC); text-decoration:none; color: #fff; font-size: 13.5px; font-weight:600; text-align:center;">Ver todos os guias →</a>
        </div>"""),
    ("Todos os 52 apps gratuitos", 'Todos os <span data-asf-apps-count>54</span> apps gratuitos'),
    ('<script src="data/mock-manas.js"></script>',
     '<script src="data/mock-manas.js"></script>\n    <script src="data/apps-count.js"></script>'),
    ('    <footer role="contentinfo"', sobre + '    <footer role="contentinfo"'),
]

for old, new in edits_index:
    assert old in src, "âncora não encontrada: " + old[:70]
    src = src.replace(old, new, 1)

assert src.count("<h1") == 1
assert src.count('data-asf-apps-count') == 2
idx.write_text(src, encoding="utf-8")
print("index.html reorganizado:", len(src), "bytes")

# --- guia-apps.html ---
g = pathlib.Path("guia-apps.html")
gt = g.read_text(encoding="utf-8")
g_edits = [
 ("<title>Guia de Apps ASF — Todos os 53 aplicativos da rede de surf feminino</title>",
  "<title>Guia de Apps ASF — Todos os 54 aplicativos da rede de surf feminino</title>"),
 ("constelação ASF: 52 apps gratuitos", "constelação ASF: 54 apps gratuitos"),
 ("Guia de Apps ASF — 53 aplicativos gratuitos de surf feminino", "Guia de Apps ASF — 54 aplicativos gratuitos de surf feminino"),
 ("A constelação ASF tem 53 aplicativos web gratuitos", "A constelação ASF tem 54 aplicativos web gratuitos"),
 ("<p>53 aplicativos gratuitos, conectados", '<p><span data-asf-apps-count>54</span> aplicativos gratuitos, conectados'),
 ("<details><summary>Quantos apps tem a rede ASF?</summary><p>53 aplicativos web gratuitos",
  '<details><summary>Quantos apps tem a rede ASF?</summary><p><span data-asf-apps-count>54</span> aplicativos web gratuitos'),
 ("</head>", '    <script src="data/apps-count.js"></script>\n</head>'),
]
for old, new in g_edits:
    assert old in gt, "guia-apps âncora: " + old[:70]
    gt = gt.replace(old, new, 1)
g.write_text(gt, encoding="utf-8")
print("guia-apps.html ok")

# --- apps-em-destaque.html ---
d = pathlib.Path("apps-em-destaque.html")
dt = d.read_text(encoding="utf-8")
d_edits = [
 ("— 53 apps gratuitos de surf feminino conectados.", "— 54 apps gratuitos de surf feminino conectados."),
 ("<p>A Rede ASF tem 53 apps gratuitos de surf feminino", '<p>A Rede ASF tem <span data-asf-apps-count>54</span> apps gratuitos de surf feminino'),
 ("</head>", '    <script src="data/apps-count.js"></script>\n</head>'),
]
for old, new in d_edits:
    assert old in dt, "apps-em-destaque âncora: " + old[:70]
    dt = dt.replace(old, new, 1)
d.write_text(dt, encoding="utf-8")
print("apps-em-destaque.html ok")
print("PATCH APLICADO COM SUCESSO")
