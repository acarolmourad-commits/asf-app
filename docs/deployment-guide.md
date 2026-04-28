# 🚀 DEPLOYMENT GUIDE - ASF App Monetization

## 📦 O QUE FOI IMPLEMENTADO

### **Novas Features (v2026.04.28)**
- ✅ Loja ASF (6 produtos afiliados)
- ✅ Premium Subscription (R$19,90/mês)
- ✅ Newsletter + WhatsApp integration
- ✅ Google Analytics 4 tracking
- ✅ CTAs estratégicos (5 posições)
- ✅ Botões de navegação (Loja + Premium)

### **Arquivos Modificados**
```
index.html          (+1447 linhas) - nova estrutura monetização
README.md           (+ seção monetização)
docs/audit-monetization.md  (NOVO - 14KB)
docs/monetization-Plan.md   (NOVO - 11KB)
scripts/test_monetization.js (NOVO - testes)
scripts/test_monetization.py (NOVO - testes)
```

---

## 🔧 CONFIGURAÇÃO NECESSÁRIA (PÓS-DEPLOY)

### **PASSO 1: Google AdSense** (1-2 semanas)
```
1. Acesse: https://adsense.google.com
2. Crie conta (ou use existente)
3. Adicione site: acarolmourad-commits.github.io/asf-app
4. Aguarde aprovação (1-2 dias úteis)
5. Copie código: ca-pub-XXXXX
6. Substitua em index.html (Linha ~120):
   ANTES: ca-pub-XXXX
   DEPOIS: ca-pub-SEU_ID_AQUI
7. Salve e commit
```

### **PASSO 2: Mercado Pago (Premium Payments)**
```
1. Criar conta: https://mercadopago.com.br
2. Tipo: Conta Jurídica (CNPJ ASF) ou PF
3. Ir em: Credenciais → API
4. Gerar:
   - Public Key (APP_USR-...)
   - Access Token
5. Implementar webhook (handler Python)
6. Testar com cartão: 4709 6400 0000 0005
```

### **PASSO 3: MailerLite (Newsletter)**
```
1. Inscrever: https://mailerlite.com (grátis ≤1.000)
2. Criar subscrição "ASF Dicas Diárias"
3. Settings → API → Copy API Key
4. Substituir em index.html (Linha ~9350):
   ANTES: 'X-MailerLite-ApiKey': ''
   DEPOIS: 'X-MailerLite-ApiKey': 'SUA_KEY'
5. Teste envio
```

---

## 🧪 TESTES DE FUNCIONALIDADE

### **Automático (Node/Python)**
```bash
cd /root/.openclaw/workspace/asf-app
node scripts/test_monetization.js
# ou
python3 scripts/test_monetization.py
```

### **Manual (Mobile/Desktop)**
1. Abrir: https://acarolmourad-commits.github.io/asf-app/
2. **Teste Loja:**
   - Tap "🛒 Loja" (nav)
   - Ver 6 produtos
   - Tap "🛒 Ver oferta" → abre Mercado Livre
   - Verificar localStorage: `asf-affiliate-clicks`

3. **Teste Premium:**
   - Tap "⭐ Premium" (nav)
   - Modal abre
   - Tap "Assinar Agora" → toast
   - Verificar localStorage: `asf-monetization-stats`

4. **Teste Newsletter:**
   - Inserir email → "📩 Inscrever"
   - Toast "Inscrita!" aparece
   - localStorage: `asf-newsletter`

5. **Teste WhatsApp:**
   - Tap "📱 Chamar no WhatsApp"
   - Abre app com mensagem

---

## 📊 MONITORAMENTO

### **Local Storage (Offline)**
```javascript
// No console do browser:
ASFMonetization.getStats()
// Retorna:
// {
//   affiliateClicks: 0,
//   premiumViews: 0,
//   subscriptionStarts: 0,
//   events: [...]
// }
```

### **Google Analytics 4 (Online)**
```
Dashboard: https://analytics.google.com
Eventos configurados:
- affiliate_click
- newsletter_signup
- premium_modal_view
- payment_start
- contact_whatsapp
```

---

## 🐛 TROUBLESHOOTING

### **Problema: Botão Loja não aparece**
**Solução:** Limpar cache do navegador ou hard refresh (Ctrl+Shift+R)

### **Problema: Links afiliados não abrem**
**Solução:** Verificar IDs no array AFFILIATE_PRODUCTS (linha 9327)

### **Problema: Premium modal não abre**
**Solução:** Verificar se `showPremiumModal()` está definida (console)

### **Problema: GA4 não rastreia**
**Solução:** Substituir `G-XXXXXXXXXX` por ID real no <head>

---

## 📈 MÉTRICAS DE SUCESSO

| Métrica | Mês 1 | Mês 3 | Mês 6 |
|---------|-------|-------|-------|
| DAU (usuários/dia) | 300 | 1.000 | 3.000 |
| Affiliate CTR | 2% | 3% | 5% |
| Premium conversion | 0% | 2% | 5% |
| Newsletter subs | 50 | 300 | 1.000 |
| Revenue | R$200 | R$3.600 | R$14.300 |

---

## 🔄 ATUALIZAR PRODUTOS/AFILIADOS

Para adicionar/remover produtos, edite `index.html` linha 9327:

```javascript
const AFFILIATE_PRODUCTS = [
  {
    id: 'id-unico',
    brand: 'MARCA',
    brandColor: '#hex',
    name: 'Nome do Produto',
    price: 'R$ XX,XX',
    oldPrice: 'R$ XX,XX',
    image: 'URL_IMAGEM',
    url: 'LINK_MERCADO_LIVRE',
    commission: 'X%',
    badge: '🏆 Tag',
    rating: 4.X,
    reviews: 123
  },
  // ... mais produtos
];
```

---

## 🎯 PRÓXIMAS ETAPAS (ROADMAP)

**Semana 1:**
- [ ] Configurar chaves API (AdSense, MP, MailerLite)
- [ ] Testar fluxos completos
- [ ] Postar no Instagram sobre loja/premium

**Semana 2:**
- [ ] Criar canal YouTube @ASF_Dicas
- [ ] Subir 3 vídeos (dicas 60s)
- [ ] Cadastrar Amazon Associates

**Semana 3:**
- [ ] Implementar webhook Mercado Pago
- [ ] Lançar premium oficialmente
- [ ] Contactar 5 marcas para sponsorship

**Semana 4:**
- [ ] Criar e-book (Canva → Gumroad)
- [ ] Configurar Hotjar (heatmaps)
- [ ] Otimizar SEO (Google Search Console)

---

## 🆘 SUPORTE

**Problemas técnicos:** Consulte `docs/audit-monetization.md`
**Financeiros:** Carol → +55 11 95434-6288
**GitHub:** acarolmourad-commits/asf-app

---

**Última atualização:** 2026-04-28
**Versão:** main (commit 521c802)
**Status:** ✅ PRONTO PARA USO
