/* ─── ASF Fixes: Calendário e ManaBot ─────────────────────
   1) Calendário: carrega os eventos reais de data/events.json
      e renderiza automaticamente ao abrir a aba.
   2) ManaBot: mostra mensagem de boas-vindas ao abrir a aba. */

/* 1) CALENDÁRIO — carrega eventos reais */
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

/* 2) MANABOT — boas-vindas */
ASF_CHATBOT.welcome = function () {
  const msgs = document.getElementById('chatbot-messages-asf');
  if (!msgs || msgs.dataset.welcomed) return;
  msgs.dataset.welcomed = '1';
  msgs.innerHTML = '<div style="display:flex;justify-content:flex-start;margin-bottom:12px">' +
    '<div style="background:var(--gray-100);color:var(--secondary);padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:14px;max-width:85%">' +
    '<strong style="color:var(--primary)">&#x1F916; ManaBot:</strong><br>' +
    'Oi, mana! &#x1F30A; Eu sou a ManaBot, a assistente da comunidade ASF. ' +
    'Posso te ajudar com dicas de praias para o seu nível, tamanho de prancha, ' +
    'melhor horário para surfar, temperatura do wax e muito mais. ' +
    'Toca numa sugestão abaixo ou escreve sua pergunta!' +
    '</div></div>';
};

/* Dispara ao clicar nas abas correspondentes */
(function () {
  function hook() {
    document.querySelectorAll('.tab').forEach(t => {
      if (t.dataset.asfFixHooked) return;
      t.dataset.asfFixHooked = '1';
      t.addEventListener('click', () => {
        const id = t.getAttribute('aria-controls');
        if (id === 'eventos' && typeof ASF_CALENDAR !== 'undefined') ASF_CALENDAR.open();
        if (id === 'assistente' && typeof ASF_CHATBOT !== 'undefined') ASF_CHATBOT.welcome();
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();
