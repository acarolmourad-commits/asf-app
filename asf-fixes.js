/* ─── ASF Fixes: inicialização automática ──────────────────
   O site opera como página longa (seções sempre visíveis), então
   todos os módulos renderizam no carregamento.
   1) Metas de Surf
   2) Segurança no Surf (conteúdo real — container nunca era preenchido)
   3) Calendário de Eventos (eventos reais de data/events.json)
   4) ManaBot (boas-vindas + novos conhecimentos)
   5) Carteirinha ASF */

function asfInitModules() {

  /* 1) METAS */
  try { if (typeof ASF_METAS !== 'undefined') ASF_METAS.init(); } catch (e) {}

  /* 2) SEGURANÇA — conteúdo real (o container nunca era preenchido) */
  (function () {
    const el = document.getElementById('seguranca-content');
    if (!el || el.dataset.loaded) return;
    el.dataset.loaded = '1';
    const regras = [
      { i: '🥇', t: 'Prioridade nas ondas', d: 'Quem está mais perto do pico (parte mais alta da onda) tem prioridade. Nunca drope a onda de outra surfista.' },
      { i: '🔗', t: 'Leash sempre', d: 'O leash (cordinha) é obrigatório: mantém sua prancha perto de você e longe da cabeça dos outros.' },
      { i: '👀', t: 'Olhe antes de remar', d: 'Antes de entrar numa onda, olhe para os lados e para trás. Se alguém já está nela, saia da frente.' },
      { i: '🆘', t: 'Conheça seus limites', d: 'Não entre em condições acima do seu nível. Se estiver cansada ou insegura, saia e descanse.' },
      { i: '🌊', t: 'Correntes de retorno', d: 'Se puxada para fora, não lute contra: nade paralelo à praia até sair da corrente e depois volte.' },
      { i: '🐚', t: 'Respeito ao mar', d: 'Não jogue lixo, não pise em recifes vivos e respeite a vida marinha. A praia é de todo mundo.' },
      { i: '👯‍♀️', t: 'Nunca surfe sozinha', d: 'Especialmente em praias novas. Avise alguém, surfe com as manas e conheça os pontos de encontro.' },
    ];
    el.innerHTML = '<div style="max-width:520px;margin:0 auto">' +
      regras.map(r =>
        '<div class="card" style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px">' +
        '<span style="font-size:24px;flex-shrink:0">' + r.i + '</span>' +
        '<div><p style="font-size:14px;font-weight:700;color:var(--secondary);margin:0 0 4px">' + r.t + '</p>' +
        '<p style="font-size:13px;color:var(--gray-600);margin:0;line-height:1.5">' + r.d + '</p></div></div>'
      ).join('') +
      '<div class="card" style="background:rgba(46,204,113,0.08);border:1.5px solid rgba(46,204,113,0.3);text-align:center">' +
      '<p style="font-size:13px;color:var(--secondary);margin:0;font-weight:600">💚 Regra de ouro: na dúvida, priorize a segurança — a onda sempre volta.</p>' +
      '</div></div>';
  })();

  /* 3) CALENDÁRIO — carrega eventos reais */
  if (typeof ASF_CALENDAR !== 'undefined' && !ASF_CALENDAR.open) {
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
  }
  try { if (typeof ASF_CALENDAR !== 'undefined') ASF_CALENDAR.open(); } catch (e) {}

  /* 4) MANABOT */
  if (typeof ASF_CHATBOT !== 'undefined') {
    if (!ASF_CHATBOT.welcome) {
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
    }
    try { ASF_CHATBOT.welcome(); } catch (e) {}

    if (!ASF_CHATBOT._kbExtended) {
      ASF_CHATBOT._kbExtended = true;
      ASF_CHATBOT.knowledgeBase.push(
        { q: ['evento', 'eventos', 'calendario', 'calendário', 'competicao', 'competição', 'campeonato', 'encontro', 'quando tem'],
          a: '&#x1F4C5; Na seção <strong>Calendário de Eventos</strong> você vê todos os rolês da comunidade e do circuito: encontros ASF, etapas WSL, copas e clínicas! Dá para ver por mês ou em lista e confirmar presença.' },
        { q: ['carteirinha', 'associada', 'associação', 'associacao', 'membro', 'cadastro', 'identidade', 'desconto', 'parceria'],
          a: '&#x1FAAA; A <strong>Carteirinha ASF</strong> é gratuita e personalizada: você cria com seu nome, nível e foto, e recebe um número único com QR Code de verificação. Em breve ela vai valer benefícios em lojas de surf, agências de viagens e pousadas parceiras!' },
        { q: ['leash', 'prioridade', 'etiqueta', 'regra', 'regras', 'respeito', 'quem tem prioridade'],
          a: '&#x1F6DF; Regras de ouro no mar: 1) Quem está mais perto do pico tem prioridade; 2) Nunca solte a prancha — o leash é obrigatório; 3) Não drope a onda de outra surfista; 4) Respeite o ambiente marinho. O guia completo está na seção <strong>Segurança no Surf</strong>, logo aqui em cima!' },
        { q: ['meta', 'metas', 'objetivo', 'objetivos', 'evoluir', 'evolução', 'evolucao', 'progresso', 'aprender'],
          a: '&#x1F3AF; Na seção <strong>Metas de Surf</strong> você define e acompanha seus objetivos: melhorar a remada, dropar a primeira onda verde, fazer a primeira manobra... cada conquista vale XP na comunidade! &#x1F3C4;' },
        { q: ['wetsuit', 'roupa de neoprene', 'neoprene', 'roupa de borracha', 'frio', 'lycra'],
          a: '&#x1F9CD; Wetsuit: no verão paulista um short john ou lycra UV já resolve (água 22-28C). No inverno, long john 3/2mm é o ideal. Ajuste deve ser justo sem apertar o pescoço, e enxágue com água doce depois de cada sessão!' }
      );
    }
  }

  /* 5) CARTEIRINHA */
  try { if (typeof ASF_CARD !== 'undefined') ASF_CARD.init(); } catch (e) {}
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', asfInitModules);
} else {
  asfInitModules();
}

/* Reforço: também ao clicar nas abas */
document.addEventListener('click', function (ev) {
  const t = ev.target.closest && ev.target.closest('.tab');
  if (!t) return;
  const id = t.getAttribute('aria-controls');
  if (id === 'eventos' && typeof ASF_CALENDAR !== 'undefined' && ASF_CALENDAR.open) ASF_CALENDAR.open();
  if (id === 'assistente' && typeof ASF_CHATBOT !== 'undefined' && ASF_CHATBOT.welcome) ASF_CHATBOT.welcome();
  if (id === 'carteirinha' && typeof ASF_CARD !== 'undefined') ASF_CARD.init();
});
