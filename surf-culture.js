// Leituras educativas revisadas: não apresentar curiosidades históricas sem fonte.
const SurfCulture = {
  stories: [
    { id: 1, title: 'Respeito também faz parte do surf', category: 'Convivência', region: 'Dentro e fora do mar', year: 'Leitura educativa', image: '🌊',
      content: 'Aprender a surfar inclui conhecer a prioridade na onda, evitar atravessar a trajetória de outra pessoa e manter o controle da prancha. Converse com sua instrutora e respeite a orientação local.',
      facts: ['Não drope a onda de outra pessoa.', 'Não mergulhe de cabeça nas quedas.', 'Na dúvida sobre as regras do pico, pergunte antes de entrar.'],
      source: 'https://rnli.org/safety/choose-your-activity/surfing', sourceLabel: 'RNLI — cuidados e etiqueta no surf (em inglês)' },
    { id: 2, title: 'Conheça o mar antes de entrar', category: 'Segurança', region: 'Cada praia é diferente', year: 'Leitura educativa', image: '🏖️',
      content: 'A aparência tranquila da água não garante segurança. Correntes de retorno podem levar pessoas para longe da praia. Consulte a previsão e a orientação dos guarda-vidas; uma informação online não substitui essa avaliação local.',
      facts: ['Prefira praias com guarda-vidas.', 'Respeite a sinalização de risco.', 'Adie a sessão quando as condições não forem adequadas ao seu nível.'],
      source: 'https://www.weather.gov/safety/ripcurrent', sourceLabel: 'National Weather Service — correntes de retorno (em inglês)' },
    { id: 3, title: 'Uma primeira aula, muitas perguntas', category: 'Aprendizado', region: 'Seu ritmo importa', year: 'Guia ASF', image: '🏄‍♀️',
      content: 'Antes da primeira aula, pergunte sobre equipamento, tamanho da turma e condições para adiar a sessão. Não existe prazo igual para todas: leve suas dúvidas e respeite seus limites.',
      facts: ['Comece com orientação qualificada.', 'Experimente o equipamento com acompanhamento.', 'Registre o que aprendeu e o que quer perguntar na próxima aula.'],
      source: '/aprender/como-comecar-a-surfar-mulheres.html', sourceLabel: 'ASF — guia para começar' }
  ],
  render: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p class="note">Leituras educativas com referências. Revisão editorial: 12/11/2026.</p>' + this.stories.map(story => `
      <details class="card" style="margin-bottom:12px;padding:16px">
        <summary style="cursor:pointer;font-weight:700;font-size:16px">${story.image} ${story.title}</summary>
        <p style="font-size:13px;margin:8px 0">${story.category} · ${story.region}</p>
        <p style="line-height:1.6">${story.content}</p>
        <ul style="padding-left:24px;line-height:1.6">${story.facts.map(f => `<li>${f}</li>`).join('')}</ul>
        <p><a href="${story.source}" rel="noopener">${story.sourceLabel}</a></p>
      </details>`).join('');
  },
  // Legacy callers may request a detail. Native details keep keyboard and focus behavior.
  showDetail: function(id) {
    const index = this.stories.findIndex(story => story.id === id);
    const details = document.querySelectorAll('#surf-culture-container details');
    if (index >= 0 && details[index]) { details[index].open = true; details[index].querySelector('summary').focus(); }
  }
};
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SurfCulture.render('surf-culture-container'));
} else {
  SurfCulture.render('surf-culture-container');
}

/* ─── Apps Dropdown: organiza as opções de apps em um dropdown ao lado do menu principal ─── */
(function(){
  function initAppsDropdown(){
    var tabs=document.querySelector('.tabs');
    if(!tabs||tabs.querySelector('.apps-dropdown'))return;
    var buttons=Array.prototype.slice.call(tabs.querySelectorAll('.tab'));
    if(buttons.length<=2)return;
    var first=buttons[0];
    var rest=buttons.slice(1);
    var dd=document.createElement('div');
    dd.className='apps-dropdown';
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='tab apps-dropdown-toggle';
    btn.setAttribute('aria-haspopup','true');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span class="tab-icon">\uD83D\uDCF1</span> Apps \u25BE';
    var menu=document.createElement('div');
    menu.className='apps-dropdown-menu';
    menu.setAttribute('role','menu');
    menu.setAttribute('aria-label','Apps ASF');
    function close(){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');}
    rest.forEach(function(b){
      menu.appendChild(b);
      b.setAttribute('role','menuitem');
      b.addEventListener('click',close);
    });
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var open=menu.classList.toggle('open');
      btn.setAttribute('aria-expanded',open?'true':'false');
    });
    dd.appendChild(btn);
    dd.appendChild(menu);
    if(first.nextSibling){tabs.insertBefore(dd,first.nextSibling);}else{tabs.appendChild(dd);}
    document.addEventListener('click',function(e){if(!e.target.closest('.apps-dropdown'))close();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAppsDropdown);}else{initAppsDropdown();}
})();
