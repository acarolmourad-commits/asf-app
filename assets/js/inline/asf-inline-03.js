/* Extraído de index.html — bloco inline #3 (ordem preservada) */

    (function () {
      var KEY = 'asf-cookie-consent';
      function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
      function setConsent(level) {
        try { localStorage.setItem(KEY, level); } catch (e) {}
        if (typeof trackEvent === 'function') trackEvent('legal', 'cookie_consent', level);
        console.log('🍪 Cookie consent:', level);
        var b = document.getElementById('cookie-consent-banner');
        if (b) { b.style.display = 'none'; b.remove(); }
      }
      window.acceptAllCookies = function () { setConsent('all'); };
      window.essentialCookies = function () { setConsent('essential'); };
      window.getCookieConsent = getConsent;
      function maybeShow() {
        var b = document.getElementById('cookie-consent-banner');
        if (b && !getConsent()) b.style.display = 'flex';
      }
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', maybeShow);
      } else { maybeShow(); }
    })();
    