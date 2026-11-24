# Rede de aplicativos ASF — padrão operacional

Última auditoria: 18/11/2026  
Fonte única de verdade das 49 páginas satélites: data/apps.json; asf-network.js é o consumidor de navegação  
Catálogo público: guia-apps.html  
Páginas de destaque: apps-em-destaque.html e destaques-rede.html

## Inventário e navegação

A rede reúne 50 ferramentas e experiências digitais: 49 páginas satélites definidas em data/apps.json e a experiência Carteirinha, integrada ao site principal. O array APPS de asf-network.js contém os 49 aplicativos mais a Carteirinha. O site https://asf.surf/ é o hub institucional.

O script compartilhado de navegação é publicado em:

https://acarolmourad-commits.github.io/asf-app/asf-network.js

Todas as páginas satélites devem carregar esse script. A Carteirinha, por ser uma âncora no hub, e as páginas legadas de redirecionamento são exceções intencionais.

O script identifica o aplicativo atual pelo caminho ou pelo subdomínio, evita recomendar o próprio aplicativo e usa https://asf.surf/ como endereço principal do hub.

## Categorias oficiais

1. Mar, tempo e segurança
2. Técnica, treino e evolução
3. Bem-estar e equilíbrio
4. Comunidade e oportunidades
5. Cultura e aprendizado
6. Viagens e sustentabilidade

## URLs legadas preservadas

- mare.asf.surf, vento.asf.surf e swell.asf.surf → previsao.asf.surf
- app.asf.surf e eventos.asf.surf → hub ASF
- repositório antigo asf-clube → asf.surf/#carteirinha

Esses endereços não entram na contagem de experiências ativas, mas devem continuar respondendo e encaminhando visitantes ao destino correto.

## Checklist para publicar ou alterar um aplicativo

- Atualizar APPS em asf-network.js com nome e URL canônica HTTPS.
- Adicionar o link ao index.html e ao guia-apps.html.
- Atualizar apps-em-destaque.html quando houver destaque editorial.
- Carregar o script global de navegação em toda página satélite.
- Testar HTTP 200, HTTPS válido, navegação móvel, teclado, links internos e retorno ao hub.
- Atualizar este documento e os monitores quando a arquitetura ou as URLs mudarem.
- Nunca remover um endereço legado sem preservar um redirecionamento funcional.

## Monitoramento

- ads-monitor.yml verifica ads.txt, disponibilidade da home e da página institucional monetizada. A ausência de código AdSense em uma ferramenta não monetizada não é tratada como falha.
- ssl-cert-watch.yml testa as URLs reais do registro asf-network.js, o hub, o script global, a navegação compartilhada e os endereços legados. Não inventa subdomínios e não tenta alterar configurações de outros repositórios usando um GITHUB_TOKEN limitado ao repositório central.
