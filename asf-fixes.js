/* ─── ASF Fallbacks: o bloco inline principal do index.html tinha um erro de
   sintaxe (chave nao fechada) que impedia ASF_CALENDAR e ASF_CHATBOT de serem
   definidos — a secao final ficava "morta". Estas definicoes autocontidas
   garantem Calendario + ManaBot mesmo se o bloco inline falhar. ─── */

if (typeof window.ASF_CALENDAR === 'undefined') {
  window.ASF_CALENDAR = {
    view: 'month',
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    events: [],
    toggleEvent: function (id) {
      const ev = this.events.find(function (e) { return e.id === id; });
      if (!ev) return;
      ev.confirmed = !ev.confirmed;
      ev.participants = Math.max(0, (ev.participants || 0) + (ev.confirmed ? 1 : -1));
      try { localStorage.setItem('asf-calendar-events', JSON.stringify(this.events)); } catch (e) {}
      if (typeof showToast === 'function') showToast(ev.confirmed ? '\u2705 Confirmado em: ' + ev.title : '\u274C Cancelado: ' + ev.title);
      if (this.view === 'upcoming') this.renderUpcoming('calendar-upcoming'); else this.render('calendar-content');
    },
    render: function (containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const months = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      const month = this.currentMonth, year = this.currentYear, today = new Date();
      const startDay = (function () { const d = new Date(year, month, 1).getDay(); return d === 0 ? 6 : d - 1; })();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      let html = '<div style="max-width:480px;margin:0 auto 20px;background:var(--white);border-radius:20px;box-shadow:var(--shadow-md);overflow:hidden">';
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white">';
      html += '<button onclick="ASF_CALENDAR.changeMonth(-1)" style="background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px" aria-label="Mes anterior">\u2039</button>';
      html += '<div style="text-align:center"><p style="font-size:18px;font-weight:700;margin:0">' + months[month] + '</p><p style="font-size:12px;opacity:0.8;margin:2px 0 0">' + year + '</p></div>';
      html += '<button onclick="ASF_CALENDAR.changeMonth(1)" style="background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px" aria-label="Proximo mes">\u203A</button></div>';
      html += '<div style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;border-bottom:1px solid var(--gray-100);padding:0 8px">';
      ['Seg','Ter','Qua','Qui','Sex','Sab','Dom'].forEach(function (d) { html += '<span style="font-size:11px;font-weight:600;color:var(--gray-400);padding:8px 0">' + d + '</span>'; });
      html += '</div><div style="display:grid;grid-template-columns:repeat(7,1fr);grid-auto-rows:40px">';
      for (let i = 0; i < startDay; i++) html += '<div></div>';
      for (let d = 1; d <= daysInMonth; d++) {
        const dStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const dayEvents = this.events.filter(function (e) { return dStr >= e.date && (!e.endDate || dStr <= e.endDate); });
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        html += '<div style="position:relative;padding:4px;text-align:center;' + (isToday ? 'background:rgba(0,168,204,0.1);border-radius:6px;' : '') + '"><span style="font-size:13px;font-weight:' + (isToday ? '700' : '400') + ';color:' + (isToday ? 'var(--primary)' : 'inherit') + '">' + d + '</span>';
        if (dayEvents.length > 0) html += '<div style="font-size:9px;background:' + (dayEvents[0].confirmed ? 'var(--success)' : 'var(--coral)') + ';color:white;border-radius:4px;padding:0 4px;margin-top:2px;overflow:hidden">' + dayEvents.length + ' evento(s)</div>';
        html += '</div>';
      }
      html += '</div><div style="padding:12px 16px;background:var(--gray-50)">';
      html += '<p style="font-size:12px;color:var(--gray-400);margin:0">\uD83C\uDFC4 Eventos da comunidade ASF e do circuito oficial (SPSurf, WSL, FESERJ, Fecasurf)</p>';
      html += '<p style="font-size:12px;margin:8px 0 0;text-align:center"><a href="https://acarolmourad-commits.github.io/asf-eventos/" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;text-decoration:none">\uD83D\uDCC5 Ver calendario completo no app ASF Eventos \u2192</a></p>';
      html += '</div></div>';
      el.innerHTML = html;
      this.view = 'month';
      const c = document.getElementById('calendar-content'); if (c) c.style.display = 'block';
      const u = document.getElementById('calendar-upcoming'); if (u) u.style.display = 'none';
    },
    changeMonth: function (delta) {
      this.currentMonth += delta;
      if (this.currentMonth > 11) { this.currentMonth = 0; this.currentYear++; }
      if (this.currentMonth < 0) { this.currentMonth = 11; this.currentYear--; }
      this.render('calendar-content');
    },
    renderUpcoming: function (containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const now = new Date(); now.setHours(0, 0, 0, 0);
      const events = this.events.filter(function (e) { return new Date((e.endDate || e.date) + 'T23:59:59') >= now; })
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      if (events.length === 0) {
        el.innerHTML = '<p style="text-align:center;color:var(--gray-400);padding:40px">\uD83C\uDF8A Nenhum evento proximo! Fique de olho nas novidades.</p>';
      } else {
        let html = '<div style="max-width:480px;margin:0 auto">';
        events.forEach(function (e) {
          const max = e.maxParticipants || 0;
          const fillPct = max > 0 ? Math.min(100, Math.round((e.participants / max) * 100)) : 0;
          const d1 = new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
          const d2 = e.endDate && e.endDate !== e.date ? ' \u2013 ' + new Date(e.endDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '';
          html += '<div class="card" style="margin-bottom:10px;border-left:4px solid ' + (e.confirmed ? 'var(--success)' : 'var(--coral)') + ';cursor:pointer" onclick="ASF_CALENDAR.toggleEvent(' + e.id + ')">';
          html += '<div style="display:flex;align-items:center;gap:10px">';
          html += '<div style="width:52px;min-height:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,168,204,0.1);border-radius:12px;flex-shrink:0;padding:4px"><span style="font-size:12px;font-weight:800;color:var(--primary);line-height:1.2;text-align:center">' + d1 + d2 + '</span></div>';
          html += '<div style="flex:1"><p style="font-size:13px;font-weight:600;color:var(--secondary);margin:0 0 2px">' + e.title + '</p><p style="font-size:11px;color:var(--gray-400);margin:0">\uD83D\uDCCD ' + (e.location || '') + '</p>' + (e.description ? '<p style="font-size:11px;color:var(--gray-500);margin:4px 0 0">' + e.description + '</p>' : '') + '</div>';
          html += '<div style="text-align:center;flex-shrink:0"><span style="font-size:10px;padding:3px 8px;border-radius:10px;' + (e.confirmed ? 'background:rgba(46,204,113,0.1);color:#27ae60' : 'background:rgba(255,107,107,0.1);color:#e74c3c') + '">' + (e.confirmed ? '\u2705 Vou!' : '\u23F3 Confirmar') + '</span></div>';
          html += '</div>';
          if (max > 0) html += '<div style="margin-top:6px;height:5px;background:var(--gray-100);border-radius:3px;overflow:hidden"><div style="height:100%;width:' + fillPct + '%;background:linear-gradient(90deg,var(--primary),var(--primary-dark));border-radius:3px"></div></div>';
          html += '</div>';
        });
        html += '<p style="font-size:12px;margin:4px 0 20px;text-align:center"><a href="https://acarolmourad-commits.github.io/asf-eventos/" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;text-decoration:none">\uD83D\uDCC5 Ver calendario completo no app ASF Eventos \u2192</a></p></div>';
        el.innerHTML = html;
      }
      this.view = 'upcoming';
      const c = document.getElementById('calendar-content'); if (c) c.style.display = 'none';
      const u = document.getElementById('calendar-upcoming'); if (u) u.style.display = 'block';
    }
  };
}

if (typeof window.ASF_CHATBOT === 'undefined') {
  window.ASF_CHATBOT = {
    knowledgeBase: [
      { q: ['melhor praia', 'iniciante', 'onde comecar', 'praia para comecar', 'primeira praia'], a: '\uD83E\uDD47 Para comecar \u2014 Praia Verde (SP): ondas pequenas e mansas. Maresias e perfeita para nivel intermediario. Tombo e Guaruja Centro tem ondas consistentes para todos os niveis!' },
      { q: ['prancha', 'tamanho', 'primeira prancha', 'comprar prancha'], a: '\uD83C\uDFC4 Primeira prancha: comece com 7\' a 8\' (funboard ou longboard). Volume: pelo menos 2x seu peso em litros. Uma prancha mais larga e longa te deixa mais estavel nos primeiros swells.' },
      { q: ['horario', 'melhor horario', 'que horas', 'manha'], a: '\u23F0 Melhor horario geral: 6h-10h. O vento fica mais fraco pela manha, as ondas mais limpas e o mar mais vazio.' },
      { q: ['wax', 'parafina', 'qual cor', 'base coat'], a: '\uD83C\uDF21 Wax por temperatura: amarela 22-28C (verao), laranja 15-22C, vermelha abaixo de 15C. Aplique base coat primeiro, depois top coat.' },
      { q: ['swell', 'mar', 'marea', 'previsao', 'ondas grandes'], a: '\uD83C\uDF0A Swell de leste/sudeste traz as melhores ondas para o litoral paulista. Periodo acima de 10s = ondas mais organizadas.' },
      { q: ['medo', 'seguranca', 'primeira vez', 'insegura'], a: '\uD83E\uDD1D Nao se preocupe! Use equipamento adequado, fique nas zonas rasas primeiro e conte com a comunidade ASF. Aulas coletivas sao perfeitas para comecar!' },
      { q: ['wetsuit', 'roupa de borracha', 'neoprene', 'frio', 'lycra'], a: '\uD83E\uDDE5 Wetsuit: no verao paulista, short john ou lycra UV (agua 22-28C). No inverno, long john 3/2mm. Enxague com agua doce apos cada sessao!' },
      { q: ['evento', 'eventos', 'calendario', 'competicao', 'campeonato', 'encontro'], a: '\uD83D\uDCC5 Na secao Calendario de Eventos voce ve os roles da comunidade e do circuito oficial \u2014 e o app ASF Eventos tem o calendario completo!' },
      { q: ['alimentacao', 'dieta', 'o que comer', 'nutricao'], a: '\uD83E\uDD57 Antes da sessao: banana + pasta de amendoim. Depois: proteina magra + frutas. Hidrate-se bem!' }
    ],
    sendAsf: function () {
      const inp = document.getElementById('chatbot-input-asf');
      const msg = inp ? inp.value.trim() : '';
      if (!msg) return;
      const msgs = document.getElementById('chatbot-messages-asf');
      if (!msgs) return;
      msgs.innerHTML += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px"><div style="background:var(--primary);color:white;padding:10px 14px;border-radius:16px 16px 4px 16px;font-size:14px;max-width:80%">' + this.esc(msg) + '</div></div>';
      inp.value = '';
      const self = this;
      setTimeout(function () {
        msgs.innerHTML += '<div style="display:flex;justify-content:flex-start;margin-bottom:12px"><div style="background:var(--gray-100);color:var(--secondary);padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:14px;max-width:85%"><strong style="color:var(--primary)">\uD83E\uDD16 ManaBot:</strong><br>' + self.respond(msg) + '</div></div>';
        msgs.scrollTop = msgs.scrollHeight;
      }, 600);
      msgs.scrollTop = msgs.scrollHeight;
    },
    respond: function (msg) {
      const m = msg.toLowerCase();
      for (const e of this.knowledgeBase) { if (e.q.some(function (kw) { return m.includes(kw); })) return e.a; }
      return '\uD83E\uDD14 Nao tenho essa informacao ainda! Tente perguntar sobre: praias, prancha, horario, wax, swell, wetsuit, eventos ou alimentacao.';
    },
    esc: function (str) { const d = document.createElement('div'); d.textContent = str; return d.innerHTML; }
  };
}

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
