// ASF Surf Goals - Sistema de metas de surf
const SurfGoals = {
  goals: JSON.parse(localStorage.getItem('asf-goals') || '[]'),
  
  // Adicionar nova meta
  addGoal: function(title, target, category) {
    const goal = {
      id: Date.now(),
      title: title,
      target: parseInt(target),
      current: 0,
      category: category || 'geral',
      created: new Date().toISOString(),
      completed: false
    };
    this.goals.push(goal);
    this.save();
    return goal;
  },
  
  // Atualizar progresso
  updateProgress: function(id, value) {
    const goal = this.goals.find(g => g.id === id);
    if (goal) {
      goal.current = Math.min(value, goal.target);
      if (goal.current >= goal.target && !goal.completed) {
        goal.completed = true;
        this.showCongrats(goal);
      }
      this.save();
      this.render();
    }
  },
  
  // Mostrar congratulações
  showCongrats: function(goal) {
    if (typeof showToast === 'function') {
      showToast(`🏆 Parabéns! Meta concluída: ${goal.title}!`);
    }
  },
  
  // Salvar no localStorage
  save: function() {
    localStorage.setItem('asf-goals', JSON.stringify(this.goals));
  },
  
  // Renderizar metas
  render: function() {
    const container = document.getElementById('goals-container');
    if (!container) return;
    
    if (this.goals.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px;">🎯</div>
          <h4 style="margin: 10px 0;">Nenhuma meta definida ainda</h4>
          <p style="color: var(--gray-600); font-size: 14px;">Que tal definir uma meta de surf?</p>
          <button class="btn btn-primary" style="margin-top: 15px;" onclick="showAddGoalModal()">+ Criar Meta</button>
        </div>
      `;
      return;
    }
    
    container.innerHTML = this.goals.map(goal => `
      <div class="card" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h4 style="font-size: 15px; margin: 0;">${goal.title}</h4>
          <span style="font-size: 12px; color: var(--gray-400);">${goal.category}</span>
        </div>
        <div style="background: var(--gray-200); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 8px;">
          <div style="width: ${(goal.current / goal.target) * 100}%; background: var(--primary); height: 100%; transition: width 0.3s;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
          <span>${goal.current} / ${goal.target}</span>
          ${goal.completed 
            ? '<span style="color: var(--success); font-weight: 600;">🏆 Concluída!</span>' 
            : `<button onclick="SurfGoals.updateProgress(${goal.id}, ${goal.current + 1})" style="background: var(--primary); color: white; border: none; padding: 4px 12px; border-radius: 12px; font-size: 12px; cursor: pointer;">+1</button>`}
        </div>
      </div>
    `).join('');
  },
  
  // Mostrar modal para adicionar meta
  showModal: function() {
    const modal = `
      <div id="goal-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.9); z-index: 10000; padding: 20px; display: flex; align-items: center; justify-content: center;">
        <div style="background: white; border-radius: 16px; max-width: 400px; width: 100%; padding: 20px;">
          <h3 style="margin-bottom: 16px;">🎯 Nova Meta de Surf</h3>
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 14px; margin-bottom: 4px;">Título</label>
            <input type="text" id="goal-title" placeholder="Ex: Pegar 50 ondas" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="display: block; font-size: 14px; margin-bottom: 4px;">Meta (número)</label>
            <input type="number" id="goal-target" placeholder="50" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 14px; margin-bottom: 4px;">Categoria</label>
            <select id="goal-category" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
              <option value="ondas">Ondas</option>
              <option value="sessoes">Sessões</option>
              <option value="manobras">Manobras</option>
              <option value="competicao">Competição</option>
              <option value="geral">Geral</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="SurfGoals.saveGoal()" style="flex: 1; background: #00A8CC; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">Salvar</button>
            <button onclick="document.getElementById('goal-modal').remove()" style="flex: 1; background: #eee; border: none; padding: 12px; border-radius: 8px;">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
  },
  
  saveGoal: function() {
    const title = document.getElementById('goal-title').value;
    const target = document.getElementById('goal-target').value;
    const category = document.getElementById('goal-category').value;
    
    if (title && target) {
      this.addGoal(title, target, category);
      document.getElementById('goal-modal').remove();
      this.render();
    }
  }
};

function showAddGoalModal() {
  SurfGoals.showModal();
}

// Auto-render when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(SurfGoals.render, 1000);
});