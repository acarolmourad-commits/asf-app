# ASF Carteirinhas — Arquitetura de Cadastro e Registro

## 🔍 Análise da Arquitetura (2026-10-06)

### Componentes Envolvidos

| Componente | Função | Estado |
|---|---|---|
| `carteirinha.js` | Lógica de geração/registro no cliente | ✅ Corrigido (REST API) |
| `carteirinhas.html` | Painel de controle de associadas | ✅ Corrigido (REST GET) |
| `carteirinha.js (supabase.js)` | Integração Supabase no app principal | ✅ Carregado na index.html |
| `ASF_Carteirinhas_Registry.gs` | Google Apps Script → Sheets | ✅ Criado (aguarda deploy) |
| `cron/supabase-sheets-sync.py` | Sincroniza Supabase → Sheets | ✅ Criado (aguarda .env.sync) |
| `cron/email-campaign-monitor.py` | Monitor de e-mails de parceiros | ✅ Ativo |
| `cron/daily-site-audit.py` | Auditoria diária do site | ✅ Ativo |

### Status do Supabase

| Recurso | Status | Detalhes |
|---|---|---|
| Tabela `associadas` | ✅ Existe | Colunas: numero, nome, apelido, nivel, praia, cidade, insta, validade, email_hash, id |
| Tabela `carteirinhas` | ❌ Não existe | Usar `associadas` em vez |
| RPC `emitir_carteirinha` | ❌ Não existe (404) | **Substituído por REST Upsert** |
| RPC `listar_carteirinhas` | ❌ Não existe | **Substituído por REST GET** |
| Anon Key | ✅ Configurada | sb_publishable_qIvPx... |
| SELECT na `associadas` | ⚠️ Bloqueado (401/RLS) | **Precisa: GRANT SELECT TO anon** |

### Fluxo de Cadastro (Corrigido)

```
1. Usuária preenche formulário → carteirinha.js
2. carteirinha.js salva no localStorage (sempre funciona)
3. Se Supabase ativo:
   a. Gera emailHash (SHA-256)
   b. Chama POST /rest/v1/associadas (upsert por numero)
   c. Se sucesso: marca como "registrada na rede ASF"
   d. Se falha (401/403): fallback local, avisa usuário
4. Se marcar "registrar" + REGISTRY_URL configurado:
   - Envia via sendBeacon para Apps Script (Sheets)
5. Painel (carteirinhas.html):
   a. GET /rest/v1/associadas → lista associadas
   b. Fallback: Apps Script doGet?action=list (com token)
   c. Fallback: mensagem de erro com instruções
```

### Problemas Corrigidos

| Problema | Correção | Arquivo |
|---|---|---|
| RPC emitir_carteirinha (404) | REST Upsert POST na tabela associadas | carteirinha.js |
| RPC listar_carteirinhas (404) | REST GET na tabela associadas | carteirinhas.html |
| carteirinhas.html não carregava carteirinha.js | Script injection dinâmico | carteirinhas.html |
| carteirinhas.html sem fallback claro | Mensagem GRANT SELECT + instrucoes | carteirinhas.html |
| REGISTRY_URL não definido | Campo adicionado (default: '') | carteirinha.js |

### Pendências

1. **Supabase Admin**: Executar `GRANT SELECT ON TABLE public.associadas TO anon;`
2. **Supabase Admin**: Criar política RLS para INSERT na tabela `associadas`
3. **Carol**: Publicar `ASF_Carteirinhas_Registry.gs` no Apps Script → colar URL em `.env.sync`
4. **Carol**: Configurar `.env.sync` com `SUPABASE_KEY` (service_role) + token

### Cronjob de Sincronização

`cron/supabase-sheets-sync.py` — Daily 3:00 UTC
- Lê Supabase (associadas) → upsert no Sheets (via Apps Script)
- Log: `docs/carteirinhas-sync-log.json`
