// Instagram Content for ASF - Ready-to-use posts
const InstagramContent = {
  posts: [
    {
      id: 1,
      title: "POSE DE GROSSURA PERFEITA",
      emoji: "🏄‍♀️",
      category: "Técnica",
      content: `A grossura é a base de tudo! Para fazer a grossura correta:
✅ Fique de costas à onda
✅ Flexione levemente os joelhos
✅ Distribua o peso igualmente
✅ Olhe para a prancha, não para a areia!`,
      hashtags: "#surffeminino #grossura #técnicas #bertioga #surfbrasil #mulhersurfista #asf #dicasdesurf"
    },
    {
      id: 2,
      title: "MULHER QUE SURFAR, NÃO SURFARÁ SOOZINHA",
      emoji: "🌅",
      category: "Motivação",
      content: `Cada onada que você pega é uma conquista. Cada wipeout é um aprendizado. Cada sessão é uma celebração da irmandade que criamos juntas.

Hoje celebramos cada uma de vocês que estão nessa jornada com a gente!`,
      hashtags: "#mulhersurfista #irmandade #surfpositivo #associacaosurffeminino #empoderamento #surfcommunity"
    },
    {
      id: 3,
      title: "WQS PRAIA DO TOMBO - AGOSTO 2026",
      emoji: "🏆",
      category: "Evento",
      content: `Marca na agenda, manas! 15-17 de agosto no calendário!
Etapa feminina do World Qualifying Series aqui em Bertioga

Quem vai torcer e apoiar nossas surfistas?`,
      hashtags: "#WQS #praiaadombo #bertiogasurf #competisurf #surffeminino #eventosurf"
    },
    {
      id: 4,
      title: "SAIBA LER A ONDA",
      emoji: "🌊",
      category: "Educação",
      content: `Dica de leitura:
🟢 Onda verde = boa para surfar
🟡 Onda amarela = cuidado com o fechamento
🔴 Onda vermelha = perigo, evite

Sempre observe antes de entrar!`,
      hashtags: "#segurançasurf #ondas #oceanografia #surfsegura #educaçãosurf"
    },
    {
      id: 5,
      title: "MANUTENÇÃO DA PRANCHÃ",
      emoji: "🧼",
      category: "Equipamento",
      content: `Sua prancha merece carinho!
→ Lave após cada sessão
→ Verifique os parafusos
→ Guarde em local seco`,
      hashtags: "#manutençãodesurf #prancha #equipamentosurf #dicas #longlifesurfboard"
    },
    {
      id: 6,
      title: "SESSÃO DE HOJE COM AS MANAS",
      emoji: "💪",
      category: "Comunidade",
      content: `7h na Praia do Tombo!
Quem vai? Confirmem presença!

Juntes na água, unidas no coração.`,
      hashtags: "#sessãosurf #bertioga #grupodosurf #manaspodersas #comunidadeASF"
    },
    {
      id: 7,
      title: "MARGARETH MENEZES - PIONEIRA",
      emoji: "👑",
      category: "História",
      content: `Did you know? Em 1978, Margareth Menezes foi a primeira surfista brasileira a competir internacionalmente. Representou o Brasil em Hawaii com uma prancha caseira!

Inspiração para todas nós!`,
      hashtags: "#históriadosurf #surfbrasil #mulherpioneira #inspo #surfhistory"
    },
    {
      id: 8,
      title: "ALONGAMENTO PÓS-SURF",
      emoji: "🧘",
      category: "Saúde",
      content: `7 minutos de alongamento:
1. Panturrilha (30s cada perna)
2. Isquiotibiais (30s cada perna)
3. Glúteos (30s cada lado)
4. Costa (30s)
5. Ombros (30s)`,
      hashtags: "#alongamento #surffitness #recuperação #saúde #bemestar"
    }
  ],

  // Render posts
  render: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = this.posts.map(post => `
      <div class="card" style="margin-bottom: 16px;">
        <div style="display: flex; gap: 12px;">
          <div style="font-size: 28px;">${post.emoji}</div>
          <div style="flex: 1;">
            <h4 style="font-size: 16px; margin: 0 0 8px 0;">${post.title}</h4>
            <span style="font-size: 11px; background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px;">${post.category}</span>
            <p style="font-size: 14px; margin: 8px 0; line-height: 1.5;">${post.content.replace(/\n/g, '<br>')}</p>
            <p style="font-size: 12px; color: var(--gray-500); margin: 8px 0 0 0;">${post.hashtags}</p>
          </div>
        </div>
      </div>
    `).join('');
  }
};

// Auto-render when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => InstagramContent.render('instagram-content-container'), 1000);
});