# ASF Polish: SEO + footer institucional no index.html (idempotente)
import sys

path = 'index.html'
h = open(path, encoding='utf-8').read()
orig = h

h = h.replace('<title>ASF - Associação de Surf Feminino</title>',
 '<title>ASF – Associação de Surf Feminino | Comunidade, Previsão de Ondas, Treinos e Surftrips</title>', 1)

h = h.replace('<meta name="description" content="ASF - Associação de Surf Feminino. Dicas, comunidade, previsões, treino, surftrips. Conectando mulheres surfistas. Bertioga, Santos, Guarujá, Ubatuba.">',
 '<meta name="description" content="ASF – Associação de Surf Feminino: o ecossistema digital das mulheres surfistas. Previsão de ondas, marés e clima, treinos, guias, comunidade, sessões, eventos, surftrips e segurança no mar. Conectando mulheres ao surf e à evolução no esporte.">', 1)

h = h.replace('<meta name="keywords" content="surf,feminino,surfista,ASF,Bertioga,santos,guaruja,ubatuba,treino,previsão,mansas,comunidade,surf trip">',
 '<meta name="keywords" content="surf feminino, mulheres surfistas, ASF, previsão de ondas, marés, treino de surf, comunidade surf, surftrip, Bertioga, Santos, Guarujá, Ubatuba">', 1)

h = h.replace('<meta property="og:title" content="ASF - Associação de Surf Feminino">',
 '<meta property="og:title" content="ASF – Associação de Surf Feminino | Surf, Comunidade e Evolução">', 1)

website_ld = '''<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "ASF - Associacao de Surf Feminino",
      "url": "https://acarolmourad-commits.github.io/asf-app/",
      "inLanguage": "pt-BR"
    }
    </script>
    '''
anchor = '<script async src="https://pagead2.googlesyndication.com'
if '"@type": "WebSite"' not in h and anchor in h:
    h = h.replace(anchor, website_ld + anchor, 1)

footer = '''
    <footer role="contentinfo" style="background: var(--secondary); color: rgba(255,255,255,0.85); padding: 32px 20px 24px; margin-top: 40px; font-size: 13px;">
        <div style="max-width: 900px; margin: 0 auto;">
            <div style="display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between;">
                <div style="min-width: 220px; flex: 1;">
                    <strong style="color: #fff; font-size: 15px;">ASF – Associação de Surf Feminino</strong>
                    <p style="margin-top: 8px; line-height: 1.6; opacity: 0.8;">Conectando mulheres ao surf, à comunidade e à evolução dentro do esporte.</p>
                </div>
                <nav aria-label="Links institucionais" style="min-width: 160px;">
                    <strong style="color: #fff;">ASF</strong>
                    <ul style="list-style: none; padding: 0; margin: 10px 0 0; line-height: 2;">
                        <li><a href="sobre.html" style="color: inherit; text-decoration: none;">Sobre o ASF</a></li>
                        <li><a href="contato.html" style="color: inherit; text-decoration: none;">Contato</a></li>
                        <li><a href="parcerias/" style="color: inherit; text-decoration: none;">Parcerias</a></li>
                    </ul>
                </nav>
                <nav aria-label="Conteúdo e ferramentas" style="min-width: 160px;">
                    <strong style="color: #fff;">Explore</strong>
                    <ul style="list-style: none; padding: 0; margin: 10px 0 0; line-height: 2;">
                        <li><a href="aprender/" style="color: inherit; text-decoration: none;">Aprender a surfar</a></li>
                        <li><a href="previsao-surf/" style="color: inherit; text-decoration: none;">Previsão de ondas</a></li>
                        <li><a href="mareas/" style="color: inherit; text-decoration: none;">Tábua de marés</a></li>
                        <li><a href="prancha-ideal/" style="color: inherit; text-decoration: none;">Prancha ideal</a></li>
                        <li><a href="surf-trip/" style="color: inherit; text-decoration: none;">Surftrips</a></li>
                    </ul>
                </nav>
                <nav aria-label="Links legais" style="min-width: 160px;">
                    <strong style="color: #fff;">Legal</strong>
                    <ul style="list-style: none; padding: 0; margin: 10px 0 0; line-height: 2;">
                        <li><a href="privacidade.html" style="color: inherit; text-decoration: none;">Política de Privacidade</a></li>
                        <li><a href="termos-de-uso.html" style="color: inherit; text-decoration: none;">Termos de Uso</a></li>
                    </ul>
                </nav>
            </div>
            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.15); opacity: 0.6; text-align: center;">© 2026 ASF – Associação de Surf Feminino. Feito com 🌊 por mulheres que surfam.</p>
        </div>
    </footer>
</body>'''
if 'role="contentinfo"' not in h and '</body>' in h:
    h = h.replace('</body>', footer, 1)

if h != orig:
    open(path, 'w', encoding='utf-8').write(h)
    print('index.html atualizado')
else:
    print('nada a alterar')
