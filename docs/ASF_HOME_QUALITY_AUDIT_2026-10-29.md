# ASF — auditoria e ajustes seguros da página inicial
Data: 2026-10-29

## Escopo
Camada aditiva para melhorar a hierarquia visual, a experiência mobile, a navegação por teclado e os nomes acessíveis dos campos da página inicial. A alteração não substitui nem reescreve o conteúdo existente.

## Proteção obrigatória da carteirinha
- Não modificar `carteirinha.js`, `emitir.html`, `verificar.html`, tabelas/RPCs do Supabase nem o projeto Google Sheets.
- Não ler, escrever, limpar, migrar ou renomear `localStorage`.
- Preservar as chaves existentes `asf-card-v2` e `asf-card-history`, IDs, números, validade e histórico de emissões.
- Não alterar emissão, renovação, QR Code ou verificação da carteirinha nesta mudança.
- A camada de UX só move nós já existentes na página; os elementos são movidos intactos e sem editar os formulários da carteirinha.

## Alterações nesta revisão
- Link acessível para pular ao conteúdo principal.
- Ordem da primeira experiência: hero e caminhos principais antes da busca e do incentivo de gamificação; nenhum bloco é removido.
- Melhor apresentação responsiva dos quatro caminhos principais.
- Estados de foco visíveis, alvos de toque confortáveis e respeito a `prefers-reduced-motion`.
- Rótulos acessíveis para busca e assistente, região de status para resultados da busca.
- Links que abrem nova aba recebem `noopener noreferrer`.

## Limites / validação necessária
- A camada não inventa previsões, horários, níveis de mar ou fontes de dados. Cada tela de previsão deve expor a fonte e a atualização real a partir do próprio provedor.
- Confirmar em navegador real: mobile, teclado, leitor de tela, busca, chatbot, links, e fluxos de carteirinha (nova emissão, edição, recarga da página, QR válido/expirado/inexistente e falha de rede).
- Confirmar o deploy de produção após merge. GitHub Pages pode levar algum tempo para refletir mudanças.
- Não executar migração nem testes de escrita em dados reais da carteirinha como parte desta revisão.
