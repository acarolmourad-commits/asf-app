from pathlib import Path
import hashlib

def blob(data):
    return hashlib.sha1(b"blob "+str(len(data)).encode()+b"\0"+data).hexdigest()

target=Path("index.html")
raw=target.read_bytes()
expected="cd54b0de660834ab42614de517bf0c4bb3e5da55"
css=Path("asf-journeys-review.css").read_bytes()
if blob(css)!="fec34fbb9be15b3f4ff290c25396c85b07eae0e4":
    raise SystemExit("Approved journeys stylesheet mismatch; no changes applied.")
if blob(raw)!=expected:
    raise SystemExit("Home has changed since review; no changes applied.")
text=raw.decode("utf-8")
anchor="    <!-- Guias ASF - Conteúdo editorial -->"
if text.count(anchor)!=1 or text.count("</head>")!=1 or "asf-journeys-title-home" in text:
    raise SystemExit("Home insertion preconditions failed; no changes applied.")
fragment='<section class="asf-journeys" aria-labelledby="asf-journeys-title-home"><h2 id="asf-journeys-title-home">Uma rede, três formas de começar</h2><p>Escolha seu momento e conecte os aplicativos à sua rotina de surf.</p><div class="asf-journeys-grid">\n<article><h3>Antes de entrar no mar</h3><p>Observe a previsão, aprenda a ler o pico e organize sua sessão. As ferramentas não substituem a avaliação local nem a orientação profissional.</p><ul>\n<li><a href="https://acarolmourad-commits.github.io/asf-previsao/">🌊 ASF Previsão</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-leitura/">👁️ ASF Leitura de Mar</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-seguranca/">🛟 ASF Segurança</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-checklist/">✅ ASF Checklist</a></li>\n</ul></article>\n<article><h3>Evolua no seu ritmo</h3><p>Combine preparação física, prática de pop-up, mobilidade e registro de sessões. Adapte os exercícios ao seu nível e respeite os sinais do corpo.</p><ul>\n<li><a href="https://acarolmourad-commits.github.io/asf-treino/">🏋️ ASF Treino</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-popup/">⏱️ ASF Pop-up</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-yoga/">🧘 ASF Yoga</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-diario/">📓 ASF Diário</a></li>\n</ul></article>\n<article><h3>Explore com a comunidade</h3><p>Conheça praias, planeje uma surf trip e descubra parceiras. Combine condições e responsabilidades diretamente com cada prestador.</p><ul>\n<li><a href="https://acarolmourad-commits.github.io/asf-praias/">🏖️ ASF Praias</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-viagens/">✈️ ASF Viagens</a></li>\n<li><a href="https://acarolmourad-commits.github.io/asf-parceiras/">🤝 ASF Parceiras</a></li>\n</ul></article>\n</div><p><a href="guia-apps.html">Explore o catálogo de aplicativos</a> · <a href="parcerias/villa-blu/">Benefício de hospedagem Villa Blu × ASF</a></p></section>\n'
text=text.replace(anchor,fragment+"\n"+anchor,1)
text=text.replace("</head>",'<link rel="stylesheet" href="asf-journeys-review.css">\n</head>',1)
target.write_text(text,encoding="utf-8")
print("Approved home journeys inserted; only index.html modified.")
