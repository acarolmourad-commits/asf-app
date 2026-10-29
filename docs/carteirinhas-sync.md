# ASF Carteirinhas — arquitetura e histórico de sincronização

## Arquitetura vigente (2026-10-29)

Este documento substitui instruções operacionais antigas abaixo que sugeriam escrita direta na tabela `associadas` com chave pública.

- Emissão/renovação oficial: RPC `emitir_carteirinha` por `ASF_CARD.emitirCarteirinha()`.
- A interface pública não deve executar SELECT/INSERT/UPDATE direto em `public.associadas`.
- Verificação do QR: RPC `verificar_carteirinha`, retornando somente os campos mínimos necessários à validação.
- Painel interno: `carteirinhas-admin.html`, autenticação Supabase por link mágico e leitura conforme RLS/permissões administrativas.
- Planilha Google: backup opcional; não é fonte oficial. `ASF_CARD.REGISTRY_URL` permanece vazia enquanto não houver endpoint Apps Script validado.
- Chave publishable/anon no frontend é pública por definição. Nunca colocar chave `service_role`, token administrativo ou segredo de Apps Script no frontend ou no repositório.
- O hash SHA-256 simples do e-mail não comprova titularidade e pode ser testado por dicionário; não deve ser tratado como credencial. Uma melhoria futura é usar identificador verificado/autenticação ou HMAC calculado exclusivamente no servidor.
- Não executar testes automatizados de emissão contra produção. Testes de unicidade, idempotência e renovação devem usar um projeto Supabase de teste.

## Componentes

| Componente | Função |
|---|---|
| `carteirinha.js` | Carteirinha local no app principal e chamada RPC quando a associada opta pelo registro central |
| `emitir.html` | Cadastro público; só exibe a carteirinha após confirmação do Supabase |
| `verificar.html` | Verificação do QR sem expor nome ou contato |
| `carteirinhas-admin.html` | Painel administrativo autenticado |
| `docs/ASF_Carteirinhas_Registry.gs` | Código opcional para cópia de segurança em Google Sheets |
| `.github/workflows/verifica-carteirinha.yml` | Checagens read-only; não deve emitir carteirinhas reais |

## Histórico de incidentes/documentação

As seções abaixo refletem a evolução histórica do projeto e não são instruções vigentes quando contradizem a arquitetura acima.

- 2026-10-06: diagnóstico antigo registrou RPC como inexistente e sugeriu REST upsert/SELECT direto. Essa orientação foi superada em 2026-10-25.
- 2026-10-25: confirmado uso da RPC `emitir_carteirinha` com parâmetros `p_*`; removidas políticas públicas de INSERT/UPDATE conforme documentação de mudança.
- 2026-10-26: fluxo central único e painel administrativo com login por link mágico.
- 2026-10-29: workflow de verificação alterado para evitar chamadas de emissão com dados de teste no banco de produção.

## Verificações de produção seguras

- Validar sintaxe local: `node --check carteirinha.js`.
- Fazer checks estáticos do contrato RPC e das proteções da interface.
- Usar OPTIONS/preflight para verificar que o endpoint responde sem executar a função.
- Confirmar deploy pelo workflow de GitHub Pages.
- Não usar a RPC de emissão como health check: ela pode inserir/renovar registros persistentes.
