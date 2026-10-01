/* Home compacta (fase 2): esconde as seções SPA secundárias no carregamento inicial.
   A home passa a mostrar: hero + caminhos/jornada/rede + cards + seção ativa + parceiros.
   Segurança: só age se o showSection real do app.js estiver disponível (ele reexibe
   a seção escolhida ao navegar). Se apenas o shim de rolagem existir, não faz nada.
   Nenhuma seção, funcionalidade ou URL é removida. */
document.addEventListener('DOMContentLoaded', function () {
  try {
    if (typeof window.showSection !== 'function') return;
    if (window.showSection.toString().indexOf("querySelectorAll('.section')") === -1) return;
    document.querySelectorAll('.section').forEach(function (s) {
      if (!s.classList.contains('active') && s.id !== 'parceiros') {
        s.style.setProperty('display', 'none', 'important');
      }
    });
  } catch (e) { /* falha silenciosa: home segue como antes */ }
});
