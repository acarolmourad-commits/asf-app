# 🏆 BRAND BADGES - UI Implementation

## 📱 **Estrutura no App**

### **1. Seção Badges no Perfil**
```
┌─────────────────────┐
│  🏆 MEUS BADGES     │
│  (ao lado de "Stats")│
├─────────────────────┤
│ 🛒 STHILL Bronze    │
│ 🏄 TRIBOSURF Silver │
│ 🎯 ASF Founder      │
│ 👥 Embaixadora      │
└─────────────────────┘
   [Ver todos] → Botão
```

### **2. Página Completa de Badges**
```
┌─────────────────────────────────┐
│  🏆 MINHA COLEÇÃO DE BADGES     │
├─────────────────────────────────┤
│                                 │
│  [Badge Grande Destaque]        │
│  🏄 STHILL SURF - Diamond       │
│  "100 Surf Sessions"            │
│  🎉 Você ganhou!                │
│  [Compartilhar] [Ver Progresso] │
│                                 │
├─────────────────────────────────┤
│  BADGES DISPONÍVEIS             │
│                                 │
│  🛒 STHILL Bronze               │
│  🏄 STHILL Silver               │
│  🏅 STHILL Gold                 │
│  💎 STHILL Diamond              │
│                                 │
│  🎯 TRIBOSURF Verão 2026        │
│  👥 ASF Embaixadora             │
└─────────────────────────────────┘
```

### **3. Badge Card Design**
```
┌─────────────────────────────┐
│  🏄  [LOGO MARCA]           │
│  STHILL SURF                │
│  Bronze Level               │
│                             │
│  "5 Surf Sessions"          │
│  Progress: 5/5 ✅           │
│                             │
│  Ganho em: 28/04/2026       │
│  [Compartilhar]             │
└─────────────────────────────┘
```

---

## 🎨 **Sistema Visual**

### **Cores por Marca:**
- STHILL SURF → Azul (#3498db)
- TRIBOSURF → Vermelho (#e74c3c)
- SURFTRUNK → Verde (#2ecc71)
- ASF → Dourado (#FFD700)

### **Animações:**
- **Ganhar badge:** shake + glow + partículas
- **Hover:** scale(1.05) + shadow
- **Novo:** pulse animation (2s infinite)

### **SVG Icons:**
- 🛒 - Compras
- 🏄 - Uso/Surf
- 🎯 - Desafio
- 👥 - Comunidade
- 💎 - Exclusivo
- 🌟 - Limitado

---

## 🔧 **JavaScript Implementation**

```javascript
// Badge data structure
const BRAND_BADGES = [
  {
    id: 'sthill-bronze',
    brand: 'STHILL SURF',
    brandColor: '#3498db',
    icon: '🏄',
    name: 'Surfista STHILL Bronze',
    description: 'Complete 5 surf sessions com prancha STHILL',
    type: 'usage',
    level: 1,
    required: 5,
    iconUrl: null, // SVG inline
    earned: false,
    earnedAt: null,
    progress: 0,
    shareable: true
  },
  // ... mais badges
];

function renderBadges() {
  const container = document.getElementById('badges-grid');
  container.innerHTML = BRAND_BADGES.map(badge => `
    <div class="badge-card" style="border-left: 4px solid ${badge.brandColor}">
      <div class="badge-icon" style="background: ${badge.brandColor}22">
        ${badge.icon}
      </div>
      <h4>${badge.name}</h4>
      <p>${badge.description}</p>
      <div class="progress-bar">
        <div style="width: ${(badge.progress/badge.required)*100}%"></div>
      </div>
      <small>${badge.progress}/${badge.required}</small>
      ${badge.earned ? '<span class="badge-earned">✅ Ganho!</span>' : ''}
    </div>
  `).join('');
}
```

---

## 📊 **Tracking de Uso**

```javascript
// Salvar sessão com marca da prancha
function logSurfSession(beach, duration, boardBrand) {
  const sessions = JSON.parse(localStorage.getItem('asf-sessions') || '[]');
  sessions.push({
    beach, duration, boardBrand,
    date: new Date().toISOString()
  });
  localStorage.setItem('asf-sessions', JSON.stringify(sessions));

  // Check badges
  checkBadgeProgress();
}

// Verificar se ganhou badge
function checkBadgeProgress() {
  const sessions = JSON.parse(localStorage.getItem('asf-sessions') || '[]');
  const badges = JSON.parse(localStorage.getItem('asf-badges') || '[]');

  BRAND_BADGES.forEach(badge => {
    if (!badge.earned) {
      const count = sessions.filter(s => s.boardBrand === badge.brand).length;
      if (count >= badge.required) {
        badge.earned = true;
        badge.earnedAt = new Date().toISOString();
        showBadgeAnimation(badge);
        sendNotification(`🎉 Você ganhou o badge ${badge.name}!`);
      }
    }
  });

  localStorage.setItem('asf-badges', JSON.stringify(badges));
}
```

---

## 🎉 **Animações de Ganho**

```css
@keyframes badge-earn {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); box-shadow: 0 0 30px gold; }
  100% { transform: scale(1); }
}

.badge-earned {
  animation: badge-earn 0.6s ease-out;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #0E2439;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: bold;
}
```

---

## 📲 **Notificações Push**

```
🎉 NOVO BADGE GANHO!

🏄 STHILL SURF - Bronze
"5 Surf Sessions"

Você acabou de ganhar!
[Ver no App]
```

---

## 🏪 **Dashboard da Marca**

A marca acessa:
```
┌──────────────────────────┐
│  📊 Dashboard - STHILL   │
├──────────────────────────┤
│  Badges emitidos: 127    │
│ ︎  Bronze: 100           │
│ ︎  Silver: 23            │
│ ︎  Gold: 4               │
│                          │
│  Manas ativas: 89        │
│  Sessões registradas: 456│
│  Compartilhamentos: 234  │
│                          │
│  📈 Crescimento: +15%    │
│  💰 ROI: 8.2x            │
└──────────────────────────┘
```

---

## 🎯 **Exemplo de Jornada**

**Mana: Carol**
1. Compra prancha STHILL → código ASFSTHILL
2. Recebe email: "Badge Bronze garantido!"
3. Vê no app: animação + badge no perfil
4. Compartilha no Instagram
5. Quer Silver → faz mais 15 sessões
6. Ganha Silver → mostra p/ amigas
7. **Viral** → amigas compram STHILL

**Resultado p/ STHILL:** vendas + branding + fidelidade

---

## 🔄 **Fluxo Completo**

```
Compra (código ASFXX) → Email → Badge no app → Animação → Notificação → 
Compartilhamento social → Amigas veem → Querem também → Nova venda
```

---

## 📈 **Métricas**

- **Badges emitidos/mês**
- **Taxa de conversão** código → badge
- **Compartilhamentos sociais**
- **Retenção** (manas com badges retêm 40% mais)
- **NPV** (valor presente das manas fidelizadas)

---

## 🚀 **PRÓXIMOS PASSOS**

1. Criar UI de badges no perfil
2. Implementar sistema de tracking
3. Validar compostas via API (ou manual)
4. Dashboard analytics
5. Notificações automáticas
6. Compartilhamento social
7. Ranking de colecionadoras

---

**Badges = Gamificação + Fidelização + Dados para marcas!** 🏆
