// ASF canonical-domain alias (fix/canonical-domain-assets-20261020)
// Pages historicas referenciam /asf-app/asf-redesign.js, valido no github.io mas
// inexistente em asf.surf (raiz do repo). Este alias carrega a fonte unica
// /asf-redesign.js. NAO edite comportamento aqui; edite o arquivo raiz.
(function () { var s = document.createElement('script'); s.src = '/asf-redesign.js'; s.defer = true; document.head.appendChild(s); })();
