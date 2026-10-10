/* Diário ASF: núcleo local. Sem rede, IA ou sincronização entre origens. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DiarioCore = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const KEY = 'asf-diario-surf', BACKUP = 'asf-diario-surf-backup-v1', LIMIT = 10000;
  const clone = value => JSON.parse(JSON.stringify(value));
  function today(now = new Date()) {
    return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  }
  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [y, m, d] = value.split('-').map(Number);
    if (y < 1900 || y > 9999) return false;
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }
  function text(value, max, required = false) {
    if (typeof value !== 'string') throw new Error('Texto inválido.');
    const clean = value.trim();
    if ((required && !clean) || clean.length > max) throw new Error('Texto vazio ou acima do limite.');
    return clean;
  }
  function validate(entry, currentDay = today(), legacy = false) {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('Registro inválido.');
    if (!validDate(entry.data) || (!legacy && entry.data > currentDay)) throw new Error('Data inválida ou futura.');
    if (typeof entry.dur !== 'number' || !Number.isInteger(entry.dur) || entry.dur < 1 || entry.dur > 1440) throw new Error('Duração deve ser inteira, de 1 a 1440 minutos.');
    const out = {...entry, praia: text(entry.praia, 120, true), mar: text(entry.mar === undefined ? '' : entry.mar, 200), notas: text(entry.notas === undefined ? '' : entry.notas, 4000)};
    if (entry.aprendizado !== undefined) out.aprendizado = text(entry.aprendizado, 2000);
    if (entry.proximoFoco !== undefined) out.proximoFoco = text(entry.proximoFoco, 2000);
    return out;
  }
  function decode(raw, currentDay) {
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length > LIMIT) throw new Error('Backup não é um array válido ou excede 10.000 registros.');
    const used = new Set(parsed.filter(x => x && typeof x.id === 'string').map(x => x.id));
    const ids = new Set();
    return parsed.map((entry, index) => {
      const out = validate(entry, currentDay, true);
      if (out.id === undefined) {
        let id = 'legacy-' + index;
        while (used.has(id)) id += '-legacy';
        out.id = id; used.add(id);
      }
      if (typeof out.id !== 'string' || !out.id || out.id.length > 200 || ids.has(out.id)) throw new Error('Identificador inválido ou duplicado.');
      ids.add(out.id); return out;
    });
  }
  const fold = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function query(entries, {term = '', from = '', to = '', page = 1, size = 10} = {}) {
    if ((from && !validDate(from)) || (to && !validDate(to)) || (from && to && from > to)) throw new Error('Intervalo de datas inválido.');
    if (!Number.isInteger(size) || size < 1 || size > 100) throw new Error('Tamanho da página inválido.');
    const search = fold(String(term));
    const filtered = entries.filter(x => (!from || x.data >= from) && (!to || x.data <= to) && fold([x.praia,x.mar,x.notas,x.aprendizado || '',x.proximoFoco || ''].join(' ')).includes(search));
    filtered.sort((a,b) => b.data.localeCompare(a.data) || a.id.localeCompare(b.id));
    const pages = Math.max(1, Math.ceil(filtered.length / size));
    const current = Math.min(pages, Math.max(1, Number.isInteger(page) ? page : 1));
    return {items: filtered.slice((current-1)*size, current*size), total: filtered.length, page: current, pages};
  }
  function summary(entries, currentDay = today()) {
    if (!validDate(currentDay)) throw new Error('Data de referência inválida.');
    const end = new Date(currentDay + 'T12:00:00Z');
    end.setUTCDate(end.getUTCDate()-29);
    const start = end.toISOString().slice(0,10);
    const recent = entries.filter(x => x.data >= start && x.data <= currentDay);
    return {total: entries.length, minutes: entries.reduce((s,x) => s+x.dur,0), beaches: new Set(entries.map(x=>fold(x.praia))).size, recent: recent.length, recentMinutes: recent.reduce((s,x)=>s+x.dur,0)};
  }
  function createStore(storage, {day = () => today(), id = () => globalThis.crypto.randomUUID()} = {}) {
    let state = [], snapshot = null, undoState = null, blocked = true, lastError = '';
    function load() {
      try {
        const raw = storage.getItem(KEY);
        const entries = decode(raw, day());
        snapshot = raw; state = entries; blocked = false; lastError = ''; undoState = null;
        return clone(state);
      } catch(error) { blocked = true; lastError = error.message; throw error; }
    }
    function persist(next) {
      if (blocked) throw new Error('Gravação bloqueada. Exporte o original e recarregue após resolver o erro.');
      if (storage.getItem(KEY) !== snapshot) throw new Error('Outra aba alterou o diário. Recarregue antes de salvar.');
      const clean = decode(JSON.stringify(next), day());
      const serialized = JSON.stringify(clean);
      if (snapshot !== null && storage.getItem(BACKUP) === null) storage.setItem(BACKUP, snapshot);
      // Verificação otimista: não é CAS nem bloqueio transacional entre abas.
      if (storage.getItem(KEY) !== snapshot) throw new Error('Conflito entre abas. Recarregue.');
      storage.setItem(KEY, serialized);
      state = clean; snapshot = serialized;
      return clone(state);
    }
    return {
      load,
      entries: () => clone(state),
      status: () => ({blocked, error: lastError}),
      raw: () => storage.getItem(KEY),
      exportJSON: () => {
        if (blocked) throw new Error('Use a exportação original RAW; os registros não puderam ser validados.');
        return JSON.stringify(state, null, 2);
      },
      canUndo: () => undoState !== null && !blocked,
      upsert(input, editId = null) {
        if (blocked) throw new Error('Gravação bloqueada.');
        let next = clone(state), position = -1;
        if (editId !== null) { position = next.findIndex(x=>x.id===editId); if(position<0) throw new Error('Sessão não encontrada.'); }
        const entry = validate({... (position>=0 ? next[position] : {}), ...input}, day());
        entry.id = position>=0 ? editId : id();
        if (typeof entry.id !== 'string' || !entry.id || next.some((x,i)=>x.id===entry.id && i!==position)) throw new Error('Identificador duplicado ou inválido.');
        if(position>=0) next[position] = entry; else next.push(entry);
        const before = clone(state); const result = persist(next); undoState = before; return result;
      },
      remove(target) {
        if (!state.some(x=>x.id===target)) throw new Error('Sessão não encontrada.');
        const before = clone(state); const result = persist(state.filter(x=>x.id!==target)); undoState = before; return result;
      },
      undo() {
        if (undoState === null) throw new Error('Não há alteração para desfazer.');
        const result = persist(undoState); undoState = null; return result;
      }
    };
  }
  return {KEY, BACKUP, LIMIT, today, validDate, validate, decode, query, summary, createStore};
});
