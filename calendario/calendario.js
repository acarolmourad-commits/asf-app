(function () {
  'use strict';
  function brasiliaDay(now) {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
    const parts = Object.fromEntries(formatter.formatToParts(now).map(part => [part.type, part.value]));
    return [parts.year, parts.month, parts.day].join('-');
  }
  function updateCalendar(doc, today) {
    const archive = doc.getElementById('history-events');
    for (const card of doc.querySelectorAll('article[data-end]')) {
      if (card.dataset.end < today) {
        const label = card.querySelector('[data-status]');
        label.textContent = 'Data já passada';
        label.className = 'badge past';
        archive.appendChild(card);
      }
    }
    doc.getElementById('historico').hidden = !archive.children.length;
    for (const status of ['confirmed', 'planned']) {
      doc.getElementById(status + '-empty').hidden =
        !!doc.getElementById(status + '-events').children.length;
    }
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { brasiliaDay, updateCalendar };
  if (typeof document !== 'undefined') updateCalendar(document, brasiliaDay(new Date()));
}());
