# 📱 Instagram ASF — Automatização via Meta Graph API

## O que você precisa

1. **Conta no Meta Developers**: https://developers.facebook.com  
   (cadastre-se grátis)

2. **Instagram @associacaosurffeminino vinculado a uma Página Facebook**

3. **Token de acesso da Página** (Page Access Token)

---

## Passo a Passo

### 1. Criar app no Meta Developers
1. Acesse https://developers.facebook.com
2. Clique **"Create App"** → Tipo: **Business** → Avançar
3. Nome: `ASF Instagram Poster` → Email de contato
4. No painel do app → **"Add Products"** → Adicione **Instagram Graph API**
5. Clique **"Set up"** no Instagram

### 2. Vincular o Instagram ao app
- Clique em **Instagram → Settings**
- Adicione a conta **@associacaosurffeminino**
- Faça login e autorize

### 3. Gerar o token (página 60 dias)
- Vá para **Tools → Access Token Generator**
- Selecione a Página Facebook vinculada
- Permissões necessárias: `instagram_basic`, `pages_show_list`
- Clique **"Generate Access Token"**
- Copie o token gerado

### 4. Trocar por token longo (60 dias)
```bash
python3 meta-integration/post.py --update-token "SEU_TOKEN_QUE_VOCOPIAR"
```

### 5. Preencher os dados no `.env`
```bash
cp meta-integration/.env.example meta-integration/.env
# Edite o .env e cole seu token
```

---

## Usando

### Postar texto
```bash
python3 meta-integration/post.py "🏄 Seu texto aqui!"
```

### Postar com imagem
```bash
python3 meta-integration/post.py "Legenda!" --image caminho/foto.jpg
```

### Postar carrossel (várias imagens)
```bash
python3 meta-integration/post.py "Carrossel!" --image img1.jpg --image img2.jpg --image img3.jpg
```

---

## Estrutura de arquivos

```
meta-integration/
├── .env.example   # Template com as credenciais
├── .env           # SUAS credenciais (não comite este arquivo!)
└── post.py        # Script principal
```

---

## Segurança

- **NUNCA** compartilhe o arquivo `.env` — ele contém o token
- **NÃO** comite o `.env` no git (já está no .gitignore)
- O token longo (60 dias) é preferível ao curto (1 hora)
- Renove antes de expirar

---

## Post pronto — Desafio Verão ASF 2026

```bash
python3 post.py "🏄‍♀️ DESAFIO OFICIAL | Verão ASF 2026

Você surfou essa semana? Que tal marcar 30 dias seguidos?

🌞 Verão ASF 2026 — 30 dias de surf consecutivos!

✓ Registre cada session no app ASF
✓ Ganhe badges exclusivas
✓ Concorra a prêmios no final do ano
✓ Faça parte das 500+ mulheres que já entraram

📍 Praias do litoral paulista contam!
📅 Até 30/12/2026
🔗 Link na bio para participar

Repost e marca aquela mana que nunca falta na praia! 👇

#ASF #SurfFeminino #DesafioASF #Verão2026 #AssociaçãoSurfFeminino"
```
