function unlockConquista(type, btn) {
    const statusEl = document.getElementById('status-' + type);
    if (statusEl) {
        statusEl.style.display = 'block';
        btn.textContent = 'Conquistado!';
        btn.disabled = true;
        btn.style.background = 'var(--success)';
        
        let count = parseInt(localStorage.getItem('conquistas-count') || '0');
        count++;
        localStorage.setItem('conquistas-count', count);
        
        const countEl = document.getElementById('conquista-count');
        const barEl = document.getElementById('conquista-bar');
        if (countEl) countEl.textContent = count + '/4';
        if (barEl) barEl.style.width = (count * 25) + '%';
        
        showToast('🏆 Conquista desbloqueada!', 'success');
    }
}

        try {
          const so=document.getElementById('stat-opens'); if(so) so.textContent = localStorage.getItem('asf-opens') || '1';
          const ss=document.getElementById("stat-sessions"); if(ss) ss.textContent = (JSON.parse(localStorage.getItem("surf-sessions") || '[]')).length;
        } catch(e) {}


        const NOTIF_KEY = 'asf_notifications';

        const DEFAULT_NOTIFICATIONS = [
            { id: 1, type: 'treino', icon: '💪', title: 'Novo Treino!', text: 'Treino de Força e Core disponível', time: 'Agora', read: false, target: 'treino-1', section: 'saude' },
            { id: 3, type: 'pontos', icon: '🎯', title: 'Quiz Disponível', text: 'Responda e ganhe +50 pontos!', time: '10 min', read: false, target: 'quiz-basico', section: 'progresso' },
            { id: 4, type: 'dica', icon: '📚', title: 'Dica do Dia', text: 'Respiração 4-4-4 para acalmar', time: '1h', read: true, target: 'tip-of-day', section: 'dicas' },
            { id: 5, type: 'manas', icon: '💬', title: 'Novo Grupo', text: 'Bertioga Surf Girls: novo grupo na comunidade!', time: '2h', read: true, target: 'grupos-ativos', section: 'manas' },
            { id: 6, type: 'dica', icon: '💧', title: 'Dica do Dia', text: 'Hidratação é chave – beba água antes de surfar.', time: '1h', read: false, target: 'tip-of-day', section: 'dicas' },
        ];

        

        

        

        

        

        

        

        

        document.addEventListener('click', function(e) {
            const panel = document.getElementById('notifications-panel');
            const bell = e.target.closest('button[onclick="toggleNotifications()"]');
            if (!panel.contains(e.target) && !bell) {
                panel.style.display = 'none';
            }
        });

        

        

        

        updateNotificationBadge();


        const APP_URL = 'https://acarolmourad-commits.github.io/asf-app/';
        const SHARE_TEXT = '🏄‍♀️ Conheça o App ASF - Dicas de surf, treinos, previsão de ondas e muito mais para mulheres surfistas! 🌊';

        

        

        

        const searchIndex = [
            { title: 'Respiração Consciente', icon: '🌬️', section: 'Mental', sectionId: 'mental', text: 'Respiração com som suave no fundo da garganta. Acalma ondas internas e externas durante o surf.' },
            { title: 'Óleos Essenciais', icon: '🌿', section: 'Saúde', sectionId: 'saude', text: 'Lavanda no pulso relaxa, hortelã refresca. Misture com óleo de coco para recuperação muscular pós-surf.' },
            { title: 'Yoga na Praia', icon: '🧘', section: 'Mobilidade', sectionId: 'mobilidade', text: 'Alongamento na areia antes do surf aumenta flexibilidade. 10 min de soltura nos ombros e quadril.' },
            { title: 'Gratidão no Surf', icon: '🙏', section: 'Mental', sectionId: 'mental', text: 'Antes de entrar, agradeça ao mar. A gratidão conecta e atrai boas ondas. Espalhe vibração positiva!' },
            { title: 'Biofeedback HRV', icon: '❤️', section: 'Biofeedback', sectionId: 'saude', text: 'Monitore variabilidade cardíaca para medir prontidão física e mental para o surf.' },
            { title: 'Navegação Correntes', icon: '🌊', section: 'Navegação', sectionId: 'dicas', text: 'Use linhas de espuma como guia para cruzar canais de maré com segurança.' },
            { title: 'Regeneração Contraste', icon: '❄️🔥', section: 'Regeneração', sectionId: 'saude', text: 'Banho frio/quente alternado acelera recuperação muscular em 40%.' },
            { title: 'Periodização Treino', icon: '📈', section: 'Metodologia', sectionId: 'treino', text: 'Alterne volume e intensidade no treino para evitar platô e lesões.' },
            { title: 'Mindset Crescimento', icon: '💡', section: 'Mindset', sectionId: 'mental', text: 'Cada wipeout é dado, não falha - analise e evolua consistentemente.' },
            { title: 'Recuperação Ativa', icon: '♨️', section: 'Saúde', sectionId: 'saude', text: 'Banho alternando quente/frio após sessão pesada. Melhora circulação e reduz inflamação muscular.' },
        ];
        const normalizedSearchIndex = searchIndex.map(item => ({
            ...item,
            _titleNorm: item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            _textNorm: item.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
            _sectionNorm: item.section.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        }));

        let _searchTimer;
        

        

        
        
        
        

        

        

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.search-container')) {
                document.getElementById('searchResults').classList.remove('active');
            }
        });

        const beaches = {
            bertioga: { name: 'Bertioga', lat: -23.85, lon: -46.14 },
            santos:   { name: 'Santos',   lat: -23.96, lon: -46.33 },
            guaruja:  { name: 'Guarujá',  lat: -23.99, lon: -46.25 },
            ubatuba:  { name: 'Ubatuba',  lat: -23.43, lon: -45.08 },
            ilhabela: { name: 'Ilhabela', lat: -23.78, lon: -45.36 },
            maresias: { name: 'Maresias', lat: -23.79, lon: -45.36 },
            baleia: { name: 'Praia da Baleia', lat: -23.82, lon: -45.45 },
            'sao-sebastiao': { name: 'São Sebastião', lat: -23.80, lon: -45.44 },
            itamambuca: { name: 'Itamambuca', lat: -23.45, lon: -45.05 },
            cambraia: { name: 'Cambraia', lat: -23.77, lon: -45.50 }
        };
        let currentBeach = 'bertioga';
        let cachedWeather = {};
        let cachedMarine = {};

        const weatherDescriptions = {
            0: '☀️ Céu limpo', 1: '🌤️ Pouco nublado', 2: '⛅ Parcialmente nublado', 3: '☁️ Nublado',
            45: '🌫️ Névoa', 48: '🌫️ Névoa gelada',
            51: '🌧️ Chuvisco leve', 53: '🌧️ Chuvisco', 55: '🌧️ Chuvisco forte',
            61: '🌧️ Chuva leve', 63: '🌧️ Chuva', 65: '🌧️ Chuva forte',
            71: '🌨️ Neve leve', 73: '🌨️ Neve', 75: '🌨️ Neve forte',
            80: '🌧️ Pancadas leves', 81: '🌧️ Pancadas', 82: '🌧️ Pancadas fortes',
            95: '⛈️ Tempestade', 96: '⛈️ Tempestade com granizo', 99: '⛈️ Tempestade forte'
        };

        const windDir = (deg) => {
            const dirs = ['N','NE','L','SE','S','SO','O','NO'];
            return dirs[Math.round(deg / 45) % 8];
        };

        const surfRating = (waveHeight) => {
            if (waveHeight < 0.3) return { text: 'Sem ondas', color: 'var(--gray-400)' };
            if (waveHeight < 0.6) return { text: '🟢 Iniciante', color: 'var(--success)' };
            if (waveHeight < 1.0) return { text: '🟡 Todos os níveis', color: 'var(--accent)' };
            if (waveHeight < 1.5) return { text: '🟠 Intermediário', color: '#FF8C00' };
            if (waveHeight < 2.0) return { text: '🔴 Avançado', color: 'var(--coral)' };
            return { text: '🔴 Expert only', color: 'var(--coral)' };
        };

        async 

        async 

        

        async 

        

        

        

        

        

        

        

        

        

        

        (function() {
            const init = () => {
                loadLiveData('bertioga');
                updateMoonPhase();
            };
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(init);
            } else {
                setTimeout(init, 0);
            }
        })();

        let timerInterval = null;
        let timerState = 'stopped'; // stopped, running, paused
        let timerSeconds = 0;
        let timerCurrentRound = 1;
        let timerTotalRounds = 8;
        let timerWorkTime = 20;
        let timerRestTime = 10;
        let timerIsWork = true;
        let timerWorkoutHistory = JSON.parse(localStorage.getItem('asf_timer_history') || '[]');

        

        

        

        

        

        

        

        async 
        loadSurfBar();

        async 
        loadBestDay();

        async 
        loadWeekStrip();

        
        
        initDarkMode();

        const scrollBar = document.getElementById('scrollProgress');
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollBar.style.width = progress + '%';
            if (scrollTop < 10) scrollBar.classList.add('hidden');
            else scrollBar.classList.remove('hidden');
        }, { passive: true });

        
        
        
        initCadastro();

        

        const manasSemana = [
            { name: 'Carolina Silva', avatar: '👩‍🦱', info: 'Intermediate • Bertioga', quote: '"Surfar me fez descobrir que sou mais forte do que imaginava. Cada onda é uma vitória!"', stat1: '🏆 3 campeonatos', stat2: '🔥 45 dias de streak' },
            { name: 'Fernanda Costa', avatar: '👩', info: 'Avançada • Itamambuca', quote: '"Comecei surfando no foam com 30 anos. Hoje faço tube. Nunca é tarde pra começar!"', stat1: '🏄 200+ sessões', stat2: '⭐ Nível 8' },
            { name: 'Juliana Mendes', avatar: '👩‍🦰', info: 'Iniciante • Riviera', quote: '"A ASF me deu coragem de entrar no mar. Agora não vivo sem! Obrigada, manas!"', stat1: '📚 15 quizzes', stat2: '💪 30 dias ativa' },
            { name: 'Beatriz Almeida', avatar: '👱‍♀️', info: 'Intermediária • Santos', quote: '"O surf me ensinou paciência. Você não controla a onda, mas pode escolher como surfar."', stat1: '🌊 80 sessões', stat2: '🥇 2 ouros' },
            { name: 'Amanda Rocha', avatar: '👩‍🦳', info: 'Avançada • Maresias', quote: '"Cair faz parte. Levantar é o que te torna surfista. Em cada wipeout, uma lição."', stat1: '🏄‍♀️ 5 anos surfando', stat2: '🏆 Ranking #8' },
            { name: 'Larissa Souza', avatar: '🧑', info: 'Iniciante • Guarujá', quote: '"Minha filha de 8 anos me ensinou a não ter medo das ondas. Crianças são ousadas!"', stat1: '👨‍👩‍👧 Mãe surfista', stat2: '📚 10 dicas lidas' },
            { name: 'Priscila Santos', avatar: '👩‍🦱', info: 'Intermediária • Mongaguá', quote: '"O mar não tem ego. Ele aceita todo mundo do mesmo jeito. É isso que amo no surf."', stat1: '🌊 120 sessões', stat2: '🧘 Yoga + Surf' },
        ];

        let selectedMood = '';
        

        

        

        

        

        

        

        

        

        

        

        

        

        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById("challenge-timer")) updateBrandTimer();
            if (typeof initBadges === 'function') initBadges();
            let appOpens = parseInt(localStorage.getItem('asf-opens') || '0');
            appOpens++;
            localStorage.setItem('asf-opens', appOpens);
            try { document.getElementById('stat-opens').textContent = appOpens; } catch(e) {}
            try { document.getElementById('stat-sessions').textContent = (JSON.parse(localStorage.getItem('surf-sessions') || '[]')).length; } catch(e) {}
            showProfile();
            const savedTheme = localStorage.getItem('asf-theme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                (document.getElementById('darkModeToggle')||{textContent:''}).textContent = '☀️';
            }
            const savedName = localStorage.getItem('asf-name');
            renderSessions();
            renderUserPosts();
            renderAchievements();
            ['Bertioga Surf Girls', 'Guarujá & Santos Surf', 'Ubatuba Surf Girls'].forEach(name => {
                const key = 'asf-joined-' + name.replace(/\s+/g, '-');
                if (localStorage.getItem(key)) {
                    const id = 'join-' + name.split(' ')[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                    const btn = document.getElementById(id);
                    if (btn) { btn.textContent = '✅ Inscrita!'; btn.style.background = 'var(--success)'; btn.style.pointerEvents = 'none'; }
                }
            });
            updateWaterDisplay(parseInt(localStorage.getItem(getWaterKey()) || '0'));
            initChecklist();
        });

        

        
        
        

        // ============ DICA DO DIA (989) ============
        window.dicas = [ <!-- ASF-DICAS-DEDUPE -->
            { text: '⭐ Confidence onda: trust + wave + faith! ⭐', category: 'Confianca', emoji: '⭐' },
            { text: '🧠 Aquecimento mental: visualize 3 ondas perfeitas antes de entrar no mar! 🌅', category: 'Mental', emoji: '🌅' },
            { text: '🤸 Alongue-se APÓS o surf para evitar rigidez muscular. 5 minutos de alongamento fazem maravilhas!', category: 'Recuperação', emoji: '🤸' },
            { text: '🧠 Neurociência surf: ondas cerebrais + performance! 🧬', category: 'Neurociência', emoji: '🧠' },
            { text: '📝 Diário de viagens: registre spots, condições e dicas para futuras expedições! ✈️', category: 'Planejamento', emoji: '✈️' },
            { text: '🔨 Shape surfboard: rails + tail + outline! 🔨', category: 'Equipamento', emoji: '🔨' },
            { text: '🎯 Motivation praia: objetivo + execução + resultado! 🎯', category: 'Motivacao', emoji: '🎯' },
            { text: '🛡️ Preservation onda: protect + wave + conserve! 🛡️', category: 'Preservacao', emoji: '🛡️' },
            { text: 'Apoie causas ambientais!', category: 'Saúde', emoji: '🧊' },
            { text: '📱 Seguro equipamento: proteção + cobertura + sinistro! 🛡️', category: 'Viagem', emoji: '📱' },
            { text: '💨 Leitura vento praias quebra: ventos offshore/onshore mudam comportamento em beach breaks! 🌊', category: 'Condições', emoji: '🌊' },
            { text: '🦀 Wetsuit pode serrei reused! Doe ou recicle. Océano agradecce! ♻️', category: 'Sustentabilidade', emoji: '♻️' },
            { text: 'Compartilhe conhecimento: ensinar e a melhor forma de aprender!', category: 'Comunidade', emoji: '\U0001F4DA' },
            { text: '📱 Baixe o app Tide Graph para acompanhar marés em tempo real. Planejamento é chave para boas sessões! 📊', category: 'Condições', emoji: '📱' },
            { text: '🎯 Foco no presente: concentre-se na onda, não no que outros fazem! 🔥', category: 'Mental', emoji: '🔥' },
            { text: '🌊 Ondas de vento (wind swell) são instáveis. Prefira ground swell para sessões consistentes! 🌪️', category: 'Condições', emoji: '🌪️' },
            { text: '🎓 Mentoria surf: desenvolvimento + networking + crescimento! 🚀', category: 'Negócios', emoji: '🎓' },
            { text: 'Praticar gratidão pela sua jornada de surf aumenta motivação diária! 🙏', category: "Mental", emoji: "💫" },
            { text: 'Prefira pranchas de materiais recicláveis — mais ecológico!', category: 'Sustentabilidade', emoji: '🌊' },
            { text: '🌌 Sonho mar: ocean + dream + infinite! 🌌', category: 'Sonho', emoji: '🌌' },
            { text: '🧴 Reaplique protetor solar nas orelhas, nuca e pés a cada 1.5h, mesmo com protetor water-resistant!', category: 'Prevenção', emoji: '🧴' },
            { text: '🏷️ Parceria marca: visibilidade + valores + sinergia! 🏷️', category: 'Parcerias', emoji: '🏷️' },
            { text: '🌊 Reconhecimento mar: ocean + recognition + respect! 🌊', category: 'Reconhecimento', emoji: '🌊' },
            { text: '💧 Leve 1.5L de água. Desidratação não combina com surf!', category: 'Nutrição', emoji: '💧' },
            { text: '🔬 Protocolo segurança pesquisa: colete salva-vidas + rádio VHF em expedições! 📻', category: 'Segurança', emoji: '📻' },
            { text: "Pratique a respiração diafragmática para aumentar a capacidade pulmonar.", category: 'Prevenção', emoji: '🏃' },
            { text: '📳 Vibration onda: tremor + wave + shake! 📳', category: 'Vibracao', emoji: '📳' },
            { text: '🕶️ Óculos de sol polarizados: reduzem reflexo na água e melhoram leitura de ondas! 😎', category: 'Equipamento', emoji: '🕶️' },
            { text: '🌊 Observe o padrão de séries por 10min antes de entrar. Menos energia gasta, mais ondas pega!', category: 'Técnica', emoji: '👀' },
            { text: '🌿 Use shampoo biodegradável após o surf. Cuide do seu cabelo e do oceano!', category: 'Sustentabilidade', emoji: '🌿' },
            { text: '🌊 Identifique correntes de retorno: água turva, ondas irregulares, detritos indo para o mar. Nade paralelo para escapar!', category: 'Segurança', emoji: '⚠️' },
            { text: '🗓️ Plano treino semanal: foco + variedade + recuperação! 📆', category: 'Treino', emoji: '🗓️' },
            { text: '🏃 Academia costa: cardio + estabilidade + foco! 🏃', category: 'Terapia', emoji: '🏃' },
            { text: '✨ Spiritual praia: iluminação + revelação + insight! ✨', category: 'Espiritualidade', emoji: '✨' },
            { text: '💧 Freshwater rinse after. Salt = rust! 🚿', category: 'Equipamento', emoji: '💧' },
            { text: '🔍 Exploração surf: mapear + investigar + descobrir! 🔍', category: 'Exploracao', emoji: '🔍' },
            { text: 'Propriedade com vista!', category: 'Equipamento', emoji: '🕯️' },
            { text: '🌊 Surfar reduz o estresse! O oceano é a melhor terapia para a mente feminina!', category: 'Saúde Mental', emoji: '🌊' },
            { text: '🆘 Sinal de resgate: aprenda a pedir ajuda no mar usando braço levantado! 🙋', category: 'Segurança', emoji: '🙋' },
            { text: 'Visualize ondas perfeitas!', category: 'Competição', emoji: '🥇' },
            { text: '😊 Joy praia: relaxamento + contentamento + paz! 😊', category: 'Alegria', emoji: '😊' },
            { text: 'Crie grupos de surf!', category: 'Técnica', emoji: '📚' },
            { text: '🤗 Amizade costa: parceria + confianca + reciprocidade! 🤗', category: 'Amizade', emoji: '🤗' },
            { text: '⏰ Timing entrada: momento perfeito + gaps! ⏳', category: 'Técnica', emoji: '⏰' },
            { text: '⚠️ Gestão de risco: evaluate consequences before each wave — safety first! 🛡️', category: 'Segurança', emoji: '🛡️' },
            { text: '🐛 Transformação costa: evolução + progresso + crescimento! 🐛', category: 'Transformacao', emoji: '🐛' },
            { text: '🗺️ Mapas de praias: estude a geografia local antes de viajar. Conhecimento evita problemas! 📍', category: 'Segurança', emoji: '📍' },
            { text: 'Yoga na prancha: treine equilíbrio estático em casa para melhorar estabilidade no mar! 🧘‍♀️', category: 'Treino', emoji: '🧘' },
            { text: '🏔️ Gestão altitude surfe: adaptação a spots de alta montanha! ⛰️', category: 'Preparação', emoji: '⛰️' },
            { text: '📸 Compartilhe no app ASF: inspire a comunidade com sua evolução! 💙', category: 'ASF', emoji: '💙' },
            { text: '🧘 Alongamento pós-surf: relaxa músculos e previne dor no dia seguinte! 🌿', category: 'Recuperação', emoji: '🌿' },
            { text: '📱 Notificações do app: ative alertas de condições favoráveis na sua região! Nunca perca uma session! 🔔', category: 'Tecnologia', emoji: '🔔' },
            { text: '🔁 Lesões crônicas surf: prevenção + tratamento! 🏥', category: 'Saúde', emoji: '🔁' },
            { text: '💚 ASF: empoderamento através do esporte. Cada onda é uma vitória!', category: 'ASF', emoji: '💚' },
            { text: '🏞️ Preparação surf água doce: atenção à água potável + proteção contra insetos! 🦟', category: 'Preparação', emoji: '🦟' },
            { text: '♿ Adaptado praia: recursos + apoio + liberdade! ♿', category: 'Terapia', emoji: '♿' },
            { text: 'Mantenha hidratação!', category: 'Mental', emoji: '🙏' },
            { text: 'Banho de contraste pós-surf: quente e frio alternados melhoram circulação e recuperação! 🌡️', category: 'Recuperação', emoji: '🚿' },
            { text: '📵 No photo zone? Respect it! 🙏', category: 'Sustentabilidade', emoji: '🙏' },
            { text: '💪 Resistência leash: material + teste + durabilidade! 💪', category: 'Equipamento', emoji: '💪' },
            { text: 'Respeito no lineup!', category: 'Recuperação', emoji: '😌' },
            { text: '🌅 Surf pôr do sol: sessões relaxantes com cores incríveis! 🌇', category: 'Experiência', emoji: '🌇' },
            { text: '💼 Equipamentos praia: cadeiras + guarda-sóis + lanternas! 💼', category: 'Equipamentos', emoji: '💼' },
            { text: '🍌 Banana + aveia = café de athlete. Energia LIMPA antes do surf!', category: 'Nutrição', emoji: '🥗' },
            { text: 'Celebre diversidade!', category: 'Mental', emoji: '🙏' },
            { text: '🤝 Convide uma amiga para surfar! ASF cresce quando trazemos mais mulheres para o mar! 🌸', category: 'Comunidade', emoji: '👭' },
            { text: 'Respiração 4-4-4 para acalmar: inspire 4s, segure 4s, expire 4s. Reduz ansiedade pré-surf! 🌬️', category: 'Mental', emoji: '🧘' },
            { text: '👯 Surfe com outras manas! Grupos de surf feminino aumentam segurança e diversão no mar. 👯', category: 'Comunidade', emoji: '🤝' },
            { text: 'Antes da session: 3 minutos de respiração diafragmática abaixam o cortisol e melhoram o foco dentro d\'água!', category: 'Mental', emoji: '🧘' },
            { text: '🧘 Meditação surf: respiração + mindfulness + presença! 🧘', category: 'Meditacao', emoji: '🧘' },
            { text: '🌊 Esperança mar: infinito + mistério + eternidade! 🌊', category: 'Esperanca', emoji: '🌊' },
            { text: '🐚 Participe dos eventos da ASF! Networking e surf juntas, ótimo para evoluir. 🏄‍♀️', category: 'ASF', emoji: '🏄‍♀️' },
            { text: 'Pratique ecoturismo!', category: 'Segurança', emoji: '🛡️' },
            { text: '👙 Use maiô de surf resistente à cloro e sal. Evita surpresas durante a session!', category: 'Equipamento', emoji: '👙' },
            { text: '💶 Economia mar: cadeias + valor + sustentabilidade! 💶', category: 'Economia', emoji: '💶' },
            { text: '🌊 O mar hoje tá com ondas de 0.5-1.0m! Boas para todas. Bora surfar!', category: 'Condições', emoji: '🌊' },
            { text: 'Evite alimentos pesados!', category: 'Etiqueta', emoji: '🏄' },
            { text: '🔍 Detalhe surf: detalhe + observação + precisão! 🔍', category: 'Detalhe', emoji: '🔍' },
            { text: '📏 Dimensões prancha ideal: altura + largura + espessura! 📐', category: 'Equipamento', emoji: '📏' },
            { text: '🏝️ Liberdade costa: ilha + refúgio + autonomia! 🏝️', category: 'Liberdade', emoji: '🏝️' },
            { text: '🏊 Swim to train paddling. Out of water = better in water! 💪', category: 'Treino', emoji: '🏊' },
            { text: '🦶 Técnica de cross-step: ande na prancha para equilíbrio e posicionamento! 👣', category: 'Técnica', emoji: '👣' },
            { text: '🏆 Liderança surf: comando + decisão nas ondas! 👑', category: 'Liderança', emoji: '🏆' },
            { text: '💧 Ayurveda pós-surf: rotina dinâmica de recuperação com automassagem e chás quentes!', category: 'Recuperação', emoji: '💧' },
            { text: '🤸 Mobilidade articular: exercícios de amplitude de movimento preparam o corpo! 🔄', category: 'Preparação', emoji: '🔄' },
            { text: '🧠 Preparação mentais: foco + confiança + execução! 💪', category: 'Mental', emoji: '🧠' },
            { text: 'Pratique o turtle roll: role com a prancha para passar ondas grandes sem perder energia! 🐢', category: 'Técnica Avançada', emoji: '🐢' },
            { text: '🧭 Navegação por praia: usar referências visuais para orientação! 🏖️', category: 'Segurança', emoji: '🏖️' },
            { text: '💰 Financas surf: orçamento + fluxo + economia! 💰', category: 'Financas', emoji: '💰' },
            { text: '👥 Friendships praia: grupo + amigos + diversão! 👥', category: 'Amizades', emoji: '👥' },
            { text: '🏄 Técnica de floater reverso: flutue sobre a espuma com weight shift para trás! 🧘', category: 'Técnica', emoji: '🧘' },
            { text: '💪 Resilience onda: flexibilidade + elasticidade + superar! 💪', category: 'Resiliencia', emoji: '💪' },
            { text: '⚙️ Técnica costa: technical + coast + surf! ⚙️', category: 'Pratica', emoji: '⚙️' },
            { text: '💡 Empreendedorismo praia: solução + MVP + clientes! 💡', category: 'Negocios', emoji: '💡' },
            { text: '📶 Frequência costa: coast + signal + strength! 📶', category: 'Frequencia', emoji: '📶' },
            { text: '✨ Brightening onda: iluminar + brilhar + clarificar! ✨', category: 'Clareamento', emoji: '✨' },
            { text: 'Ajuste o balanceamento no stand-up!', category: 'Recuperação', emoji: '💤' },
            { text: '🔖 Licencas praia: eventos + atividades + uso do solo! 🔖', category: 'Legal', emoji: '🔖' },
            { text: '💙 Indique a ASF para sua amiga surfista! Quanto mais manas, mais forte nossa comunidade fica. 🤝', category: 'ASF', emoji: '💙' },
            { text: '🤸 Yoga improves balance and flexibility. Try downward dog to strengthen your pop-up! 🧘', category: 'Treino', emoji: '🧘' },
            { text: '♻️ Economia circular surf: permuta + reaproveitamento! 🔄', category: 'Sustentabilidade', emoji: '♻️' },
            { text: '🌀 Complexidade surf: complex + patterns + layers! 🌀', category: 'Complexidade', emoji: '🌀' },
            { text: '🏄♀️ Choose right board for conditions. Not all waves need same board! 🏄', category: 'Equipamento', emoji: '🏄' },
            { text: '🥗 Pós-surf meal: proteína + carboidrato ideal para recuperação muscular! 🍗', category: 'Nutrição', emoji: '🍗' },
            { text: '💆 Massage foam roll. Stay injury-free! 🧘', category: 'Recuperação', emoji: '💆' },
            { text: '🌋 Ambição mar: ocean + ambition + power! 🌋', category: 'Ambicao', emoji: '🌋' },
            { text: '💪 Friendship onda: grupo + uniao + colaboracao! 💪', category: 'Amizade', emoji: '💪' },
            { text: '🤝 Apoio emocional: grupo ASF para compartilhar medos e conquistas! 💙', category: 'ASF', emoji: '💙' },
            { text: 'Liberação miofascial com bolinha de tênis: 2 min por ponto gatilho nos pés melhora propriocepção! 🎾', category: "Recuperação", emoji: "🦶" },
            { text: '🏄‍♀️💪 Praticar breath control ajuda a ficar mais tempo na água. Respire fundo, permaneça calma! 🧘', category: 'Saúde', emoji: '🌬️' },
            { text: '🌊 Ecossistema surf: stakeholders + integração + sustentabilidade! 🔄', category: 'Negócios', emoji: '🌊' },
            { text: 'Micro-habits: 5 min de mobilidade diária > 1 hora esporádica. Consistência vence! 📈', category: 'Rotina', emoji: '🔄' },
            { text: "Use uma toalha de microfibra para secar rapidamente após o surf.", category: 'Competição', emoji: '🏆' },
            { text: '✨ Prancha certo pro seu nível. Estabilidade > velocidade, sempre!', category: 'Equipamento', emoji: '🏄' },
            { text: '🌈 Esperança surf: futuro + possibilidades + sonhos! 🌈', category: 'Esperanca', emoji: '🌈' },
            { text: '🦵 Hip openers = deeper turns! 🧘', category: 'Treino', emoji: '🦵' },
            { text: '🧠 Process fear first. Mind = board! 🧘', category: 'Mental', emoji: '🧠' },
            { text: '🍊 Laranja pós-surf: vitamina C para imunidade e recuperação! 🍊', category: 'Nutrição', emoji: '🍊' },
            { text: '📊 Estatística surf: dados + análise de performance! 📈', category: 'Dados', emoji: '📊' },
            { text: '📡 Padronização API surf: dados + integração! 🔌', category: 'Tech', emoji: '📡' },
            { text: 'Aprenda a ler as ondas. Observar 15 min antes de entrar revela o padrão das ondas! 👀', category: 'Técnica', emoji: '🔍' },
            { text: 'Retorno garantido!', category: 'Técnica', emoji: '🔄' },
            { text: '✨ Selfesteem onda: self-love + wave + surf! ✨', category: 'Autoestima', emoji: '✨' },
            { text: '🔥 Dynamics onda: power + wave + motion! 🔥', category: 'Dinamica', emoji: '🔥' },
            { text: 'Pratique estresse!', category: 'Competição', emoji: '🥇' },
            { text: '💧 Purification praia: limpar + purificar + água! 💧', category: 'Purificacao', emoji: '💧' },
            { text: '🧠 Surf terapêutico: terapia através do surf + conexão com a natureza! 🏄', category: 'Saúde', emoji: '🧠' },
            { text: '🌊 Esportes mar: stand up + paddle + canoa! 🌊', category: 'Esportes', emoji: '🌊' },
            { text: '🏛️ Sabedoria costa: ancient + coast + wisdom! 🏛️', category: 'Sabedoria', emoji: '🏛️' },
            { text: '🔥 Rest day is training too. Recover smart! 💆', category: 'Recuperação', emoji: '😌' },
            { text: '💊 Healthcare onda: terapias + medicamentos + tratamentos! 💊', category: 'Saude', emoji: '💊' },
            { text: '🏄 Técnica de backdoor: entre por trás da onda quando ela está fechando! 🔄', category: 'Técnica', emoji: '🔄' },
            { text: 'Sororidade na lineup: chame uma mana para a onda, compartilhar faz bem! 🤝', category: 'ASF', emoji: '💙' },
            { text: 'Nunca entre sozinha em dias grandes!', category: 'Segurança', emoji: '🛟' },
            { text: 'Apoie novatos!', category: 'Segurança', emoji: '👀' },
            { text: '🧽 Limpeza de prancha: remove cera velha e sal — mantém aderência e vida útil! 🧼', category: 'Manutenção', emoji: '🧼' },
            { text: '🏖️ Beach gratitude. Thank the ocean! 🙏', category: 'Mental', emoji: '🙏' },
            { text: '🎓 Wisdom onda: wise + wave + insight! 🎓', category: 'Sabedoria', emoji: '🎓' },
            { text: '🥤 Hydrate with intention. Conscious water! 💧', category: 'Nutrição', emoji: '💧' },
            { text: '📡 Leitura swell tempo real: dados oceanográficos ao vivo para decisões instantâneas! 📊', category: 'Condições', emoji: '📊' },
            { text: 'Investimento em praias!', category: 'Competição', emoji: '🏆' },
            { text: '🌊 Treino de remada no mar: foco na técnica da braçada longa e eficiente. Paddle = metade da session! 💪', category: 'Treino', emoji: '🏊' },
            { text: '📊 Stats no app: acompanhe Dias no mar, horas de surf e progresso geral! 📈', category: 'Progresso', emoji: '📈' },
            { text: 'Respeite o \"take-off priority\": quem está mais perto da onda tem a vez.', category: 'Etiqueta', emoji: '🤝' },
            { text: 'Desenvolva estratégia!', category: 'ASF', emoji: '🤝' },
            { text: '🤝 Parceria ASF: colaboração + apoio + desenvolvimento! 🤝', category: 'Parcerias', emoji: '🤝' },
            { text: '📝 Frequency praia: beach + signal + strength! 📝', category: 'Frequencia', emoji: '📝' },
            { text: '🏄♀️ Set realistic goals. Small wins lead to big progress! 🎯', category: 'Mental', emoji: '🎯' },
            { text: '🦺 Protection onda: equipamento + fita + alerta! 🦺', category: 'Cuidado', emoji: '🦺' },
            { text: '🍎 Lanche pós-session: frutas e nozes para energia rápida! 🍌', category: 'Nutrição', emoji: '🍌' },
            { text: 'Olhe sempre para onde quer chegar, não para onde a onda te empurra!', category: 'Nutrição', emoji: '🍉' },
            { text: '🏄‍♀️ Registros do app: toda session salva é um passo rumo à evolução consciente! 📈', category: 'Progresso', emoji: '📈' },
            { text: '🌡️ Track water temp. Wetsuit = comfort! 🌡️', category: 'Prática', emoji: '🌡️' },
            { text: '🌊 Previsão de ondas: interpretar gráficos de swell e período! 📈', category: 'Condições', emoji: '📈' },
            { text: '🌙 Protocolo segurança surf noturno solo: luz + whistle + rota pré-definida! 🛟', category: 'Segurança', emoji: '🛟' },
            { text: '🏄♀️ Surfe com outra mujer fortalece laços e segurança. Mar é melhor em comunidade! 💙', category: 'Comunidade', emoji: '🤝' },
            { text: 'Use boia de segurança em mar aberto!', category: 'Saúde', emoji: '🦶' },
            { text: '🏄‍♀️ Participe do circuito da ASF! Competir com outras mulheres fortalece sua técnica e confiança! 🏆', category: 'ASF', emoji: '🏄‍♀️' },
            { text: 'Treine equilíbrio em superfície instável: prancha de equilíbrio ou stand-up paddle!', category: 'Treino', emoji: '🏋️' },
            { text: '🤖 Tecnologia costa: automação + sensores + IoT! 🤖', category: 'Tecnologia', emoji: '🤖' },
            { text: '🌊 Fluxo mar: ocean + current + flow! 🌊', category: 'Fluxo', emoji: '🌊' },
            { text: '🌊 Identifique bancos de areia: áreas mais escuras = menos profundidade = boas ondas!', category: 'Técnica', emoji: '👀' },
            { text: '🧭 Leitura vento point break avançada: análise de ventos em picos de onda! 🌬️', category: 'Condições', emoji: '🌬️' },
            { text: '🤝 Amizades surf: camaradagem + sessão + parceria! 🤝', category: 'Amizades', emoji: '🤝' },
            { text: '📸 Photo or it didn\'t happen! Share your progress! 📸', category: 'Progresso', emoji: '📸' },
            { text: '⚡ Vitalidade surf: vitalidade + energia + força! ⚡', category: 'Vitalidade', emoji: '⚡' },
            { text: '🏄 Warm-up específico: 5 minutos de remada simulada prepara o corpo! 🔥', category: 'Preparação', emoji: '🔥' },
            { text: '📅 Cronograma posts: frequência + horários + consistência! ⏰', category: 'Social', emoji: '📅' },
            { text: "Não compartilhe protetor solar — cada pessoa deve aplicar a quantidade adequada.", category: 'Comunidade', emoji: '💜' },
            { text: '🌟 Achievement praia: star + beach + triumph! 🌟', category: 'Conquista', emoji: '🌟' },
            { text: '🤸 Corpo costa: alongamento + flexibilidade + mobilidade! 🤸', category: 'Corpo', emoji: '🤸' },
            { text: '🏄 Prancha de treino: use soft top para iniciantes ou sessions seguras! 🏄', category: 'Equipamento', emoji: '🏄' },
            { text: '📱 Leitura swell app: previsão ao vivo no smartphone! 📲', category: 'Condições', emoji: '📲' },
            { text: '💾 Backup dados surf: nuvem + local + rotina! ☁️', category: 'Tecnologia', emoji: '💾' },
            { text: '📊 Administracao onda: KPIs + relatórios + decisão! 📊', category: 'Gestao', emoji: '📊' },
            { text: 'Deslize suavemente no wax com os pés!', category: 'Equipamento', emoji: '🧴' },
            { text: '🤝 Apoio ASF: ajude outras surfistas — comunidade forte eleva todas! 💪', category: 'ASF', emoji: '💪' },
            { text: '🌊 Resiliência mar: ondas + mergulho + imersão! 🌊', category: 'Resiliencia', emoji: '🌊' },
            { text: '🍵 Chá verde pós-surf: antioxidantes combatem radicais livres do sol e sal! 🍃', category: 'Nutrição', emoji: '🍵' },
            { text: '📦 Kit emergencia: primeiros socorros + sinalização + comunicação! 📦', category: 'Segurança', emoji: '📦' },
            { text: '📺 Nostalgia onda: retro + wave + vintage! 📺', category: 'Nostalgia', emoji: '📺' },
            { text: '🌍 Geopolítica surf: poder + fronteiras costeiras! 🗺️', category: 'Geopolítica', emoji: '🌍' },
            { text: '😴 Dormir 7-8h é pré-requisito. Corpo descansado = paddle melhor!', category: 'Saúde', emoji: '😴' },
            { text: '🌊 Mar alive! Feel the energy. Respect the ocean! 🙏', category: 'Sabedoria', emoji: '🌊' },
            { text: '💥 Preparação para wipeout: treine respiração e relaxamento sob pressão! 🌊', category: 'Segurança', emoji: '🌊' },
            { text: '📸 Vídeo analysis: grave suas sessões e compare com profissionais! 📹', category: 'Progresso', emoji: '📹' },
            { text: '🎙️ Podcast onda: conversas + histórias + inspiração! 🎙️', category: 'Mídia', emoji: '🎙️' },
            { text: '🎯 Foco costa: focus + coast + attention! 🎯', category: 'Foco', emoji: '🎯' },
            { text: '🏄‍♀️ Your wave, your style. Own it! 💃', category: 'Mental', emoji: '💃' },
            { text: '🍎 Apple before surf. Fast energy! 🍎', category: 'Nutrição', emoji: '🍎' },
            { text: '🥥 Água de coco pós-surf: reposição eletrolítica natural, sem açúcar! 🥥', category: 'Nutrição', emoji: '🥥' },
            { text: '📰 Noticias costa: jornalismo + reportagens + entrevistas! 📰', category: 'Mídia', emoji: '📰' },
            { text: 'Controle a velocidade com o cotovelo na areia!', category: 'Saúde', emoji: '🦶' },
            { text: '👥 Comunidade costa: grupos + apoio + trocas! 👥', category: 'Comunidade', emoji: '👥' },
            { text: '🌺 Sorte costa: presente + presente + agradecimento! 🌺', category: 'Sorte', emoji: '🌺' },
            { text: '⏱️ Controle velocidade: aceleração + desaceleração! ⚡', category: 'Técnica', emoji: '⏱️' },
            { text: 'Respeite a fila no lineup!', category: 'Etiqueta', emoji: '🏄' },
            { text: '🎚️ Vibration praia: adjust + beach + intensity! 🎚️', category: 'Vibracao', emoji: '🎚️' },
            { text: '🍫 Chocolate 70%+ cacau pré-surf fornece energia rápida sem picos de açúcar. Experimente!', category: 'Nutrição', emoji: '🍫' },
            { text: '🏄‍♀️ Treine pop-up em terra seca 5min antes de entrar. Memória muscular = mais ondas!', category: 'Técnica', emoji: '🏠' },
            { text: 'Pratique força no core!', category: 'Equipamento', emoji: '🕯️' },
            { text: '📢 Confira relatos de outras surfistas locais, não apenas apps. A experiência delas é valiosa!', category: 'Condições', emoji: '🗣️' },
            { text: '🏄‍♀️ Respeite a prioridade das mansas na lineup. Quem está mais próxima da zona de quebra tem preferência! ⚡', category: 'Etiqueta', emoji: '⚡' },
            { text: 'O melhor surfista não é o que pega mais ondas — é o que aproveita cada uma!', category: 'Mental', emoji: '🧘' },
            { text: '🥜 Snack rápido: amêndoas e frutas secas para energia imediata! 🌰', category: 'Nutrição', emoji: '🌰' },
            { text: '🎯 Afinacao quilha: ajuste + ondas + estilo! 🎯', category: 'Equipamento', emoji: '🎯' },
            { text: '🎼 Resonance onda: musical + wave + frequency! 🎼', category: 'Resonancia', emoji: '🎼' },
            { text: '🛡️ Segurança surf: vigilância + protocolos + emergências! 🛡️', category: 'Seguranca', emoji: '🛡️' },
            { text: 'Prefira transporte compartilhado!', category: 'Condições', emoji: '🌅' },
            { text: '💨 Leitura vento shore break: ventos변화 em quebras próximas à praia são imprevisíveis! ⚠️', category: 'Condições', emoji: '⚠️' },
            { text: '🎯 Foco na respiração: controle o fôlego para mais tempo na onda! 🌬️', category: 'Saúde', emoji: '🌬️' },
            { text: '✨ Art onda: performance + interação + espetáculo! ✨', category: 'Arte', emoji: '✨' },
            { text: 'Mantenha persistência!', category: 'Técnica', emoji: '🏄' },
            { text: '🎯 Focus praia: target + beach + focus! 🎯', category: 'Foco', emoji: '🎯' },
            { text: '🌬️ Respiração diafragma: técnica de respiração profunda para oxigenação! 💨', category: 'Saúde', emoji: '💨' },
            { text: '📄 Circulares onda: comunicados + orientações + avisos! 📄', category: 'Mídia', emoji: '📄' },
            { text: '📆 Tempo mar: maré + lua + fase! 📆', category: 'Tempo', emoji: '📆' },
            { text: 'Considere umidade!', category: 'Saúde', emoji: '🦶' },
            { text: 'Confie no processo!', category: 'Equipamento', emoji: '🔗' },
            { text: 'Coma potássio (banana)!', category: 'Sustentabilidade', emoji: '🐢' },
            { text: '📢 Divulgação evento: canais + timing + engajamento! 🎪', category: 'Negócios', emoji: '📢' },
            { text: '🗳️ Politica costa: eleições + campanhas + voto! 🗳️', category: 'Politica', emoji: '🗳️' },
            { text: '🌊 Leitura da séria: contar ondas do set (geralmente 3-5) prevê quando a próxima vem. Paciência! 📊', category: 'Técnica', emoji: '📊' },
            { text: '📊 Track your sessions! Note wave height, wind direction, how you felt. Data = improvement! 📱', category: 'Progresso', emoji: '📊' },
            { text: '📸 Video yourself weekly. Progress becomes visible! 🎬', category: 'Técnica', emoji: '📹' },
            { text: "Verifique o regulador da sua prancha (se for inflável) antes de cada sessão.", category: 'Mental', emoji: '🙏' },
            { text: 'Fortaleça ombros regularmente!', category: 'Sustentabilidade', emoji: '🌍' },
            { text: '🧠 Visualize your session before hitting the water! 🌊', category: 'Mental', emoji: '🧠' },
            { text: '🖌️ Subtlety onda: subtle + nuanced + artistic! 🖌️', category: 'Nuance', emoji: '🖌️' },
            { text: '🧘‍♀️ Pratique ioga 10 min antes do surf. Flexibilidade e foco garantidos!', category: 'Treino', emoji: '🧘' },
            { text: '🎪 Paradox praia: fun + serious + play! 🎪', category: 'Paradoxo', emoji: '🎪' },
            { text: '💳 Venda online surf: estratégia + conversão + pós-venda! 💰', category: 'Negócios', emoji: '💳' },
            { text: '🗺️ Organização viagem surf: itinerário + logística + imprevistos! 📅', category: 'Viagem', emoji: '🗺️' },
            { text: '🩹 Tenha um kit de primeiros socorros no carro: band-aid, antisséptico e compressa para cortes de corais!', category: 'Segurança', emoji: '🩹' },
            { text: '🧙 Myths onda: bestiários + narrativas + tradições! 🧙', category: 'Historia', emoji: '🧙' },
            { text: 'Escolha prancha certa para seu nível!', category: 'Competição', emoji: '📈' },
            { text: 'Durma bem para recuperação!', category: 'Treino', emoji: '🤸' },
            { text: 'Bottom turn: deixe o peso do corpo seguir a curva da onda!', category: 'Técnica', emoji: '🏄' },
            { text: 'Hidratação é chave – beba água antes de surfar. Desidratação rouba seu pop-up! 💧', category: 'Nutrição', emoji: '💧' },
            { text: 'Círculo de mulheres surfistas: conexão profunda e troca de experiências fortalece a irmandade! 🤝', category: "Comunidade", emoji: "👯" },
            { text: '🤖 Tech costa: robótica + sensores + automação! 🤖', category: 'Tecnologia', emoji: '🤖' },
            { text: 'Hidratação com eletrólitos: água de coco natural repõe minerais perdidos no suor! 🥥', category: "Nutrição", emoji: "🥥" },
            { text: 'Celebração do surf feminino!', category: 'Segurança', emoji: '👀' },
            { text: '📐 Check fin position. Set it and forget! 🛼', category: 'Equipamento', emoji: '📐' },
            { text: '🧪 Microplásticos surf: impacto e ações de conscientização! 🔬', category: 'Científico', emoji: '🧪' },
            { text: '💫 Brightening praia: iluminar + brilhar + reluzir! 💫', category: 'Clareamento', emoji: '💫' },
            { text: 'Pratique o takeoff em areia antes de entrar no mar!', category: 'Competição', emoji: '🏅' },
            { text: '👤 Historia surfista: trajetória + desafios + conquistas! 👤', category: 'Técnico', emoji: '👤' },
            { text: '🏋️ Fortalecimentoarante: exercícios de mobilidade preparam o corpo para o surf! 🔄', category: 'Preparação', emoji: '🔄' },
            { text: '📱 App offline mode: salve dicas e地图 para acessar na praia sem internet! 🗺️', category: 'Tecnologia', emoji: '📱' },
            { text: 'Evite álcool antes do surf!', category: 'ASF', emoji: '💙' },
            { text: '🎨 Expression onda: creative + wave + surf! 🎨', category: 'Expressao', emoji: '🎨' },
            { text: '💊 Suplementação surf: omega + magnésio + eletrólitos! 💧', category: 'Saúde', emoji: '💊' },
            { text: '📷 Câmera surf: ação + resistência + estabilização! 📷', category: 'Técnico', emoji: '📷' },
            { text: '🍷 Gastronomia mar: vinhos + queijos + harmonizações! 🍷', category: 'Alimentacao', emoji: '🍷' },
            { text: '🏄 Pratique cutback no foam: deslize o pé traseiro e feche a trajetória!', category: 'Técnica', emoji: '🏄' },
            { text: '🤝 Ao terminar a sessão, cumprimente as outras surfistas na areia. Cria conexão e respeito na lineup!', category: 'Etiqueta', emoji: '🤝' },
            { text: '🩹 Preparação água salgada feridas: desinfecção + curativo impermeável! 🩸', category: 'Segurança', emoji: '🩸' },
            { text: '👀 Olhe pro destino, não pra onda. Controle o paddle com os olhos!', category: 'Técnica', emoji: '🎯' },
            { text: '🏄 Técnica de puntada: impulso rápido na remada para inside! ⚡', category: 'Técnica', emoji: '⚡' },
            { text: '🍓 Frutas vermelhas pós-surf! Antioxidantes ajudam na recuperação muscular. 🍓', category: 'Nutrição', emoji: '🍓' },
            { text: 'Use linguagem universal!', category: 'Prevenção', emoji: '☀️' },
            { text: '🏅 Habilidade mar: ocean + skill + ability! 🏅', category: 'Habilidade', emoji: '🏅' },
            { text: '🤝 Mentoria feminina: guie novas surfistas — compartilhe conhecimento! 👩', category: 'ASF', emoji: '👩' },
            { text: '🧠 Foco absoluto sessions: técnica de concentração por 90 minutos! 🎯', category: 'Mental', emoji: '🎯' },
            { text: '👥 Sociologia surf: tribo + hierarquia nas linhas! 🤝', category: 'Sociologia', emoji: '👥' },
            { text: '🎯 Abilities onda: capability + wave + skill! 🎯', category: 'Habilidades', emoji: '🎯' },
            { text: "Se sua prancha tiver um cheiro forte, deixe-a ao sol por algumas horas para arejar.", category: 'Etiqueta', emoji: '🙌' },
            { text: 'Rotacione o tronco no takeoff: gire ombros e quadril juntos para máxima velocidade! 🌪️', category: 'Técnica Avançada', emoji: '🌪️' },
            { text: 'Trabalhe coordenação!', category: 'Cultura', emoji: '🌊' },
            { text: '🔄 Rotation onda: axis + wave + turn! 🔄', category: 'Rotacao', emoji: '🔄' },
            { text: 'Use transporte limpo!', category: 'Prevenção', emoji: '🧘' },
            { text: '🧊 Ice bath recovery: banho gelado reduz inflamação e acelera recuperação! ❄️', category: 'Recuperação', emoji: '❄️' },
            { text: '👩‍🤝‍👩 Forme grupos de surf com amigas - segurança e diversão em dobro nas sessões!', category: 'Comunidade', emoji: '👩‍🤝‍👩' },
            { text: '👶 Ondas pequenas = chance de treinar manobras novas. Aproveite! 🐣', category: 'Técnica', emoji: '👶' },
            { text: '🤝 Apoio psicológico: converse com outras surfistas sobre desafios e vitórias! 💬', category: 'Mental', emoji: '💬' },
            { text: '🧤 Wetsuit gloves in winter. Warm hands = happy! 🧤', category: 'Equipamento', emoji: '🧤' },
            { text: 'Comunique-se bem!', category: 'ASF', emoji: '💙' },
            { text: '👨‍‍👩‍‍👦 Segurança surf em família: coletes + supervisão + zonas seguras! 👨‍‍👩‍‍👦', category: 'Segurança', emoji: '👨‍👩‍👦' },
            { text: 'Leia a direção do vento na areia antes de entrar: off-shore = ondas mais bonitas!', category: 'Condições', emoji: '🌊' },
            { text: '🏄 Técnica de projeto: projetar a prancha no ar para estilo! ✨', category: 'Técnica', emoji: '✨' },
            { text: '🌊 Surfe em diferentes praias para conhecer novas ondas e adaptar sua técnica!', category: 'Técnica', emoji: '🌊' },
            { text: 'Protetor labial FPS: lábios ressecados atrapalham concentração. Hidratação total! 🌞', category: 'Prevenção', emoji: '💄' },
            { text: '📱 App offline: salve dicas e地图 para acessar na praia sem internet! 📱', category: 'Tecnologia', emoji: '📱' },
            { text: '🍫 Chocolate amargo pós-surf: magnésio e energia rápida!', category: 'Nutrição', emoji: '🍫' },
            { text: '😊 Feeling onda: happy + wave + surf! 😊', category: 'Sentimento', emoji: '😊' },
            { text: '🚀 Exploration onda: navegar + mapear + fronteiras! 🚀', category: 'Exploracao', emoji: '🚀' },
            { text: '🛠️ Technique praia: tools + beach + technique! 🛠️', category: 'Pratica', emoji: '🛠️' },
            { text: '🧘 Gestão stress campeonatos: técnicas de respiração + foco no presente! 🧘', category: 'Mental', emoji: '🧘' },
            { text: '💨 Check wind direction! Offshore wind = glassy waves, onshore = choppy. Plan your session accordingly! 💨', category: 'Condições', emoji: '💨' },
            { text: '🧴 SPF 50+ reapply every 2h. No excuses! ☀️', category: 'Prevenção', emoji: '🧴' },
            { text: '🧜‍♂️ Guardiao mar: vigilância + proteção + atenção! 🧜‍♂️', category: 'Segurança', emoji: '🧜‍♂️' },
            { text: '🌊 Oceanografia física: correntes + dinâmica oceânica! 🌊', category: 'Ciência', emoji: '🌊' },
            { text: 'Flexione levemente os joelhos no stand-up para mais controle!', category: 'Mental', emoji: '🎯' },
            { text: '♻️ Leve um saco para recolher lixo na praia. Pequenos gestos salvam o oceano!', category: 'Sustentabilidade', emoji: '♻️' },
            { text: '🏋️ Capacity praia: fitness + beach + strength! 🏋️', category: 'Capacidade', emoji: '🏋️' },
            { text: '📊 Leitura de mapa de ondas: interpreta gráficos de swell, vento e maré! 🗺️', category: 'Condições', emoji: '🗺️' },
            { text: '🏊 Swim for paddle fitness. Dry land = better pop-up! 💪', category: 'Treino', emoji: '🏊' },
            { text: '🐚 Renovação mar: renovar + regenerar + reciclar! 🐚', category: 'Renovacao', emoji: '🐚' },
            { text: '🫁 Exercícios respiratórios: treino diafragma para remada potente! 💨', category: 'Saúde', emoji: '💨' },
            { text: '🎭 Creativity praia: art + beach + make! 🎭', category: 'Criatividade', emoji: '🎭' },
            { text: '🤝 Conexões no mar: cumprimente e estabeleça respeito antes de pegar ondas! 👋', category: 'Ética', emoji: '👋' },
            { text: 'Leve chinelos de dedo: evite micoses e cortes na areia e chuveiros publicos!', category: 'Equipamento', emoji: '\U0001F461' },
            { text: 'Olhe para a direção que quer ir — o olhar guia o corpo toda a onda!', category: 'Técnica', emoji: '🏄' },
            { text: '🔄 Rotina variada: mix de exercises prevents plateaus and keeps motivation high! ⚡', category: 'Treino', emoji: '⚡' },
            { text: '🌷 Rebirth praia: planta + nascer + renascer! 🌷', category: 'Renascimento', emoji: '🌷' },
            { text: '🌊 Surf em ondas pesadas: mais distância da quebra, remada potente e paciência! ⏳', category: 'Segurança', emoji: '⏳' },
            { text: 'Cumprimente seu vizinho!', category: 'Técnica', emoji: '🔄' },
            { text: 'Use protetor solar biodegradável — protege você e o oceano ao mesmo tempo!', category: 'Sustentabilidade', emoji: '🌿' },
            { text: 'Banho de contraste: 1 min quente / 30s frio x 3 rounds = circulação turbo e recuperação! 🔄', category: "Recuperação", emoji: "🛁" },
            { text: '🌟 Vitality onda: vital + power + dynamic! 🌟', category: 'Vitalidade', emoji: '🌟' },
            { text: '🏄‍♀️ Pratique pop-up em terra firme: 10 repetições diárias fortalecem a memória muscular!', category: 'Técnica', emoji: '🏄‍♀️' },
            { text: '🚨 Protocolo emergência surf camp: reunião segurança + lista emergencies! 🆘', category: 'Segurança', emoji: '🆘' },
            { text: 'Pratique sprints!', category: 'Treino', emoji: '🔥' },
            { text: '👥 Protocolo segurança campeonato duplas: comunicação contínua entre parceiros! 📡', category: 'Segurança', emoji: '📡' },
            { text: '🍹 Hydrating drinks > coffee before surf. Natural energy! 🍌', category: 'Nutrição', emoji: '🥤' },
            { text: '⏰ Cronograma evolução: metas + prazos + checkpoints! 📊', category: 'Treino', emoji: '⏰' },
            { text: 'A respiração no surf é tudo: inspire na remada, expire no drop!', category: 'Respiração', emoji: '💨' },
            { text: '📝 Anote suas metas de surf num diário. Progresso visível aumenta a motivação!', category: 'Mental', emoji: '📝' },
            { text: '💨 Leitura vento big wave spots: análise de ventos em ondas gigantes! 🌊', category: 'Condições', emoji: '🌊' },
            { text: '🥥 Água de coco gelada: hidratação rápida e eletrólitos após surf intenso! 🥥', category: 'Nutrição', emoji: '🥥' },
            { text: '🌊识别 correntes de retorno: água mais escura e espuma que afasta da praia. Saia lateralmente! 🧭', category: 'Segurança', emoji: '🧭' },
            { text: 'Mantenha os ombros alinhados com a prancha!', category: 'ASF', emoji: '🏄‍♀️' },
            { text: '🥤 Hidratação inteligente: garrafa térmica com gelo mantém água fresca na sessão! ❄️', category: 'Saúde', emoji: '❄️' },
            { text: '🎬 Watch surf videos. Study the pros, visualize your style! 📹', category: 'Técnica', emoji: '📹' },
            { text: '👥 Administracao praia: liderança + motivação + cultura! 👥', category: 'Gestao', emoji: '👥' },
            { text: 'Desenvolva autoconfiança!', category: 'Cultura', emoji: '🧚' },
            { text: '🌍 Gestão riscos ambientais: evite poluição, respeite vida marinha e recifes! 🌊', category: 'Sustentabilidade', emoji: '🌊' },
            { text: '📊 Complexidade costa: data + layers + analysis! 📊', category: 'Complexidade', emoji: '📊' },
            { text: '🏄‍♀️ Use prancha de espuma para ensinar iniciantes! Compartilhar o conhecimento fortalece a comunidade. 🤝', category: 'Comunidade', emoji: '🏄‍♀️' },
            { text: '💪 Fortaleça o core com pranchada (surf ergometer) para melhorar a remada. 🏋️', category: 'Treino', emoji: '🏋️' },
            { text: 'Coma proteína pós-surf!', category: 'Comunidade', emoji: '💙' },
            { text: '🏖️ Esportes costa: vôlei + frescobol + footvolley! 🏖️', category: 'Esportes', emoji: '🏖️' },
            { text: '⏰ Gestão de tempo: alocar 90min de surf + 30min preparação/recuperação! ⏱️', category: 'Progresso', emoji: '⏱️' },
            { text: 'Apoie marcas sustentáveis!', category: 'Mental', emoji: '💪' },
            { text: '🏄 Técnica de frontside: surf de frente para onda com agressividade controlada! 🔥', category: 'Técnica', emoji: '🔥' },
            { text: '🏅 Conquista mar: ocean + victory + success! 🏅', category: 'Conquista', emoji: '🏅' },
            { text: '🌅 Madrugue! 6-9h tem vento OFF e ondas mais limpinhas.', category: 'Condições', emoji: '🌅' },
            { text: '🧘‍♂️ Alongue a coluna torácica para melhorar a rotação no surf!', category: 'Treino', emoji: '🧘‍♂️' },
            { text: '📜 Selo ecossurf: certificação ecossistema + projetos conservação! 📖', category: 'Sustentabilidade', emoji: '📖' },
            { text: '👙 Moda costa: biquínis + maiôs + saídas de praia! 👙', category: 'Moda', emoji: '👙' },
            { text: '🌸 ASF apoia sua jornada! Nunca pare de surfar, estamos aqui juntas. 💙', category: 'ASF', emoji: '🌸' },
            { text: '🚢 Transporte mar: ferris + catamarãs + embarcações! 🚢', category: 'Transporte', emoji: '🚢' },
            { text: 'Conheça critérios go/no-go!', category: 'Competição', emoji: '🏅' },
            { text: 'Evite açúcar refinado!', category: 'Cultura', emoji: '⚡' },
            { text: '📊 Progress tracker: use o app para medir evolução e definir novas metas! 📈', category: 'Progresso', emoji: '📈' },
            { text: '🏆 Habilidades costa: talent + coast + surf! 🏆', category: 'Habilidades', emoji: '🏆' },
            { text: '🧘 Equilíbrio costa: calm + balance + centered! 🧘', category: 'Equilibrio', emoji: '🧘' },
            { text: '🧘 Meditação guiada pós-surf: 10 min de gratidão pelo mar elevam o bem-estar! 🧠', category: 'Mental', emoji: '🧘' },
            { text: '🌊 Superação mar: ocean + overcome + victory! 🌊', category: 'Superacao', emoji: '🌊' },
            { text: 'Comunidade constrói sonhos!', category: 'Etiqueta', emoji: '🤝' },
            { text: '👑 Pioneiras surf: trailblazers + coragem + legado! 🏆', category: 'Cultura', emoji: '👑' },
            { text: '🌟 Potencial costa: star + coast + talent! 🌟', category: 'Potencial', emoji: '🌟' },
            { text: '🐬 Meioambiente mar: megafauna + ecossistemas + conservação! 🐬', category: 'MeioAmbiente', emoji: '🐬' },
            { text: '💪 Strength train legs: squats and lunges improve your pop-up and balance! 🏋️', category: 'Treino', emoji: '💪' },
            { text: '🧊 Leve gelo na bolsa. Pós-surf = recuperação 3x mais rápida!', category: 'Prevenção', emoji: '❄️' },
            { text: '🍌 Banana com pasta de amendoim pré-surf = energia lenta pro paddle!', category: 'Nutrição', emoji: '🍌' },
            { text: 'Grupo local ASF: encontre suas manas pra surf juntas! Segurança + diversão! 👯', category: 'ASF', emoji: '👯' },
            { text: '🌍 Surf sostenible: choose eco-friendly brands and respect marine life! 🌱', category: 'Sustentabilidade', emoji: '🌱' },
            { text: '🥇 Skill praia: gold + beach + talent! 🥇', category: 'Habilidade', emoji: '🥇' },
            { text: '🏕️ Preparação surf lago/rio: proteção contra bactérias + equipamento seco! 🦠', category: 'Preparação', emoji: '🦠' },
            { text: "Use uma touca de neoprene fina para proteger a cabeça do vento sem perder audição.", category: 'Saúde', emoji: '🌬️' },
            { text: '📸 Compartilhe suas sessões no app da ASF. A comunidade te apoia!', category: 'Comunidade', emoji: '📱' },
            { text: '🌊 Trust the process. Every session makes you better! 📈', category: 'Progresso', emoji: '📈' },
            { text: '🌊 Verifique a previsão de marés e correntes antes de remar: o conhecimento do mar é essencial para sua segurança.', category: 'Segurança', emoji: '🌊' },
        ];        

        let beachCards = null;
        

        
        
        
        
        
        

        
        
        

        

        

        

        

        
        window.addEventListener('offline', updateConnectionStatus);
        window.addEventListener('online', updateConnectionStatus);
        updateConnectionStatus();

  const AFFILIATE_PRODUCTS = [/* vitrine em construção — somente produtos de parceiros confirmados serão listados aqui, com link para o canal oficial do parceiro */];


  
  if (typeof gtag !== 'undefined') {
    gtag('event', 'affiliate_click', {
      event_category: 'monetization',
      event_label: productId,
      value: 1
    });
  }


window.ASFMonetization = { trackEvent, getStats };


// cookie consent movido para script dedicado próximo ao banner


window.ASFMonetization={trackEvent,getStats};const a=document.createElement('style');a.textContent="@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}@keyframes toastOut{from{opacity:1;transform:translateX(-50%) translateY(0)}to{opacity:0;transform:translateX(-50%) translateY(20px)}}",document.head.appendChild(a);document.addEventListener('DOMContentLoaded',function(){console.log('✅ Monetization system initialized');const e=document.getElementById('loja');e&&getComputedStyle(e).display!=='none'&&setTimeout(renderAffiliateStore,100)});
