/* ASF Navigation UX — accessibility and interaction polish
   Additive layer: preserves existing destinations and application flows. */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function focusable(root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      return el.getClientRects().length && getComputedStyle(el).visibility !== "hidden";
    });
  }

  ready(function () {
    /* Main hamburger navigation */
    var toggle = document.getElementById("menu-toggle");
    var menu = document.getElementById("header-menu");

    if (toggle && menu) {
      toggle.type = "button";
      toggle.setAttribute("aria-controls", menu.id);
      toggle.setAttribute("aria-label", "Abrir menu");

      function syncMenu() {
        var open = menu.classList.contains("open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
        menu.setAttribute("aria-hidden", String(!open));
      }

      var menuObserver = new MutationObserver(syncMenu);
      menuObserver.observe(menu, { attributes: true, attributeFilter: ["class"] });
      syncMenu();

      toggle.addEventListener("click", function () {
        window.setTimeout(function () {
          syncMenu();
          if (menu.classList.contains("open")) {
            var items = focusable(menu);
            if (items.length) items[0].focus();
          }
        }, 0);
      });

      menu.addEventListener("keydown", function (event) {
        var items = focusable(menu);
        if (!items.length) return;
        var index = items.indexOf(document.activeElement);

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          var delta = event.key === "ArrowDown" ? 1 : -1;
          items[(index + delta + items.length) % items.length].focus();
        } else if (event.key === "Home") {
          event.preventDefault();
          items[0].focus();
        } else if (event.key === "End") {
          event.preventDefault();
          items[items.length - 1].focus();
        } else if (event.key === "Escape") {
          event.preventDefault();
          if (typeof window.closeMenu === "function") window.closeMenu();
          else menu.classList.remove("open");
          toggle.focus();
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && menu.classList.contains("open")) {
          if (typeof window.closeMenu === "function") window.closeMenu();
          else menu.classList.remove("open");
          toggle.focus();
        }
      });
    }

    /* Satellite network overlay */
    var satelliteButton = document.getElementById("asf-sat-nav");
    var satellitePanel = document.getElementById("asf-sat-nav-panel");
    var satelliteBackdrop = document.getElementById("asf-sat-nav-backdrop");

    if (satelliteButton && satellitePanel && satelliteBackdrop) {
      satelliteButton.type = "button";
      satelliteButton.setAttribute("aria-controls", satellitePanel.id);
      satelliteButton.setAttribute("aria-expanded", "false");
      satelliteButton.setAttribute("aria-label", "Abrir catálogo da Rede ASF");

      satellitePanel.setAttribute("role", "dialog");
      satellitePanel.setAttribute("aria-modal", "true");
      satellitePanel.setAttribute("aria-label", "Aplicativos e sites da Rede ASF");
      satellitePanel.setAttribute("tabindex", "-1");
      satelliteBackdrop.setAttribute("aria-hidden", "true");

      var closeButton = satellitePanel.querySelector('button[aria-label="Fechar menu"]');
      if (closeButton) closeButton.setAttribute("aria-label", "Fechar catálogo da Rede ASF");

      function syncSatellitePanel() {
        var open = satellitePanel.style.display !== "none" && satellitePanel.style.display !== "";
        satelliteButton.setAttribute("aria-expanded", String(open));
        satelliteButton.setAttribute("aria-label", open ? "Fechar catálogo da Rede ASF" : "Abrir catálogo da Rede ASF");
        satelliteBackdrop.setAttribute("aria-hidden", String(!open));
      }

      var satelliteObserver = new MutationObserver(syncSatellitePanel);
      satelliteObserver.observe(satellitePanel, { attributes: true, attributeFilter: ["style"] });
      syncSatellitePanel();

      satelliteButton.addEventListener("click", function () {
        window.setTimeout(function () {
          syncSatellitePanel();
          if (satelliteButton.getAttribute("aria-expanded") === "true") {
            var items = focusable(satellitePanel);
            (items[0] || satellitePanel).focus();
          } else {
            satelliteButton.focus();
          }
        }, 0);
      });

      satellitePanel.addEventListener("keydown", function (event) {
        if (event.key !== "Tab" || satelliteButton.getAttribute("aria-expanded") !== "true") return;
        var items = focusable(satellitePanel);
        if (!items.length) {
          event.preventDefault();
          satellitePanel.focus();
          return;
        }
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      satelliteBackdrop.addEventListener("click", function () {
        window.setTimeout(function () {
          syncSatellitePanel();
          if (satelliteButton.getAttribute("aria-expanded") === "false") satelliteButton.focus();
        }, 0);
      });

      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && satelliteButton.getAttribute("aria-expanded") === "true") {
          if (satelliteBackdrop) satelliteBackdrop.click();
        }
      });
    }

    /* Gallery shortcut */
    var gallery = document.querySelector("#asf-galeria-btn a");
    if (gallery) {
      gallery.setAttribute("aria-label", "Abrir Galeria das Manas");
      gallery.setAttribute("title", "Galeria das Manas");
    }

    /* Persistent bottom navigation */
    var bottomNav = document.querySelector(".asf-bottom-nav");
    if (bottomNav) {
      bottomNav.setAttribute("aria-label", "Navegação principal ASF");
      bottomNav.querySelectorAll("a").forEach(function (link) {
        var label = link.querySelector("small");
        if (label) link.setAttribute("aria-label", label.textContent.trim());
      });
    }
  });
})();
