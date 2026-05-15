// Post publishing and create menu functions
function publishPost() {
    const textarea = document.getElementById('new-post-text');
    const text = textarea.value.trim();
    if (!text) {
        if (typeof showToast === 'function') showToast('Escreva algo antes de publicar!', 'error');
        return;
    }
    const posts = JSON.parse(localStorage.getItem('asf-posts') || '[]');
    posts.unshift({
        id: Date.now(),
        author: 'Você',
        avatar: '🟡',
        content: text,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0
    });
    localStorage.setItem('asf-posts', JSON.stringify(posts));
    textarea.value = '';
    if (typeof showToast === 'function') showToast('Post publicado! 🏄♀️');
    loadUserPosts();
}

function loadUserPosts() {
    const container = document.getElementById('user-posts');
    if (!container) return;
    const posts = JSON.parse(localStorage.getItem('asf-posts') || '[]');
    if (posts.length === 0) return;
    container.innerHTML = posts.map(p => `
        <div class="post" style="margin: 0 20px 16px;">
            <div class="post-header">
                <div class="post-avatar">${p.avatar}</div>
                <div class="post-info">
                    <h4>${p.author} <span style="font-size:11px;color:var(--gray-400)">• agora</span></h4>
                </div>
            </div>
            <div class="post-content">${p.content}</div>
            <div class="post-actions">
                <button class="post-action"><span>🤍</span> ${p.likes}</button>
                <button class="post-action"><span>💬</span> ${p.comments}</button>
                <button class="post-action" onclick="sharePost('${p.content.replace(/'/g, "\\'")}')"><span>🔗</span> Compartilhar</button>
            </div>
        </div>
    `).join('');
}

// Create menu for FAB
function showCreateMenu() {
    const menu = `
        <div id="create-menu" style="position: fixed; bottom: 80px; right: 24px; background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); z-index: 1000; padding: 16px; min-width: 200px;">
            <div style="margin-bottom: 12px;">
                <button onclick="showSection('sessoes'); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">💬 Criar Sessão</button>
                <button onclick="document.getElementById('new-post-text').focus(); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--accent); color: var(--secondary); border: none; border-radius: 8px; margin-bottom: 8px; cursor: pointer;">📝 Novo Post</button>
                <button onclick="showAddGoalModal(); hideCreateMenu()" style="width: 100%; padding: 12px; background: var(--purple); color: white; border: none; border-radius: 8px; cursor: pointer;">🎯 Nova Meta</button>
            </div>
            <button onclick="hideCreateMenu()" style="width: 100%; padding: 8px; background: var(--gray-100); border: none; border-radius: 8px; font-size: 12px;">Cancelar</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menu);
}

function hideCreateMenu() {
    const menu = document.getElementById('create-menu');
    if (menu) menu.remove();
}

// Load posts on page load
document.addEventListener('DOMContentLoaded', loadUserPosts);