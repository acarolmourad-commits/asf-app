# 🎨 Plano de Evolução UX — ASF

> Princípio central: **nada é removido**. Simplificar = organizar, conectar, explicar e priorizar melhor.

## Inventário atual (mapeado em 2026-09-21)
- **32 seções** na home (`index.html`): dicas, praias, eventos, competicoes, manas, comunidade, progresso, metas, badges, carteirinha, mobilidade, saude, mental, alimentacao, tecnica, seguranca, pos-surf, surf-news, surf-culture, desafios, lojas, loja, premium, assinantes, parceiros, brandhub, utilities, assistente, conteudo, surfer-profile, conquistas-secretas, manas-proximas.
- **Ferramentas externas** (URLs preservadas): `aprender/`, `quiz/`, `mareas/`, `previsao-surf/`, `prancha-ideal/`, `surf-trip/`, `diario/`, `apps/`, `bem-estar/`, `praias/`.
- **APIs**: Open-Meteo (clima + ondas), AdSense, GA4.

## Jornada-alvo
**Encontrar → Explorar → Aprender → Surfar → Registrar → Evoluir → Voltar**

Implementado na Fase 1 como faixa de jornada na Home + rodapés de "continue sua jornada" conectando seções relacionadas.

## Fases

### ✅ Fase 1 — Camada aditiva de UX (`asf-ux.js` + `asf-ux.css`)
- Faixa de jornada na Home (7 passos, links para seções/ferramentas existentes)
- Selo 🧪 "Conteúdo demonstrativo" em dados mock (Manas)
- Conexões entre seções relacionadas
- Notas de fonte nos cards de mar/clima/maré (Open-Meteo / estimativa)

### Fase 2 — Home orientada à ação
- Reordenar destaque visual: Manas, Sessões/Registrar, Evolução no topo (sem remover nada)
- Cabeçalhos de seção com micro-explicações ("o que é isto")
- Busca com pré-visualização de seção de destino

### Fase 3 — Perfil/Carteirinha como identidade
- Carteirinha exibindo nível, badges e stats reais do localStorage
- Link direto Carteirinha ↔ Progresso ↔ Badges (feito na Fase 1)

### Fase 4 — Gamificação integrada
- Pontos por ações reais já existentes (registrar sessão, diário, quiz)
- Desafios semanais ligados a sessões registradas

### Fase 5 — Monetização não intrusiva (AdSense)
Posicionamentos planejados (nunca dentro de formulários, navegação ou conteúdo de segurança):
1. Entre blocos de conteúdo editorial (após 3º card de dicas)
2. Rodapé das páginas de guias (`aprender/`)
3. Sidebar desktop apenas (oculto em mobile)
- Sempre com `AdSense` identificado, lazy-load e sem sobrepor conteúdo.

### Fase 6 — Parceiros (preparado, sem inventar marcas)
- Seção `parceiros` permanece como "Em breve — espaço para parcerias" + formulário de cadastro de interesse (já existente)
- Nenhuma marca fictícia exibida como parceira real

## Regras de verificação (toda alteração)
1. Preserva 100% das funcionalidades? Se não, não executar.
2. URLs e compatibilidade mantidas.
3. Mobile-first, acessível (aria), rápido (defer/lazy).
4. Dados mock identificados; dados reais com fonte.
