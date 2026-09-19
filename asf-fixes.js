/* ─── ASF Fixes: inicialização da home longa ───────────────
   A home mostra TODAS as seções (modo página longa/AdSense), então
   este arquivo inicializa tudo no DOMContentLoaded, quando os objetos
   ASF_* já existem. Também atende aos cliques das abas. */

(function () {

  /* 1) CALENDÁRIO — carrega eventos reais de data/events.json */
  function setupCalendar() {
    if (typeof ASF_CALENDAR === 'undefined' || ASF_CALENDAR._openReady) return;
    ASF_CALENDAR._openReady = true;
    ASF_CALENDAR.open = async function () {
      if (!this._remoteLoaded) {
        this._remoteLoaded = true;
        try {
          const r = await fetch('data/events.json');
          const j = await r.json();
          const saved = JSON.parse(localStorage.getItem('asf-calendar-events') || '[]');
          const conf = {};
          saved.forEach(e => { conf[e.id] = { confirmed: e.confirmed, participants: e.participants }; });
          const remotos = (j.eventos || []).map((e, i) => {
            const id = 1000 + i;
            const s = conf[id] || {};
            return {
              id: id,
              title: e.titulo,
              date: e.inicio,
              endDate: e.fim,
              type: 'evento',
              icon: '&#x1F3C4;',
              location: e.local,
              confirmed: !!s.confirmed,
              participants: s.participants || 0,
              maxParticipants: 0,
              description: (e.descricao || '') + (e.fonte ? ' · Fonte: ' + e.fonte : ''),
              category: e.status === 'EM_ANDAMENTO' ? 'Acontecendo agora' : 'Evento'
            };
          });
          this.events = remotos.concat(this.events.filter(e => e.id < 1000));
        } catch (err) { /* mantém eventos padrão offline */ }
      }
      this.render('calendar-content');
    };
    ASF_CALENDAR.open();
  }

  /* 2) MANABOT — boas-vindas + novos conhecimentos */
  function setupChatbot() {
    if (typeof ASF_CHATBOT === 'undefined' || ASF_CHATBOT._fixesReady) return;
    ASF_CHATBOT._fixesReady = true;

    ASF_CHATBOT.welcome = function () {
      const msgs = document.getElementById('chatbot-messages-asf');
      if (!msgs || msgs.dataset.welcomed) return;
      msgs.dataset.welcomed = '1';
      msgs.innerHTML = '<div style="display:flex;justify-content:flex-start;margin-bottom:12px">' +
        '<div style="background:var(--gray-100);color:var(--secondary);padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:14px;max-width:85%">' +
        '<strong style="color:var(--primary)">&#x1F916; ManaBot:</strong><br>' +
        'Oi, mana! &#x1F30A; Eu sou a ManaBot, a assistente da comunidade ASF. ' +
        'Posso te ajudar com dicas de praias para o seu nível, tamanho de prancha, ' +
        'melhor horário para surfar, temperatura do wax, eventos, carteirinha e muito mais. ' +
        'Toca numa sugestão abaixo ou escreve sua pergunta!' +
        '</div></div>';
    };

    ASF_CHATBOT.knowledgeBase.push(
      { q: ['evento', 'eventos', 'calendario', 'calendário', 'competicao', 'competição', 'campeonato', 'encontro', 'quando tem'],
        a: '&#x1F4C5; Na seção <strong>Calendário de Eventos</strong> você vê todos os rolês da comunidade e do circuito: encontros ASF, etapas WSL, copas e clínicas! Dá para ver por mês ou em lista e confirmar presença.' },
      { q: ['carteirinha', 'associada', 'associação', 'associacao', 'membro', 'cadastro', 'identidade', 'desconto', 'parceria'],
        a: '&#x1FAAA; A <strong>Carteirinha ASF</strong> é gratuita e personalizada: você cria com seu nome, nível e foto, e recebe um número único com QR Code de verificação. Em breve ela vai valer benefícios em lojas de surf, agências de viagens e pousadas parceiras!' },
      { q: ['leash', 'prioridade', 'etiqueta', 'regra', 'regras', 'respeito', 'quem tem prioridade'],
        a: '&#x1F6DF; Regras de ouro no mar: 1) Quem está mais perto do pico tem prioridade; 2) Nunca solte a prancha — o leash é obrigatório; 3) Não drope a onda de outra surfista; 4) Respeite o ambiente marinho. Na seção <strong>Segurança no Surf</strong> tem o guia completo!' },
      { q: ['meta', 'metas', 'objetivo', 'objetivos', 'evoluir', 'evolução', 'evolucao', 'progresso', 'aprender'],
        a: '&#x1F3AF; Na seção <strong>Metas de Surf</strong> você define e acompanha seus objetivos: melhorar a remada, dropar a primeira onda verde, fazer a primeira manobra... cada conquista vale XP na comunidade! &#x1F3C4;' },
      { q: ['wetsuit', 'roupa de neoprene', 'neoprene', 'roupa de borracha', 'frio', 'lycra'],
        a: '&#x1F9CD; Wetsuit: no verão paulista um short john ou lycra UV já resolve (água 22-28C). No inverno, long john 3/2mm é o ideal. Ajuste deve ser justo sem apertar o pescoço, e enxágue com água doce depois de cada sessão!' }
    );

    ASF_CHATBOT.welcome();
  }

  /* 3) CARTEIRINHA — renderiza assim que a página abre (home longa) */
  function setupCard() {
    if (typeof ASF_CARD !== 'undefined') ASF_CARD.init();
  }

  /* 4) Reforço ao clicar nas abas (para quem navega por elas) */
  function hookTabs() {
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.asfFixHooked) return;
      t.dataset.asfFixHooked = '1';
      t.addEventListener('click', () => {
        const id = t.getAttribute('aria-controls');
        if (id === 'eventos' && typeof ASF_CALENDAR !== 'undefined' && ASF_CALENDAR.open) ASF_CALENDAR.open();
        if (id === 'assistente' && typeof ASF_CHATBOT !== 'undefined' && ASF_CHATBOT.welcome) ASF_CHATBOT.welcome();
        if (id === 'carteirinha' && typeof ASF_CARD !== 'undefined') ASF_CARD.init();
      });
    });
  }

  function initAll() {
    setupCalendar();
    setupChatbot();
    setupCard();
    hookTabs();
  }

  /* DOMContentLoaded garante que os scripts inline (ASF_CALENDAR,
     ASF_CHATBOT) e carteirinha.js já foram executados. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
