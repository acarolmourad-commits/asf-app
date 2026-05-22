# 🤖 AGENTE — INSTRUÇÕES PARA NOVO AGENTE

## 🎯 Missão
Ajudar Carol na manutenção e evolução do **ASF App** ( Associação de Surf Feminino).

## 📍 Where tudo está

| Recurso | Valor |
|----------|-------|
| Repo GitHub | `https://github.com/acarolmourad-commits/asf-app.git` |
| Site ao vivo | `https://acarolmourad-commits.github.io/asf-app/` |
| Branch | `main` |
| Arquivo principal | `/root/.openclaw/workspace/index.html` (1.09 MB, 14,000+ linhas) |
| GitHub Pages HTTP | `200` ✅ |
| HEAD atual | `a74061f` |
| Dicas no array | **3,692** (todas aspas simples) |
| Remote | `origin` → `https://github.com/acarolmourad-commits/asf-app.git` |

## 📊 Estado atual (22:45 UTC — verificar sempre antes de editar!)

```bash
# Rode estes comandos antes de qualquer trabalho:
cd /root/.openclaw/workspace
python3 -c "import re; c=open('index.html').read(); m=re.search(r'const dicas = \[([\s\S]*?)\n        \];',c); print(f'Dicas: {m.group(0).count(chr(123)+chr(32)+chr(39)+chr(116)+chr(101)+chr(120)+chr(116)+chr(58)+chr(32)+chr(39)) if m else 0}')"
git log --oneline -3
curl -s -o /dev/null -w "%{http_code}" https://acarolmourad-commits.github.io/asf-app/
```

Valores atuais confirmados:
- **Dicas no array**: 3,573
- **UGC_IMAGES**: 4 URLs Unsplash preenchidas
- **Segurança Online**: 5 dicas
- **carol.jpg/carol2.jpg**: removidas
- **UGC_IMAGES fix**: `const UGC_IMAGES = []` → agora com 4 URLs reais

## 🔧 Comandos permitidos (use estes!)

### Git
```bash
cd /root/.openclaw/workspace
git status --short           # ver o que mudou
git diff -- index.html        # ver mudanças
git add -A                    # adicionar tudo
git commit -m "tipo: mensagem curta"
git push origin HEAD:main
```

### Buscar e editar
```bash
grep -n "padrao" index.html         # encontrar linha
grep -n "carol\|UGC\|produto" index.html | head -20
sed -n '10300,10400p' index.html    # mostrar faixa de linhas
sed -i "s/old/new/" index.html      # substituir uma linha
```

### Python (sandbox) — **NÃO use `-c` diretamente**
Floating `python3 -c "..."` é bloqueado no OpenClaw.
Use **script de arquivo** ou **heredoc**:

```bash
python3 << 'PYEOF'
import re
with open('/root/.openclaw/workspace/index.html') as f:
    c = f.read()
arr = re.search(r'const dicas = \[([\s\S]*?)\n        \];', c)
count = arr.group(1).count("{ text: '") if arr else 0
print(f"Dicas: {count}")
PYEOF
```

## 📨 Padrão de commit

```
tipo: descrição curta
```

Tipos válidos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`

```bash
git commit -m "feat: +5 dicas Nutrição"
git commit -m "fix: UGC_IMAGES declaracao vazia"
git commit -m "docs: heartbeat atualizado"
```

## 📁 Estrutura de pastas no workspace

```
/root/.openclaw/workspace/
├── index.html                 ← arquivo principal (1.1 MB) — EDITE AQUI
├── HEARTBEAT.md               ← checklist de manutenção 15min
├── memory/
│   └── 2026-05-21.md          ← memória de hoje
└── docs/
    ├── brand-kit-partnership.html
    ├── brand-kit-asf.pdf
    ├── brand-targets.json
    └── brand-emails-confirmed.json
```

## 🔑 Credenciais e contas

| Conta | Valor |
|-------|-------|
| GitHub repo | `acarolmourad-commits/asf-app` |
| GitHub Pages | `https://acarolmourad-commits.github.io/asf-app/` |
| Google OAuth | pendente (Carl enviar `credentials.json`) |
| MercadoPago API | não configurado |
| MailerLite | não configurado |
| Infolinks PID/WSID | não cadastrado |

## 🚨 Regras importantes

1. **NÃO edite o arquivo do Windows** — `C:\Users\Carolina\.openclaw\workspace\index.html` é um redirect de 93 bytes. Todo trabalho é no servidor.
2. **NÃO use `python3 -c "..."`** — é bloqueado. Use heredoc ou arquivo.
3. **Sempre commitar e pushar** após alterações importantes.
4. **Verificar GitHub Pages HTTP 200** após cada push antes de fechar.
5. **NÃO compartilhar tokens/API keys** em conversas.
6. **Usar ser** — não inventar comando novos de primeira.

## 📚 Histórico recente (última semana)

| Data | Mudança |
|------|---------|
| 2026-05-21 | +5 dicas Segurança Online → 3,573 dicas totais |
| 2026-05-21 | UGC_IMAGES filled com 4 URLs Unsplash |
| 2026-05-21 | carol.jpg/carol2.jpg removidas, product.image fix |
| 2026-05-21 | +10 dicas Saúde Mental/Sustentabilidade/Técnica |
| 2026-04-29 | Monetização audit + Pix/Referral/Ebook/UGC/Infolinks |

## 💬 Como trabalhar com Carol (Cahrol)

- Ela usa **PT-BR**, gosta de emojis
- Canal: **Telegram** — mensagens diretas funcionam
- Ela também envia tarefas e respostas via relatório
- Horário aproximado: UTC 20:00–23:00
- Confie no que ela diz — ela já trabalha no projeto há semanas

## 🎯 Próximas features (não implementadas)

- [ ] Quiz diário rotativo (5 perguntas, rotação por data)
- [ ] XP bar visual no perfil (barra animada + nível)
- [ ] Animações suaves com Intersection Observer
- [ ] Redesign da home (gradient moderno)
- [ ] SEO completo (JSON-LD structured data)
- [ ] Configurar Mercado Pago API
- [ ] Cadastrar Infolinks (PID/WSID)
- [ ] Upload ebook PDF no Gumroad

## ⚡ Comandos rápidos

```bash
cd /root/.openclaw/workspace

# Ver saúde do site
curl -s -w "%{http_code}" -o /dev/null https://acarolmourad-commits.github.io/asf-app/

# Contar dicas
python3 << 'EOF'
import re
c = open('index.html').read()
m = re.search(r'const dicas = \[([\s\S]*?)\n        \];', c)
print(f"Dicas: {m.group(1).count('{ text: ') if m else 0}")
EOF

# Ver últimas modificações
git show HEAD --stat

# Push completo
git add -A && git commit -m "mensagem" && git push origin HEAD:main > /tmp/gitpush.log 2>&1 && echo "PUSH OK" || echo "ERRO: veja /tmp/gitpush.log"
```

---

**Boa sorte! 🏄‍♀️** Qualquer coisa, Carol está de olho!
