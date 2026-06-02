  // Initialize: load saved language
  var savedLang = localStorage.getItem('asf-lang');
  if (savedLang) setLanguage(savedLang);
  // Google Analytics 4 initialization
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_title: document.title,
    page_location: window.location.href,
    user_id: getUserId ? getUserId() : undefined
  });
  window.trackGAEvent = function(action, label, value) {
    gtag('event', action, {
      event_label: label,
      value: value
    });
  };
function setLanguage(lang) {
    localStorage.setItem('asf-lang', lang);
    document.querySelectorAll('button[onclick^="setLanguage"]').forEach(function(b) {
        var isActive = b.textContent.indexOf(lang === 'en' ? 'EN' : lang === 'es' ? 'ES' : 'PT') >= 0;
        b.style.background = isActive ? '#00A8CC' : 'rgba(255,255,255,0.2)';
        b.style.color = 'white';
    });
    var terms = translations[lang];
    if (!terms) return;
    // Translate ALL visible text
    
    walkTree(document.body);
    showToast('Idioma: ' + (lang === 'pt' ? 'Português' : lang === 'en' ? 'English' : 'Español') + ' 🌎');
}
function toggleChatbot() {
            const panel = document.getElementById("chatbot-panel");
            panel.style.display = panel.style.display === "none" ? "block" : "none";
        }
function sendChatbotMessage() {
            const input = document.getElementById("chatbot-input");
            const msg = input.value.toLowerCase().trim();
            if (!msg) return;
            const msgs = document.getElementById("chatbot-messages");
            msgs.innerHTML += "<div style='background:#eee; padding:8px; border-radius:8px; margin:4px 0;'><strong>Você:</strong> " + input.value + "</div>";
            let response = "Desculpe, não entendi. Tente: previsão, pontos, eventos, contatos ou como participar! 🤖";
            for (const [key, value] of Object.entries(chatbotFAQs)) {
                if (msg.includes(key)) { response = value; break; }
            }
            msgs.innerHTML += "<div style='background:#E0F7FA; padding:8px; border-radius:8px; margin:4px 0;'><strong>🤖:</strong> " + response + "</div>";
            msgs.scrollTop = msgs.scrollHeight;
            input.value = "";
        }
function showTripVotes() {
                var votes = JSON.parse(localStorage.getItem('asf-trip-votes') || '[]');
                if (votes.length === 0) {
                    alert('Nenhum voto recebido ainda! Compartilhe o app para receber votos.');
                    return;
                }
                // Group by location
                var counts = {};
                votes.forEach(function(v) { counts[v.location] = (counts[v.location] || 0) + 1; });
                var summary = '🗳️ RESULTADOS DAS VOTAÇÕES\n\nTotal: ' + votes.length + ' votos\n\n';
                for (var loc in counts) { summary += loc + ': ' + counts[loc] + ' voto(s)\n'; }
                summary += '\n--- DETALHES ---\n';
                votes.forEach(function(v, i) { summary += (i+1) + '. ' + v.name + ' - ' + v.location + '\nWhatsApp: ' + v.phone + '\n\n'; });
                alert(summary);
            }
function initVotingCountdown() {
                var startKey = 'asf-vote-start';
                var startDate = localStorage.getItem(startKey);
                if (!startDate) {
                    startDate = new Date().toISOString().split('T')[0];
                    localStorage.setItem(startKey, startDate);
                }
                var today = new Date();
                var start = new Date(startDate);
                var diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
                var daysLeft = 20 - diffDays;
                var daysEl = document.getElementById('days-left');
                if (daysEl) {
                    if (daysLeft <= 0) {
                        daysEl.textContent = '0';
                        var daysEl2 = document.getElementById('days-left2');
                        if (daysEl2) daysEl2.textContent = '0';
                        document.getElementById('vote-countdown').innerHTML = '<div style="font-size: 18px; font-weight: bold;">✅ VOTAÇÃO ENCERRADA!</div><div style="font-size: 12px; opacity: 0.8;">Resultado final definido</div>';
                        // Show final results
                        showFinalResults();
                    } else {
                        daysEl.textContent = daysLeft;
                        var daysEl2 = document.getElementById('days-left2');
                        if (daysEl2) daysEl2.textContent = daysLeft;
                    }
                }
                // Mostrar resultado parcial em tempo real
                updateLiveResults();
            }
function updateLiveResults() {
                var votes = JSON.parse(localStorage.getItem('asf-trip-votes') || '[]');
                if (votes.length > 0) {
                    var counts = {};
                    votes.forEach(function(v) { counts[v.location] = (counts[v.location] || 0) + 1; });
                    var sorted = Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; });
                    var resultDiv = document.getElementById('current-results');
                    var display = document.getElementById('result-display');
                    if (resultDiv && display) {
                        resultDiv.style.display = 'block';
                        display.innerHTML = sorted.map(function(c) { return c[0] + ': <b>' + c[1] + '</b> voto(s)' }).join(' | ');
                    }
                }
            }
function showFinalResults() {
                var votes = JSON.parse(localStorage.getItem('asf-trip-votes') || '[]');
                if (votes.length === 0) return;
                var counts = {};
                votes.forEach(function(v) { counts[v.location] = (counts[v.location] || 0) + 1; });
                var sorted = Object.entries(counts).sort(function(a, b) { return b[1] - a[1]; });
                var winner = sorted[0][0];
                var winnerVotes = sorted[0][1];
                var msg = '🏆 SURFTRIP ' + (new Date().getMonth() + 1) + '/' + new Date().getFullYear() + '\n\n';
                msg += 'DESTINO: ' + winner + '\n';
                msg += 'VOTOS: ' + winnerVotes + '\n\n';
                msg += 'Próxima trip será em ' + winner + '! 🌊';
                alert(msg);
            }
function voteTrip(btn, loc) {
                // Check if user is logged in
                var user = localStorage.getItem('asf-profile');
                if (!user) {
                    showToast('⚠️ Faça login primeiro! 📝');
                    // Show login modal
                    var loginHTML = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.95);z-index:10000;padding:20px;display:flex;align-items:center;justify-content:center;"><div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:100%;"><h3 style="margin-bottom:16px;">📝 Vote em ' + loc + '</h3><p style="font-size:13px;color:#666;margin-bottom:16px;">Precisamos saber quem você é!</p><input id="voter-name" placeholder="Seu nome" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:10px;"><input id="voter-phone" placeholder="WhatsApp" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:10px;"><input id="voter-email" placeholder="E-mail" style="width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;margin-bottom:16px;"><button onclick="saveVoterAndVote(\'\' + loc + \')" style="background:#00A8CC;color:white;border:none;padding:14px;border-radius:8px;width:100%;font-weight:600;">VOTAR! 🏄‍♀️</button><button onclick="this.closest(\'div\').parentElement.remove()" style="background:none;border:none;color:#666;margin-top:12px;width:100%;">Cancelar</button></div></div>';
                    document.body.insertAdjacentHTML('beforeend', loginHTML);
                    return;
                }
                // Already logged in - just vote
                var profile = JSON.parse(user);
                voteForLocation(btn, loc, profile.name, profile.phone, profile.email);
            }
function saveVoterAndVote(loc) {
                var name = document.getElementById('voter-name').value.trim();
                var phone = document.getElementById('voter-phone').value.trim();
                var email = document.getElementById('voter-email').value.trim();
                if (!name || !phone) {
                    alert('Nome e WhatsApp são obrigatórios!');
                    return;
                }
                // Save as profile for future
                localStorage.setItem('asf-profile', JSON.stringify({name: name, phone: phone, email: email, level: 'comunidade'}));
                // Remove modal
                document.querySelectorAll('[style*="z-index:10000"]')[0].remove();
                // Vote now
                voteForLocation(null, loc, name, phone, email);
            }
function voteForLocation(btn, loc, name, phone, email) {
                // Save vote with full data
                var key = 'asf-trip-votes';
                var votes = JSON.parse(localStorage.getItem(key) || '[]');
                votes.push({location: loc, name: name, phone: phone, email: email, date: new Date().toISOString()});
                localStorage.setItem(key, JSON.stringify(votes));
                // Also update count
                var countKey = 'asf-trip-' + loc, count = (parseInt(localStorage.getItem(countKey)||0)+1);
                localStorage.setItem(countKey, count);
                // Update display
                var el = document.getElementById('vote-' + loc.toLowerCase());
                if (el) el.textContent = count;
                if (btn) {btn.style.border = '#FFD700'; btn.style.background = 'rgba(255,215,0,0.2)';}
                showToast('✓ Voto registrado para ' + loc + '! 🏄‍♀️');
                // Send to Carol via WhatsApp
                var msg = '🏄♀️ NOVO VOTO!\nLocal: ' + loc + '\nNome: ' + name + '\nWhatsApp: ' + phone + (email ? '\nE-mail: ' + email : '');
                window.open('https://wa.me/5511954346288?text=' + encodeURIComponent(msg), '_blank');
            }
function renderBrandHub() {
    // Render offers
    const offersContainer = document.getElementById('brand-offers');
    if (offersContainer) {
        offersContainer.innerHTML = BRAND_OFFERS.map(offer => `
            <div class="card" style="background: linear-gradient(135deg, ${offer.color}22, ${offer.color}11); border-left: 4px solid ${offer.color};">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h4 style="margin: 0 0 8px 0; color: ${offer.color};">${offer.brand}</h4>
                    <span style="background: ${offer.color}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">${offer.discount}</span>
                </div>
                <p style="font-size: 13px; margin: 0 0 8px 0;">${offer.description}</p>
                <div style="display: flex; justify-content: space-between; font-size: 11px; opacity: 0.7;">
                    <span>Código: <strong>${offer.code}</strong></span>
                    <span>⏰ Válido até ${offer.expires}</span>
                </div>
                <button onclick="applyDiscount('${offer.code}')" style="width: 100%; margin-top: 10px; padding: 8px; background: ${offer.color}; color: white; border: none; border-radius: 8px; cursor: pointer;">Aplicar cupom</button>
            </div>
        `).join('');
    }
    // Render UGC gallery
    const gallery = document.getElementById('ugc-gallery');
    if (gallery) {
        gallery.innerHTML = UGC_IMAGES.map(imgurl => `
            <div style="aspect-ratio: 1; overflow: hidden; border-radius: 12px; background: linear-gradient(135deg, #00A8CC, #0E2439); display: flex; align-items: center; justify-content: center;">
                <img src="${imgurl}" alt="UGC" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy">
            </div>
        `).join('');
    }
}
function showBrandChallenge() {
            alert('🏆 DESAFIO DA SEMANA\n\n📸 Tema: "Melhor foto com prancha na praia"\n🏅 Prêmio: R$500 em produtos\n📅 Prazo: 7 dias\n\nComo participar:\n1. Tire sua foto\n2. Poste no Instagram marcando @associacaosurffeminino\n3. Use #ASFChallenge\n4. Compartilhe no app!\n\nBoa sorte! 🏄‍♀️');
        }
function showBrandContact() {
            window.open('https://wa.me/5511954346288?text=Olá!%20Quero%20anunciar%20no%20ASF%20Brand%20Lab.%20Meu%20nome:%20[MARCA]', '_blank');
        }
function applyDiscount(code) {
            alert(`✅ Cupom ${code} copiado!\n\nUse no site da marca parceira.\nDesconto aplicado automaticamente.`);
        }
function exportData() {
                var keys = ['asf-profile', 'surf-sessions', 'quizzes-done', 'asf-water', 'asf-checklist', 'asf-trip-votes', 'asf-parceiros', 'asf-lang', 'asf-theme', 'asf-achievements', 'asf-score', 'asf-level'];
                var data = {};
                keys.forEach(function(k) { var v = localStorage.getItem(k); if (v) data[k] = JSON.parse(v); });
                var blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = 'asf-backup-' + new Date().toISOString().split('T')[0] + '.json';
                a.click();
                URL.revokeObjectURL(url);
                showToast('✅ Backup salvo!', 'success');
            }
function importData(input) {
                var file = input.files[0];
                if (!file) return;
                var reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        var data = JSON.parse(e.target.result);
                        var count = 0;
                        for (var k in data) { localStorage.setItem(k, JSON.stringify(data[k])); count++; }
                        showToast('✅ ' + count + ' itens restaurados! Recarregue o app.', 'success');
                    } catch(err) { showToast('❌ Erro ao importar. Archivo inválido.', 'error'); }
                };
                reader.readAsText(file);
            }
function enviarCadastroParceiro() {
            var nome = document.getElementById("parceiro-nome").value.trim();
            var insta = document.getElementById("parceiro-insta").value.trim();
            var site = document.getElementById("parceiro-site").value.trim();
            var logo = document.getElementById("parceiro-logo").value.trim();
            var comprovante = document.getElementById("parceiro-comprovante").value.trim();
            if (!nome) {
                alert("Preencha o nome da marca!");
                return;
            }
            if (!comprovante) {
                alert("Anexe o comprovante do PIX!");
                return;
            }
            // Save registration
            var parceiro = { nome: nome, insta: insta, site: site, logo: logo, comprovante: comprovante, data: new Date().toISOString() };
            localStorage.setItem("asf-parceiros", JSON.stringify(parceiro));
            // Send to Carol
            var msg = "🏄♀️ NOVO CADASTRO DE PARCEIRO!\n\n";
            msg += "Marca: " + nome + "\n";
            if (insta) msg += "Instagram: " + insta + "\n";
            if (site) msg += "Site: " + site + "\n";
            msg += "\nComprovante: " + comprovante + "\n";
            msg += "Revisar e ativar!";
            window.open("https://wa.me/5511954346288?text=" + encodeURIComponent(msg), "_blank");
            showToast("✓ Cadastro enviado! Revisaremos em breve.");
        }
function checkBadge(type) {
        var sessions = (JSON.parse(localStorage.getItem('surf-sessions') || '[]')).length;
        var quizzes = (JSON.parse(localStorage.getItem('quizzes-done') || '[]')).length;
        var opens = parseInt(localStorage.getItem('asf-opens') || '0');
        var shares = parseInt(localStorage.getItem('asf-shares') || '0');
        if (type === 'surf') {
            if (sessions >= 1) showToast('🏄 Badge desbloqueado! 🎉');
            else showToast('🏄 Progresso: ' + sessions + '/1 sessão registrada');
        } else if (type === 'quiz') {
            if (quizzes >= 5) showToast('📝 Badge desbloqueado! 🎉');
            else showToast('📝 Progresso: ' + quizzes + '/5 quizzes');
        } else if (type === 'streak') {
            if (opens >= 3) showToast('🔥 Badge desbloqueado! 🎉');
            else showToast('🔥 Progresso: ' + opens + '/3 dias usando o app');
        } else if (type === 'veterana') {
            if (sessions >= 5) showToast('🦈 Badge desbloqueado! 🎉');
            else showToast('🦈 Progresso: ' + sessions + '/5 sessões');
        } else if (type === 'maratona') {
            if (sessions >= 10) showToast('⚡ Badge desbloqueado! 🎉');
            else showToast('⚡ Progresso: ' + sessions + '/10 sessões');
        } else if (type === 'share') {
            if (shares >= 1) showToast('📤 Badge desbloqueado! 🎉');
            else showToast('📤 Compartilhe o app para desbloquear!');
        }
    }
function trackShare() {
        localStorage.setItem('asf-shares', parseInt(localStorage.getItem('asf-shares') || '0') + 1);
    }
function callLua() {
    showToast("🌙 Lua está verificando o app... aguarde!");
}
function showBrandSupport() { document.getElementById('brand-support').style.display = 'block'; }
function sendSupport(valor) {
        var msg = 'Olá Carol! Quero apoiar o ASF App. Escolhi: ' + valor + '. Apoio o surf feminino! Me envia o PIX:';
        window.open('https://wa.me/5511954346288?text=' + encodeURIComponent(msg), '_blank');
    }
function showSection(sectionId) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            // Show selected section
            document.getElementById(sectionId).classList.add('active');
            // Render affiliate store if loja section
            if (sectionId === 'loja' && typeof renderAffiliateStore === 'function') {
                renderAffiliateStore();
            }
        }
function handleNavTap(btn, sectionId) {
            if (btn.classList.contains('active')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                showSection(sectionId);
                // Update badges if opening badges section
                if (sectionId === 'badges') {
                    if (typeof updateBadgeProgress === 'function') updateBadgeProgress();
                }
            }
        }
function loadNotifications() {
            const saved = localStorage.getItem(NOTIF_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
            // Primeira vez: usar notificações padrão
            localStorage.setItem(NOTIF_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
            return DEFAULT_NOTIFICATIONS;
        }
function saveNotifications(notifs) {
            localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
        }
function addNotification(type, icon, title, text) {
            const notifs = loadNotifications();
            const newNotif = {
                id: Date.now(),
                type: type,
                icon: icon,
                title: title,
                text: text,
                time: 'Agora',
                read: false
            };
            notifs.unshift(newNotif);
            // Manter apenas últimas 20
            if (notifs.length > 20) notifs.pop();
            saveNotifications(notifs);
            updateNotificationBadge();
        }
function updateNotificationBadge() {
            const notifs = loadNotifications();
            const unread = notifs.filter(n => !n.read).length;
            const badge = document.getElementById('notif-badge');
            if (unread > 0) {
                badge.style.display = 'flex';
                badge.textContent = unread > 9 ? '9+' : unread;
            } else {
                badge.style.display = 'none';
            }
        }
function toggleNotifications() {
            const panel = document.getElementById('notifications-panel');
            const isVisible = panel.style.display === 'block';
            panel.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) {
                renderNotifications();
                // Marcar todas como lidas
                const notifs = loadNotifications();
                notifs.forEach(n => n.read = true);
                saveNotifications(notifs);
                updateNotificationBadge();
            }
        }
function renderNotifications() {
            const notifs = loadNotifications();
            const list = document.getElementById('notifications-list');
            if (notifs.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Sem notificações</p>';
                return;
            }
            list.innerHTML = notifs.map(n => `
                <div onclick="openNotification('${n.type}', '${n.id}')" style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; background: ${n.read ? 'white' : '#F0F9FF'}; border-radius: 8px; margin-bottom: 5px; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='${n.read ? 'white' : '#F0F9FF'}'">
                    <div style="font-size: 28px; flex-shrink: 0;">${n.icon}</div>
                    <div style="flex: 1;">
                        <p style="font-weight: 600; font-size: 14px; color: #0E2439;">${n.title}</p>
                        <p style="font-size: 12px; color: #666; margin-top: 3px;">${n.text}</p>
                        <p style="font-size: 10px; color: #999; margin-top: 5px;">${n.time}</p>
                    </div>
                    ${!n.read ? '<div style="width: 8px; height: 8px; background: #00A8CC; border-radius: 50%; flex-shrink: 0; margin-top: 5px;"></div>' : ''}
                    <div style="color: #00A8CC; font-size: 12px; flex-shrink: 0; margin-top: 5px;">→</div>
                </div>
            `).join('');
        }
function openNotification(type, id) {
            // Marcar como lida
            const notifs = loadNotifications();
            const notif = notifs.find(n => n.id == id);
            if (notif) notif.read = true;
            saveNotifications(notifs);
            updateNotificationBadge();
            // Fechar painel
            document.getElementById('notifications-panel').style.display = 'none';
            // Navegar para a seção correta
            const sectionMap = {
                'treino': 'saude',
                'ondas': 'dicas',
                'pontos': 'progresso',
                'dica': 'dicas',
                'manas': 'manas',
                'quiz': 'progresso',
                'mobilidade': 'mobilidade',
                'mental': 'mental',
                'surftrip': 'manas'
            };
            const section = sectionMap[type] || 'dicas';
            showSection(section);
            // Se tem target específico, fazer scroll até ele
            if (notif && notif.target) {
                setTimeout(() => {
                    const element = document.getElementById(notif.target) ||
                                   document.querySelector(`[data-target="${notif.target}"]`) ||
                                   document.querySelector(`h3:contains("${notif.text}")`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        element.style.transition = 'background 0.3s';
                        element.style.background = '#FFF9E6';
                        setTimeout(() => element.style.background = '', 2000);
                    }
                }, 300);
            }
        }
function clearNotifications() {
            localStorage.setItem(NOTIF_KEY, '[]');
            renderNotifications();
            updateNotificationBadge();
        }
function notifyPoints(points, action) {
            addNotification('pontos', '🎯', `+${points} Pontos!`, action);
        }
function notifyWorkout(name) {
            addNotification('treino', '💪', 'Treino Completo!', `Você terminou: ${name}`);
        }
function notifyWaves(beach, height) {
            addNotification('ondas', '🌊', 'Ondas Boas!', `${beach}: ${height}m - Hora de surfar!`);
        }
function toggleSharePanel() {
            const panel = document.getElementById('share-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        }
function shareToWhatsApp() {
            const url = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + '\n\n' + APP_URL)}`;
            window.open(url, '_blank');
            trackShare();
            toggleSharePanel();
        }
function shareToInstagram() {
            // Instagram não permite share direto via web, copia o link
            copyShareLink();
            trackShare();
            alert('📋 Link copiado!\n\nCole no seu Story ou Post do Instagram 📸');
            toggleSharePanel();
        }
function shareToFacebook() {
            const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(APP_URL)}&quote=${encodeURIComponent(SHARE_TEXT)}`;
            window.open(url, '_blank');
            trackShare();
            toggleSharePanel();
        }
function shareToTwitter() {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(APP_URL)}`;
            window.open(url, '_blank');
            trackShare();
            toggleSharePanel();
        }
function copyShareLink() {
            const input = document.getElementById('share-link');
            const link = input.value;
            // Modern clipboard API with fallback
            if (navigator.clipboard) {
                navigator.clipboard.writeText(link).then(() => showToast('📋 Link copiado!'));
            } else {
                input.select();
                document.execCommand('copy');
                showToast('📋 Link copiado!');
            }
            trackShare();
            // Visual feedback
            const btn = event.target;
            const original = btn.textContent;
            btn.textContent = '✅';
            setTimeout(() => btn.textContent = original, 1500);
        }
function initWelcome() {
            const hasSeenWelcome = localStorage.getItem('asf-welcome-seen');
            if (!hasSeenWelcome) {
                document.getElementById('welcome-card').style.display = 'block';
            }
        }
function closeWelcome() {
            document.getElementById('welcome-card').style.display = 'none';
            localStorage.setItem('asf-welcome-seen', 'true');
        }
function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
function requestLocation() {
            const statusDiv = document.getElementById('location-status');
            statusDiv.innerHTML = '<p style="text-align: center; color: var(--primary);">📍 Buscando localização...</p>';
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        statusDiv.innerHTML = `
                            <div style="background: #E8F5E9; padding: 15px; border-radius: 12px; text-align: center;">
                                <p style="color: #27AE60; font-weight: bold;">✅ Localização ativada!</p>
                                <p style="font-size: 12px; color: #666; margin-top: 5px;">${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</p>
                            </div>
                        `;
                        findNearbyManas();
                    },
                    (error) => {
                        statusDiv.innerHTML = `
                            <div style="background: #FFEBEE; padding: 15px; border-radius: 12px; text-align: center;">
                                <p style="color: #E74C3C;">❌ Não foi possível obter localização</p>
                                <p style="font-size: 12px; color: #666; margin-top: 5px;">Verifique as permissões do navegador</p>
                                <button onclick="requestLocation()" class="btn btn-secondary" style="margin-top: 10px;">Tentar novamente</button>
                            </div>
                        `;
                    }
                );
            } else {
                statusDiv.innerHTML = '<p style="color: #E74C3C; text-align: center;">Geolocalização não suportada neste navegador</p>';
            }
        }
function findNearbyManas() {
            const nearbyDiv = document.getElementById('nearby-manas');
            nearbyDiv.innerHTML = '<p style="text-align: center; color: var(--primary);">🔄 Buscando manas próximas...</p>';
            // Simula busca (em produção usaria a localização real)
            setTimeout(() => {
                const allManas = [];
                Object.keys(MOCK_MANAS).forEach(beach => {
                    MOCK_MANAS[beach].forEach(mana => {
                        allManas.push({ ...mana, region: beach });
                    });
                });
                // Ordena por distância
                allManas.sort((a, b) => a.distance - b.distance);
                // Pega as 5 mais próximas
                const closest = allManas.slice(0, 5);
                nearbyDiv.innerHTML = `
                    <h4 style="color: var(--secondary); margin-bottom: 15px;">📍 Manas mais próximas</h4>
                    ${closest.map(mana => `
                        <div class="card" style="margin-bottom: 15px; cursor: pointer;" onclick="connectManas('${mana.name}')">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="font-size: 40px;">${mana.avatar}</div>
                                <div style="flex: 1;">
                                    <h4 style="font-size: 16px; color: var(--secondary);">${mana.name}</h4>
                                    <p style="font-size: 12px; color: var(--gray-600);">${mana.level} • ${mana.beach}</p>
                                    <p style="font-size: 11px; color: var(--primary); font-weight: bold;">📍 ${mana.distance} km</p>
                                </div>
                                <button class="btn btn-primary" style="font-size: 12px; padding: 8px 12px;">Conectar</button>
                            </div>
                        </div>
                    `).join('')}
                    <p style="text-align: center; font-size: 12px; color: var(--gray-400); margin-top: 15px;">Total: ${allManas.length} manas encontradas</p>
                `;
            }, 1500);
        }
function showBeachManas(beach) {
            const manas = MOCK_MANAS[beach] || [];
            const listDiv = document.getElementById('beach-manas-list');
            const detailDiv = document.getElementById('beach-manas-detail');
            const beachNames = {
                bertioga: 'Bertioga',
                santos: 'Santos',
                guaruja: 'Guarujá',
                ubatuba: 'Ubatuba'
            };
            listDiv.innerHTML = `
                <h4 style="color: var(--secondary); margin-bottom: 15px;">🏖️ Manas em ${beachNames[beach]}</h4>
                ${manas.map(mana => `
                    <div class="card" style="margin-bottom: 15px; cursor: pointer;" onclick="connectManas('${mana.name}')">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="font-size: 40px;">${mana.avatar}</div>
                            <div style="flex: 1;">
                                <h4 style="font-size: 16px; color: var(--secondary);">${mana.name}</h4>
                                <p style="font-size: 12px; color: var(--gray-600);">${mana.level} • ${mana.beach}</p>
                                <p style="font-size: 11px; color: var(--primary); font-weight: bold;">📍 ${mana.distance} km</p>
                            </div>
                            <button class="btn btn-primary" style="font-size: 12px; padding: 8px 12px;">Conectar</button>
                        </div>
                    </div>
                `).join('')}
            `;
            detailDiv.style.display = 'block';
        }
function connectManas(name) {
            alert(`🏄‍♀️ Solicitação enviada para ${name}!\n\nVocê receberá uma notificação quando ela aceitar. Enquanto isso, continue surfando! 🌊`);
        }
function getLevel(points) {
            for (let i = LEVELS.length - 1; i >= 0; i--) {
                if (points >= LEVELS[i].minPoints) return LEVELS[i];
            }
            return LEVELS[0];
        }
function renderAchievements() {
            const container = document.getElementById('achievements-grid');
            if (!container) return;
            const data = JSON.parse(localStorage.getItem('asf_points') || '{"total":0,"quizzes":0,"dicas":0,"treinos":0}');
            const sessions = JSON.parse(localStorage.getItem('surf-sessions') || '[]');
            const checks = parseInt(localStorage.getItem('asf-checklist-done') || '0');
            const waterDays = getWaterStreak();
            const points = data.total;
            const level = getLevel(points);
            // Check for early morning sessions (before 7am)
            const earlyMorningCount = sessions.filter(s => {
                const hour = new Date(s.date).getHours();
                return hour < 7;
            }).length;
            const achievements = [
                { id: 'primeira-onda', name: '🌟 Primeira Onda', desc: 'Complete seu primeiro quiz', done: data.quizzes >= 1 },
                { id: 'estudiosa', name: '📚 Estudiosa', desc: 'Complete 5 quizzes', done: data.quizzes >= 5 },
                { id: 'surfista-completa', name: '🏄 Surfista Completa', desc: 'Complete 10 quizzes', done: data.quizzes >= 10 },
                { id: 'atleta', name: '💪 Atleta', desc: 'Registre 5 sessões de surf', done: sessions.length >= 5 },
                { id: 'maratonista', name: '🏃 Maratonista', desc: 'Registre 20 sessões de surf', done: sessions.length >= 20 },
                { id: 'hidratada', name: '💧 Hidratada', desc: 'Beba 8 copos de água em 1 dia', done: waterDays > 0 },
                { id: 'manas', name: '🤝 Conectada', desc: 'Entre em 1 grupo de surf', done: !!localStorage.getItem('asf-joined-Bertioga-Surf-Girls') || !!localStorage.getItem('asf-joined-Guarujá-&-Santos-Surf') || !!localStorage.getItem('asf-joined-Ubatuba-Surf-Girls') },
                { id: 'nivel-5', name: '⭐ Onda Grande', desc: 'Alcance nível 5', done: level.minPoints >= 800 },
                { id: 'checklist', name: '✅ Preparada', desc: 'Complete o checklist pré-surf 3x', done: checks >= 3 },
                { id: 'comunidade', name: '💬 Voz Ativa', desc: 'Publique 3 posts na comunidade', done: (JSON.parse(localStorage.getItem('asf-user-posts') || '[]')).length >= 3 },
                { id: 'madrugadora', name: '🌅 Madrugadora', desc: 'Surfe antes das 7h da manhã', done: earlyMorningCount >= 1 },
            ];
            const done = achievements.filter(a => a.done);
            const locked = achievements.filter(a => !a.done);
            container.innerHTML = done.map(a => `<div class="card">
                <span class="card-tag" style="background: gold; color: black;">CONQUISTADO</span>
                <h3>${a.name}</h3>
                <p>${a.desc}</p>
                <p style="margin-top: 8px; font-size: 12px; color: var(--success);">✅ Desbloqueada!</p>
            </div>`).join('') + locked.map(a => `<div class="card">
                <span class="card-tag gray">🔒 BLOQUEADO</span>
                <h3>${a.name}</h3>
                <p>${a.desc}</p>
            </div>`).join('');
            // Update stats
            const statEl = document.querySelector('.profile-stat-value:last-of-type');
            // Update achievement count in profile
        }
function getWaterStreak() {
            let count = 0;
            for (let i = 0; i < 7; i++) {
                const d = new Date(); d.setDate(d.getDate() - i);
                const key = 'asf-water-' + d.toISOString().split('T')[0];
                if (parseInt(localStorage.getItem(key) || '0') >= 8) count++;
            }
            return count;
        }
function loadPoints() {
            return JSON.parse(localStorage.getItem(POINTS_KEY) || '{"total":0,"quizzes":0,"dicas":0,"treinos":0}');
        }
function savePoints(data) {
            localStorage.setItem(POINTS_KEY, JSON.stringify(data));
        }
function earnPoints(type, points) {
            const data = loadPoints();
            data.total += points;
            if (type === 'quiz') {
                data.quizzes++;
                // Sync to quizzes-done for achievements
                const quizzes = JSON.parse(localStorage.getItem('quizzes-done') || '[]');
                quizzes.push({date: new Date().toISOString()});
                localStorage.setItem('quizzes-done', JSON.stringify(quizzes));
            }
            if (type === 'dica') data.dicas++;
            if (type === 'treino') data.treinos++;
            savePoints(data);
            // Mostrar animação
            const popup = document.createElement('div');
            popup.innerHTML = `+${points} pontos! 🎉`;
            popup.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#27AE60;color:white;padding:20px 40px;border-radius:15px;font-size:20px;font-weight:bold;z-index:9999;';
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 1500);
            updatePointsDisplay();
        }
function updatePointsDisplay() {
            const data = loadPoints();
            const level = getLevel(data.total);
            // Atualizar displays se existirem
            document.querySelectorAll('.points-display').forEach(el => {
                el.textContent = data.total;
            });
        }
function createPost() {
            const textarea = document.getElementById('new-post-text');
            const text = textarea.value.trim();
            if (!text) { showToast('Escreva algo antes de publicar! ✍️'); return; }
            const posts = JSON.parse(localStorage.getItem('asf-user-posts') || '[]');
            posts.unshift({ text, time: Date.now(), likes: 0 });
            localStorage.setItem('asf-user-posts', JSON.stringify(posts));
            textarea.value = '';
            renderUserPosts();
            showToast('Post publicado! 🎉');
            earnPoints('dica', 5);
        }
function startQuiz(quizName) {
            const quizDiv = document.getElementById('quiz-' + quizName);
            const button = event.target;
            if (quizDiv.style.display === 'none') {
                quizDiv.style.display = 'block';
                button.textContent = 'Fechar Quiz';
                button.classList.remove('btn-primary');
                button.classList.add('btn-secondary');
            } else {
                quizDiv.style.display = 'none';
                button.textContent = 'Responder Quiz';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-primary');
            }
        }
function submitQuiz() {
            const answers = { q1: 'a', q2: 'a', q3: 'b', q4: 'a', q5: 'a', q6: 'a', q7: 'a', q8: 'a', q9: 'a', q10: 'a' };
            let correct = 0;
            let total = Object.keys(answers).length;
            for (const [q, ans] of Object.entries(answers)) {
                const selected = document.querySelector(`input[name="${q}"]:checked`);
                if (selected && selected.value === ans) correct++;
            }
            const pct = Math.round((correct / total) * 100);
            const pts = correct >= 8 ? 50 : correct >= 5 ? 30 : 10;
            const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
            showToast(`${emoji} ${correct}/${total} acertos (${pct}%)! +${pts} pontos`);
            earnPoints('quiz', pts);
        }
function submitQuizSeguranca() {
            const answers = { sq1: 'b', sq2: 'c', sq3: 'a', sq4: 'b', sq5: 'b', sq6: 'b', sq7: 'c', sq8: 'a', sq9: 'b', sq10: 'b' };
            let correct = 0;
            let total = Object.keys(answers).length;
            for (const [q, ans] of Object.entries(answers)) {
                const selected = document.querySelector(`input[name="${q}"]:checked`);
                if (selected && selected.value === ans) correct++;
            }
            const pct = Math.round((correct / total) * 100);
            const pts = correct >= 8 ? 50 : correct >= 5 ? 30 : 10;
            const emoji = pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚';
            showToast(`${emoji} Segurança: ${correct}/${total} acertos (${pct}%)! +${pts} pontos`);
            earnPoints('quiz', pts);
            document.getElementById('quiz-seguranca').style.display = 'none';
            document.querySelector('button[onclick="startQuiz(\'seguranca\')"]').textContent = 'Refazer Quiz';
        }
function showAchievementDetails(badgeId) {
            const badge = achievements[badgeId];
            if (badge) {
                const status = badge.earned ? '✅ Conquistada!' : '🔒 Em progresso';
                showToast(`${badge.title}\n${badge.desc}\n${status}`);
            }
        }
function updateCountdown() {
            const compDate = new Date('2026-04-12');
            const now = new Date();
            const diff = compDate - now;
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            const el = document.getElementById('countdown');
            if (el) {
                if (days > 0) {
                    el.textContent = days + ' dia' + (days > 1 ? 's' : '');
                } else if (days === 0) {
                    el.textContent = 'HOJE! 🔥';
                } else {
                    el.textContent = 'Em andamento';
                }
            }
        }
function debouncedSearch(q) { clearTimeout(_searchTimer); _searchTimer = setTimeout(() => handleSearch(q), 150); }
function handleSearch(query) {
            const resultsDiv = document.getElementById('searchResults');
            const clearBtn = document.getElementById('searchClear');
            if (!query || query.length < 2) {
                resultsDiv.classList.remove('active');
                clearBtn.style.display = 'none';
                return;
            }
            clearBtn.style.display = 'block';
            const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const results = normalizedSearchIndex.filter(item => {
                return item._titleNorm.includes(q) || item._textNorm.includes(q) || item._sectionNorm.includes(q);
            }).slice(0, 8);
            if (results.length === 0) {
                resultsDiv.innerHTML = '<div class="search-no-results"><span class="emoji">🏄‍♀️</span>Nenhum resultado para "' + query + '"<br><small>Tente outro termo</small></div>';
            } else {
                resultsDiv.innerHTML = results.map(item => {
                    const preview = item.text.length > 80 ? item.text.substring(0, 80) + '...' : item.text;
                    const highlighted = preview.replace(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
                    return '<div class="search-result-item" onclick="goToSection(\'' + item.sectionId + '\', this)">' +
                        '<div class="result-title">' + item.icon + ' ' + item.title + '</div>' +
                        '<div class="result-section">' + item.section + '</div>' +
                        '<div class="result-preview">' + highlighted + '</div></div>';
                }).join('');
            }
            resultsDiv.classList.add('active');
            // Save to recent searches
            if (query.length >= 3) saveRecentSearch(query);
        }
function getRecentSearches() {
            try { return JSON.parse(localStorage.getItem('asf-recent-searches') || '[]'); } catch { return []; }
        }
function saveRecentSearch(query) {
            let recent = getRecentSearches().filter(s => s !== query);
            recent.unshift(query);
            if (recent.length > 3) recent = recent.slice(0, 3);
            localStorage.setItem('asf-recent-searches', JSON.stringify(recent));
        }
function showRecentSearches() {
            const recent = getRecentSearches();
            const resultsDiv = document.getElementById('searchResults');
            if (recent.length === 0) return;
            const input = document.getElementById('searchInput');
            if (input.value.length >= 2) return;
            resultsDiv.innerHTML = '<div style="padding:8px 12px;font-size:11px;color:var(--gray-400);">Buscas recentes</div>' +
                recent.map(s => '<div class="search-result-item" onclick="document.getElementById(\'searchInput\').value=\'' + s + '\';handleSearch(\'' + s + '\')"><div class="result-title">🕐 ' + s + '</div></div>').join('') +
                '<div style="padding:6px 12px;text-align:right;"><button onclick="clearRecentSearches()" style="background:none;border:none;color:var(--primary);font-size:11px;cursor:pointer;">Limpar</button></div>';
            resultsDiv.classList.add('active');
        }
function clearRecentSearches() {
            localStorage.removeItem('asf-recent-searches');
            document.getElementById('searchResults').classList.remove('active');
        }
function clearSearch() {
            document.getElementById('searchInput').value = '';
            document.getElementById('searchResults').classList.remove('active');
            document.getElementById('searchClear').style.display = 'none';
        }
function goToSection(sectionId, el) {
            clearSearch();
            showSection(sectionId);
        }
async function fetchWeather(beach) {
            const b = beaches[beach];
            const key = beach + '_' + new Date().toDateString();
            if (cachedWeather[key]) return cachedWeather[key];
            try {
                const resp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${b.lat}&longitude=${b.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index,sunrise,sunset&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,wind_speed_10m_max,sunrise,sunset&timezone=America/Sao_Paulo&forecast_days=7`);
                const data = await resp.json();
                cachedWeather[key] = data;
                return data;
            } catch (e) {
                console.error('Weather fetch error:', e);
                return null;
            }
        }
async function fetchMarine(beach) {
            const b = beaches[beach];
            const key = beach + '_' + new Date().toDateString();
            if (cachedMarine[key]) return cachedMarine[key];
            try {
                const resp = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${b.lat}&longitude=${b.lon}&current=wave_height,wave_direction,wave_period,swell_wave_height,swell_wave_period&daily=wave_height_max,wave_direction_dominant,wave_period_max&timezone=America/Sao_Paulo&forecast_days=7`);
                const data = await resp.json();
                cachedMarine[key] = data;
                return data;
            } catch (e) {
                console.error('Marine fetch error:', e);
                return null;
            }
        }
function selectBeach(beach, btn) {
            currentBeach = beach;
            document.querySelectorAll('.beach-btn').forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-secondary');
            });
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            loadLiveData(beach);
        }
async function loadLiveData(beach) {
            const [weather, marine] = await Promise.all([fetchWeather(beach), fetchMarine(beach)]);
            // Update Mar card
            const marDiv = document.getElementById('mar-data');
            if (marine && marine.current) {
                const c = marine.current;
                const rating = surfRating(c.wave_height);
                marDiv.innerHTML = `
                    <p style="font-size: 20px; font-weight: 700; color: var(--primary);">${c.wave_height.toFixed(1)}m</p>
                    <p style="font-size: 14px; color: ${rating.color}; font-weight: 600;">${rating.text}</p>
                    <div style="font-size: 13px; color: var(--gray-600); margin-top: 6px;">
                        <div>Período: ${c.wave_period.toFixed(0)}s | Direção: ${windDir(c.wave_direction)} (${c.wave_direction}°)</div>
                        ${c.swell_wave_height ? `<div>Swell: ${c.swell_wave_height.toFixed(1)}m (${c.swell_wave_period.toFixed(0)}s)</div>` : ''}
                    </div>
                `;
            } else {
                marDiv.innerHTML = `<p style="font-size: 14px; color: var(--gray-400);">Dados indisponíveis no momento</p>`;
            }
            // Update Clima card
            const climaDiv = document.getElementById('clima-data');
            if (weather && weather.current) {
                const c = weather.current;
                const desc = weatherDescriptions[c.weather_code] || 'Condições variadas';
                const sunrise = c.sunrise ? c.sunrise.slice(11, 16) : '--:--';
                const sunset = c.sunset ? c.sunset.slice(11, 16) : '--:--';
                climaDiv.innerHTML = `
                    <p style="font-size: 20px; font-weight: 700; color: var(--primary);">${c.temperature_2m.toFixed(0)}°C</p>
                    <p style="font-size: 14px; color: var(--gray-600);">${desc}</p>
                    <div style="font-size: 13px; color: var(--gray-600); margin-top: 6px;">
                        <div>☀️ Nascer: ${sunrise} | 🌇 Pôr: ${sunset}</div>
                        <div>Sensação: ${c.apparent_temperature.toFixed(0)}°C | Umidade: ${c.relative_humidity_2m}%</div>
                        <div>Vento: ${c.wind_speed_10m.toFixed(0)} km/h ${windDir(c.wind_direction_10m)} | UV: ${c.uv_index.toFixed(0)}</div>
                    </div>
                `;
            } else {
                climaDiv.innerHTML = `<p style="font-size: 14px; color: var(--gray-400);">Dados indisponíveis no momento</p>`;
            }
            // Update Maré card (estimated based on location)
            const mareDiv = document.getElementById('mare-data');
            const now = new Date();
            const hour = now.getHours();
            const mareTimes = getEstimatedTides(beach, now);
            mareDiv.innerHTML = `
                <p style="font-size: 16px; font-weight: 700; color: var(--primary);">🔴 ${mareTimes.high}</p>
                <p style="font-size: 14px; color: var(--success);">🟢 ${mareTimes.low}</p>
                <p style="font-size: 12px; color: var(--gray-400); margin-top: 4px;">${mareTimes.tip}</p>
            `;
            // Animate tide clock
            updateTideClock(mareTimes, now);
            // Update UV card
            const uvDiv = document.getElementById('uv-data');
            const uvProt = document.getElementById('uv-protection');
            if (weather && weather.current && weather.daily) {
                const currentUV = weather.current.uv_index || 0;
                const todayMaxUV = weather.daily.uv_index_max[0] || currentUV;
                // UV level description and color
                let uvLevel, uvColor, uvIcon;
                if (todayMaxUV <= 2) {
                    uvLevel = 'Baixo';
                    uvColor = '#27ae60';
                    uvIcon = '🟢';
                } else if (todayMaxUV <= 5) {
                    uvLevel = 'Moderado';
                    uvColor = '#f39c12';
                    uvIcon = '🟡';
                } else if (todayMaxUV <= 7) {
                    uvLevel = 'Alto';
                    uvColor = '#e67e22';
                    uvIcon = '🟠';
                } else if (todayMaxUV <= 10) {
                    uvLevel = 'Muito Alto';
                    uvColor = '#e74c3c';
                    uvIcon = '🔴';
                } else {
                    uvLevel = 'Extremo';
                    uvColor = '#8e44ad';
                    uvIcon = '⚠️';
                }
                uvDiv.innerHTML = `
                    <p style="font-size: 32px; font-weight: 700; color: ${uvColor};">${todayMaxUV.toFixed(0)}</p>
                    <p style="font-size: 14px; color: ${uvColor}; font-weight: 600;">${uvIcon} ${uvLevel}</p>
                    <p style="font-size: 12px; color: var(--gray-400); margin-top: 4px;">Máximo hoje</p>
                `;
                // Protection tip
                let protTip = '';
                if (todayMaxUV <= 2) {
                    protTip = '☀️ Protetor opcional para pele sensível';
                } else if (todayMaxUV <= 5) {
                    protTip = '🧴 Aplique FPS 30+ a cada 2h';
                } else if (todayMaxUV <= 7) {
                    protTip = '🧴 Aplique FPS 50+ a cada 2h | Usar chapéu';
                } else if (todayMaxUV <= 10) {
                    protTip = '🧴 FPS 50+ | Chapéu e óculos | Evitar 12-16h';
                } else {
                    protTip = '⚠️ Evitar sol entre 10h-16h!';
                }
                if (uvProt) uvProt.querySelector('p').innerHTML = `<strong>☀️ Dica:</strong> ${protTip}`;
            } else {
                uvDiv.innerHTML = `<p style="font-size: 14px; color: var(--gray-400);">Dados indisponíveis</p>`;
            }
        }
function updateTideClock(tides, now) {
            const arc = document.getElementById('tide-arc');
            const icon = document.getElementById('tide-level-icon');
            const text = document.getElementById('tide-level-text');
            const label = document.getElementById('tide-level-label');
            if (!arc) return;
            // Parse high/low times to estimate current tide position (0-1 cycle)
            const highMatch = tides.high.match(/(\d+):(\d+)/);
            const lowMatch = tides.low.match(/(\d+):(\d+)/);
            if (!highMatch || !lowMatch) return;
            const highMin = parseInt(highMatch[1]) * 60 + parseInt(highMatch[2]);
            const lowMin = parseInt(lowMatch[1]) * 60 + parseInt(lowMatch[2]);
            const nowMin = now.getHours() * 60 + now.getMinutes();
            // Simple sine approximation between high and low
            const cycleLen = Math.abs(lowMin - highMin) * 2;
            let pos;
            if (highMin < lowMin) {
                pos = ((nowMin - highMin) / (lowMin - highMin));
                if (nowMin < highMin) pos = 0;
                if (nowMin > lowMin) pos = 1 - ((nowMin - lowMin) / (highMin + 1440 - lowMin));
                if (pos < 0) pos = 0;
                if (pos > 1) pos = 1;
                // Map: 0=high, 0.5=low, 1=high
                const angle = pos * Math.PI;
                const tideHeight = Math.cos(angle); // 1=high, -1=low, 0=mid
                const pct = (tideHeight + 1) / 2; // 0 to 1
                const circumference = 339.29;
                arc.style.strokeDashoffset = circumference - (circumference * pct * 0.85);
                if (pct > 0.65) {
                    icon.textContent = '🌊';
                    text.textContent = 'Alta';
                    arc.style.stroke = 'var(--primary)';
                } else if (pct < 0.35) {
                    icon.textContent = '🏖️';
                    text.textContent = 'Baixa';
                    arc.style.stroke = 'var(--success)';
                } else {
                    icon.textContent = '〰️';
                    text.textContent = 'Subindo';
                    arc.style.stroke = 'var(--accent)';
                    if (nowMin > (highMin + lowMin) / 2 && nowMin < lowMin) text.textContent = 'Descendo';
                }
            } else {
                pos = ((nowMin - lowMin) / (highMin - lowMin));
                if (nowMin < lowMin) pos = 0;
                if (nowMin > highMin) pos = 1 - ((nowMin - highMin) / (lowMin + 1440 - highMin));
                if (pos < 0) pos = 0;
                if (pos > 1) pos = 1;
                const angle = pos * Math.PI;
                const tideHeight = Math.cos(angle);
                const pct = (tideHeight + 1) / 2;
                const circumference = 339.29;
                arc.style.strokeDashoffset = circumference - (circumference * pct * 0.85);
                if (pct > 0.65) {
                    icon.textContent = '🏖️';
                    text.textContent = 'Baixa';
                    arc.style.stroke = 'var(--success)';
                } else if (pct < 0.35) {
                    icon.textContent = '🌊';
                    text.textContent = 'Alta';
                    arc.style.stroke = 'var(--primary)';
                } else {
                    icon.textContent = '〰️';
                    text.textContent = 'Subindo';
                    arc.style.stroke = 'var(--accent)';
                }
            }
            const timeStr = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
            label.textContent = 'agora: ' + timeStr;
        }
function getEstimatedTides(beach, date) {
            // Approximate tidal cycle - shifts ~50min per day
            const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
            const baseOffset = (dayOfYear % 14) * 0.8; // ~50 min shift per day
            const baseHigh = 5 + baseOffset;
            const baseLow = 11 + baseOffset;
            const high1 = Math.floor(baseHigh) % 24;
            const highMin1 = Math.floor((baseHigh % 1) * 60);
            const low1 = Math.floor(baseLow) % 24;
            const lowMin1 = Math.floor((baseLow % 1) * 60);
            const high2 = (high1 + 12) % 24;
            return {
                high: `${String(high1).padStart(2,'0')}:${String(highMin1).padStart(2,'0')} (${(1.0 + Math.sin(dayOfYear * 0.4) * 0.4).toFixed(1)}m)`,
                low: `${String(low1).padStart(2,'0')}:${String(lowMin1).padStart(2,'0')} (${(0.3 + Math.sin(dayOfYear * 0.4) * 0.2).toFixed(1)}m)`,
                tip: `💡 Próxima alta: ${String(high2).padStart(2,'0')}:${String(highMin1).padStart(2,'0')}`
            };
        }
function showMarDetails() {
            if (!cachedMarine[currentBeach]) {
                alert('Dados ainda carregando. Tente novamente em instantes.');
                return;
            }
            const m = cachedMarine[currentBeach + '_' + new Date().toDateString()];
            if (!m || !m.daily) return;
            const d = m.daily;
            let msg = `🌊 PREVISÃO DO MAR - ${beaches[currentBeach].name.toUpperCase()}\n\n`;
            const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
            for (let i = 0; i < Math.min(7, d.time.length); i++) {
                const date = new Date(d.time[i]);
                const dayName = days[date.getDay()];
                const rating = surfRating(d.wave_height_max[i]);
                msg += `${dayName} (${date.getDate()}/${date.getMonth()+1}):\n`;
                msg += `  Ondas: até ${d.wave_height_max[i].toFixed(1)}m\n`;
                if (d.wave_period_max) msg += `  Período: ${d.wave_period_max[i].toFixed(0)}s\n`;
                msg += `  ${rating.text}\n\n`;
            }
            alert(msg);
        }
function showClimaDetails() {
            if (!cachedWeather[currentBeach]) {
                alert('Dados ainda carregando. Tente novamente em instantes.');
                return;
            }
            const w = cachedWeather[currentBeach + '_' + new Date().toDateString()];
            if (!w || !w.daily) return;
            const d = w.daily;
            let msg = `🌡️ PREVISÃO DO TEMPO - ${beaches[currentBeach].name.toUpperCase()}\n\n`;
            const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
            for (let i = 0; i < Math.min(7, d.time.length); i++) {
                const date = new Date(d.time[i]);
                const dayName = days[date.getDay()];
                const desc = weatherDescriptions[d.weather_code[i]] || 'Variado';
                msg += `${dayName} (${date.getDate()}/${date.getMonth()+1}): ${desc}\n`;
                msg += `  ${d.temperature_2m_min[i].toFixed(0)}°-${d.temperature_2m_max[i].toFixed(0)}°C | Vento: ${d.wind_speed_10m_max[i].toFixed(0)} km/h | UV: ${d.uv_index_max[i].toFixed(0)}\n`;
                const sr = d.sunrise ? d.sunrise[i].slice(11, 16) : '--:--';
                const ss = d.sunset ? d.sunset[i].slice(11, 16) : '--:--';
                msg += `  ☀️ ${sr} - ${ss}\n\n`;
            }
            alert(msg);
        }
function showMareDetails() {
            const b = beaches[currentBeach];
            const now = new Date();
            let msg = `🗓️ MARÉS - ${b.name.toUpperCase()}\n\n`;
            const days = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
            for (let i = 0; i < 3; i++) {
                const d = new Date(now);
                d.setDate(d.getDate() + i);
                const tides = getEstimatedTides(currentBeach, d);
                msg += `${days[d.getDay()]} (${d.getDate()}/${d.getMonth()+1}):\n`;
                msg += `  Alta: ${tides.high}\n`;
                msg += `  Baixa: ${tides.low}\n\n`;
            }
            msg += `💡 MELHOR HORÁRIO:\n• SURF: Maré média/baixa (ondas melhores)\n• INICIANTE: Maré alta (mais fácil)`;
            alert(msg);
        }
function updateMoonPhase() {
            // Reference new moon: January 11, 2000 at 12:24 UTC
            const knownNewMoon = new Date('2000-01-11T12:24:00Z');
            const now = new Date();
            // Calculate days since known new moon
            const msPerDay = 24 * 60 * 60 * 1000;
            const daysSinceNewMoon = (now - knownNewMoon) / msPerDay;
            // Synodic month (lunation) is approximately 29.53059 days
            const lunation = 29.53059;
            // Current moon age (0-29.5)
            const moonAge = daysSinceNewMoon % lunation;
            // Determine phase name and icon
            let phaseName, moonIcon, surfTip, tideTipDesc;
            if (moonAge < 1.85 || moonAge > 27.68) {
                phaseName = 'Lua Nova';
                moonIcon = '🌑';
                surfTip = 'Ondas Poderosas!';
                tideTipDesc = 'Maré grande (spring) = +tidal range';
            } else if (moonAge < 7.38) {
                phaseName = 'Lua Crescente';
                moonIcon = '🌒';
                surfTip = 'Maré Subindo';
                tideTipDesc = 'Ondasbuildando ao longo do dia';
            } else if (moonAge < 9.23) {
                phaseName = 'Quarto Crescente';
                moonIcon = '🌓';
                surfTip = 'Maré Média';
                tideTipDesc = 'Boas condições gerais';
            } else if (moonAge < 14.77) {
                phaseName = 'Gibosa Crescente';
                moonIcon = '🌔';
                surfTip = 'Ondas Grandes!';
                tideTipDesc = 'Maré grandi (spring) = +tidal range';
            } else if (moonAge < 16.61) {
                phaseName = 'Lua Cheia';
                moonIcon = '🌕';
                surfTip = 'Ondas Poderosas!';
                tideTipDesc = 'Spring tide = maior range de maré';
            } else if (moonAge < 22.15) {
                phaseName = 'Gibosa Minguante';
                moonIcon = '🌖';
                surfTip = 'Maré Caindo';
                tideTipDesc = 'Ondas mudando ao longo do dia';
            } else if (moonAge < 24.0) {
                phaseName = 'Quarto Minguante';
                moonIcon = '🌗';
                surfTip = 'Maré Média';
                tideTipDesc = 'Neap tide = menor range';
            } else {
                phaseName = 'Lua Minguante';
                moonIcon = '🌘';
                surfTip = 'Maré Estável';
                tideTipDesc = 'Menor variação de maré';
            }
            // Update the display
            document.getElementById('moon-icon').textContent = moonIcon;
            document.getElementById('moon-phase-name').textContent = phaseName;
            document.getElementById('moon-age').textContent = moonAge.toFixed(1) + ' dias';
            document.getElementById('tide-tip').textContent = surfTip;
            document.getElementById('tide-tip-desc').textContent = tideTipDesc;
        }
function calcularVolume() {
            const peso = parseFloat(document.getElementById('peso-input').value) || 65;
            const nivel = document.getElementById('nivel-input').value;
            // Cálculo de volume em litros
            let addVolume = nivel === 'iniciante' ? 5.5 : nivel === 'intermediario' ? 2.5 : 0.5;
            const volume = Math.round(peso + addVolume);
            // Cálculo de borda (rail height) em cm
            let borda;
            if (nivel === 'iniciante') {
                borda = Math.round((peso * 0.08) + 2); // Bordas mais altas para iniciantes
            } else if (nivel === 'intermediario') {
                borda = Math.round((peso * 0.06) + 1.5); // Bordas médias
            } else {
                borda = Math.round((peso * 0.04) + 1); // Bordas mais baixas para avançados
            }
            // Garantir limites razoáveis
            borda = Math.max(4, Math.min(8, borda));
            // Mostrar resultado
            const resultDiv = document.getElementById('calc-result');
            resultDiv.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; text-align: center;">
                    <div>
                        <p style="font-size: 12px; color: var(--gray-600);">Volume</p>
                        <p style="font-size: 24px; font-weight: bold; color: var(--success);" id="volume-result">${volume}L</p>
                    </div>
                    <div>
                        <p style="font-size: 12px; color: var(--gray-600);">Borda</p>
                        <p style="font-size: 24px; font-weight: bold; color: var(--primary);" id="borda-result">${borda}cm</p>
                    </div>
                </div>
                <p style="font-size: 11px; color: var(--gray-400); margin-top: 10px; text-align: center;">
                    ${nivel === 'iniciante' ? '🌱 Bordas altas = mais flutuação e estabilidade' :
                      nivel === 'intermediario' ? '🏄 Bordas médias = equilíbrio entre controle e performance' :
                      '🔥 Bordas baixas = mais agilidade e resposta'}
                </p>
            `;
        }
function toggleChecklistItem(label) {
            const checkbox = label.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            if (checkbox.checked) {
                label.style.background = 'rgba(46, 204, 113, 0.15)';
                label.style.textDecoration = 'none';
            } else {
                label.style.background = 'var(--light)';
            }
            updateChecklistProgress();
        }
function updateChecklistProgress() {
            const checkboxes = document.querySelectorAll('#checklist-container input[type="checkbox"]');
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            document.getElementById('checklist-count').textContent = checked;
            const percentage = (checked / total) * 100;
            document.getElementById('checklist-bar').style.width = percentage + '%';
            if (checked === total) {
                document.getElementById('checklist-progress').style.background = 'rgba(46, 204, 113, 0.15)';
                document.getElementById('checklist-progress').innerHTML = '<p style="font-size: 14px; color: var(--success); font-weight: bold;">🎉 Tudo pronto! Bora surfar!</p>';
            }
        }
function resetChecklist() {
            document.querySelectorAll('.pre-surf-check').forEach(c => c.checked = false);
            updateChecklistStatus();
        }
function setTimerPreset(preset) {
            const workInput = document.getElementById('timer-work');
            const restInput = document.getElementById('timer-rest');
            const roundsInput = document.getElementById('timer-rounds');
            if (preset === 'tabata') {
                workInput.value = 20;
                restInput.value = 10;
                roundsInput.value = 8;
            } else if (preset === 'emom') {
                workInput.value = 60;
                restInput.value = 0;
                roundsInput.value = 10;
            } else if (preset === 'hiit') {
                workInput.value = 40;
                restInput.value = 20;
                roundsInput.value = 10;
            } else if (preset === 'amrap') {
                workInput.value = 30;
                restInput.value = 15;
                roundsInput.value = 7;
            }
            resetTimer();
        }
function updateTimerDisplay() {
            const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
            const secs = (timerSeconds % 60).toString().padStart(2, '0');
            document.getElementById('timer-display').textContent = `${mins}:${secs}`;
            const phase = timerIsWork ? '🔥 TRABALHO' : '😤 DESCANSAR';
            document.getElementById('timer-phase').textContent = phase;
            document.getElementById('timer-phase').style.color = timerIsWork ? '#E74C3C' : '#3498DB';
            const totalTime = timerIsWork ? timerWorkTime : timerRestTime;
            const progress = ((totalTime - timerSeconds) / totalTime) * 100;
            document.getElementById('timer-progress').style.width = progress + '%';
            document.getElementById('timer-progress').style.background = timerIsWork ?
                'linear-gradient(90deg, #E74C3C, #F39C12)' : 'linear-gradient(90deg, #3498DB, #2ECC71)';
            document.getElementById('timer-round').textContent = timerCurrentRound;
            document.getElementById('timer-total-rounds').textContent = timerTotalRounds;
        }
function startTimer() {
            if (timerState === 'running') return;
            timerWorkTime = parseInt(document.getElementById('timer-work').value) || 20;
            timerRestTime = parseInt(document.getElementById('timer-rest').value) || 10;
            timerTotalRounds = parseInt(document.getElementById('timer-rounds').value) || 8;
            if (timerState === 'stopped') {
                timerSeconds = timerWorkTime;
                timerCurrentRound = 1;
                timerIsWork = true;
            }
            timerState = 'running';
            document.getElementById('timer-start-btn').disabled = true;
            document.getElementById('timer-start-btn').textContent = '⏳ Correndo...';
            document.getElementById('timer-pause-btn').disabled = false;
            timerInterval = setInterval(() => {
                timerSeconds--;
                if (timerSeconds <= 0) {
                    // Play beep sound (browser notification)
                    if ('speechSynthesis' in window) {
                        const msg = new SpeechSynthesisUtterance(timerIsWork ? 'Descanso' : 'Trabalho');
                        msg.rate = 2;
                        speechSynthesis.speak(msg);
                    }
                    if (timerIsWork) {
                        // Work phase ended, go to rest
                        if (timerRestTime > 0) {
                            timerSeconds = timerRestTime;
                            timerIsWork = false;
                        } else {
                            // No rest, go to next round
                            timerCurrentRound++;
                            if (timerCurrentRound > timerTotalRounds) {
                                completeWorkout();
                                return;
                            }
                            timerSeconds = timerWorkTime;
                            timerIsWork = true;
                        }
                    } else {
                        // Rest phase ended, go to work
                        timerCurrentRound++;
                        if (timerCurrentRound > timerTotalRounds) {
                            completeWorkout();
                            return;
                        }
                        timerSeconds = timerWorkTime;
                        timerIsWork = true;
                    }
                }
                updateTimerDisplay();
            }, 1000);
        }
function pauseTimer() {
            if (timerState !== 'running') return;
            clearInterval(timerInterval);
            timerState = 'paused';
            document.getElementById('timer-start-btn').disabled = false;
            document.getElementById('timer-start-btn').textContent = '▶ Continuar';
            document.getElementById('timer-pause-btn').disabled = true;
        }
function resetTimer() {
            clearInterval(timerInterval);
            timerState = 'stopped';
            timerSeconds = timerWorkTime;
            timerCurrentRound = 1;
            timerIsWork = true;
            document.getElementById('timer-display').textContent = '00:00';
            document.getElementById('timer-phase').textContent = 'Pronto';
            document.getElementById('timer-phase').style.color = 'var(--gray-600)';
            document.getElementById('timer-progress').style.width = '0%';
            document.getElementById('timer-round').textContent = '0';
            document.getElementById('timer-start-btn').disabled = false;
            document.getElementById('timer-start-btn').textContent = '▶ Iniciar';
            document.getElementById('timer-pause-btn').disabled = true;
        }
function completeWorkout() {
            clearInterval(timerInterval);
            timerState = 'stopped';
            // Save to history
            const workout = {
                date: new Date().toISOString(),
                rounds: timerTotalRounds,
                workTime: timerWorkTime,
                restTime: timerRestTime
            };
            timerWorkoutHistory.unshift(workout);
            if (timerWorkoutHistory.length > 10) timerWorkoutHistory.pop();
            localStorage.setItem('asf_timer_history', JSON.stringify(timerWorkoutHistory));
            document.getElementById('timer-phase').textContent = '🎉 TREINO COMPLETO!';
            document.getElementById('timer-phase').style.color = '#27AE60';
            document.getElementById('timer-display').textContent = '✓✓✓';
            document.getElementById('timer-start-btn').disabled = false;
            document.getElementById('timer-start-btn').textContent = '▶ Iniciar';
            document.getElementById('timer-pause-btn').disabled = true;
            // Add points for completing workout
            earnPoints('treino', 50);
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance('Parabéns! Treino completo!');
                msg.rate = 1.5;
                speechSynthesis.speak(msg);
            }
        }
function showTimerHistory() {
            const history = timerWorkoutHistory.slice(0, 5).map((w, i) => {
                const date = new Date(w.date);
                return `${i+1}. ${date.toLocaleDateString('pt-BR')} - ${w.rounds} rodadas (${w.workTime}s/${w.restTime}s)`;
            }).join('\n');
            alert('📊 Histórico de Treinos:\n\n' + (history || 'Nenhum treino registrado ainda!'));
        }
async function loadSurfBar() {
            const bar = document.getElementById('surfBar');
            try {
                const [weather, marine] = await Promise.all([fetchWeather('bertioga'), fetchMarine('bertioga')]);
                const w = weather?.current;
                const m = marine?.current;
                if (!w || !m) {
                    bar.innerHTML = '<div class="surf-bar-loading">🌊 Dados indisponíveis</div>';
                    return;
                }
                const rating = surfRating(m.wave_height);
                const condClass = m.wave_height >= 0.6 && m.wave_height < 2.0 ? 'condition-bom' : m.wave_height < 0.6 ? 'condition-moderado' : 'condition-ruim';
                const condText = m.wave_height >= 0.6 && m.wave_height < 2.0 ? 'Bom' : m.wave_height < 0.6 ? 'Calmo' : 'Pesado';
                bar.innerHTML = `
                    <div class="surf-bar-item">
                        <span class="surf-icon">📍</span>
                        <span class="surf-val">Bertioga</span>
                        <span class="surf-label">Praia</span>
                    </div>
                    <div class="surf-bar-divider"></div>
                    <div class="surf-bar-item">
                        <span class="surf-icon">🌊</span>
                        <span class="surf-val">${m.wave_height.toFixed(1)}m</span>
                        <span class="surf-label">Ondas</span>
                    </div>
                    <div class="surf-bar-item">
                        <span class="surf-icon">💨</span>
                        <span class="surf-val">${w.wind_speed_10m.toFixed(0)}km/h</span>
                        <span class="surf-label">${windDir(w.wind_direction_10m)}</span>
                    </div>
                    <div class="surf-bar-item">
                        <span class="surf-icon">🌡️</span>
                        <span class="surf-val">${w.temperature_2m.toFixed(0)}°C</span>
                        <span class="surf-label">Temp</span>
                    </div>
                    <div class="surf-bar-item">
                        <span class="surf-icon">${w.uv_index >= 8 ? '🔴' : w.uv_index >= 6 ? '🟠' : w.uv_index >= 3 ? '🟡' : '🟢'}</span>
                        <span class="surf-val">${w.uv_index.toFixed(0)}</span>
                        <span class="surf-label">UV ${w.uv_index >= 8 ? 'Ext' : w.uv_index >= 6 ? 'Alt' : w.uv_index >= 3 ? 'Mod' : 'Bai'}</span>
                    </div>
                    <div class="surf-bar-divider"></div>
                    <div class="surf-bar-item">
                        <span class="surf-icon">⏱️</span>
                        <span class="surf-val">${m.wave_period.toFixed(0)}s</span>
                        <span class="surf-label">Período</span>
                    </div>
                    <div class="surf-bar-item">
                        <span class="surf-condition-badge ${condClass}">${condText}</span>
                        <span class="surf-label">Condição</span>
                    </div>
                    <div class="surf-bar-item" style="cursor: pointer;" onclick="shareSurfConditions()" title="Compartilhar condições">
                        <span class="surf-icon">📤</span>
                        <span class="surf-val" style="font-size: 11px;">Share</span>
                        <span class="surf-label">Enviar</span>
                    </div>
                `;
            } catch (e) {
                bar.innerHTML = '<div class="surf-bar-loading">🌊 Erro ao carregar</div>';
            }
        }
async function loadBestDay() {
            try {
                const marine = await fetchMarine('bertioga');
                const weather = await fetchWeather('bertioga');
                if (!marine?.daily || !weather?.daily) return;
                const days = marine.daily;
                const wDays = weather.daily;
                const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const dayNamesFull = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
                let bestIdx = 0, bestScore = 0;
                const scores = [];
                for (let i = 0; i < days.time.length; i++) {
                    const wh = days.wave_height_max[i] || 0;
                    const wp = days.wave_period_max[i] || 0;
                    const wind = wDays.wind_speed_10m_max?.[i] || 20;
                    // Score: wave height (0-3m ideal) + period (longer better) - wind penalty
                    let score = 0;
                    if (wh >= 0.5 && wh <= 2.5) score += 40;
                    else if (wh > 2.5) score += 25;
                    else score += 10;
                    score += Math.min(wp * 3, 30); // period bonus
                    score += Math.max(0, 20 - wind); // low wind bonus
                    score += Math.random() * 10; // slight randomization
                    scores.push({ idx: i, score, wh, wp, wind, date: days.time[i] });
                    if (score > bestScore) { bestScore = score; bestIdx = i; }
                }
                const best = scores[bestIdx];
                const d = new Date(best.date + 'T12:00:00');
                const today = new Date(); today.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((d - today) / 86400000);
                let dayLabel;
                if (diffDays === 0) dayLabel = 'Hoje!';
                else if (diffDays === 1) dayLabel = 'Amanhã';
                else dayLabel = dayNamesFull[d.getDay()] + ' (' + d.getDate() + '/' + (d.getMonth() + 1) + ')';
                // Rating stars
                const stars = bestScore >= 70 ? '⭐⭐⭐' : bestScore >= 50 ? '⭐⭐' : '⭐';
                document.getElementById('best-day-text').textContent = dayLabel;
                document.getElementById('best-day-detail').textContent = `Ondas: ${best.wh.toFixed(1)}m • Período: ${best.wp.toFixed(0)}s • Vento: ${best.wind.toFixed(0)}km/h`;
                document.getElementById('best-day-rating').textContent = stars;
                document.getElementById('best-day-icon').textContent = diffDays === 0 ? '🏄‍♀️' : '📅';
                document.getElementById('best-day-widget').style.display = 'block';
                // Also render mini forecast
                const widget = document.getElementById('best-day-widget');
                const miniForecast = scores.slice(0, 5).map(s => {
                    const dd = new Date(s.date + 'T12:00:00');
                    const isToday = dd.toDateString() === new Date().toDateString();
                    const cls = s.idx === bestIdx ? 'font-weight:700;color:white;background:rgba(255,255,255,0.15);border-radius:8px;' : '';
                    return `<div style="text-align:center;font-size:11px;${cls}padding:4px 6px;min-width:45px;">
                        <div style="opacity:0.7;">${isToday ? 'Hoje' : dayNames[dd.getDay()]}</div>
                        <div style="font-weight:600;margin:2px 0;">${s.wh.toFixed(1)}m</div>
                        <div style="font-size:10px;opacity:0.7;">${s.wp.toFixed(0)}s</div>
                    </div>`;
                }).join('');
                widget.querySelector('div').innerHTML += `<div style="display:flex;gap:4px;margin-top:10px;overflow-x:auto;justify-content:center;">${miniForecast}</div>`;
            } catch (e) { console.error('Best day error:', e); }
        }
async function loadWeekStrip() {
            const inner = document.getElementById('week-strip-inner');
            if (!inner) return;
            try {
                const weather = await fetchWeather('bertioga');
                const marine = await fetchMarine('bertioga');
                if (!weather?.daily || !marine?.daily) { inner.innerHTML = ''; return; }
                const d = marine.daily;
                const w = weather.daily;
                const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                let html = '';
                for (let i = 0; i < Math.min(7, d.time.length); i++) {
                    const date = new Date(d.time[i] + 'T12:00:00');
                    const isToday = date.toDateString() === new Date().toDateString();
                    const wh = d.wave_height_max[i] || 0;
                    const wp = d.wave_period_max?.[i] || 0;
                    const rating = surfRating(wh);
                    let bg = 'var(--gray-200)';
                    if (wh >= 0.6 && wh < 2.0) bg = 'rgba(0,168,204,0.15)';
                    else if (wh >= 2.0) bg = 'rgba(255,107,107,0.15)';
                    else if (wh < 0.6 && wh > 0) bg = 'rgba(244,208,63,0.15)';
                    html += `<div style="text-align:center;padding:8px 6px;min-width:52px;border-radius:10px;background:${bg};${isToday ? 'border:2px solid var(--primary);' : ''}flex-shrink:0;">
                        <div style="font-size:10px;font-weight:${isToday ? '700' : '400'};color:var(--gray-600);">${isToday ? 'Hoje' : dayNames[date.getDay()]}</div>
                        <div style="font-size:15px;font-weight:700;margin:3px 0;color:var(--secondary);">${wh.toFixed(1)}m</div>
                        <div style="font-size:10px;color:var(--gray-400);">${wp.toFixed(0)}s</div>
                        <div style="font-size:12px;margin-top:2px;">${rating.text.split(' ')[0]}</div>
                    </div>`;
                }
                inner.innerHTML = html;
            } catch (e) { inner.innerHTML = ''; }
        }
function initDarkMode() {
            const saved = localStorage.getItem('asf-theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (saved === 'dark' || (!saved && prefersDark)) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('darkModeToggle').textContent = '☀️';
                document.querySelector('meta[name="theme-color"]').content = '#1A1D23';
            }
        }
function toggleDarkMode() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            // Add transition for smooth theme change
            document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('asf-theme', 'light');
                document.getElementById('darkModeToggle').textContent = '🌙';
                document.querySelector('meta[name="theme-color"]').content = '#00A8CC';
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('asf-theme', 'dark');
                document.getElementById('darkModeToggle').textContent = '☀️';
                document.querySelector('meta[name="theme-color"]').content = '#1A1D23';
            }
            setTimeout(() => document.documentElement.style.transition = '', 300);
        }
function cadastrarMana() {
            const nome = document.getElementById('cadastro-nome').value.trim();
            const nivel = document.getElementById('cadastro-nivel').value;
            const praia = document.getElementById('cadastro-praia').value;
            if (!nome) { showToast('Digite seu nome ou apelido!'); return; }
            if (!nivel) { showToast('Selecione seu nível de surf!'); return; }
            if (!praia) { showToast('Escolha sua praia!'); return; }
            const profile = { nome, nivel, praia, registered: Date.now() };
            localStorage.setItem('asf-profile', JSON.stringify(profile));
            document.getElementById('cadastro-form').style.display = 'none';
            document.getElementById('cadastro-done').style.display = 'block';
            const nivelLabel = { iniciante: '🌱 Iniciante', intermediario: '🏄 Intermediária', avancado: '🔥 Avançada' };
            document.getElementById('cadastro-welcome').textContent = `${nome} • ${nivelLabel[nivel]} • Praia de ${praia.charAt(0).toUpperCase() + praia.slice(1)}`;
            showToast('Cadastro feito! Bem-vinda! 🌊');
        }
function editCadastro() {
            const profile = JSON.parse(localStorage.getItem('asf-profile') || '{}');
            document.getElementById('cadastro-nome').value = profile.nome || '';
            document.getElementById('cadastro-nivel').value = profile.nivel || '';
            document.getElementById('cadastro-praia').value = profile.praia || '';
            document.getElementById('cadastro-form').style.display = '';
            document.getElementById('cadastro-done').style.display = 'none';
        }
function initCadastro() {
            const profile = JSON.parse(localStorage.getItem('asf-profile') || '{}');
            if (profile.nome) {
                document.getElementById('cadastro-form').style.display = 'none';
                document.getElementById('cadastro-done').style.display = 'block';
                const nivelLabel = { iniciante: '🌱 Iniciante', intermediario: '🏄 Intermediária', avancado: '🔥 Avançada' };
                document.getElementById('cadastro-welcome').textContent = `${profile.nome} • ${nivelLabel[profile.nivel] || profile.nivel} • Praia de ${(profile.praia || '').charAt(0).toUpperCase() + (profile.praia || '').slice(1)}`;
            }
        }
function shareSurfConditions() {
            const bar = document.getElementById('surfBar');
            const items = bar.querySelectorAll('.surf-bar-item');
            let data = {};
            items.forEach(item => {
                const label = item.querySelector('.surf-label')?.textContent || '';
                const val = item.querySelector('.surf-val')?.textContent || '';
                if (label === 'Praia') data.beach = val;
                if (label === 'Ondas') data.waves = val;
                if (label === 'Temp') data.temp = val;
                if (label === 'Período') data.period = val;
            });
            // Get condition from badge
            const badge = bar.querySelector('.surf-condition-badge');
            data.condition = badge ? badge.textContent : '';
            // Wind info
            const windItem = Array.from(items).find(i => {
                const l = i.querySelector('.surf-label');
                return l && l.textContent.includes('km/h') === false && ['N','NE','E','SE','S','SO','O','NO'].includes(l.textContent);
            });
            if (windItem) {
                data.windSpeed = windItem.querySelector('.surf-val')?.textContent || '';
                data.windDir = windItem.querySelector('.surf-label')?.textContent || '';
            }
            const msg = `🏄‍♀️ Condições ASF - ${data.beach || 'Bertioga'}\n\n🌊 Ondas: ${data.waves || '-'}\n💨 Vento: ${data.windSpeed || '-'} ${data.windDir || ''}\n🌡️ Temp: ${data.temp || '-'}\n⏱️ Período: ${data.period || '-'}\n📊 Condição: ${data.condition || '-'}\n\nBora surfar? 🤙`;
            // Try native share API first (mobile), fallback to WhatsApp
            if (navigator.share) {
                navigator.share({ title: 'Condições ASF', text: msg }).catch(() => {});
            } else {
                const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
            }
        }
function initMana() {
            const now = new Date();
            const weekNum = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (7 * 86400000));
            const mana = manasSemana[weekNum % manasSemana.length];
            document.getElementById('mana-name').textContent = mana.name;
            document.getElementById('mana-avatar').textContent = mana.avatar;
            document.getElementById('mana-info').textContent = mana.info;
            document.getElementById('mana-quote').textContent = mana.quote;
            document.getElementById('mana-stat1').textContent = mana.stat1;
            document.getElementById('mana-stat2').textContent = mana.stat2;
        }
function selectMood(btn, mood) {
            document.querySelectorAll('.session-mood-btn').forEach(b => {
                b.style.borderColor = 'var(--gray-200)';
                b.style.background = 'white';
            });
            btn.style.borderColor = 'var(--primary)';
            btn.style.background = 'rgba(0,168,204,0.08)';
            selectedMood = mood;
        }
function getSessions() {
            return JSON.parse(localStorage.getItem('asf-sessions') || '[]');
        }
function saveSessions(sessions) {
            localStorage.setItem('asf-sessions', JSON.stringify(sessions));
            // Also sync to surf-sessions for achievements
            localStorage.setItem('surf-sessions', JSON.stringify(sessions));
        }
function saveSession() {
            const beach = document.getElementById('session-beach').value;
            const duration = parseInt(document.getElementById('session-duration').value);
            const notes = document.getElementById('session-notes').value;
            if (!selectedMood) { showToast('Selecione como estava! 😊'); return; }
            const session = {
                id: Date.now(),
                date: new Date().toISOString(),
                beach,
                duration,
                mood: selectedMood,
                notes
            };
            const sessions = getSessions();
            sessions.unshift(session);
            saveSessions(sessions);
            // Reset form
            document.getElementById('session-notes').value = '';
            document.querySelectorAll('.session-mood-btn').forEach(b => {
                b.style.borderColor = 'var(--gray-200)';
                b.style.background = 'white';
            });
            selectedMood = '';
            renderSessions();
            showToast('Sessão registrada! 🏄‍♀️ +20 pts');
        }
function deleteSession(id) {
            const sessions = getSessions().filter(s => s.id !== id);
            saveSessions(sessions);
            renderSessions();
            showToast('Sessão removida');
        }
function renderSessions() {
            const sessions = getSessions();
            const list = document.getElementById('sessions-list');
            const count = document.getElementById('session-count');
            const stats = document.getElementById('session-stats');
            count.textContent = sessions.length + ' sessão' + (sessions.length !== 1 ? 'ões' : '');
            if (sessions.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: var(--gray-400); font-size: 13px; padding: 20px;">Nenhuma sessão registrada ainda. Bora surfar! 🏄‍♀️</p>';
                stats.style.display = 'none';
                return;
            }
            stats.style.display = 'block';
            // Render last 5 sessions
            list.innerHTML = sessions.slice(0, 5).map(s => {
                const d = new Date(s.date);
                const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                return `<div class="card" style="margin-bottom: 8px; padding: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span style="font-size: 24px;">${s.mood}</span>
                            <div>
                                <p style="font-size: 14px; font-weight: 600;">${s.beach}</p>
                                <p style="font-size: 12px; color: var(--gray-400);">${dateStr} • ${s.duration}min ${s.notes ? '• ' + s.notes : ''}</p>
                            </div>
                        </div>
                        <button onclick="deleteSession(${s.id})" style="background: none; border: none; font-size: 16px; cursor: pointer; opacity: 0.4;">✕</button>
                    </div>
                </div>`;
            }).join('');
            // Stats
            const totalMin = sessions.reduce((sum, s) => sum + s.duration, 0);
            const totalH = Math.floor(totalMin / 60);
            const extraMin = totalMin % 60;
            document.getElementById('stat-total').textContent = sessions.length;
            document.getElementById('stat-hours').textContent = totalH > 0 ? totalH + 'h' + (extraMin > 0 ? extraMin : '') : totalMin + 'min';
            // Avg and longest session
            const durations = sessions.map(s => s.duration);
            const avgMin = Math.round(totalMin / sessions.length);
            const longestMin = Math.max(...durations);
            // Fav beach
            const beachCount = {};
            sessions.forEach(s => { beachCount[s.beach] = (beachCount[s.beach] || 0) + 1; });
            const favBeach = Object.entries(beachCount).sort((a, b) => b[1] - a[1])[0];
            document.getElementById('stat-fav-beach').textContent = favBeach ? favBeach[0] : '-';
            // Fav mood
            const moodCount = {};
            sessions.forEach(s => { moodCount[s.mood] = (moodCount[s.mood] || 0) + 1; });
            const favMood = Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0];
            document.getElementById('stat-fav-mood').textContent = favMood ? favMood[0] : '-';
            document.getElementById('stat-longest').textContent = longestMin >= 60 ? Math.floor(longestMin / 60) + 'h' + (longestMin % 60 > 0 ? longestMin % 60 : '') : longestMin + 'min';
            document.getElementById('stat-avg').textContent = avgMin >= 60 ? Math.floor(avgMin / 60) + 'h' + (avgMin % 60 > 0 ? avgMin % 60 : '') : avgMin + 'min';
            // Streak
            let streak = 0;
            const today = new Date(); today.setHours(0, 0, 0, 0);
            for (let i = 0; i < 30; i++) {
                const checkDate = new Date(today); checkDate.setDate(checkDate.getDate() - i);
                const dateStr = checkDate.toISOString().split('T')[0];
                if (sessions.some(s => s.date.split('T')[0] === dateStr)) { streak++; } else { break; }
            }
            document.getElementById('stat-streak').textContent = streak;
            // Heatmap
            const heatmapEl = document.getElementById('session-heatmap');
            if (heatmapEl) {
                let heatHTML = '';
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(today); d.setDate(d.getDate() - i);
                    const ds = d.toISOString().split('T')[0];
                    const daySessions = sessions.filter(s => s.date.split('T')[0] === ds);
                    const count = daySessions.length;
                    let bg = 'var(--gray-200)';
                    let title = ds;
                    if (count === 1) { bg = 'rgba(0,168,204,0.35)'; title += ': 1 sessão'; }
                    else if (count === 2) { bg = 'rgba(0,168,204,0.6)'; title += ': 2 sessões'; }
                    else if (count >= 3) { bg = 'var(--primary)'; title += ': ' + count + ' sessões'; }
                    heatHTML += `<div title="${title}" style="width: 16px; height: 16px; border-radius: 3px; background: ${bg}; cursor: default;" ></div>`;
                }
                heatmapEl.innerHTML = heatHTML;
            }
        }
function updateBrandTimer() {
            // Countdown: 7 dias a partir de agora
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 7);
            
            function update() {
                const now = new Date();
                const diff = endDate - now;
                
                if (diff <= 0) {
                    document.getElementById('challenge-timer').textContent = 'Encerrado!';
                    return;
                }
                
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                document.getElementById('challenge-timer').textContent = `${days} dias ${hours}h`;
            }
            
            update();
            setInterval(update, 60000); // Atualiza a cada minuto
        }
function loadBadges() {
          const saved = localStorage.getItem('asf-badges');
          if (saved) {
            const earnedBadges = JSON.parse(saved);
            // Merge with current badge definitions
            BRAND_BADGES.forEach(badge => {
              const earned = earnedBadges.find(e => e.id === badge.id);
              if (earned) {
                badge.earned = true;
                badge.earnedAt = earned.earnedAt;
                badge.progress = earned.progress || badge.required;
              }
            });
          }
        }
function saveBadges() {
          const toSave = BRAND_BADGES.filter(b => b.earned);
          localStorage.setItem('asf-badges', JSON.stringify(toSave));
          updateBadgesUI();
        }
function updateBadgeProgress() {
          const sessions = JSON.parse(localStorage.getItem('surf-sessions') || '[]');
          let changed = false;
          BRAND_BADGES.forEach(badge => {
            if (!badge.earned && badge.type === 'usage') {
              // Count sessions with matching brand
              let count = 0;
              sessions.forEach(s => {
                if (s.boardBrand && s.boardBrand.toLowerCase().includes(badge.brand.toLowerCase().split(' ')[0])) {
                  count++;
                }
                // Also check equipment notes
                if (s.notes && s.notes.toLowerCase().includes(badge.brand.toLowerCase().split(' ')[0])) {
                  count++;
                }
              });
              badge.progress = Math.min(count, badge.required);
              if (count >= badge.required) {
                badge.earned = true;
                badge.earnedAt = new Date().toISOString().split('T')[0];
                changed = true;
                showBadgeEarnedAnimation(badge);
                sendNotification(`🎉 Novo badge: ${badge.name}!`);
              }
            }
          });
          if (changed) saveBadges();
          updateBadgesUI();
        }
function renderBadges() {
          const container = document.getElementById('badges-container');
          const noBadges = document.getElementById('no-badges');
          if (!container) return;
          const earnedBadges = BRAND_BADGES.filter(b => b.earned);
          const allBadges = BRAND_BADGES; // Show all (locked/unlocked)
          if (earnedBadges.length === 0) {
            noBadges.style.display = 'block';
            container.style.display = 'none';
          } else {
            noBadges.style.display = 'none';
            container.style.display = 'grid';
            container.innerHTML = allBadges.map(badge => {
              const isEarned = badge.earned;
              const opacity = isEarned ? '1' : '0.5';
              const filter = isEarned ? 'none' : 'grayscale(80%)';
              return `
                <div class="badge-card" data-badge-id="${badge.id}"
                     style="background: ${isEarned ? `linear-gradient(135deg, ${badge.brandColor}22, ${badge.brandColor}11)` : 'rgba(150,150,150,0.1)'};
                            border: 2px solid ${isEarned ? badge.brandColor : '#ccc'};
                            border-radius: 16px; padding: 16px; text-align: center;
                            opacity: ${opacity}; filter: ${filter};
                            transition: all 0.3s; cursor: pointer;"
                     onclick="showBadgeDetails('${badge.id}')">
                  <div style="font-size: 48px; margin-bottom: 8px;">${badge.icon}</div>
                  <h4 style="font-size: 13px; margin: 0 0 4px 0; color: ${isEarned ? badge.brandColor : '#666'};">${badge.brand}</h4>
                  <p style="font-size: 12px; font-weight: bold; margin: 0 0 8px 0; color: #333;">${badge.name}</p>
                  <div style="background: rgba(0,0,0,0.05); border-radius: 8px; padding: 8px; margin-bottom: 8px;">
                    <div style="font-size: 11px; color: #666; margin-bottom: 4px;">Progresso</div>
                    <div style="background: #ddd; height: 6px; border-radius: 3px; overflow: hidden;">
                      <div style="width: ${(badge.progress / (badge.required || 1)) * 100}%; height: 100%; background: ${badge.brandColor}; transition: width 0.5s;"></div>
                    </div>
                    <div style="font-size: 10px; margin-top: 4px;">${badge.progress}/${badge.required}</div>
                  </div>
                  ${isEarned ? '<span style="font-size: 11px; background: #FFD700; color: #0E2439; padding: 4px 12px; border-radius: 50px; font-weight: bold;">✅ Ganho!</span>' : '<span style="font-size: 11px; background: #ccc; color: #666; padding: 4px 12px; border-radius: 50px;">🔒 Bloqueado</span>'}
                </div>
              `;
            }).join('');
          }
        }
function showBadgeDetails(badgeId) {
          const badge = BRAND_BADGES.find(b => b.id === badgeId);
          if (!badge) return;
          const message = `
🏆 ${badge.name}
${badge.icon} ${badge.brand}
📝 ${badge.description}
📊 Progresso: ${badge.progress}/${badge.required}
${badge.earned ? '✅ Ganho em: ' + badge.earnedAt : '🔒 Continue evoluindo!'}
💡 Dica: ${badge.type === 'usage' ? 'Use produtos da marca em suas sessions' : 'Participe de campanhas ASF'}
          `;
          alert(message);
        }
function showBadgeEarnedAnimation(badge) {
          // Create floating badge element
          const badgeEl = document.createElement('div');
          badgeEl.innerHTML = `${badge.icon}`;
          badgeEl.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0);
            font-size: 120px; z-index: 10000;
            animation: badge-earn-pop 1.5s ease-out forwards;
            pointer-events: none;
          `;
          document.body.appendChild(badgeEl);
          // Add CSS animation
          if (!document.getElementById('badge-anim-style')) {
            const style = document.createElement('style');
            style.id = 'badge-anim-style';
            style.textContent = `
              @keyframes badge-earn-pop {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                40% { transform: translate(-50%, -50%) scale(0.9); }
                60% { transform: translate(-50%, -50%) scale(1.1); }
                80% { transform: translate(-50%, -50%) scale(1); }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
              }
            `;
            document.head.appendChild(style);
          }
          setTimeout(() => badgeEl.remove(), 1500);
        }
function initBadges() {
          loadBadges();
          updateBadgeProgress();
          renderBadges();
        }
function unlockPremium(id) {
            const preview = document.getElementById('premium-' + id + '-preview');
            const full = document.getElementById('premium-' + id + '-full');
            if (full.style.display === 'none') {
                full.style.display = 'block';
                preview.querySelector('button').textContent = '📖 Recolher';
                showToast('✨ Conteúdo liberado!');
            } else {
                full.style.display = 'none';
                preview.querySelector('button').textContent = '🔓 Ler Conteúdo Completo';
            }
        }
function updateChecklistStatus() {
            const checks = document.querySelectorAll('.pre-surf-check');
            const checked = document.querySelectorAll('.pre-surf-check:checked').length;
            const total = checks.length;
            const el = document.getElementById('checklist-status');
            if (checked === total) {
                el.innerHTML = '<span style="color: var(--success, #27ae60); font-weight: 600;">🏄‍♀️ Tudo pronto! Bora surfar!</span>';
                el.style.background = 'rgba(39, 174, 96, 0.08)';
                el.style.borderRadius = '8px';
                el.style.padding = '8px';
            } else {
                el.textContent = `${checked}/${total} itens marcados`;
                el.style.background = 'none';
                el.style.padding = '0';
            }
        }
function initChecklist() {
            const saved = localStorage.getItem('asf-checklist');
            if (saved) {
                const states = JSON.parse(saved);
                document.querySelectorAll('.pre-surf-check').forEach((c, i) => {
                    if (states[i]) c.checked = true;
                });
            }
            document.querySelectorAll('.pre-surf-check').forEach(c => {
                c.addEventListener('change', () => {
                    const states = [];
                    document.querySelectorAll('.pre-surf-check').forEach(cb => states.push(cb.checked));
                    localStorage.setItem('asf-checklist', JSON.stringify(states));
                    updateChecklistStatus();
                });
            });
            updateChecklistStatus();
        }
function showDica(index) {
            const d = dicas[index];
            const container = document.getElementById('dica-do-dia');
            // Fade out
            container.style.opacity = '0';
            container.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.getElementById('dica-text').textContent = d.text;
                document.getElementById('dica-category').textContent = d.category;
                document.getElementById('dica-emoji').textContent = d.emoji;
                // Fade in
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 200);
        }
function nextDica() {
            let idx = Math.floor(Math.random() * dicas.length);
            // Avoid repeat
            const current = document.getElementById('dica-text').textContent;
            while (dicas[idx].text === current && dicas.length > 1) idx = Math.floor(Math.random() * dicas.length);
            showDica(idx);
        }
function initDica() {
            const now = new Date();
            const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
            showDica(dayOfYear % dicas.length);
        }
function filterBeaches(region) {
            if (!beachCards) beachCards = document.querySelectorAll('.beach-card');
            const showAll = region === 'all';
            beachCards.forEach(card => {
                card.style.display = (showAll || card.dataset.region === region) ? '' : 'none';
            });
            // Update filter buttons
            document.querySelectorAll('[id^="beach-filter-"]').forEach(btn => {
                btn.className = 'btn btn-secondary';
            });
            const activeBtn = document.getElementById('beach-filter-' + region);
            if (activeBtn) activeBtn.className = 'btn btn-primary';
        }
function toggleLike(btn) {
            let count = parseInt(btn.dataset.count || '0');
            const liked = btn.dataset.liked === 'true';
            if (liked) {
                count--;
                btn.dataset.liked = 'false';
                btn.querySelector('span').textContent = '🤍';
            } else {
                count++;
                btn.dataset.liked = 'true';
                btn.querySelector('span').textContent = '❤️';
                btn.style.transform = 'scale(1.2)';
                setTimeout(() => btn.style.transform = '', 200);
            }
            btn.dataset.count = count;
            btn.lastChild.textContent = ' ' + count;
        }
function sharePost(text) {
            const msg = `🏄‍♀️ ASF - Associação de Surf Feminino\n\n"${text}"\n\n🔗 https://acarolmourad-commits.github.io/asf-app/`;
            if (navigator.share) {
                navigator.share({ title: 'ASF', text: msg }).catch(() => {});
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(msg).then(() => showToast('📋 Copiado para compartilhar!'));
            }
        }
function renderUserPosts() {
            const container = document.getElementById('user-posts');
            const posts = JSON.parse(localStorage.getItem('asf-user-posts') || '[]');
            if (!posts.length) { container.innerHTML = ''; return; }
            container.innerHTML = posts.map((p, i) => {
                const ago = getTimeAgo(p.time);
                return `<div class="post">
                    <div class="post-header">
                        <div class="post-avatar">C</div>
                        <div class="post-info"><h4>Carol</h4><span class="time">${ago}</span></div>
                    </div>
                    <div class="post-content">${p.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                    <div class="post-actions">
                        <button class="post-action" onclick="toggleLike(this)" data-count="${p.likes || 0}"><span>🤍</span> ${p.likes || 0}</button>
                        <button class="post-action" onclick="deleteUserPost(${i})" style="font-size:11px;opacity:0.5;">🗑️</button>
                    </div>
                </div>`;
            }).join('');
        }
function deleteUserPost(idx) {
            const posts = JSON.parse(localStorage.getItem('asf-user-posts') || '[]');
            posts.splice(idx, 1);
            localStorage.setItem('asf-user-posts', JSON.stringify(posts));
            renderUserPosts();
        }
function getTimeAgo(ts) {
            const diff = Date.now() - ts;
            if (diff < 60000) return 'agora';
            if (diff < 3600000) return Math.floor(diff / 60000) + ' min atrás';
            if (diff < 86400000) return Math.floor(diff / 3600000) + 'h atrás';
            return Math.floor(diff / 86400000) + 'd atrás';
        }
function getWaterKey() { return 'asf-water-' + new Date().toISOString().split('T')[0]; }
function addWater(delta) {
            const key = getWaterKey();
            let count = parseInt(localStorage.getItem(key) || '0');
            count = Math.max(0, Math.min(12, count + delta));
            localStorage.setItem(key, count);
            updateWaterDisplay(count);
            if (count === 8) showToast('💧 Meta atingida! Hidratada! 🎉');
        }
function updateWaterDisplay(count) {
            document.getElementById('water-count').textContent = count;
            document.getElementById('water-bar').style.width = Math.min(100, (count / 8) * 100) + '%';
            if (count >= 8) {
                document.getElementById('water-bar').style.background = 'var(--success)';
                document.getElementById('water-label').textContent = '✅ Meta atingida!';
            } else {
                document.getElementById('water-bar').style.background = 'var(--primary)';
                document.getElementById('water-label').textContent = 'de 8 copos';
            }
        }
function votePoll(btn, pollId, option) {
            const key = 'asf-poll-' + pollId;
            if (localStorage.getItem(key)) { showToast('Você já votou! 🗳️'); return; }
            localStorage.setItem(key, option);
            // Mark this button
            btn.style.background = '#27AE60';
            btn.style.color = 'white';
            // Disable all siblings
            btn.parentElement.querySelectorAll('button').forEach(b => b.style.pointerEvents = 'none');
            showToast('Voto registrado! 🗳️ +5 pts');
            earnPoints('dica', 5);
        }
function joinGroup(btn, groupName) {
            const key = 'asf-joined-' + groupName.replace(/\s+/g, '-');
            if (localStorage.getItem(key)) {
                showToast('✅ Você já está neste grupo!');
                return;
            }
            localStorage.setItem(key, 'true');
            btn.textContent = '✅ Inscrita!';
            btn.style.background = 'var(--success)';
            btn.style.pointerEvents = 'none';
            showToast('🏄‍♀️ ' + groupName + ': contato salvo! Entraremos em contato.');
            earnPoints('dica', 10);
        }
function showToast(msg, duration = 2500) {
            let t = document.querySelector('.toast');
            if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
            t.textContent = msg;
            t.classList.add('show');
            setTimeout(() => t.classList.remove('show'), duration);
        }
function showSecretAchievements() {
            const sessions = (JSON.parse(localStorage.getItem('surf-sessions') || '[]')).length;
            const quizzes = (JSON.parse(localStorage.getItem('quizzes-done') || '[]')).length;
            const opens = parseInt(localStorage.getItem('asf-opens') || '0');
            const modal = document.createElement('div');
            modal.id = 'secret-modal';
            modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:9999;padding:20px;overflow-y:auto;';
            modal.innerHTML = `
                <div style="background:linear-gradient(135deg,#2c0a37,#4a1c5e);border-radius:20px;padding:24px;max-width:400px;margin:40px auto;color:white;text-align:center;">
                    <div style="font-size:32px;margin-bottom:12px;">🔓 Conquistas Secretas</div>
                    <p style="font-size:14px;opacity:0.9;margin-bottom:20px;">Complete missões para desbloquear!</p>
                    <div style="display:grid;gap:12px;margin-bottom:20px;">
                        <div style="background:rgba(255,255,255,0.15);padding:16px;border-radius:12px;text-align:center;">
                            <div style="font-size:36px;margin-bottom:8px;">🏄</div>
                            <div style="font-size:16px;font-weight:bold;">1 Session</div>
                            <div style="font-size:13px;opacity:0.8;margin:8px 0;">Progresso: ${sessions}/1</div>
                            <div style="font-size:12px;${sessions>=1?'color:#4ade80':'opacity:0.6'}">${sessions>=1?'✅ CONQUISTADO!':'⏳ Em progresso'}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.15);padding:16px;border-radius:12px;text-align:center;">
                            <div style="font-size:36px;margin-bottom:8px;">📝</div>
                            <div style="font-size:16px;font-weight:bold;">5 Quizzes</div>
                            <div style="font-size:13px;opacity:0.8;margin:8px 0;">Progresso: ${quizzes}/5</div>
                            <div style="font-size:12px;${quizzes>=5?'color:#4ade80':'opacity:0.6'}">${quizzes>=5?'✅ CONQUISTADO!':'⏳ Em progresso'}</div>
                        </div>
                        <div style="background:rgba(255,255,255,0.15);padding:16px;border-radius:12px;text-align:center;">
                            <div style="font-size:36px;margin-bottom:8px;">🔥</div>
                            <div style="font-size:16px;font-weight:bold;">3 Dias</div>
                            <div style="font-size:13px;opacity:0.8;margin:8px 0;">Progresso: ${opens}/3</div>
                            <div style="font-size:12px;${opens>=3?'color:#4ade80':'opacity:0.6'}">${opens>=3?'✅ CONQUISTADO!':'⏳ Em progresso'}</div>
                        </div>
                    </div>
                    <button onclick="document.getElementById('secret-modal').remove()" style="background:white;color:#2c0a37;border:none;padding:12px 32px;border-radius:25px;font-size:14px;font-weight:bold;cursor:pointer;">Fechar</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
function updateConnectionStatus() {
            let banner = document.getElementById('offline-banner');
            if (!navigator.onLine) {
                if (!banner) {
                    banner = document.createElement('div');
                    banner.id = 'offline-banner';
                    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;background:#e74c3c;color:white;text-align:center;padding:8px;font-size:13px;font-weight:600;z-index:10000;font-family:Outfit,sans-serif;';
                    banner.textContent = '📡 Sem conexão - modo offline';
                    document.body.appendChild(banner);
                }
            } else {
                if (banner) {
                    banner.remove();
                    showToast('✅ Conectado!');
                }
            }
        }
function renderAffiliateStore() {
  const container = document.getElementById('affiliate-store');
  if (!container) return;
  container.innerHTML = AFFILIATE_PRODUCTS.map(product => `
    <div class="card" style="background: white; border-left: 4px solid ${product.brandColor}; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;"
         onclick="openAffiliateLink('${product.url}', '${product.id}')"
         onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.12)'"
         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='var(--shadow-sm)'">
      <div style="position: relative;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover;">
        <span style="position: absolute; top: 8px; right: 8px; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; box-shadow: 0 2px 8px rgba(255,215,0,0.4);">
          ${product.badge}
        </span>
      </div>
      <div style="padding: 14px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; color: ${product.brandColor}; font-weight: 600;">${product.brand}</h4>
        <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.4; color: var(--secondary); min-height: 40px;">${product.name}</p>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="font-size: 20px; font-weight: bold; color: #27ae60;">${product.price}</span>
          <span style="font-size: 12px; text-decoration: line-through; color: #999;">${product.oldPrice}</span>
        </div>
        <button class="btn btn-primary" style="width: 100%; padding: 11px; font-size: 13px;">🛒 Ver oferta</button>
      </div>
    </div>
  `).join('');
  console.log('Loja renderizada');
}
function openAffiliateLink(url, productId) {
  const clicks = JSON.parse(localStorage.getItem('asf-affiliate-clicks') || '[]');
  clicks.push({productId, timestamp: new Date().toISOString()});
  localStorage.setItem('asf-affiliate-clicks', JSON.stringify(clicks));
  console.log('Click afiliado:', productId);
  window.open(url, '_blank', 'noopener,noreferrer');
  // GA4 tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', 'affiliate_click', {
      event_category: 'monetization',
      event_label: productId,
      value: 1
    });
  }
}
// Newsletter
function subscribeNewsletter(){const e=document.getElementById('newsletter-email'),t=e?e.value.trim():'';if(!t||!t.includes('@'))return showToast('❌ Email inválido!','error');const o=JSON.parse(localStorage.getItem('asf-newsletter')||'[]');o.push({email:t,date:new Date().toISOString()}),localStorage.setItem('asf-newsletter',JSON.stringify(o)),showToast('✅ Inscrita! Você receberá dicas toda semana.','success'),e&&(e.value=''),typeof gtag!=='undefined'&&gtag('event','newsletter_signup',{event_category:'engagement',value:1})}
function showPremiumModal(){document.getElementById('premium-modal').style.display='flex',trackEvent('premium','modal_view'),typeof gtag!=='undefined'&&gtag('event','premium_modal_view',{event_category:'monetization',value:1})}
function hidePremiumModal(){document.getElementById('premium-modal').style.display='none'}
function startPayment(){trackEvent('premium','payment_start'),showToast('🚀 Redirecionando para Mercado Pago...','info'),typeof gtag!=='undefined'&&gtag('event','payment_start',{event_category:'monetization',event_label:'premium_subscription',value:19.9}),setTimeout(()=>{showToast('💳 Integração com Mercado Pago em breve!','info')},1500)}
function contactWhatsApp(){trackEvent('contact','whatsapp_click'),window.open('https://wa.me/5511954346288','_blank')}
function trackEvent(e,t,o){const n=JSON.parse(localStorage.getItem('asf-monetization-stats')||'{}');n.events||(n.events=[]),n.events.push({category:e,action:t,label:o,timestamp:Date.now()}),localStorage.setItem('asf-monetization-stats',JSON.stringify(n)),console.log('📊 Track:',e,t,o)}
function getStats(){return JSON.parse(localStorage.getItem('asf-monetization-stats')||'{}')}
function getCookieConsent(){return localStorage.getItem('asf-cookie-consent')}
function acceptAllCookies(){localStorage.setItem('asf-cookie-consent','all');const b=document.getElementById('cookie-consent-banner');if(b){b.style.animation='slideDown 0.3s ease-out forwards';setTimeout(()=>b.remove(),300)}trackEvent('legal','cookie_consent','all');console.log('🍪 Cookie: all')}
function essentialCookies(){localStorage.setItem('asf-cookie-consent','essential');const b=document.getElementById('cookie-consent-banner');if(b){b.style.animation='slideDown 0.3s ease-out forwards';setTimeout(()=>b.remove(),300)}trackEvent('legal','cookie_consent','essential');console.log('🍪 Cookie: essential')}
function showPixDonation(){const m=document.getElementById('pix-modal');if(m)m.style.display='flex';trackEvent('donation','pix_modal_view')}
function showReferralModal(){const m=document.getElementById('referral-modal');if(m){m.style.display='flex';const codeDisplay=document.getElementById('referral-code-display');if(codeDisplay){const userCode=localStorage.getItem('asf-my-referral-code');if(userCode){codeDisplay.textContent=userCode}else{const newCode=generateReferralCode();localStorage.setItem('asf-my-referral-code',newCode);codeDisplay.textContent=newCode}}trackEvent('referral','modal_view')}}
function hideReferralModal(){const m=document.getElementById('referral-modal');if(m)m.style.display='none'}
function copyReferralCode(){const code=localStorage.getItem('asf-my-referral-code')||generateReferralCode();navigator.clipboard.writeText(code).then(()=>showToast('✅ Código copiado!','success')).catch(()=>showToast('❌ Erro ao copiar','error'));trackEvent('referral','code_copy')}
function shareReferral(platform){const code=localStorage.getItem('asf-my-referral-code')||generateReferralCode();const url=`https://acarolmourad-commits.github.io/asf-app/?ref=${code}`;let shareUrl='';switch(platform){case'whatsapp':shareUrl=`https://wa.me/?text=Olá! Quero te convidar para o app ASF - Dicas de surf gratuitas! Baixe aqui: ${url}`;break;case'copy':shareUrl=url;break}shareUrl&&window.open(shareUrl,'_blank');trackEvent('referral','share',platform)}
function hidePixDonation(){const m=document.getElementById('pix-modal');if(m)m.style.display='none'}
function copyPixKey(){
  const pix = 'asf@asf-surf.org';
  navigator.clipboard.writeText(pix).then(()=>{
    showToast('✅ Chave Pix copiada!', 'success');
  }).catch(()=>{
    showToast('❌ Erro ao copiar', 'error');
  });
  trackEvent('donation','pix_copy');
}
function getUserId(){try{let uid=localStorage.getItem('asf-user-id');if(!uid){uid='user_'+Math.random().toString(36).substring(7);localStorage.setItem('asf-user-id',uid)}return uid}catch(e){return 'user_anon'}}
function generateReferralCode(){const userId=getUserId();const code=btoa(`${userId}:${Date.now()}`).substring(0,8);localStorage.setItem(`asf-referral-${code}`,userId);return code}
function trackReferral(code,targetEmail){const referrerId=localStorage.getItem(`asf-referral-${code}`);if(referrerId){const r=JSON.parse(localStorage.getItem('asf-referrals')||'[]');r.push({code,targetEmail,timestamp:Date.now(),rewardGranted:false});localStorage.setItem('asf-referrals',JSON.stringify(r));trackEvent('referral','code_used',code);console.log('📨 Referral tracked:',code)}}
function buyEbook(){const isPremium=localStorage.getItem('asf-premium-status')==='active';const price=isPremium?(29.90*0.7):29.90;trackEvent('ebook','purchase_click',{price,premium_user:isPremium});showToast('🚀 Redirecionando para pagamento...','info');setTimeout(()=>{showToast('📦 Ebook disponível em breve!','info')},1500)}
function submitUGC(){const fileInput=document.getElementById('ugc-photo');if(!fileInput||!fileInput.files[0])return showToast('📷 Selecione uma foto primeiro','error');showToast('✅ Foto enviada! Em análise.','success');trackEvent('ugc','photo_submitted');fileInput.value=''}

// ─── Metas de Surf ────────────────────────────────────
function addMeta() {
    const input = document.getElementById('meta-input');
    const text = (input.value || '').trim();
    if (!text) { showToast('⚠️ Escreva sua meta primeiro!', 'error'); return; }
    const metas = JSON.parse(localStorage.getItem('asf-metas') || '[]');
    metas.push({ text, done: false, createdAt: Date.now() });
    localStorage.setItem('asf-metas', JSON.stringify(metas));
    input.value = '';
    renderMetas();
    showToast('🎯 Meta adicionada!', 'success');
}

function toggleMeta(index) {
    const metas = JSON.parse(localStorage.getItem('asf-metas') || '[]');
    metas[index].done = !metas[index].done;
    localStorage.setItem('asf-metas', JSON.stringify(metas));
    renderMetas();
    if (metas[index].done) showToast('✅ Meta concluída!', 'success');
}

function deleteMeta(index) {
    const metas = JSON.parse(localStorage.getItem('asf-metas') || '[]');
    metas.splice(index, 1);
    localStorage.setItem('asf-metas', JSON.stringify(metas));
    renderMetas();
}

function renderMetas() {
    const metas = JSON.parse(localStorage.getItem('asf-metas') || '[]');
    const active = metas.filter(m => !m.done);
    const done   = metas.filter(m => m.done);
    const listEl  = document.getElementById('metas-list');
    const doneEl  = document.getElementById('metas-concluidas-list');

    if (!listEl || !doneEl) return;

    if (active.length === 0) {
        listEl.innerHTML = '<div class="card" style="text-align:center;padding:16px;color:var(--gray-500);font-size:13px;">🎯 Nenhuma meta ativa ainda. Adicione uma acima!</div>';
    } else {
        listEl.innerHTML = active.map((m, i) => {
            const orig = metas.indexOf(m);
            return `<div class="card" style="display:flex;align-items:center;gap:12px;padding:12px;margin-bottom:8px;border-radius:12px;border-left:4px solid var(--primary);">
                <button onclick="toggleMeta(${orig})" style="background:none;border:none;font-size:20px;cursor:pointer;flex-shrink:0;">⬜</button>
                <span style="flex:1;font-size:14px;">${m.text}</span>
                <button onclick="deleteMeta(${orig})" style="background:none;border:none;color:var(--danger);cursor:pointer;font-size:16px;">✕</button>
            </div>`;
        }).join('');
    }

    if (done.length > 0) {
        doneEl.innerHTML = '<h4 style="font-size:14px;color:var(--gray-600);margin:16px 0 8px;">🏆 Concluídas</h4>' +
            done.map((m, i) => {
                const orig = metas.indexOf(m);
                return `<div class="card" style="display:flex;align-items:center;gap:12px;padding:10px;margin-bottom:6px;border-radius:12px;background:var(--light);opacity:0.7;">
                <span style="font-size:18px;">✅</span>
                <span style="flex:1;font-size:13px;text-decoration:line-through;color:var(--gray-500);">${m.text}</span>
                <button onclick="deleteMeta(${orig})" style="background:none;border:none;color:var(--gray-400);cursor:pointer;font-size:14px;">✕</button>
            </div>`;
            }).join('');
    } else {
        doneEl.innerHTML = '';
    }
}

// Auto-render no init
(function(){
    if (typeof window.METAS_INIT !== 'undefined') return;
    window.METAS_INIT = true;
    document.addEventListener('DOMContentLoaded', renderMetas);
    renderMetas();
})();

function initGoogleAnalytics(){console.log('📊 Analytics enabled')}
// Auto-render achievements init
(function(){
    if (typeof window.ACHIEVEMENTS_INIT !== "undefined") return;
    window.ACHIEVEMENTS_INIT = true;
    document.addEventListener("DOMContentLoaded", renderAchievements);
    renderAchievements();
})();
function getConsent() { return localStorage.getItem(COOKIE_CONSENT); }
function setConsent(level) {
      localStorage.setItem(COOKIE_CONSENT, level);
      if (banner) banner.remove();
      trackEvent('legal', 'cookie_consent', level);
      console.log('🍪 Cookie consent:', level);
    }
function walkTree(el) {
        if (el.nodeType === 3 && el.textContent.trim().length > 2 && !el.parentElement.classList.contains('icon')) {
            var txt = el.textContent;
            for (var key in terms) {
                if (txt.indexOf(key) >= 0) el.textContent = txt.replace(key, terms[key]);
            }
        } else if (el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {
            Array.from(el.childNodes).forEach(walkTree);
        }
    }
