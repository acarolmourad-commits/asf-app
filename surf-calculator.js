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