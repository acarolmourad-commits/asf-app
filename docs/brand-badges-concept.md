# 🏆 BRAND BADGES - Sistema de Badges Patrocinados

## 📋 CONCEITO

**Badges (conquistas) patrocinadas por marcas** que as manas ganham ao:
1. Comprar produtos da marca (com código ASF)
2. Usar o produto e registrar no app
3. Alcançar metas (ex: 10 surf sessions com a lycra X)

---

## 🎯 POR QUE MARCAS VÃO AMAR?

### **VISUAL IMPACTANTE**
- Badges aparecem no **perfil da mana** (área de destaque)
- Badges aparecem no **Brand Hub** (galeria de conquistas)
- Badges aparecem em **notificações push** ("@Carol ganhou o badge STHILL SURF!")
- Badges podem ser **colecionáveis** (séries limitadas)

### **Dados Valiosos**
- Marca sabe **quantas manas estão usando** seu produto
- **Engagement rate** das campanhas
- **ROI direto**: venda → badge → orgulho → fidelização

---

## 🎨 TIPOS DE BADGES

### **1. BADGE DE COMPRA (Entry Level)**
```
🛒 [LOGO MARCA] - "Primeira Compra"
✅ Ganha ao usar código ASFXX na 1ª compra
📅 Dura: 30 dias (renovável anualmente)
🎁 Benefício: 5% OFF no app
```

### **2. BADGE DE USO (Engagement)**
```
🏄 [LOGO MARCA] - "Surfista STHILL"
✅ Ganha após 5 surf sessions com prancha da marca
📊 Níveis: Bronze (5) → Silver (20) → Gold (50) → Diamond (100)
🏆 Exclusivo: mostra no perfil como "Surfista STHILL Diamond"
```

### **3. BADGE DE DESAFIO (Campaign)**
```
🎯 [LOGO MARCA] - "Desafio Verão 2026"
✅ Ganha ao postar foto com hashtag #ASFSTHILL
⏰ Limitado: apenas 500 primeiras
🌟 Especial: badge animado (glow effect)
```

### **4. BADGE DE COMUNIDADE (Social Proof)**
```
👥 [LOGO MARCA] - "Embaixadora ASF"
✅ Indicada por outras manas + votação
✨ Único: 10 por marca por ano
💎 Altíssimo valor: posicionamento como leader
```

---

## 📱 IMPLEMENTAÇÃO NO APP

### **Perfil da Mana (área de badges)**
```
┌─────────────────┐
│  🏆 MEUS BADGES │
├─────────────────┤
│ 🛒 STHILL       │ ← Bronze
│ 🏄 STHILL       │ ← Silver (20 sessions)
│ 🎯 TRIBOSURF    │ ← Desafio
│ 👥 ASF          │ ← Embaixadora
└─────────────────┘
```

### **Botão "Ganhar Badges"**
- Mostra badges disponíveis
- Como ganhar cada um
- Progresso atual
-LOGO da marca vinculada

### **Badge Animado (especial)**
- Efeito glow dourado
- Partículas saindo
- Som ao ganhar
- Notificação push: "🎉 PARABÉNS! Você ganhou o badge [MARCA]!"

---

## 💰 MODELO DE PRICING (por badge)

| Tipo | Preço | O que a marca paga |
|------|-------|-------------------|
| **Badge Básico** | R$ 2.000/mês | Badge fixo no perfil + notificação |
| **Badge Premium** | R$ 5.000/mês | Badge animado + appearing em múltiplas seções |
| **Badge Exclusivo** | R$ 15.000/mês | Série limitada (apenas 100 badges) + evento de entrega |
| **Campanha Desafio** | R$ 10.000 + R$50/badge | Badge por performance (paga só por badges ganhos) |

**Meta:** 5 marcas → **R$ 35.000/mês** (R$ 420.000/ano)

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### **Estrutura de dados:**
```javascript
{
  "badges": [
    {
      "id": "sthill-bronze",
      "brand": "STHILL SURF",
      "type": "usage",
      "name": "Surfista STHILL Bronze",
      "description": "5 surf sessions com prancha STHILL",
      "icon": "🏄",
      "color": "#3498db",
      " earnedAt": "2026-04-28",
      "expiresAt": null,
      "level": 1, // 1-4 (Bronze, Silver, Gold, Diamond)
      "progress": { current: 5, target: 20 }
    }
  ]
}
```

### **LocalStorage keys:**
- `asf-badges` - badges da mana (array)
- `asf-brand-usage` - uso de produtos (tracking)

### **Funções JS:**
- `earnBadge(badgeId)` - adiciona badge
- `checkBadgeProgress()` - valida se cumpre critérios
- `renderBadges()` - desenha na tela
- `animateBadgeEarn()` - animação de ganho

---

## 🎯 EXEMPLO DE CAMPANHA

**Marca:** STHILL SURF  
**Objetivo:** Lançar nova linha de pranchas  
**Campanha:** "Primeiras 100 manas a usarem ganham badge exclusivo"  

**Mecânica:**
1. Mana compra prancha STHILL
2. Usa código `ASFSTHILL` no checkout
3. Recebe email: "Parabéns! Você ganhou o badge STHILL FOUNDER!"
4. Badge aparece no perfil com glow dourado
5. Compartilha no Instagram: "Acabei de ganhar meu badge STHILL FOUNDER da ASF! 🏆"
6. Outras manas veem e querem também

**Resultado p/ marca:**
- 100 vendas diretas
- 100 posts orgânicos no Instagram
- 100 depoimentos autênticos
- badges colecionáveis (desejo)

---

## 📈 MÉTRICAS DE SUCESSO

| Métrica | Meta |
|---------|------|
| Badges emitidos/mês | 500+ |
| Marcas ativas | 5-10 |
| Manas com ≥1 badge | 30%+ |
| Compartilhamentos sociais | 200+/mês |
| ROI médio por marca | 8x |

---

## 🚀 PRÓXIMOS PASSOS

1. **Criar interface de badges** no perfil
2. **Sistema de checking** (validar compras)
3. **API de códigos** (gerenciar cupons)
4. **Dashboard da marca** (ver quem ganhou)
5. **Notificações push** de badges
6. **Badges colecionáveis** (trading cards)
7. **Ranking de colecionadoras** (top 10)

---

**Badges patrocinados = marcas + manas + ASF todos ganham!** 💰🏆
