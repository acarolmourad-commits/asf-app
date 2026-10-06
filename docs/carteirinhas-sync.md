# ASF Carteirinhas — Supabase ↔ Sheets Sync

## Arquitetura Atual

### Fonte Primária: Supabase
- **Tabela**: `associadas`
- **RPCs**: `emitir_carteirinha` (cria/atualiza carteirinha)
- **Chave**: Anon key (publishable) no carteirinha.js
- **Proteção**: RLS (Row Level Security) — dados encriptados por email_hash

### Fonte Secundária: Google Sheets (backup)
- **Tabela**: aba "Carteirinhas" no Google Sheets
- **Apps Script**: `ASF_Carteirinhas_Registry.gs`
- **Deployment URL**: configurada em `ASF_CARD.REGISTRY_URL`
- **Flow**: app → `doPost()` → Sheets (upsert por numero)

## Problema de Sincronização

Supabase e Google Sheets são **sistemas independentes**:
- Dados no Supabase **não aparecem** no Sheets automaticamente
- Dados no Sheets **não aparecem** no Supabase automaticamente
- `carteirinhas.html` lê apenas do Sheets (via Apps Script doGet)

## Solução: Script de Sincronização

### Script: `cron/supabase-sheets-sync.py`
- Lê carteirinhas do Supabase (via service_role key)
- Lê carteirinhas do Google Sheets (via Apps Script doGet)
- Upsert: registros do Supabase → Sheets (novos registros)
- Salva log em `docs/carteirinhas-sync-log.json`

### Configuração
1. Copiar `.env.sync-template` → `.env.sync`
2. Preencher `SUPABASE_KEY` (service_role key)
3. Preencher `GOOGLE_SCRIPT_URL` (Deployment URL do Apps Script)
4. Preencher `GOOGLE_SCRIPT_TOKEN` (TOKEN do .gs)
5. Adicionar ao `monitor-loop-v2.sh` ou GitHub Actions

### Cronjob
```bash
PYTHON /c/Users/Zion/asf-app-local/cron/supabase-sheets-sync.py
# Daily at 03:00 UTC
```

## Status do Supabase

| Recurso | Status | Observação |
|---------|--------|------------|
| Tabela `associadas` | ✅ Existe | Protegida por RLS (401 sem auth) |
| Tabela `carteirinhas` | ❌ Não existe | Precisa criar |
| RPC `emitir_carteirinha` | ❌ Não existe (404) | Precisa criar |
| RPC `listar_carteirinhas` | ❌ Não existe | Precisa criar |
