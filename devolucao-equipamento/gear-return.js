(() => {
  'use strict';
  const key = 'asf-gear-return-v1';
  const widgets = Array.from(document.querySelectorAll('fieldset[data-lang]'));
  if (!widgets.length) return;
  const controls = Array.from(document.querySelectorAll('select[data-gear]'));
  const items = [...new Set(controls.map(control => control.dataset.gear))];
  const allowed = new Set(['pending','done','na']);
  const defaultState = () => Object.fromEntries(items.map(item => [item, 'pending']));
  let state = defaultState();
  let storageOK = true;

  try {
    const raw = sessionStorage.getItem(key);
    const saved = raw === null ? null : JSON.parse(raw);
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const item of items) {
        if (Object.hasOwn(saved, item) && allowed.has(saved[item])) state[item] = saved[item];
      }
    }
  } catch (error) {
    // Malformed old values should not prevent using the current list.
    storageOK = error instanceof SyntaxError;
  }

  function show() {
    const values = Object.values(state);
    const count = value => values.filter(item => item === value).length;
    const pending = count('pending');
    const done = count('done');
    const na = count('na');
    for (const control of controls) control.value = state[control.dataset.gear];
    for (const widget of widgets) {
      const english = widget.dataset.lang === 'en';
      const status = widget.querySelector('[data-status]');
      const reset = widget.querySelector('[data-reset]');
      const note = widget.querySelector('[data-storage-note]');
      const summary = english
        ? `To check: ${pending} · Marked as returned: ${done} · Not applicable: ${na}`
        : `A conferir: ${pending} · Marcados como devolvidos: ${done} · Não se aplica: ${na}`;
      status.hidden = reset.hidden = note.hidden = false;
      if (status.textContent !== summary) status.textContent = summary;
      if (!storageOK) note.textContent = english
        ? 'This browser could not save the selections. Keep the page open while you use the checklist.'
        : 'Este navegador não conseguiu guardar as marcações. Mantenha a página aberta enquanto confere a lista.';
    }
  }

  for (const control of controls) control.addEventListener('change', () => {
    if (!allowed.has(control.value)) return;
    state[control.dataset.gear] = control.value;
    try { sessionStorage.setItem(key, JSON.stringify(state)); }
    catch { storageOK = false; }
    show();
  });
  for (const widget of widgets) widget.querySelector('[data-reset]').addEventListener('click', () => {
    state = defaultState();
    try { sessionStorage.removeItem(key); }
    catch { storageOK = false; }
    show();
  });

  function openEnglish() {
    if (location.hash === '#english') document.getElementById('english').open = true;
  }
  window.addEventListener('hashchange', openEnglish);
  openEnglish();
  show();
})();
