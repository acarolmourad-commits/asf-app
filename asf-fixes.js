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

/* ─── ManaBot 2.0: melhorias da assistente virtual ─────────────
   1) Base de conhecimento ampliada (apps satélites, cupons, XP,
      praias específicas, segurança, pequenas conversas)
   2) Respostas com links navegáveis para seções e apps
   3) Enter envia mensagem
   4) Indicador de "digitando..."
   5) Sugestões dinâmicas após cada resposta ─── */

(function () {
  const BOT = window.ASF_CHATBOT;
  if (!BOT) return;

  /* 1+2) Novos conhecimentos (com links) */
  if (!BOT._kbV2) {
    BOT._kbV2 = true;
    BOT.knowledgeBase.push(
      { q: ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'eae', 'hello'],
        a: '\uD83C\uDF0A Oi, mana! Que bom te ver por aqui! Posso te ajudar com praias, pranchas, eventos, carteirinha, segurança no mar e muito mais. O que você quer saber?' },
      { q: ['obrigada', 'obrigado', 'valeu', 'brigada', 'thanks'],
        a: '\uD83D\uDC9A De nada, mana! A comunidade ASF está sempre junto. Boa sessão e vejo você no line-up! \uD83C\uDFC4' },
      { q: ['quem é você', 'quem e voce', 'seu nome', 'o que você faz', 'o que voce faz', 'manabot'],
        a: '\uD83E\uDD16 Eu sou a <strong>ManaBot</strong>, a assistente virtual da ASF — Associação de Surf Feminino! Fui criada para ajudar as manas com dicas de surf, eventos, segurança e tudo do nosso ecossistema de apps. Pode perguntar!' },
      { q: ['maresias'], a: '\uD83C\uDFD6 <strong>Maresias</strong> (São Sebastião/SP): nível intermediário, swell de sudeste, melhor das 6h às 9h. Tem estacionamento, salva-vidas e é \uD83D\uDEE1 Safe Spot ASF. Confira o <a href="https://acarolmourad-commits.github.io/asf-atlas/" target="_blank" style="color:var(--primary);font-weight:600">ASF Atlas</a> para o mapa do pico!' },
      { q: ['itamambuca'], a: '\uD83C\uDFD6 <strong>Itamambuca</strong> (Ubatuba/SP): nível avançado, swell sudeste/sul, melhor 6h-10h. Região mais afastada — vá em grupo e avise alguém! Dicas de segurança na seção <strong>Segurança no Surf</strong> aqui da home.' },
      { q: ['tombo'], a: '\uD83C\uDFD6 <strong>Praia do Tombo</strong> (Guarujá/SP): todos os níveis, swell nordeste, melhor 7h-11h. Policiamento no verão + salva-vidas fixo. Safe Spot \uD83D\uDEE1' },
      { q: ['guaruja', 'guarujá'], a: '\uD83C\uDFD6 <strong>Guarujá Centro</strong>: perfeita para iniciantes! Ondas consistentes, área urbana iluminada e movimentada (6h-22h). Veja o guia completo no <a href="https://acarolmourad-commits.github.io/asf-praias/" target="_blank" style="color:var(--primary);font-weight:600">ASF Praias</a>.' },
      { q: ['ubatuba', 'litoral norte'], a: '\uD83C\uDFD6 O litoral norte de SP é um paraíso! Itamambuca, Maresias, Praia Verde... Explore todos os picos no <a href="https://acarolmourad-commits.github.io/asf-atlas/" target="_blank" style="color:var(--primary);font-weight:600">ASF Atlas</a> e no <a href="https://acarolmourad-commits.github.io/asf-mapa/" target="_blank" style="color:var(--primary);font-weight:600">ASF Mapa</a>!' },
      { q: ['cupom', 'desconto', 'cupons', 'promocao', 'promoção'], a: '\uD83C\uDFF7 Temos cupons de marcas parceiras! Rip Curl (ASF15), Billabong (ASF20), Granado (ASF25) e mais. Confira na <a href="https://acarolmourad-commits.github.io/asf-loja/" target="_blank" style="color:var(--primary);font-weight:600">ASF Loja</a> e na seção de marcas aqui da home!' },
      { q: ['xp', 'pontos', 'nivel', 'nível', 'ranking', 'badge', 'conquista'], a: '\u26A1 Você ganha <strong>XP</strong> completando desafios, quiz diário, checklists e lendo conteúdos! Suba de Bronze \uD83E\uDD49 para Diamante \uD83D\uDC8E e desbloqueie conquistas. Veja sua posição no <a href="https://acarolmourad-commits.github.io/asf-ranking/" target="_blank" style="color:var(--primary);font-weight:600">ASF Ranking</a>!' },
      { q: ['quiz'], a: '\uD83E\uDDE0 O <strong>Quiz diário</strong> testa seus conhecimentos de surf e vale XP + streak! Tem um quiz rápido aqui na home e a versão completa no <a href="https://acarolmourad-commits.github.io/asf-quiz/" target="_blank" style="color:var(--primary);font-weight:600">ASF Quiz</a>.' },
      { q: ['diario', 'diário', 'registrar sessao', 'registrar sessão', 'registro'], a: '\uD83D\uDCD3 Registre suas sessões (ondas, manobras, evolução) no <a href="https://acarolmourad-commits.github.io/asf-diario/" target="_blank" style="color:var(--primary);font-weight:600">ASF Diário</a>! Acompanhar o progresso é o melhor incentivo.' },
      { q: ['aprender', 'aula', 'aulas', 'curso', 'tutorial', 'iniciante aprender'], a: '\uD83C\uDFC4 Para evoluir: comece pela trilha de <a href="https://acarolmourad-commits.github.io/asf-manobras/" target="_blank" style="color:var(--primary);font-weight:600">ASF Manobras</a>, treine o pop-up em casa com o <a href="https://acarolmourad-commits.github.io/asf-popup/" target="_blank" style="color:var(--primary);font-weight:600">ASF Pop-up</a> e aprenda termos no <a href="https://acarolmourad-commits.github.io/asf-glossario/" target="_blank" style="color:var(--primary);font-weight:600">ASF Glossário</a>!' },
      { q: ['respiracao', 'respiração', 'apneia', 'prender respiracao', 'wipeout'], a: '\uD83E\uDEC1 Treine respiração 4-4-4 e apneia para wipeouts com o <a href="https://acarolmourad-commits.github.io/asf-respira/" target="_blank" style="color:var(--primary);font-weight:600">ASF Respira</a> e o <a href="https://acarolmourad-commits.github.io/asf-apnea/" target="_blank" style="color:var(--primary);font-weight:600">ASF Apneia</a>. Segurança em primeiro lugar!' },
      { q: ['emergencia', 'emergência', 'sos', 'perigo', 'acidente', 'socorro'], a: '\uD83D\uDEA8 Em situação de perigo no mar, use o <a href="https://acarolmourad-commits.github.io/asf-sos/" target="_blank" style="color:#e74c3c;font-weight:700">ASF SOS</a> — botão de emergência com geolocalização. Salve nos favoritos do celular! E revise as regras de ouro na seção <strong>Segurança no Surf</strong>.' },
      { q: ['filme', 'filmes', 'documentario', 'documentário', 'serie'], a: '\uD83C\uDFAC Inspire-se com o <a href="https://acarolmourad-commits.github.io/asf-filmes/" target="_blank" style="color:var(--primary);font-weight:600">ASF Filmes</a> — guia de filmes e documentários sobre mulheres no surf!' },
      { q: ['podcast', 'audio', 'áudio', 'ouvir'], a: '\uD83C\uDF99 Ouça o <a href="https://acarolmourad-commits.github.io/asf-podcast/" target="_blank" style="color:var(--primary);font-weight:600">ASF Podcast</a> — episódios sobre surf feminino. Completar um episódio vale a conquista "Orelha de Peixe" \uD83D\uDCFA!' },
      { q: ['viagem', 'viagens', 'surf trip', 'trip', 'roteiro'], a: '\u2708 Planeje sua próxima surf trip com o <a href="https://acarolmourad-commits.github.io/asf-viagens/" target="_blank" style="color:var(--primary);font-weight:600">ASF Viagens</a> — roteiros e expedições para mulheres!' },
      { q: ['carona', 'transporte', 'como chegar'], a: '\uD83D\uDE97 Precisa de carona para a praia? O <a href="https://acarolmourad-commits.github.io/asf-carona/" target="_blank" style="color:var(--primary);font-weight:600">ASF Carona</a> conecta manas indo para o mesmo pico!' },
      { q: ['volume', 'litros', 'litragem'], a: '\uD83E\uDDEE Calcule o volume ideal da sua prancha por peso e nível na <a href="https://acarolmourad-commits.github.io/asf-volume/" target="_blank" style="color:var(--primary);font-weight:600">Calculadora de Volume ASF</a>!' },
      { q: ['mare', 'maré', 'tabua de mare', 'tábua'], a: '\uD83C\uDF15 Consulte a tábua de marés e fases da lua no <a href="https://acarolmourad-commits.github.io/asf-mare/" target="_blank" style="color:var(--primary);font-weight:600">ASF Maré</a> antes da sessão!' },
      { q: ['previsao', 'previsão', 'vento', 'tempo', 'clima'], a: '\uD83C\uDF24 Veja ondas, vento e maré ao vivo no <a href="https://acarolmourad-commits.github.io/asf-previsao/" target="_blank" style="color:var(--primary);font-weight:600">ASF Previsão</a> e o vento em tempo real no <a href="https://acarolmourad-commits.github.io/asf-vento/" target="_blank" style="color:var(--primary);font-weight:600">ASF Vento</a>!' },
      { q: ['achados', 'perdidos', 'perdi', 'achei', 'quilha', 'chave'], a: '\uD83D\uDD0D Perdeu ou achou algo no pico (quilha, leash, chave)? Poste no <a href="https://acarolmourad-commits.github.io/asf-achados/" target="_blank" style="color:var(--primary);font-weight:600">ASF Achados</a>!' },
      { q: ['parceira', 'parceiras', 'surfar junto', 'companhia', 'sozinha'], a: '\uD83D\uDC6D Encontre parceiras de surf por nível, praia e horário no <a href="https://acarolmourad-commits.github.io/asf-parceiras/" target="_blank" style="color:var(--primary);font-weight:600">ASF Parceiras</a> — nunca surfe sozinha!' },
      { q: ['mentoria', 'mentora', 'professora'], a: '\uD83E\uDDD1\u200D\uD83C\uDFEB O <a href="https://acarolmourad-commits.github.io/asf-mentorias/" target="_blank" style="color:var(--primary);font-weight:600">ASF Mentorias</a> conecta surfistas experientes e iniciantes. Aprender com quem já trilhou o caminho acelera tudo!' },
      { q: ['yoga', 'alongamento', 'aquecimento'], a: '\uD83E\uDDD8 Aqueça antes de entrar no mar com o <a href="https://acarolmourad-commits.github.io/asf-yoga/" target="_blank" style="color:var(--primary);font-weight:600">ASF Yoga</a> — yoga guiado com timer, feito para surfistas!' },
      { q: ['sono', 'dormir', 'descanso'], a: '\uD83D\uDE34 Recuperação é treino! Monitore seu sono com o <a href="https://acarolmourad-commits.github.io/asf-sono/" target="_blank" style="color:var(--primary);font-weight:600">ASF Sono</a> e renda mais no mar.' },
      { q: ['crianca', 'criança', 'filha', 'menina', 'kids'], a: '\uD83D\uDC67 O <a href="https://acarolmourad-commits.github.io/asf-kids/" target="_blank" style="color:var(--primary);font-weight:600">ASF Kids</a> é a iniciação ao surf para meninas — com segurança e diversão!' },
      { q: ['mercado', 'venda', 'comprar usado', 'usada', 'troca'], a: '\uD83D\uDCB0 Compre e venda equipamentos usados entre surfistas no <a href="https://acarolmourad-commits.github.io/asf-mercado/" target="_blank" style="color:var(--primary);font-weight:600">ASF Mercado</a>!' },
      { q: ['patrocinio', 'patrocínio', 'apoiar', 'apoie', 'doar', 'doacao'], a: '\uD83D\uDC9C Quer apoiar o surf feminino? Conheça as cotas de patrocínio e parcerias no <a href="https://acarolmourad-commits.github.io/asf-patrocinio/" target="_blank" style="color:var(--primary);font-weight:600">ASF Patrocínio</a>!' },
      { q: ['historia', 'história', 'origem', 'quem começou'], a: '\uD83D\uDCDC Conheça a história do surf feminino no Brasil e no mundo no <a href="https://acarolmourad-commits.github.io/asf-historia/" target="_blank" style="color:var(--primary);font-weight:600">ASF História</a>!' },
      { q: ['sustentabilidade', 'lixo', 'limpeza', 'meio ambiente', 'eco'], a: '\uD83C\uDF3F Participe das ações de limpeza de praia e surf ecológico no <a href="https://acarolmourad-commits.github.io/asf-eco/" target="_blank" style="color:var(--primary);font-weight:600">ASF Eco</a>. O mar agradece! \uD83D\uDC19' },
      { q: ['checklist', 'mala', 'levar', 'o que levar'], a: '\uD83C\uDF92 Monte sua mala de praia inteligente por tipo de sessão no <a href="https://acarolmourad-commits.github.io/asf-mala/" target="_blank" style="color:var(--primary);font-weight:600">ASF Mala</a> e faça o checklist pré-surf no <a href="https://acarolmourad-commits.github.io/asf-checklist/" target="_blank" style="color:var(--primary);font-weight:600">ASF Checklist</a>!' },
      { q: ['quem esta no pico', 'check-in', 'checkin', 'quem está'], a: '\uD83D\uDCCD Veja quem está surfando agora em cada pico no <a href="https://acarolmourad-commits.github.io/asf-ponto/" target="_blank" style="color:var(--primary);font-weight:600">ASF Ponto</a> — check-in ao vivo!' }
    );
  }

  /* Resposta padrão mais útil */
  BOT.respond = function (msg) {
    const m = msg.toLowerCase();
    for (const e of this.knowledgeBase) { if (e.q.some(function (kw) { return m.includes(kw); })) return e.a; }
    return '\uD83E\uDD14 Hmm, ainda não sei essa! Mas posso ajudar com: <strong>praias</strong> (Maresias, Ubatuba, Guarujá...), <strong>prancha e volume</strong>, <strong>horário</strong>, <strong>wax</strong>, <strong>eventos</strong>, <strong>carteirinha</strong>, <strong>XP e ranking</strong>, <strong>segurança</strong>, <strong>carona</strong>, <strong>viagens</strong>... ou pergunte sobre qualquer app ASF!';
  };

  /* UX: Enter envia, indicador de digitando, sugestões dinâmicas */
  BOT._suggestions = [
    'Melhor praia para iniciantes?', 'Previsão das ondas', 'Próximos eventos',
    'Cupons de desconto', 'Como ganho XP?', 'Volume ideal da prancha',
    'Encontrar parceiras de surf', 'Treino de apneia', 'Tábua de marés',
    'O que levar para a praia?'
  ];

  /* sendAsf com UX completa (mantém lógica de resposta) */
  BOT.sendAsf = function () {
    const inp = document.getElementById('chatbot-input-asf');
    const msg = inp ? inp.value.trim() : '';
    if (!msg) return;
    const msgs = document.getElementById('chatbot-messages-asf');
    if (!msgs) return;
    msgs.innerHTML += '<div style="display:flex;justify-content:flex-end;margin-bottom:8px"><div style="background:var(--primary);color:white;padding:10px 14px;border-radius:16px 16px 4px 16px;font-size:14px;max-width:80%">' + this.esc(msg) + '</div></div>';
    inp.value = '';
    const self = this;

    /* indicador de digitando */
    const tid = 'manabot-typing-' + Date.now();
    msgs.innerHTML += '<div id="' + tid + '" style="display:flex;justify-content:flex-start;margin-bottom:12px"><div style="background:var(--gray-100);padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:13px;color:var(--gray-400)"><strong style="color:var(--primary)">\uD83E\uDD16 ManaBot</strong> digitando<span class="mana-dots">...</span></div></div>';
    msgs.scrollTop = msgs.scrollHeight;

    setTimeout(function () {
      const t = document.getElementById(tid);
      if (t) t.remove();
      const resp = self.respond(msg);
      /* sugestões dinâmicas relacionadas */
      const pool = self._suggestions.filter(function (s) { return s.toLowerCase() !== msg.toLowerCase(); });
      const picks = pool.sort(function () { return 0.5 - Math.random(); }).slice(0, 3);
      const sug = '<div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px">' + picks.map(function (s) {
        return '<button onclick="document.getElementById(\'chatbot-input-asf\').value=\'' + s.replace(/'/g, '') + '\';ASF_CHATBOT.sendAsf()" style="padding:4px 10px;border-radius:14px;border:1px solid var(--primary);background:white;color:var(--primary);font-size:11px;cursor:pointer;font-family:\'Outfit\',sans-serif">' + s + '</button>';
      }).join('') + '</div>';
      msgs.innerHTML += '<div style="display:flex;justify-content:flex-start;margin-bottom:4px"><div style="background:var(--gray-100);color:var(--secondary);padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:14px;max-width:85%"><strong style="color:var(--primary)">\uD83E\uDD16 ManaBot:</strong><br>' + resp + '</div></div>' + sug;
      msgs.scrollTop = msgs.scrollHeight;
    }, 700 + Math.random() * 500);
    msgs.scrollTop = msgs.scrollHeight;
  };

  /* Enter para enviar */
  function bindEnter() {
    const inp = document.getElementById('chatbot-input-asf');
    if (!inp || inp.dataset.enterBound) return;
    inp.dataset.enterBound = '1';
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); BOT.sendAsf(); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindEnter);
  } else { bindEnter(); }
  document.addEventListener('click', function (ev) {
    const t = ev.target.closest && ev.target.closest('.tab');
    if (t && t.getAttribute('aria-controls') === 'assistente') setTimeout(bindEnter, 100);
  });
})();

/* ─── Reparo do chatbot flutuante (chatbot-panel) ─────────────
   O painel flutuante usava a variavel "chatbotFAQs", que nao estava
   definida em nenhum lugar — sendChatbotMessage() quebrava com
   ReferenceError e a conversa morria. Aqui definimos as FAQs e
   unificamos o painel com o cerebro da ManaBot (43 topicos). ─── */

if (typeof window.chatbotFAQs === 'undefined') {
  window.chatbotFAQs = {
    'previsao': '\uD83C\uDF0A Para previsao de ondas, vento e mare em tempo real, use o ASF Previsao e o ASF Vento (links na home)!',
    'pontos': '\u26A1 Voce ganha pontos (XP) completando desafios, quiz diario, checklists e lendo conteudos. Veja o ASF Ranking!',
    'eventos': '\uD83D\uDCC5 Todos os eventos estao na secao Calendario de Eventos da home e no app ASF Eventos!',
    'contato': '\uD83D\uDCE9 Fale com a ASF pelo Instagram @asf.surffeminino ou pela pagina de Contato no rodape.',
    'participar': '\uD83E\uDD1D Para participar: crie sua Carteirinha ASF gratuita na home, entre nos eventos e conecte-se com as manas no ASF Parceiras!',
    'ajuda': '\uD83D\uDCAC Posso ajudar com: previsao, pontos, eventos, contatos e como participar. Pergunta ainda mais detalhada? Use a secao Assistente Virtual ASF na home!'
  };
}

(function () {
  function greetFloating() {
    const msgs = document.getElementById('chatbot-messages');
    if (!msgs || msgs.dataset.greeted) return;
    msgs.dataset.greeted = '1';
    msgs.innerHTML = '<div style="background:#E0F7FA;padding:8px;border-radius:8px;margin:4px 0"><strong>\uD83E\uDD16 ManaBot:</strong> Oi, mana! \uD83C\uDF0A Pergunte sobre previsao, eventos, pontos, praias, equipamentos... estou aqui para ajudar!</div>';
  }

  /* Envia com o cerebro da ManaBot; cai para chatbotFAQs se ela nao existir */
  window.sendChatbotMessage = function () {
    const input = document.getElementById('chatbot-input');
    const msgs = document.getElementById('chatbot-messages');
    if (!input || !msgs) return;
    const raw = input.value.trim();
    if (!raw) return;
    const BOTX = window.ASF_CHATBOT;
    const esc = (BOTX && BOTX.esc) ? BOTX.esc(raw) : raw;
    msgs.innerHTML += '<div style="background:#eee;padding:8px;border-radius:8px;margin:4px 0"><strong>Voce:</strong> ' + esc + '</div>';
    input.value = '';
    const tid = 'float-typing-' + Date.now();
    msgs.innerHTML += '<div id="' + tid + '" style="background:#E0F7FA;padding:8px;border-radius:8px;margin:4px 0;color:#7f8c8d;font-size:12px"><strong>\uD83E\uDD16 ManaBot</strong> digitando...</div>';
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function () {
      const t = document.getElementById(tid);
      if (t) t.remove();
      let response;
      if (BOTX && typeof BOTX.respond === 'function') {
        response = BOTX.respond(raw);
      } else {
        response = 'Desculpe, nao entendi. Tente: previsao, pontos, eventos, contatos ou como participar! \uD83E\uDD16';
        const m = raw.toLowerCase();
        for (const key of Object.keys(window.chatbotFAQs || {})) {
          if (m.includes(key)) { response = window.chatbotFAQs[key]; break; }
        }
      }
      msgs.innerHTML += '<div style="background:#E0F7FA;padding:8px;border-radius:8px;margin:4px 0"><strong>\uD83E\uDD16 ManaBot:</strong> ' + response + '</div>';
      msgs.scrollTop = msgs.scrollHeight;
    }, 600 + Math.random() * 400);
  };

  /* Enter envia + boas-vindas ao abrir o painel */
  function bindFloating() {
    const inp = document.getElementById('chatbot-input');
    if (inp && !inp.dataset.enterBound) {
      inp.dataset.enterBound = '1';
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); window.sendChatbotMessage(); }
      });
    }
    greetFloating();
  }

  const _toggle = window.toggleChatbot;
  window.toggleChatbot = function () {
    if (typeof _toggle === 'function') _toggle();
    setTimeout(bindFloating, 50);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindFloating);
  } else { bindFloating(); }
})();
