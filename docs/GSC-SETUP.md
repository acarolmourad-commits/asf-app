# 🔑 Setup opcional: Search Console + AdSense API nos workflows

Os workflows `gsc-seo-review.yml` e `adsense-approval-monitor.yml` funcionam **sem credenciais** (modo HTTP/heurístico). Para ativar o modo completo (dados reais de cliques, impressões e status de aprovação do AdSense), configure 4 secrets no repo asf-app:

| Secret | O que é |
|--------|---------|
| `GSC_CLIENT_ID` | OAuth Client ID do Google Cloud |
| `GSC_CLIENT_SECRET` | OAuth Client Secret |
| `GSC_REFRESH_TOKEN` | Refresh token gerado no OAuth Playground |
| `ADSENSE_ACCOUNT_ID` | `accounts/pub-1643806355443576` |

## Passo a passo

1. **Google Cloud Console** (console.cloud.google.com) com a conta asf.surffeminino@gmail.com
   - Ativar APIs: Google Search Console API + AdSense Management API
   - Tela de permissão OAuth: tipo **Externo**, escopos:
     - `https://www.googleapis.com/auth/webmasters.readonly`
     - `https://www.googleapis.com/auth/adsense.readonly`
   - ⚠️ Adicionar `asf.surffeminino@gmail.com` em **Usuários de teste** (sem isso dá erro 403 access_denied)
   - Credenciais → ID do cliente OAuth → **Aplicativo da Web**
     - Campo "Origens JavaScript": deixar **vazio**
     - Campo "URIs de redirecionamento": `https://developers.google.com/oauthplayground`

2. **OAuth Playground** (developers.google.com/oauthplayground)
   - ⚙️ → marcar "Use your own OAuth credentials" → colar Client ID + Secret
   - Colar os 2 escopos → Authorize APIs → login com a conta ASF
   - Se aparecer "app não verificado": Avançado → Acessar (não seguro)
   - Exchange authorization code for tokens → copiar o **Refresh token** (`1//...`)

3. **GitHub** → repo asf-app → Settings → Secrets and variables → Actions → New repository secret → adicionar os 4 secrets.

Depois disso os workflows passam a coletar dados reais automaticamente.

> Dica: se o erro 403 persistir no Playground, verifique se o navegador está logado na conta certa (use aba anônima).
