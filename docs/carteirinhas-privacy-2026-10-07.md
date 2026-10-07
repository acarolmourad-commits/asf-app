# Carteirinhas — emissão pública, controle privado

Mudança aprovada em 07/10/2026.

- `carteirinhas.html` redireciona para `emitir.html`. Nenhuma tabela/listagem ou token administrativo nas páginas públicas.
- `emitir.html` usa um único contêiner visível, renderizado por `ASF_CARD`.
- Registro central opcional com consentimento separado: RPC existente `emitir_carteirinha`; QR usa `verificar_carteirinha` (nível, validade, situação, sem nome/contatos).
- Nenhuma alteração em tabelas, colunas, dados existentes, funções de emissão/verificação ou chaves locais `asf-card-v2` e `asf-card-history`.
- O controle interno é o Table Editor do Supabase, autenticado e disponível apenas para integrantes autorizados do projeto: https://supabase.com/dashboard/project/qktabrzbgdfndklytwub/editor
- Permissões diretas de `public.associadas` para PUBLIC/anon/authenticated são revogadas. Não conceder SELECT público nem colocar chave secret/service_role no frontend.
- Estatísticas de inscrições também devem ser acessíveis somente à equipe interna.
- Google Sheets existente permanece inalterado; Apps Script opcional não está implantado/configurado no frontend (`REGISTRY_URL` vazio).
- Testes locais em Chromium mobile: formulário único, consentimento, emissão local, edição, persistência, PNG, RPC simulada, falha HTTP, escape de dados legados, redirecionamento. Sem escrita de testes em produção.
- Cache de service worker atualizado para não conservar o antigo painel administrativo.

Limitação preservada: a RPC existente usa hash do e-mail como identificação e não prova a titularidade do e-mail. Uma autenticação forte requer um projeto adicional; não tratar hash como senha.
