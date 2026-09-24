# 📰 Regras Editoriais ASF — Anti-Duplicidade

## Fluxo obrigatório antes de criar qualquer conteúdo

**PESQUISAR → COMPARAR → CLASSIFICAR → DECIDIR → PRODUZIR**

1. **PESQUISAR**: buscar no repositório (títulos, slugs, temas) se já existe conteúdo equivalente.
2. **COMPARAR**: comparar título, URL, texto e propósito com os existentes.
3. **CLASSIFICAR**:
   - A) CANÔNICA — já existe fonte oficial → não criar; referenciar.
   - B) REPETIDA — mesmo tema sem valor novo → não criar; atualizar o existente.
   - C) COMPLEMENTAR — acrescenta informação realmente diferente → pode criar.
   - D) OBSOLETA — versão antiga → atualizar ou noindex/redirect.
   - E) CONFLITANTE — informação divergente → corrigir antes de publicar.
4. **DECIDIR**: se equivalente existe, NÃO criar outro artigo. Atualizar o existente ou produzir conteúdo complementar realmente diferente.
5. **PRODUZIR**: somente conteúdo classificado como C.

## Requisitos de todo artigo novo

- Título único
- Slug/URL única e estável
- Propósito definido (1 intenção → 1 página)
- Categoria
- Data de atualização
- Fonte/referência quando aplicável
- `rel="canonical"` apontando para si mesmo
- Meta description única

## Fonte única da verdade

| Tema | Fonte oficial |
|---|---|
| Institucional ASF | `sobre.html` |
| Carteirinha/associação | asf-clube + `carteirinha.js` |
| Eventos | asf-eventos + `data/events.json` |
| Praias | asf-praias |
| Guias/artigos | `aprender/` |
| Previsão/condições do mar | asf-previsao |
| Marés | asf-mare |
| Hub da rede de satélites | `guia-apps.html` |

As demais páginas devem resumir + linkar a fonte canônica — nunca manter cópias independentes.

## Regra de segurança

NUNCA inventar informações para preencher lacunas. Em caso de dúvida: preservar a informação existente e marcar como PENDÊNCIA para revisão humana.

## Validação automática

O workflow `.github/workflows/asf-content-audit.yml` roda a cada push com HTML alterado e semanalmente, bloqueando publicações com DUPLICADO ou CONFLITO. Relatório: `docs/generated/content-audit.json`.
