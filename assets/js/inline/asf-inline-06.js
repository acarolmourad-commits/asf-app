/* Extraído de index.html — bloco inline #6 (ordem preservada) */

function closeAllModals(){
  {const m=document.getElementById('premium-modal');if(m)m.style.display='none';}
  {const m2=document.getElementById('pix-modal');if(m2)m2.style.display='none';}
  {const m3=document.getElementById('referral-modal');if(m3)m3.style.display='none';}
  {const m4=document.getElementById('brand-support');if(m4)m4.style.display='none';}
  const campaign = document.getElementById('campaign-modal');
  if(campaign) campaign.style.display='none';
  document.body.style.overflow='';
}
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    closeAllModals();
  }
});

/* Home: Guias & Praias e Parceiros & Rede. Alteracao limitada aos alvos abaixo. */
(function () {
  'use strict';
  function applyHomeReview() {
    var premium = document.getElementById('premium');
    var praias = document.getElementById('praias');
    var parceiros = document.getElementById('parceiros');
    if (!premium || !praias || !parceiros || premium.dataset.homeReview === '1') return;
    premium.dataset.homeReview = '1';
    var style = document.createElement('style');
    style.id = 'asf-home-guides-partners-style';
    style.textContent = '#premium,#praias,#parceiros{scroll-margin-top:140px}'+
      '#premium .hp-intro,#praias .hp-intro,#parceiros .hp-intro{background:linear-gradient(135deg,#0e2439,#00576a);color:#fff;border-radius:20px;padding:24px;margin:16px 20px}'+
      '#premium .hp-intro h3,#praias .hp-intro h3,#parceiros .hp-intro h3{color:#fff;margin:8px 0;font-size:clamp(20px,3vw,28px);line-height:1.3}'+
      '#premium .hp-intro p,#praias .hp-intro p,#parceiros .hp-intro p{color:#fff;line-height:1.65;font-size:15px;margin:12px 0}'+
      '#premium .hp-grid,#parceiros .hp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px;margin:20px}'+
      '#premium .hp-card,#parceiros .hp-card{display:flex;flex-direction:column;min-width:0;padding:22px;background:#fff;border:1px solid #dbe9ed;border-radius:16px;color:#0e2439}'+
      '#premium .hp-card h3,#parceiros .hp-card h3{font-size:19px;line-height:1.4;margin:12px 0}'+
      '#premium .hp-card p,#parceiros .hp-card p{font-size:15px;line-height:1.65;margin:0 0 16px}'+
      '#premium .hp-tag,#parceiros .hp-tag{font-size:12px;font-weight:700;color:#00576a;letter-spacing:.04em}'+
      '#premium .hp-link,#praias .hp-link,#parceiros .hp-link{display:block;background:#00576a;color:#fff!important;padding:12px 16px;border-radius:12px;text-align:center;text-decoration:none;font-size:14px;font-weight:700;line-height:1.5;margin-top:auto;overflow-wrap:anywhere}'+
      '#premium .hp-routes,#praias .hp-routes{display:flex;flex-wrap:wrap;gap:10px;margin:16px 20px}'+
      '#premium .hp-routes a,#praias .hp-routes a{flex:1 1 180px;margin:0}'+
      '#premium .hp-note,#praias .hp-note,#parceiros .hp-note{font-size:13px;line-height:1.65;color:#46596a;margin:16px 20px}'+
      '#premium a:focus-visible,#praias a:focus-visible,#parceiros a:focus-visible,#parceiros button:focus-visible,#parceiros input:focus-visible{outline:3px solid #9b3d68;outline-offset:4px}'+
      '#parceiros .hp-proposal{background:#f4fbfd!important;color:#0e2439!important;border:1px solid #dbe9ed}'+
      '#parceiros .hp-consent{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.6;margin:16px 0}'+
      '#parceiros .hp-consent input{flex:0 0 auto;width:20px;height:20px;margin-top:3px}'+
      '#parceiros .hp-status{font-size:14px;color:#0e2439;line-height:1.6;margin-top:12px}'+
      '#dicas .cards-grid{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))!important;gap:16px!important}'+
      '#dicas .cards-grid>.card{display:block!important;min-width:0!important;width:auto!important;max-width:100%!important;white-space:normal!important}'+
      '#dicas .cards-grid>.card h3,#dicas .cards-grid>.card p{min-width:0;max-width:100%;overflow-wrap:break-word}'+
      '@media(max-width:480px){#premium .hp-grid,#parceiros .hp-grid{grid-template-columns:1fr}#premium .hp-intro,#praias .hp-intro,#parceiros .hp-intro{padding:20px;margin:12px}#premium .hp-grid,#parceiros .hp-grid,#premium .hp-routes,#praias .hp-routes{margin:12px}}';
    document.head.appendChild(style);
    premium.innerHTML = '<div class="section-header"><h2 class="section-title">📚 Guias para evoluir no surf</h2></div>'+
      '<div class="hp-intro"><span class="hp-tag" style="color:#fff">CONTEUDO GRATUITO ASF</span><h3>Aprenda, evolua e prepare sua próxima sessão</h3><p>Explore guias gratuitos de técnica, preparação física e foco mental. Conheça praias e encontre os aplicativos que acompanham sua jornada no surf.</p></div>'+
      '<div class="hp-grid">'+
      '<article class="hp-card" id="guia-cutback-unificado"><span class="hp-tag">🏄‍♀️ TECNICA · ASF MANOBRAS</span><h3>Cutback: fundamentos e prática</h3><div id="premium-1-full"><p>Entenda a relação entre velocidade, olhar e trajetória. Consulte o guia educativo e avance no seu ritmo, com orientação qualificada para a prática no mar.</p></div><a class="hp-link" href="https://manobras.asf.surf/#guia-cutback-completo">Explorar o guia de cutback →</a></article>'+
      '<article class="hp-card"><span class="hp-tag">🧠 FOCO · ASF MENTAL</span><h3>Visualização para a competição</h3><div id="premium-2-full"><p>Conheça exercícios de visualização e uma rotina de preparação mental. Use o conteúdo como apoio educativo, sem promessa de desempenho.</p></div><a class="hp-link" href="https://mental.asf.surf/#mental-de-competidora">Explorar o guia de visualização →</a></article>'+
      '<article class="hp-card"><span class="hp-tag">💪 PREPARACAO · ASF TREINO</span><h3>Organize um ciclo de 30 dias</h3><div id="premium-3-full"><p>Explore o plano de quatro semanas e organize sua prática. Adapte as atividades ao seu nível e busque orientação qualificada; o período não garante resultados.</p></div><a class="hp-link" href="https://treino.asf.surf/#plano-30-dias">Explorar o plano de treino →</a></article></div>'+
      '<nav class="hp-routes" aria-label="Continue aprendendo"><a class="hp-link" href="https://asf.surf/aprender/">Ver todos os guias →</a><a class="hp-link" href="#praias">Conhecer praias →</a><a class="hp-link" href="https://asf.surf/guia-apps.html">Encontrar um aplicativo →</a></nav>'+
      '<p class="hp-note">Acesso gratuito aos guias: não é necessário participar de eventos para abrir estes conteúdos. Os materiais são educativos e não substituem orientação profissional.</p>';
    praias.innerHTML = '<div class="section-header"><h2 class="section-title">🏖️ Conheça praias e prepare sua visita</h2></div>'+
      '<div class="hp-intro"><h3>Explore o litoral com mais contexto</h3><p>Consulte o guia de praias, confira a previsão e organize seu equipamento. As condições variam: observe o local, respeite seus limites e procure orientação qualificada.</p></div>'+
      '<nav class="hp-routes" aria-label="Planeje sua sessão"><a class="hp-link" data-app="praias" href="https://acarolmourad-commits.github.io/asf-praias/">Abrir o guia de praias →</a><a class="hp-link" data-app="previsao" href="https://acarolmourad-commits.github.io/asf-previsao/">Consultar a previsão →</a><a class="hp-link" href="https://checklist.asf.surf/">Organizar o checklist →</a></nav>'+
      '<p class="hp-note">Uma previsão não garante condições seguras. Avalie o mar no momento da visita e siga as orientações locais.</p>';
    var heading = parceiros.querySelector('.section-title');
    if (heading) heading.textContent = '🤝 Parcerias ASF';
    var intro = parceiros.querySelector('.section-header + div');
    if (intro) {
      intro.className = 'hp-intro';
      intro.removeAttribute('style');
      intro.innerHTML = '<h3>Conexões que fortalecem o surf feminino</h3><p>Conheça as parcerias divulgadas pela ASF, explore nossa rede de aplicativos ou apresente sua marca e seu projeto à associação.</p>';
      var grid = document.createElement('div'); grid.className = 'hp-grid';
      grid.innerHTML = '<article class="hp-card"><span class="hp-tag">🤝 PARCERIAS</span><h3>Conheça as iniciativas</h3><p>Consulte os detalhes publicados de cada parceria. Disponibilidade, condições e validade de benefícios devem ser confirmadas com o responsável.</p><a class="hp-link" href="https://asf.surf/parcerias/">Consultar as parcerias →</a></article>'+
        '<article class="hp-card"><span class="hp-tag">🧰 APLICATIVOS ASF</span><h3>Explore a rede</h3><p>Encontre ferramentas para aprender, preparar sua sessão e acompanhar sua jornada. Aplicativos e marcas parceiras são apresentados separadamente.</p><a class="hp-link" href="https://asf.surf/guia-apps.html">Explorar os aplicativos →</a></article>';
      intro.insertAdjacentElement('afterend', grid);
    }
    var button = parceiros.querySelector('button[onclick*="enviarCadastroParceiro"]');
    if (!button) return;
    var form = button.parentElement;
    if (form.parentElement) form.parentElement.classList.add('hp-proposal');
    var title = form.parentElement && form.parentElement.querySelector('h3');
    if (title) title.textContent = 'Apresente sua marca ou projeto';
    ['nome','insta','site','logo'].forEach(function (key) {
      var input = document.getElementById('parceiro-' + key);
      if (!input) return;
      if (input.previousElementSibling && input.previousElementSibling.tagName === 'LABEL') input.previousElementSibling.htmlFor = input.id;
      input.maxLength = key === 'nome' ? 120 : key === 'insta' ? 100 : 600;
      if (key === 'site' || key === 'logo') input.type = 'url';
    });
    var consent = document.createElement('label'); consent.className = 'hp-consent';
    consent.innerHTML = '<input type="checkbox" id="parceiro-consentimento"><span>Autorizo abrir o WhatsApp com os dados informados. Vou revisar a mensagem antes de confirmar o envio no WhatsApp.</span>';
    button.insertAdjacentElement('beforebegin', consent);
    var status = document.createElement('p'); status.id = 'parceiro-status'; status.className = 'hp-status'; status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
    button.insertAdjacentElement('afterend', status);
    var note = document.createElement('p'); note.className = 'hp-note'; note.textContent = 'Proposta gratuita, sem PIX ou comprovante. O contato não ativa uma parceria automaticamente. Não informe dados sensíveis. Consulte a Política de Privacidade antes de compartilhar informações.';
    form.insertAdjacentElement('afterbegin', note);
    var privacy = document.createElement('a'); privacy.href = 'https://asf.surf/privacidade.html'; privacy.textContent = 'Política de Privacidade'; privacy.className = 'hp-link'; status.insertAdjacentElement('afterend', privacy);
    button.type = 'button'; button.textContent = 'Preparar proposta no WhatsApp';
    function say(text, field) { status.textContent = text; if (field) field.focus(); return false; }
    window.enviarCadastroParceiro = function () {
      if (window.ASF_HOME_REVIEW_PREVIEW) return say('Envio desativado nesta prévia. Não insira dados pessoais.');
      var values = {};
      for (var i = 0, keys = ['nome','insta','site','logo']; i < keys.length; i++) {
        var el = document.getElementById('parceiro-' + keys[i]);
        values[keys[i]] = el ? el.value.trim() : '';
        if (values[keys[i]].length > (keys[i] === 'nome' ? 120 : keys[i] === 'insta' ? 100 : 600)) return say('Revise o tamanho do campo informado.',el);
      }
      if (!values.nome) return say('Informe o nome da marca ou projeto.',document.getElementById('parceiro-nome'));
      for (var j = 0, urls = ['site','logo']; j < urls.length; j++) {
        if (!values[urls[j]]) continue;
        try { var u = new URL(values[urls[j]]); if (!/^https?:$/.test(u.protocol)) throw new Error('URL'); }
        catch (e) { return say('Use um endereço completo iniciado por https:// ou http://.',document.getElementById('parceiro-' + urls[j])); }
      }
      var check = document.getElementById('parceiro-consentimento');
      if (!check || !check.checked) return say('Confirme a autorização para abrir a mensagem no WhatsApp.',check);
      var message = 'PROPOSTA DE PARCERIA ASF\n\nMarca ou projeto: ' + values.nome;
      if (values.insta) message += '\nInstagram: ' + values.insta;
      if (values.site) message += '\nSite: ' + values.site;
      if (values.logo) message += '\nLogo: ' + values.logo;
      message += '\n\nGostaria de conversar sobre uma colaboração. Esta proposta não representa uma parceria aprovada.';
      window.open('https://wa.me/5511954346288?text=' + encodeURIComponent(message),'_blank','noopener,noreferrer');
      status.textContent = 'A abertura do WhatsApp foi solicitada. Revise a mensagem e confirme o envio lá. Se a janela não abrir, use a página de Contato.';
      return true;
    };
    if (window.ASF_HOME_REVIEW_PREVIEW) {
      form.querySelectorAll('input').forEach(function (input) { input.disabled = true; });
      button.disabled = true; button.textContent = 'Envio desativado na prévia';
      status.textContent = 'Prévia visual: cadastro bloqueado, sem armazenamento ou envio de dados.';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',function () { setTimeout(applyHomeReview,0); });
  else setTimeout(applyHomeReview,0);
})();
