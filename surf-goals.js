/* ─── ASF Menu Dropdown ───
   Menu principal (.tabs) em drop-down, com botão fixo no topo da página */
(function () {
  function initMenuDropdown() {
    var tabs = document.querySelector('.tabs');
    if (!tabs || document.getElementById('asf-menu-toggle')) return;

    var style = document.createElement('style');
    style.textContent =
      'body{padding-top:64px !important;}' +
      '.tabs.asf-dropdown{display:none;flex-direction:column;gap:6px;padding:12px;margin:0;background:var(--white,#fff);border:1px solid var(--gray-200,#e5e5e5);border-radius:16px;box-shadow:0 10px 28px rgba(0,0,0,0.14);max-height:calc(100vh - 76px);overflow-y:auto;position:fixed;top:64px;left:16px;right:16px;z-index:1001;}' +
      '.tabs.asf-dropdown.open{display:flex;}' +
      '.tabs.asf-dropdown .tab{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:11px 14px;border:none;background:transparent;border-radius:10px;cursor:pointer;font-size:14px;color:var(--secondary,#0E2439);}' +
      '.tabs.asf-dropdown .tab:hover{background:rgba(0,168,204,0.08);}' +
      '.tabs.asf-dropdown .tab.active{background:rgba(0,168,204,0.12);color:var(--primary,#00A8CC);font-weight:600;}' +
      '#asf-menu-toggle{display:flex;align-items:center;justify-content:center;gap:10px;position:fixed;top:8px;left:16px;right:16px;width:auto;margin:0;padding:13px;border:1.5px solid rgba(0,168,204,0.35);background:var(--white,#fff);border-radius:14px;font-size:15px;font-weight:600;color:var(--primary,#00A8CC);cursor:pointer;box-shadow:0 2px 12px rgba(0,0,0,0.10);font-family:inherit;z-index:1002;}';
    document.head.appendChild(style);

    // Corrige o item "Posts" (HTML quebrado no index) ligando-o à seção Comunidade,
    // onde ficam o feed e a publicação de posts
    Array.prototype.slice.call(tabs.children).forEach(function (el) {
      if (el.classList && el.classList.contains('tab-icon') && !el.closest('.tab')) {
        var fix = document.createElement('button');
        fix.className = 'tab';
        fix.setAttribute('role', 'tab');
        fix.setAttribute('aria-selected', 'false');
        fix.setAttribute('aria-controls', 'comunidade');
        fix.setAttribute('onclick', "showSection('comunidade')");
        tabs.insertBefore(fix, el);
        fix.appendChild(el);
        var txt = fix.nextSibling;
        if (txt && txt.nodeType === 3) {
          fix.appendChild(txt);
        } else {
          fix.appendChild(document.createTextNode(' Posts'));
        }
      }
    });

    tabs.classList.add('asf-dropdown');
    tabs.id = tabs.id || 'asf-main-tabs';

    var btn = document.createElement('button');
    btn.id = 'asf-menu-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', tabs.id);
    btn.textContent = '☰ Menu';
    document.body.appendChild(btn);

    function setOpen(open) {
      tabs.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? '✕ Fechar menu' : '☰ Menu';
    }
    btn.addEventListener('click', function () { setOpen(!tabs.classList.contains('open')); });
    tabs.addEventListener('click', function (e) { if (e.target.closest('.tab')) setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!tabs.classList.contains('open')) return;
      if (!e.target.closest('.tabs') && !e.target.closest('#asf-menu-toggle')) setOpen(false);
    });
  }
  var tries = 0;
  function boot() {
    var tabs = document.querySelector('.tabs');
    if (!tabs && tries < 40) { tries++; setTimeout(boot, 250); return; }
    initMenuDropdown();
    // Reforço: se outro script recriar o menu, reaplica o dropdown
    setTimeout(initMenuDropdown, 1000);
    setTimeout(initMenuDropdown, 3000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
    window.addEventListener('load', boot);
  } else {
    boot();
  }
})();


// ASF Surf Goals - Sistema de metas de surf

// Escapa HTML para evitar injeção via campos do usuário (XSS)
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function asfSafeParse(key, fallback) {
  try { return JSON.parse((window.localStorage && localStorage.getItem(key)) || '' ) || fallback; } catch (e) { return fallback; }
}

const SurfGoals = {
  goals: asfSafeParse('asf-goals', []),
  
  // Adicionar nova meta
  addGoal: function(title, target, category) {
    const t = parseInt(target, 10);
    if (!Number.isFinite(t) || t <= 0) {
      if (typeof showToast === 'function') showToast('⚠️ Informe uma meta numérica maior que zero.');
      return null;
    }
    const goal = {
      id: Date.now(),
      title: title,
      target: t,
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
    try { localStorage.setItem('asf-goals', JSON.stringify(this.goals)); } catch (e) {}
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
          <h4 style="font-size: 15px; margin: 0;">${esc(goal.title)}</h4>
          <span style="font-size: 12px; color: var(--gray-400);">${esc(goal.category)}</span>
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
            <input type="number" id="goal-target" placeholder="50" min="1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 8px;">
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
    const title = document.getElementById('goal-title').value.trim();
    const target = document.getElementById('goal-target').value;
    const category = document.getElementById('goal-category').value;
    
    if (title && target) {
      const goal = this.addGoal(title, target, category);
      if (goal) {
        document.getElementById('goal-modal').remove();
        this.render();
      }
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
