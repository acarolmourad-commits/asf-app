# ASF — ativação do OTP por e-mail (guia operacional)

Status: **implementação de frontend isolada em branch; NÃO habilitada em produção**.

Branch: `security/verified-email-issuance`

## O que foi preparado

- `emitir.html` apresenta a etapa de confirmação de e-mail antes da emissão.
- `otp-emissao.js` solicita OTP pelo Supabase Auth, valida o código e só então chama `emitir_carteirinha` com o `access_token` da sessão confirmada.
- O hash é calculado a partir do e-mail retornado pelo Supabase, e o cliente confere que o e-mail autenticado corresponde ao informado no formulário.
- O token de sessão fica apenas em memória nesta página; não é gravado em `localStorage` nem em `sessionStorage`.
- O código tem 8 dígitos, conforme a configuração atual do projeto.
- Nenhuma chamada de emissão é feita ao solicitar o OTP.

## Pré-requisito obrigatório: entrega do código

A conta `asf.surffeminino@gmail.com` foi conectada ao ChatGPT/Composio para uso institucional. Essa autorização **não configura SMTP no Supabase** e não fornece senha SMTP. O Supabase Auth precisa de um canal de envio próprio.

Opção a avaliar para baixo volume: SMTP do Gmail com senha de app, se a conta ASF tiver a verificação em duas etapas habilitada e o Google disponibilizar essa opção. A senha de app deve ser criada e inserida diretamente no painel do Supabase pela responsável pela conta — **nunca enviar a senha por chat, e-mail ou commit**. Se a opção não estiver disponível ou se a entrega não for confiável, usar um provedor transacional com domínio autenticado.

### Configuração SMTP no painel Supabase

No projeto `qktabrzbgdfndklytwub`, abrir Authentication → SMTP Settings e configurar somente depois de criar a credencial diretamente no Google:

- Host: `smtp.gmail.com`
- Port: `587` (STARTTLS)
- Username: `asf.surffeminino@gmail.com`
- Sender email: `asf.surffeminino@gmail.com`
- Sender name: `Associação Surf Feminino`
- Password: senha de app criada no Google, guardada apenas no painel

Não aumentar limites de envio para contornar bloqueios. Considerar os limites de conta Gmail pessoal e testar entregabilidade, spam e reenvio antes de liberar.

## Modelos de e-mail OTP

No Supabase → Authentication → Email Templates, ajustar os modelos **Confirm signup** e **Magic Link** para exibir o código em vez de depender de um link. O corpo deve conter `{{ .Token }}` (o código de uso único). Exemplo de corpo:

```html
<h2>Confirme seu e-mail — ASF</h2>
<p>Use este código para confirmar seu endereço e continuar a emissão da carteirinha:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>Se você não solicitou este código, ignore esta mensagem.</p>
```

Manter validade e comprimento alinhados à configuração atual: OTP de 8 dígitos, expiração de 3600 segundos. Não compartilhar o código.

## Validação antes de qualquer ativação

1. Criar um projeto Supabase de staging isolado, com esquema e funções necessárias e dados exclusivamente sintéticos.
2. Configurar SMTP e os dois modelos de e-mail em staging; testar Gmail, outros provedores, spam, reenvio e expiração.
3. Publicar a página somente em ambiente de staging e confirmar que a chamada RPC usa `Authorization: Bearer <access_token>`.
4. Aplicar a migração SQL proposta somente em staging e verificar que `anon`/`PUBLIC` não executam `emitir_carteirinha`, enquanto uma sessão confirmada pode executar apenas para o próprio e-mail.
5. Testar código incorreto, expirado, e-mail divergente, sessão ausente/expirada, duplicidade, renovação, concorrência e erros de rede.
6. Confirmar que os registros históricos permanecem intactos e que a verificação pública de QR e o painel administrativo continuam funcionando.
7. Só depois abrir PR para revisão humana e planejar backup/rollback de produção.

## Estado atual de produção

- SMTP Supabase: não configurado na última leitura.
- `hook_send_email`: desabilitado; não é necessário para o fluxo OTP padrão.
- `emitir.html`: ainda não está na allowlist de redirects; o fluxo de código digitado não depende de callback externo, mas qualquer futura mudança para magic link deve adicionar somente a URL exata.
- RPC: proposta de segurança ainda não aplicada; o endpoint público permanece como estava antes desta branch.
- Nenhum cadastro foi criado, alterado, renovado ou apagado nesta etapa.
- Não houve deploy para GitHub Pages nem alteração de Auth/SMTP/SQL em produção.

## Atenção técnica

O frontend preparado depende da migração `VERIFIED_EMAIL_ISSUANCE_PROPOSED.sql` para rejeitar chamadas anônimas e exigir a sessão confirmada. **Não publicar esta página isoladamente em produção antes de aplicar e validar a migração**, pois o endpoint antigo ainda aceita o fluxo público legado.
