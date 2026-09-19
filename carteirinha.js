/* ─── ASF Carteirinha Digital v2 ─────────────────────────────
   Carteirinha personalizada de cada usuária.
   Preparada para futuras parcerias (lojas, agências, pousadas):
   cada carteirinha tem número único + QR code de verificação. */
const ASF_CARD = {
  KEY: 'asf-card-v2',

  niveis: ['Iniciante', 'Intermediária', 'Avançada'],

  /* futuras parcerias — exibido como "em breve" na carteirinha */
  parcerias: [
    { icon: '🛒', tipo: 'Lojas de surf', desc: 'descontos em pranchas, wax e acessórios' },
    { icon: '✈️', tipo: 'Agências de viagens', desc: 'surf trips com tarifa de associada' },
    { icon: '🏡', tipo: 'Pousadas parceiras', desc: 'hospedagem com benefícios perto dos picos' },
  ],

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || null; }
    catch (e) { return null; }
  },

  save(d) { localStorage.setItem(this.KEY, JSON.stringify(d)); },

  gerarNumero() {
    return 'ASF-' + Date.now().toString(36).toUpperCase() +
           Math.random().toString(36).substr(2, 3).toUpperCase();
  },

  initials(nome) {
    return nome.trim().split(/\s+/).slice(0, 2)
      .map(p => p[0].toUpperCase()).join('');
  },

  salvar() {
    const nome = document.getElementById('card-nome').value.trim();
    const nivel = document.getElementById('card-nivel').value;
    const praia = document.getElementById('card-praia').value.trim();
    if (nome.length < 2) { showToast('Conta pra gente o seu nome! 🏄‍♀️'); return; }
    const atual = this.load() || {};
    const d = {
      nome: nome,
      nivel: nivel,
      praia: praia,
      foto: atual.foto || null,
      numero: atual.numero || this.gerarNumero(),
      desde: atual.desde || new Date().toLocaleDateString('pt-BR'),
    };
    const val = new Date(); val.setFullYear(val.getFullYear() + 1);
    d.validade = val.toLocaleDateString('pt-BR');
    this.save(d);
    showToast('Carteirinha gerada! 🪪');
    this.render('carteirinha-content');
    if (typeof ASF_GAMIFICATION !== 'undefined') ASF_GAMIFICATION.checkAll();
  },

  uploadFoto(input) {
    const f = input.files && input.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        const s = Math.min(img.width, img.height);
        c.width = c.height = 256;
        c.getContext('2d').drawImage(
          img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 256, 256);
        const d = this.load() || {};
        d.foto = c.toDataURL('image/jpeg', 0.85);
        this.save(d);
        this.render('carteirinha-content');
      };
      img.src = r.result;
    };
    r.readAsDataURL(f);
  },

  editar() {
    const d = this.load() || {};
    localStorage.removeItem(this.KEY);
    this.render('carteirinha-content', d);
  },

  verificacaoUrl(numero) {
    return location.origin + location.pathname.replace(/[^/]*$/, '') +
           'verificar.html?numero=' + encodeURIComponent(numero);
  },

  qrUrl(numero) {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=4&data=' +
           encodeURIComponent(this.verificacaoUrl(numero));
  },

  avatarHtml(d, size) {
    if (d.foto) {
      return '<img src="' + d.foto + '" alt="Foto de ' + d.nome + '" style="width:' + size +
        'px;height:' + size + 'px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,0.6)">';
    }
    return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;' +
      'background:rgba(255,255,255,0.2);border:3px solid rgba(255,255,255,0.6);' +
      'display:flex;align-items:center;justify-content:center;font-size:' + (size / 2.4) +
      'px;font-weight:800;color:white">' + this.initials(d.nome) + '</div>';
  },

  render(containerId, prefill) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const d = this.load();

    if (!d || !d.numero) {
      const p = prefill || {};
      el.innerHTML =
        '<div style="max-width:480px;margin:0 auto"><div class="card" style="margin-bottom:16px">' +
        '<div style="text-align:center;padding:8px 0 16px">' +
        '<span style="font-size:44px">🏄‍♀️</span>' +
        '<p style="font-size:18px;font-weight:700;color:var(--secondary);margin:8px 0 4px">Crie sua Carteirinha ASF</p>' +
        '<p style="font-size:13px;color:var(--gray-600);margin:0">Gratuita, digital e só sua. Em breve valendo benefícios em parceiros!</p></div>' +
        '<label style="font-size:12px;font-weight:600;color:var(--gray-600)">Nome de surfista</label>' +
        '<input id="card-nome" type="text" maxlength="40" placeholder="Ex.: Ana Mar" value="' + (p.nome || '') + '" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid var(--gray-200);margin:4px 0 12px;font-family:inherit">' +
        '<label style="font-size:12px;font-weight:600;color:var(--gray-600)">Nível</label>' +
        '<select id="card-nivel" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid var(--gray-200);margin:4px 0 12px;font-family:inherit">' +
        this.niveis.map(n => '<option' + (p.nivel === n ? ' selected' : '') + '>' + n + '</option>').join('') +
        '</select>' +
        '<label style="font-size:12px;font-weight:600;color:var(--gray-600)">Praia do coração (opcional)</label>' +
        '<input id="card-praia" type="text" maxlength="40" placeholder="Ex.: Maresias" value="' + (p.praia || '') + '" style="width:100%;padding:12px;border-radius:10px;border:1.5px solid var(--gray-200);margin:4px 0 16px;font-family:inherit">' +
        '<button onclick="ASF_CARD.salvar()" class="btn btn-primary" style="width:100%">🪪 Gerar minha carteirinha</button>' +
        '</div>' + this.parceriasHtml() + '</div>';
      return;
    }

    el.innerHTML =
      '<div style="max-width:480px;margin:0 auto">' +
      '<div id="asf-card-visual" style="background:linear-gradient(135deg,var(--secondary) 0%,var(--primary-dark) 60%,var(--primary) 100%);border-radius:24px;padding:22px;color:white;box-shadow:var(--shadow-lg);margin-bottom:12px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;top:-50px;right:-50px;width:180px;height:180px;background:radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%);border-radius:50%"></div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;position:relative">' +
      this.avatarHtml(d, 64) +
      '<div><p style="font-size:18px;font-weight:800;margin:0">' + d.nome + '</p>' +
      '<p style="font-size:12px;opacity:0.8;margin:2px 0 0">' + d.nivel + (d.praia ? ' · 📍 ' + d.praia : '') + '</p></div></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative">' +
      '<div><p style="font-size:10px;opacity:0.6;margin:0;letter-spacing:2px;text-transform:uppercase">Nº da associada</p>' +
      '<p style="font-size:17px;font-weight:800;letter-spacing:1px;margin:2px 0 8px;font-family:monospace">' + d.numero + '</p>' +
      '<p style="font-size:11px;opacity:0.75;margin:0">Associada desde ' + d.desde + ' · Válida até ' + d.validade + '</p></div>' +
      '<a href="' + this.verificacaoUrl(d.numero) + '" target="_blank" rel="noopener"><img src="' + this.qrUrl(d.numero) + '" alt="QR de verificação" style="width:76px;height:76px;border-radius:10px;background:white;padding:4px"></a>' +
      '</div></div>' +
      '<div style="display:flex;gap:8px;margin-bottom:16px">' +
      '<button onclick="ASF_CARD.baixar()" class="btn btn-secondary" style="flex:1;font-size:13px">⬇️ Baixar PNG</button>' +
      '<button onclick="document.getElementById(\'card-foto-input\').click()" class="btn btn-secondary" style="flex:1;font-size:13px">📷 ' + (d.foto ? 'Trocar foto' : 'Adicionar foto') + '</button>' +
      '<button onclick="ASF_CARD.editar()" class="btn btn-secondary" style="flex:1;font-size:13px">✏️ Editar</button>' +
      '<input id="card-foto-input" type="file" accept="image/*" style="display:none" onchange="ASF_CARD.uploadFoto(this)">' +
      '</div>' +
      this.parceriasHtml() +
      '</div>';
  },

  parceriasHtml() {
    return '<div class="card" style="background:linear-gradient(135deg,rgba(0,168,204,0.05),rgba(155,89,182,0.06));border:1.5px dashed rgba(0,168,204,0.3)">' +
      '<p style="font-size:14px;font-weight:700;color:var(--secondary);margin:0 0 4px">🤝 Em breve: rede de parceiros ASF</p>' +
      '<p style="font-size:12px;color:var(--gray-600);margin:0 0 10px">Sua carteirinha tem QR de verificação para valer benefícios em:</p>' +
      this.parcerias.map(p =>
        '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid var(--gray-100)">' +
        '<span style="font-size:20px">' + p.icon + '</span>' +
        '<div><p style="font-size:13px;font-weight:600;margin:0;color:var(--secondary)">' + p.tipo + '</p>' +
        '<p style="font-size:12px;margin:0;color:var(--gray-600)">' + p.desc + '</p></div></div>').join('') +
      '</div>';
  },

  baixar() {
    const d = this.load();
    if (!d) return;
    const c = document.createElement('canvas');
    c.width = 900; c.height = 560;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 900, 560);
    g.addColorStop(0, '#0E2439'); g.addColorStop(0.6, '#007A99'); g.addColorStop(1, '#00A8CC');
    x.fillStyle = g;
    x.beginPath(); x.roundRect(0, 0, 900, 560, 40); x.fill();
    const draw = (img, qr) => {
      x.fillStyle = 'rgba(255,255,255,0.95)';
      x.font = '800 40px Outfit, sans-serif';
      x.fillText(d.nome, 220, 120);
      x.font = '400 26px Outfit, sans-serif';
      x.fillText(d.nivel + (d.praia ? '  ·  ' + d.praia : ''), 220, 165);
      if (img) { x.save(); x.beginPath(); x.arc(120, 130, 75, 0, 7); x.clip(); x.drawImage(img, 45, 55, 150, 150); x.restore(); }
      else {
        x.fillStyle = 'rgba(255,255,255,0.2)'; x.beginPath(); x.arc(120, 130, 75, 0, 7); x.fill();
        x.fillStyle = 'white'; x.font = '800 56px Outfit, sans-serif';
        x.textAlign = 'center'; x.fillText(this.initials(d.nome), 120, 150); x.textAlign = 'left';
      }
      x.fillStyle = 'rgba(255,255,255,0.7)'; x.font = '400 20px Outfit, sans-serif';
      x.fillText('Nº DA ASSOCIADA', 60, 420);
      x.fillStyle = 'white'; x.font = '800 34px monospace';
      x.fillText(d.numero, 60, 465);
      x.fillStyle = 'rgba(255,255,255,0.7)'; x.font = '400 20px Outfit, sans-serif';
      x.fillText('Desde ' + d.desde + '  ·  Válida até ' + d.validade, 60, 510);
      if (qr) x.drawImage(qr, 720, 400, 130, 130);
      x.fillStyle = 'white'; x.font = '800 28px Outfit, sans-serif';
      x.fillText('ASF — Associação de Surf Feminino', 60, 60);
      const a = document.createElement('a');
      a.download = 'carteirinha-asf.png';
      a.href = c.toDataURL('image/png');
      a.click();
      showToast('Carteirinha baixada! 🪪');
    };
    const foto = d.foto ? new Image() : null;
    const qr = new Image(); qr.crossOrigin = 'anonymous';
    let loaded = 0;
    const total = (foto ? 1 : 0) + 1;
    const done = () => { if (++loaded === total) draw(foto, qr); };
    if (foto) { foto.onload = done; foto.src = d.foto; }
    qr.onload = done;
    qr.onerror = () => draw(foto, null);
    qr.src = this.qrUrl(d.numero);
  },

  init() { this.render('carteirinha-content'); }
};
