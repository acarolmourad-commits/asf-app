# ASF - Patch: showSection robusto (liga/desliga display inline)
# Resolve: home com todas as secoes visiveis (conteudo duplicado) e
# secoes com display:none inline que nao abriam (carteirinha, metas etc.)

src = open('app.js', encoding='utf-8').read()

old = """function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            // Render affiliate store if loja section
            if (sectionId === 'loja' && typeof renderAffiliateStore === 'function') {
                renderAffiliateStore();
            }
        }"""

new = """function showSection(sectionId) {
            // Redireciona secoes desativadas
            if (sectionId === 'loja') sectionId = 'lojas';
            if (sectionId === 'badges') sectionId = 'progresso';
            document.querySelectorAll('.section').forEach(s => { s.classList.remove('active'); s.style.setProperty('display', 'none', 'important'); });
            document.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            // Show selected section
            const sec = document.getElementById(sectionId);
            if (!sec) return;
            sec.classList.add('active');
            sec.style.setProperty('display', 'block', 'important');
            const tab = document.querySelector('.tab[aria-controls="' + sectionId + '"]');
            if (tab) { tab.classList.add('active'); tab.setAttribute('aria-selected', 'true'); }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }"""

assert src.count(old) == 1, 'showSection nao encontrado ou duplicado'
src = src.replace(old, new)
open('app.js', 'w', encoding='utf-8').write(src)
print('app.js patcheado: showSection robusto')
