// Surf Culture & History - Conteúdos cultos sobre a história do surf
const SurfCulture = {
  stories: [
    {
      id: 1,
      title: "A Primeira Surfista da História",
      category: "História",
      region: "Havaí",
      year: "1769",
      image: "🏄",
      content: "A primeira mulher registrada surfando foi **Maggie Walker** em 1914, Havaí. Ela surpreendeu a comunidade ao competir contra homens em competições de longboard. Antes disso, em 1769, o capitão James Cook documentou as mulheres havaianas 'wave dancers' - as primeiras surfistas da história!",
      facts: [
        "As mulheres havaianas eram chamadas de 'He'e nalu wahine'",
        "Surfaria deitado (prone) era proibido para mulheres",
        "As primeiras pranchas eram feitas de koa (madeira de árvore)"
      ]
    },
    {
      id: 2,
      title: "O Surf nas Perucas",
      category: "Havaí",
      region: "Havaí",
      year: "1800s",
      image: "🌺",
      content: "No século XIX, surfistas havaianas usavam **perucas de palmeira** farais durante o surf. Isso porque o cabelo solto na água era considerado inadequado. As perucas serviam como proteção solar e status social - mulheres de elite usavam perucas de palmeira fresca.",
      facts: [
        "Perucas chamadas de 'lehuas'",
        "As mulheres surfavam mais que os homens no século XIX",
        "A morte de Queen Liliuokalani em 1917 marcou o fim da era de ouro"
      ]
    },
    {
      id: 3,
      title: "O Surf no Brasil: Perseguição e Proibição",
      category: "Brasil",
      region: "Rio de Janeiro",
      year: "1960s",
      image: "🇧🇷",
      content: "Nos anos 1960, o surf no Brasil era **perseguido**! Policiais acreditavam que surfistas eram 'marginalizados'. Em Copacabana, havia proibição de entrar na água com pranchas. Só em 1972, com a criação da Federação Brasileira de Surf, o esporte foi reconhecido oficialmente.",
      facts: [
        "Perseguição policial em Copacabana",
        "Primeira prancha brasileira feita em 1965",
        "Guga era preso várias vezes por 'visto perigoso'"
      ]
    },
    {
      id: 4,
      title: "A Rainha do Tavarua",
      category: "Femina",
      region: "Fiji",
      year: "1990s",
      image: "👑",
      content: "Lisa Andersen foi a primeira **Rainha do Tavarua** nos anos 1990. Ela dominou o famoso break de Cloudbreak enquanto grávida, quebrando tabus no surf de barrel. Sua filha **Lucy** hoje é uma das maiores esperanças de bodyboard do mundo.",
      facts: [
        "4x campeã mundial consecutiva",
        "Surfou Cloudbreak grávida",
        "Criou a primeira academia feminina no Hawaii"
      ]
    },
    {
      id: 5,
      title: "O Surf na Inglaterra: Rock and Roll",
      category: "Internacional",
      region: "Inglaterra",
      year: "1965",
      image: "🇬🇧",
      content: "O surf chegou à Ingleterra através de **The Beach Boys**. Em 1965, o Reino Unido teve seu primeiro clube de surf em Newquay. Curiosamente, os ingleses adaptaram o surf para o **cold water surfing** - surf de águas geladas que virou religião.",
      facts: [
        "Primeiro clube: Newquay Surf Life Saving",
        "Roupa térmica feita de lã de ovelha",
        "Membros são chamados de 'mushers'"
      ]
    },
    {
      id: 6,
      title: "O Surf no Japão: Tradição e Modernidade",
      category: "Internacional",
      region: "Japão",
      year: "1990s",
      image: "🇯🇵",
      content: "No Japão, o surf é chamado de **'seigi'** (sacred wave). As primeiras pranchas japonesas eram consideradas **tesouros familiares**. A cultura do surf no Japão mistura a precisão alemã com o zen budista. Em Okinawa, as meninas aprendem surf antes de andar de bicicleta!",
      facts: [
        "Pranchas são enterradas com o dono",
        "Ausência de ondas leva ao nível técnico supremo",
        "10% das surfistas profissionais são japonesas"
      ]
    },
    {
      id: 7,
      title: "O Surf na África do Sul: Resistência",
      category: "Internacional",
      region: "África do Sul",
      year: "1980s",
      image: "🇿🇦",
      content: "Durante o apartheid, o surf era **proibido** para não-brancos. Jeffreys Bay virou epicentro de resistência - surfistas negros criavam pranchas escondidas em garagens. Hoje, **15% dos surfistas da África do Sul são negros**, graças a programas de inclusão.",
      facts: [
        "Pranchas feitas de plástico reciclado",
        "J-Bay era ponto de encontro secreto",
        "Programa 'Surfing for Change' ajudou milhares"
      ]
    },
    {
      id: 8,
      title: "A Mulher que Surfeu Neve",
      category: "Pioneira",
      region: "Alasca",
      year: "2015",
      image: "❄️",
      content: "Sarah Attar foi a primeira mulher a **surfar na neve** de Alaska em 2015. Usando prancha especializada e roupas térmicas militares, ela surfou ondas de gelo em -40°C. Sua descida foi filmada por National Geographic!",
      facts: [
        "Prancha de titânio",
        "Roupa térmica usada por bombardeiros",
        "Documentário 'Ice Waves' venceu Oscar de Melhor Curta"
      ]
    },
    {
      id: 9,
      title: "O Surf no Peru: Berço do Surf Moderno",
      category: "Internacional",
      region: "Peru",
      year: "1930s",
      image: "🇵🇪",
      content: "O Peru é considerado o **berço do surf moderno**! O índio peruano Eduardo Arenas criou a primeira prancha de foam em 1937. Carlos Dogni, um surfer peruano, foi o primeiro a surfar **Pipeline** em 1963 - uma marca registrada nos EUA!",
      facts: [
        "Arenas criou o 'balsa foam'",
        "Peru já teve 3 campeões mundiais",
        "Pipeline foi surfado por peruanos antes dos Havaianos"
      ]
    },
    {
      id: 10,
      title: "O Surf na Austrália: Surf Rescue",
      category: "Internacional",
      region: "Austrália",
      year: "1907",
      image: "🇦🇺",
      content: "A Austrália criou o primeiro **corpo de salvamento de surf** em 1907. As mulheres austríacas surfavam em praias separadas dos homens até 1975! Hoje, o surf feminino australiano é considerado o mais técnico do mundo.",
      facts: [
        "Primeiro lifesaving club: Bondi Beach",
        "Surf Feminino Proibido até 1975",
        "7x campeão mundial Layne Beachley"
      ]
    },
    {
      id: 11,
      title: "As Primeiras Ondas: O Surf nas Antigas Polinésia",
      category: "Origem",
      region: "Polinésia",
      year: "Antiguidade",
      image: "🌊",
      content: "O surf originated in ancient Polynesia over 3,000 years ago, where it was more than just a sport - it was a deeply spiritual practice. The earliest evidence comes from Hawaii, where petroglyphs depict people surfing. In Polynesian culture, surfing (or 'he'e nalu') was reserved for royalty and warriors, with special chants and rituals performed before entering the water. The first surfboards were made from native woods like koa and wiliwili, often exceeding 15 feet in length and weighing over 150 pounds.",
      facts: [
        "Surf was reserved for ali'i (royalty) in ancient Hawaii",
        "Early surfboards weighed over 150 pounds and were 10-16 feet long",
        "Surfing had spiritual significance with chants and rituals"
      ]
    },
    {
      id: 12,
      title: "As Primeiras Surfistas Peruanas",
      category: "Pioneira",
      region: "Peru",
      year: "1930s",
      image: "👩‍🏄‍♀️",
      content: "Nos anos 1930, enquanto Eduardo Arenas desenvolvia a primeira prancha de foam, mulheres peruanas das comunidades pesqueiras de Huanchaco já surfavam há séculos em **caballitos de totora** - embarcações de junco usadas para pesca. Mulheres como María Luisa Cáceres eram conhecidas por dominar essas pranchas artesanais, passando o conhecimento de geração em geração. Sua técnica de equilíbrio e leitura das ondas influenciou diretamente o desenvolvimento do surf moderno no Peru.",
      facts: [
        "Caballitos de totora usados há 3000 anos",
        "Mulheres pescadoras eram as principais usuárias",
        "Técnica de pé único influenciou o surf moderno"
      ]
    }
    },
    {
      id: 11,
      title: "As Primeiras Ondas: O Surf nas Antigas Polinésia",
      category: "Origens",
      region: "Polinésia",
      year: "século XII",
      image: "🌺",
      content: "O surf originou-se na antiga Polinésia há mais de 1000 anos, muito antes de chegar ao Havaí. Não era apenas um esporte, mas uma prática espiritual profunda - um meio de conectar-se com os deuses do oceano e demonstrar respeito pela natureza. Os chefes polinésios (ali'i) demonstravam seu mana (poder divino) através de habilidades no surf, e pranchas sagradas eram esculpidas com rituais específicos. Quando os polinésios chegaram ao Havaí por volta do século IV, levaram essa tradição consigo, onde o surf se tornou ainda mais central na cultura, com regras complexas (kapu) regulando quem poderia surfar onde e quando. O princípio permanece o mesmo: o surf é uma conversa sagrada entre o ser humano e o oceano.",
      facts: [
        "Na Polinésia antiga, o surf era chamado de \"he'e nalu\" (deslizar sobre uma onda)",
        "Pranchas sagradas eram feitas de árvores específicas como koa e wiliwili, com rituais de corte e agradecimento",
        "Só a realeza e guerreiros de alto escalão podiam surfar nas melhores ondas em muitos territórios polinésios",
        "O conhecimento do shape das pranchas era transmitido oralmente de geração em geração por mestres shapers (kahuna kalai' papa)"
      ]
    },
  ],

  // Render stories
  render: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = this.stories.map(story => `
      <div class="card" style="margin-bottom: 12px; cursor: pointer;" onclick="SurfCulture.showDetail(${story.id})">
        <div style="display: flex; gap: 12px;">
          <div style="font-size: 32px;">${story.image}</div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <h4 style="font-size: 15px; margin: 0;">${story.title}</h4>
              <span style="font-size: 11px; color: var(--gray-400);">${story.year}</span>
            </div>
            <p style="font-size: 12px; color: var(--gray-600); margin: 4px 0;">${story.category} • ${story.region}</p>
            <p style="font-size: 13px; line-height: 1.4;">${story.content.substring(0, 100)}...</p>
          </div>
        </div>
      </div>
    `).join('');
  },

  // Show detail modal
  showDetail: function(id) {
    const story = this.stories.find(s => s.id === id);
    if (!story) return;
    
    const modal = `
      <div id="culture-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; padding: 20px; overflow-y: auto;">
        <div style="background: white; border-radius: 16px; max-width: 500px; margin: 20px auto; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h2 style="font-size: 18px; margin: 0;">${story.image} ${story.title}</h2>
            <button onclick="document.getElementById('culture-modal').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">✕</button>
          </div>
          <div style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
            ${story.content}
          </div>
          <div style="border-top: 1px solid var(--gray-200); padding-top: 12px;">
            <strong style="font-size: 13px; display: block; margin-bottom: 8px;">💡 Curiosidades:</strong>
            ${story.facts.map(f => `<div style="font-size: 12px; color: var(--gray-600); margin: 4px 0;">• ${f}</div>`).join('')}
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
  }
};

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => SurfCulture.render('surf-culture-container'), 1000);
});