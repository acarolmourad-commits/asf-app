// ASF Surf Calculator - Funções para cálculos de surf
const SurfCalculator = {
  // Calcula volume ideal da prancha
  calculateVolume: function(height, weight, skill) {
    // Altura em cm, peso em kg
    let baseVolume = (height / 100) * (weight / 10);
    
    // Ajuste por nível
    const skillMultipliers = {
      beginner: 1.2,
      intermediate: 1.0,
      advanced: 0.8,
      pro: 0.6
    };
    
    baseVolume *= skillMultipliers[skill] || 1.0;
    return baseVolume.toFixed(1);
  },
  
  // Calcula tamanho de quilha ideal
  calculateFinSize: function(weight) {
    // Peso em kg
    if (weight < 55) return '6" - 7"';
    if (weight < 65) return '7" - 8"';
    if (weight < 75) return '8" - 9"';
    if (weight < 85) return '9" - 10"';
    return '10"+';
  },
  
  // Calcula necessidades calóricas pós-surf
  calculateCalories: function(sessionHours, weight) {
    // Aproximadamente 400-600 calorias por hora para atividade moderada
    return Math.round(sessionHours * 500 * (weight / 70));
  },
  
  // Calcula prancha ideal para popup
  calculateBoardLength: function(height) {
    // Altura em cm - prancha 6-8 polegadas acima da altura
    const inches = Math.round((height * 0.4) / 2.54);
    return `${inches}"`;
  }
};

// UI Calculator
function showSurfCalculator() {
  const html = `
    <div id="calc-modal" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:10000;padding:20px;overflow-y:auto;">
      <div style="background:white;border-radius:16px;max-width:500px;margin:0 auto;padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
          <h2 style="font-size:20px;margin:0;">🌊 Calculadora de Surf</h2>
          <button onclick="document.getElementById('calc-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;">✕</button>
        </div>
        
        <div style="margin-bottom:15px;">
          <label style="display:block;font-size:14px;margin-bottom:5px;">Altura (cm)</label>
          <input type="number" id="calc-height" value="165" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
        </div>
        
        <div style="margin-bottom:15px;">
          <label style="display:block;font-size:14px;margin-bottom:5px;">Peso (kg)</label>
          <input type="number" id="calc-weight" value="60" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
        </div>
        
        <div style="margin-bottom:20px;">
          <label style="display:block;font-size:14px;margin-bottom:5px;">Nível</label>
          <select id="calc-skill" style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;">
            <option value="beginner">Iniciante</option>
            <option value="intermediate">Intermediário</option>
            <option value="advanced">Avançado</option>
          </select>
        </div>
        
        <button onclick="calculateSurfMetrics()" style="width:100%;background:#00A8CC;color:white;border:none;padding:14px;border-radius:8px;font-size:16px;font-weight:600;margin-bottom:20px;">Calcular</button>
        
        <div id="calc-results" style="display:none;">
          <h3 style="font-size:16px;margin-bottom:10px;">📊 Resultados</h3>
          <div style="background:#f8f9fa;padding:15px;border-radius:8px;margin-bottom:10px;">
            <p style="margin:5px 0;"><strong>Volume ideal prancha:</strong> <span id="result-volume"></span> L</p>
            <p style="margin:5px 0;"><strong>Tamanho prancha:</strong> <span id="result-board"></span></p>
            <p style="margin:5px 0;"><strong>Quilha ideal:</strong> <span id="result-fin"></span></p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function calculateSurfMetrics() {
  const height = parseInt(document.getElementById('calc-height').value) || 165;
  const weight = parseInt(document.getElementById('calc-weight').value) || 60;
  const skill = document.getElementById('calc-skill').value;
  
  document.getElementById('result-volume').textContent = SurfCalculator.calculateVolume(height, weight, skill);
  document.getElementById('result-board').textContent = SurfCalculator.calculateBoardLength(height);
  document.getElementById('result-fin').textContent = SurfCalculator.calculateFinSize(weight);
  
  document.getElementById('calc-results').style.display = 'block';
}

// Export for use
window.SurfCalculator = SurfCalculator;
// ASF Satellite Network Nav (injetado automaticamente)
(function(){
  if (document.getElementById('asf-sat-nav')) return;
  var sites = [
    ['ASF App','asf-app'],['Previsão','asf-previsao'],['Praias','asf-praias'],
    ['Maré','asf-mare'],['Mapa','asf-mapa'],['Atlas','asf-atlas'],
    ['Alerta','asf-alerta'],['Ponto','asf-ponto'],['Leitura de Mar','asf-leitura'],
    ['Golden Hour','asf-goldenhour'],['Vento','asf-vento'],['Treino','asf-treino'],
    ['Manobras','asf-manobras'],['Pop-up','asf-popup'],['Apneia','asf-apnea'],
    ['Respira','asf-respira'],['Yoga','asf-yoga'],['Volume','asf-volume'],
    ['Comunidade','asf-comunidade'],['Parceiras','asf-parceiras'],['Mentorias','asf-mentorias'],
    ['Carona','asf-carona'],['Eventos','asf-eventos'],['Galeria','asf-galeria'],
    ['Mercado','asf-mercado'],['Eco','asf-eco'],['Viagens','asf-viagens'],
    ['Patrocínio','asf-patrocinio'],['Loja','asf-loja'],['Glossário','asf-glossario'],
    ['História','asf-historia'],['Kids','asf-kids'],['Checklist','asf-checklist'],
    ['Quiz','asf-quiz'],['Ranking','asf-ranking'],['Desafio 30','asf-desafio'],
    ['Desafios','asf-desafios'],['Memória','asf-memoria'],['Diário','asf-diario'],
    ['Mala','asf-mala'],['Segurança','asf-seguranca'],['SOS','asf-sos'],
    ['Sono','asf-sono'],['Bem-estar','asf-bemestar'],['Mental','asf-mental'],
    ['Nutrição','asf-nutricao'],['Equipamento','asf-equipamento'],['Filmes','asf-filmes'],
    ['Podcast','asf-podcast'],['Inspiração','asf-inspiracao'],['Sonhos','asf-sonhos'],
    ['Clube','asf-clube'],['Achados','asf-achados']
  ];
  var btn = document.createElement('button');
  btn.id = 'asf-sat-nav';
  btn.textContent = '🌊 Rede ASF';
  btn.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:99999;background:#0a4d68;color:#fff;border:none;border-radius:999px;padding:10px 16px;font-weight:700;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.3);';
  var panel = document.createElement('div');
  panel.style.cssText = 'position:fixed;bottom:64px;left:16px;z-index:99999;background:#fff;border-radius:12px;padding:12px;box-shadow:0 8px 24px rgba(0,0,0,.25);display:none;max-width:260px;';
  panel.innerHTML = '<b style="color:#0a4d68;font-size:13px;">Sites da Rede ASF</b><br>' + sites.map(function(s){
    return '<a href="https://acarolmourad-commits.github.io/' + s[1] + '/" style="display:inline-block;margin:4px 4px 0 0;padding:5px 10px;border:1px solid #088395;border-radius:999px;color:#0a4d68;text-decoration:none;font-size:12px;font-weight:600;">' + s[0] + '</a>';
  }).join('');
  btn.onclick = function(){ panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; };
  document.body.appendChild(btn);
  document.body.appendChild(panel);
})();

// ─── ASF Apps Dropdown: converte as abas de apps em dropdown ao lado do menu ───
(function(){
  function initAppsDropdown(){
    var tabs = document.querySelector('.tabs');
    if (!tabs || document.getElementById('apps-dropdown-nav')) return;
    var btns = Array.prototype.slice.call(tabs.querySelectorAll('button.tab'));
    if (!btns.length) return;
    var nav = document.createElement('div');
    nav.id = 'apps-dropdown-nav';
    nav.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 20px;background:#fff;border-bottom:1px solid #eee;';
    var label = document.createElement('label');
    label.htmlFor = 'apps-dropdown';
    label.textContent = '\uD83D\uDCF1 Apps:';
    label.style.cssText = 'font-size:14px;font-weight:700;color:#0E2439;white-space:nowrap;';
    var sel = document.createElement('select');
    sel.id = 'apps-dropdown';
    sel.setAttribute('aria-label', 'Navegação principal');
    sel.style.cssText = 'flex:1;min-width:0;padding:10px 14px;border-radius:12px;border:1.5px solid #e5e7eb;font-size:14px;font-weight:600;color:#0E2439;background:#fff;cursor:pointer;';
    btns.forEach(function(b, i){
      var opt = document.createElement('option');
      opt.textContent = b.textContent.trim().replace(/\s+/g, ' ');
      opt.value = String(i);
      opt.dataset.action = b.getAttribute('onclick') || '';
      if (b.classList.contains('active')) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', function(){
      var action = sel.options[sel.selectedIndex].dataset.action;
      if (action) { try { new Function(action)(); } catch(e){ console.error(e); } }
    });
    nav.appendChild(label);
    nav.appendChild(sel);
    tabs.parentNode.insertBefore(nav, tabs);
    tabs.style.display = 'none';
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppsDropdown);
  } else { initAppsDropdown(); }
})();


// 🏄‍♀️ ASF Manas - Substitui o formulário de cadastro pelo botão direto de WhatsApp
(function(){
  function initManasWhatsApp(){
    var section = document.getElementById('manas');
    if (!section) return;
    if (document.getElementById('manas-wa-btn')) return;
    var input = document.getElementById('whatsapp-input');
    if (!input) return;
    var formBox = input.closest('div[style]');
    while (formBox && formBox.parentElement !== section) { formBox = formBox.parentElement; }
    if (!formBox) return;
    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'background: var(--light); padding: 20px; margin: 0 20px 20px; border-radius: 16px; text-align: center;';
    wrapper.innerHTML = '<h4 style="margin-bottom: 10px; color: var(--secondary);">📱 Cadastre-se no Grupo</h4>' +
      '<p style="font-size: 13px; color: var(--gray-600); margin-bottom: 15px;">Toque no botão abaixo e envie sua mensagem — uma saudação automática já vai pronta pedindo seu nome! 🌊</p>' +
      '<a id="manas-wa-btn" href="https://wa.me/5511954346288?text=Ol%C3%A1!%20%F0%9F%8F%84%E2%80%8D%E2%99%80%EF%B8%8F%20Quero%20entrar%20no%20grupo%20de%20surftrip%20com%20as%20amigas!%20Meu%20nome%20%C3%A9%3A%20" target="_blank" rel="noopener" ' +
      'style="display: inline-block; width: 100%; background: #25D366; color: #fff; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 50px; text-decoration: none; box-shadow: 0 4px 12px rgba(37,211,102,0.35); box-sizing: border-box;">📱 Entrar no Grupo pelo WhatsApp</a>';
    formBox.parentNode.replaceChild(wrapper, formBox);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManasWhatsApp);
  } else { initManasWhatsApp(); }
})();
