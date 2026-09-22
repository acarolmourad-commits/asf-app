# ASF — Guia de preparação para Google AdSense

_Status: pronto para submissão; aguardando conta AdSense real da ASF._

## O que já está pronto ✅
- **Conteúdo original e útil**: guias editoriais (`/aprender/`, `/bem-estar/`, `/praias/`), ferramentas interativas e 52 sites satélites, cada um com função própria e conteúdo distinto.
- **Sem conteúdo fictício**: métricas demonstrativas, depoimentos e números inventados foram removidos em auditorias anteriores; `data/hospedagens.json` permanece vazio até haver parcerias reais.
- **Sem incentivo a cliques**: gamificação (XP, badges, quizzes) não está vinculada a anúncios.
- **LGPD**: `privacidade.html` (já menciona cookies de publicidade/AdSense), `termos-de-uso.html`, banner de consentimento de cookies implementado no `index.html`.
- **SEO técnico**: title/meta description, canonical, Open Graph, sitemap.xml, robots.txt, schema.org (SportsOrganization + WebSite), 404.html personalizado.
- **Sem scripts de anúncio inválidos**: o snippet AdSense anterior (com ID incorreto) e o `ads.txt` foram removidos; placeholder GA4 removido.

## O que falta (exige ação humana) ⚠️
1. **Criar/associar a conta Google AdSense** da ASF e obter o ID real `ca-pub-XXXXXXXXXXXXXXXX`.
2. **Adicionar `ads.txt`** na raiz com a linha oficial fornecida pelo AdSense:
   `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
3. **Inserir o script oficial do AdSense** no `<head>` do `index.html` (copiar exatamente o fornecido pelo Google).
4. **Submeter o site no AdSense** e aguardar a revisão (o Google exige navegação clara, conteúdo suficiente e páginas legais — tudo já presente).
5. Após aprovação, criar blocos de anúncio **somente** em áreas que não prejudiquem a experiência do app (ex.: rodapé de páginas editoriais em `/aprender/`, nunca sobre botões, nunca dentro de fluxos interativos).
6. Opcional: ativar GA4 real definindo `window.ASF_GA_ID` (o stub seguro já está no `index.html`).

## Regras permanentes (política editorial)
- Nunca exibir números, membros, parceiros, sorteios ou resultados que não sejam reais e verificáveis.
- Nunca vincular recompensas/XP a cliques ou visualizações de anúncios.
- Separar visualmente conteúdo editorial, benefícios de parceiros e publicidade.
- Conteúdo de saúde/nutrição/segurança com linguagem responsável e sem afirmações médicas absolutas.
