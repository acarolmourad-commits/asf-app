// ASF Surf News - Dynamic surf news and updates
const SURF_NEWS = [
  {
    id: 1,
    titulo: "WSL Women's Tour 2026 - Bertioga Confirmado!",
    resumo: "A etapa feminina do CT vai passar pela Praia do Tombo em agosto. Mulheres surfistas de todo Brasil já estão se organizando!",
    data: "2026-05-10",
    categoria: "Competição",
    imagem: "🏆",
    link: "#"
  },
  {
    id: 2,
    titulo: "Nova Praia Feminina na Litorânea Paulista",
    resumo: "Bertioga inaugura primeira praia oficial feminina no Brasil. Horário exclusivo das 6h às 8h para surf feminino.",
    data: "2026-05-08",
    categoria: "Comunidade",
    imagem: "🌊",
    link: "#"
  },
  {
    id: 3,
    titulo: "Tecnologia: Pranchas de Surf com Sensor de Onda",
    resumo: "Nova tecnologia registra dados de performance e condições do mar em tempo real. Perfeito para treino!",
    data: "2026-05-05",
    categoria: "Tecnologia",
    imagem: "📱",
    link: "#"
  },
  {
    id: 4,
    titulo: "Workshop de Yoga para Surfistas",
    resumo: "ASF vai promover workshop gratuito de yoga e respiração para surfistas em Bertioga. 20 vagas!",
    data: "2026-05-03",
    categoria: "Evento",
    imagem: "🧘",
    link: "#"
  },
  {
    id: 5,
    titulo: "Projeto de Inclusão: Surf para Todas",
    resumo: "Iniciativa da ASF oferece aulas gratuitas de surf para mulheres em situação de vulnerabilidade.",
    data: "2026-04-28",
    categoria: "Social",
    imagem: "💙",
    link: "#"
  },
  {
    id: 6,
    titulo: "ASF Team no Campeonato Sul-Americano",
    resumo: "Representantes do surf feminino paulista foram selecionados para representar o Brasil em Santiago.",
    data: "2026-04-20",
    categoria: "Competição",
    imagem: "🇵🇾",
    link: "#"
  },
  {
    id: 7,
    titulo: "Parceria com Marca de Roupas de Surf",
    resumo: "ASF fecha parceria com marca sustentável de roupas de surf. Descontos exclusivos para membros!",
    data: "2026-04-15",
    categoria: "Comunidade",
    imagem: "🤝",
    link: "#"
  }
];

function renderSurfNews() {
  const container = document.getElementById('surf-news-container');
  if (!container) return;
  
  container.innerHTML = SURF_NEWS.map(news => `
    <div class="news-card card" style="margin-bottom: 12px; cursor: pointer;" onclick="showNewsDetail(${news.id})">
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="font-size: 32px;">${news.imagem}</div>
        <div style="flex: 1;">
          <span style="background: var(--primary); color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px;">${news.categoria}</span>
          <h4 style="font-size: 14px; margin: 8px 0 4px 0;">${news.titulo}</h4>
          <p style="font-size: 12px; color: var(--gray-600); line-height: 1.4;">${news.resumo}</p>
          <span style="font-size: 10px; color: var(--gray-400);">${formatDate(news.data)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function formatDate(dateStr) {
  const options = { day: 'numeric', month: 'short' };
  return new Date(dateStr).toLocaleDateString('pt-BR', options);
}

function showNewsDetail(id) {
  const news = SURF_NEWS.find(n => n.id === id);
  if (!news) return;
  
  const modal = `
    <div id="news-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; padding: 20px; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; border-radius: 16px; max-width: 500px; width: 100%; max-height: 80vh; overflow-y: auto;">
        <div style="position: relative; padding: 20px;">
          <button onclick="document.getElementById('news-modal').remove()" style="position: absolute; top: 10px; right: 10px; background: var(--gray-200); border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">✕</button>
          <div style="font-size: 48px; text-align: center; margin: 20px 0;">${news.imagem}</div>
          <span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px;">${news.categoria}</span>
          <h2 style="font-size: 18px; margin: 12px 0;">${news.titulo}</h2>
          <p style="color: var(--gray-600); line-height: 1.6;">${news.resumo}</p>
          <p style="font-size: 12px; color: var(--gray-400); margin-top: 16px;">${formatDate(news.data)}</p>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modal);
}

// Auto-render when DOM is loaded
document.addEventListener('DOMContentLoaded', renderSurfNews);