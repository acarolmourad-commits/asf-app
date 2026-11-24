/* ASF consent: optional providers remain unloaded until an explicit current choice. */
(function () {
  'use strict';
  var KEY = 'asf-cookie-consent-v2';
  var current = null;
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'all' || saved === 'essential') current = saved;
    // Preserve a refusal, but never upgrade legacy ambiguous acceptance.
    if (!current && localStorage.getItem('asf-cookie-consent') === 'essential') current = 'essential';
  } catch (_) {}
  if (window.location.hash === '#asf-cookies-essential') current = 'essential';
  function banner() { return document.getElementById('cookie-consent-banner'); }
  function render(open) {
    var duplicate = document.getElementById('asf-cookie-banner');
    if (duplicate) duplicate.remove();
    var b = banner();
    if (!b) return;
    b.style.display = open || !current ? 'flex' : 'none';
    b.setAttribute('role', 'region');
    b.setAttribute('aria-label', 'Preferências de cookies');
    b.setAttribute('tabindex', '-1');
  }
  function optionalProviders() {
    if (current !== 'all' || document.getElementById('asf-consented-ads')) return;
    var script = document.createElement('script');
    script.id = 'asf-consented-ads';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1643806355443576';
    document.head.appendChild(script);
  }
  function set(level) {
    if (level !== 'all' && level !== 'essential') return;
    var revoke = current === 'all' && level === 'essential';
    current = level;
    try { localStorage.setItem(KEY, level); localStorage.setItem('asf-cookie-consent', level); } catch (_) {
      // Keep refusal effective on reload even if storage becomes unwritable.
      if (revoke) window.location.hash = 'asf-cookies-essential';
    }
    render(false);
    if (revoke) {
      // Already executed third-party code cannot be unloaded. Reload with the refusal saved.
      window.location.reload();
      return;
    }
    optionalProviders();
  }
  window.ASFConsent = {
    get: function () { return current; },
    set: set,
    refresh: function () { render(false); },
    open: function () { render(true); var b = banner(); if (b) b.focus(); }
  };
  window.getCookieConsent = window.ASFConsent.get;
  window.acceptAllCookies = function () { set('all'); };
  window.essentialCookies = function () { set('essential'); };
  window.openCookiePreferences = window.ASFConsent.open;
  function init() { render(false); optionalProviders(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
  window.addEventListener('storage', function (event) {
    if (event.key !== KEY) return;
    var previous = current;
    current = event.newValue === 'all' || event.newValue === 'essential' ? event.newValue : null;
    if (previous === 'all' && current !== 'all') window.location.reload();
    else { render(false); optionalProviders(); }
  });
})();
