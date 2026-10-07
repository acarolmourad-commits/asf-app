/* ─── ASF Carteirinha Digital v2 — privacidade 2026-10-07 ───────────────────────────
   Carteirinha personalizada de cada usuária.
   Preparada para futuras parcerias (lojas, agências, pousadas):
   cada carteirinha tem número único + QR code de verificação. */
const ASF_CARD = {
  KEY: 'asf-card-v2',
  HIST_KEY: 'asf-card-history', /* controle de 1 emissão por ano (fallback local) */

  /* ─── Registro central (Supabase) — chave publishable (pública por design).
     Dados protegidos por RLS; acesso só via RPCs. NUNCA usar chave secret aqui. ─── */
  SUPABASE_URL: 'https://qktabrzbgdfndklytwub.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_qIvPxh6DavCPtntfflaRLw_QI_pZJih',
  get supabaseOn() { return !!this.SUPABASE_URL && !!this.SUPABASE_ANON_KEY; },

  /* ─── Registro de associadas (Google Apps Script → Google Sheets) ───
     Faz backup do controle de quem emitiu carteirinha.
     A sincronização Supabase→Sheets não é automática; este é o backup opcional.
     Deixe vazio se não usar Sheets. O controle interno fica no painel autenticado do Supabase. */
  REGISTRY_URL: '',

  async sha256(t) {
    const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t.trim().toLowerCase()));
    return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
  },

  async sbRpc(fn, body) {
    const r = await fetch(this.SUPABASE_URL + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: {
        'apikey': this.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + this.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error('RPC ' + fn + ': ' + r.status);
    return r.json();
  },

  /* --- controle anual de emissão --- */
  parseDataBR(s) {
    if (!s) return null;
    const m = String(s).match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (!m) { const t = new Date(s); return isNaN(t) ? null : t; }
    return new Date(+m[3], +m[2] - 1, +m[1]);
  },
  expirada(d) {
    const v = d && this.parseDataBR(d.validade);
    return v ? v.getTime() < Date.now() : true;
  },
  diasParaExpirar(d) {
    const v = d && this.parseDataBR(d.validade);
    return v ? Math.ceil((v.getTime() - Date.now()) / 86400000) : -1;
  },
  historico() {
    try { return JSON.parse(localStorage.getItem(this.HIST_KEY)) || { emissoes: [] }; }
    catch (e) { return { emissoes: [] }; }
  },
  registrarEmissao(numero) {
    const h = this.historico();
    h.emissoes.push({ numero: numero, em: new Date().toISOString() });
    localStorage.setItem(this.HIST_KEY, JSON.stringify(h));
  },
  proximaEmissaoLiberada() {
    /* retorna null se já pode emitir, senão a Date da próxima liberação */
    const h = this.historico();
    if (!h.emissoes.length) return null;
    const ultima = new Date(h.emissoes[h.emissoes.length - 1].em);
    const livre = new Date(ultima); livre.setFullYear(livre.getFullYear() + 1);
    return livre.getTime() > Date.now() ? livre : null;
  },

  /* Registro de associadas via Supabase REST API (tabela: associadas).
     Dados LGPD ficam no banco protegido por RLS. */

  niveis: ['Iniciante', 'Intermediária', 'Avançada'],

  /* futuras parcerias — exibido como "em breve" na carteirinha */
  parcerias: [
    { icon: '🛒', tipo: 'Lojas de surf parceiras', desc: 'descontos em pranchas, wax, lycras e acessórios ao apresentar a carteirinha' },
    { icon: '🏄‍♀️', tipo: 'Eventos ASF', desc: 'acesso prioritário a Surf Days, mutirões e encontros da comunidade' },
    { icon: '🏆', tipo: 'Campeonatos e clinics', desc: 'inscrições com condições especiais para associadas' },
    { icon: '✈️', tipo: 'Agências de viagens', desc: 'surf trips com tarifa de associada' },
    { icon: '🏡', tipo: 'Pousadas parceiras', desc: 'hospedagem com benefícios perto dos picos' },
  ],

  load() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || null; }
    catch (e) { return null; }
  },

  save(d) { localStorage.setItem(this.KEY, JSON.stringify(d)); },

  /* O registro central usa apenas a RPC existente; nunca consulta/lista associadas. */
  registrar() { /* a sincronização confirmada acontece em salvar() */ },
  escape(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },

  gerarNumero() {
    /* número único e não previsível (crypto) — padrão ASF-XXXXXXXXXX */
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sem I,O,0,1 para evitar confusão
    const rnd = new Uint32Array(10);
    crypto.getRandomValues(rnd);
    let s = '';
    for (let i = 0; i < 10; i++) s += abc[rnd[i] % abc.length];
    return 'ASF-' + s;
  },

  initials(nome) {
    return nome.trim().split(/\s+/).slice(0, 2)
      .map(p => p[0].toUpperCase()).join('');
  },

  async salvar() {
    if (this._saving) return;
    const value = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const atual = this.load() || {};
    const nome = value('card-nome');
    const nivel = value('card-nivel');
    const consent = document.getElementById('card-lgpd');
    const optin = document.getElementById('card-registrar');
    const central = !!(optin && optin.checked);
    const email = value('card-email').toLowerCase();
    if (nome.length < 2) { showToast('Informe seu nome de surfista.'); return; }
    if (!this.niveis.includes(nivel)) { showToast('Selecione seu nível.'); return; }
    if (!consent || !consent.checked) { showToast('Confirme o consentimento para gerar a carteirinha.'); return; }
    if (central && !atual.emailHash && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      showToast('Para registrar na ASF, informe um e-mail válido.'); return;
    }
    const d = {
      nome, nivel, praia: value('card-praia'), apelido: value('card-apelido'),
      cidade: value('card-cidade'), insta: value('card-insta'), foto: atual.foto || null,
      numero: atual.numero || this.gerarNumero(),
      desde: atual.desde || new Date().toLocaleDateString('pt-BR'),
      lgpdConsent: atual.lgpdConsent || new Date().toISOString(),
    };
    if (atual.emailHash) d.emailHash = atual.emailHash;
    if (atual.registrada) d.registrada = atual.registrada;
    this._saving = true;
    const btn = document.getElementById('card-submit');
    if (btn) { btn.disabled = true; btn.textContent = 'Gerando…'; }
    try {
      if (central && this.supabaseOn) {
        try {
          const hash = atual.emailHash || await this.sha256(email);
          const rows = await this.sbRpc('emitir_carteirinha', {
            p_numero: d.numero, p_email_hash: hash, p_nome: d.nome,
            p_apelido: d.apelido, p_nivel: d.nivel, p_praia: d.praia,
            p_cidade: d.cidade, p_insta: d.insta,
          });
          const r = Array.isArray(rows) && rows[0];
          if (!r || !r.numero || !r.validade || !['emitida','existente','renovada'].includes(r.status)) {
            throw new Error('Resposta de emissão inválida');
          }
          d.numero = r.numero;
          d.validade = String(r.validade).split('-').reverse().join('/');
          d.emailHash = hash;
          d.registrada = new Date().toISOString();
          if (r.status !== 'existente') this.registrarEmissao(d.numero);
          this.save(d);
          this.render('carteirinha-content');
          showToast(r.status === 'existente' ? 'Carteirinha recuperada/atualizada. Validade mantida.' : 'Carteirinha registrada na ASF!');
          if (typeof ASF_GAMIFICATION !== 'undefined') ASF_GAMIFICATION.checkAll();
          return;
        } catch (e) {
          // Falha de rede/servidor não pode ser tratada como registro confirmado.
          showToast('Registro indisponível. Sua carteirinha será salva neste dispositivo; tente registrar depois.');
        }
      }
      if (atual.numero && atual.validade && this.diasParaExpirar(atual) > 30) {
        d.validade = atual.validade;
      } else if (atual.numero && atual.validade) {
        const antiga = this.parseDataBR(atual.validade);
        const agora = new Date();
        const val = new Date(antiga && antiga > agora ? antiga : agora);
        val.setFullYear(val.getFullYear() + 1);
        d.validade = val.toLocaleDateString('pt-BR');
        this.registrarEmissao(d.numero);
        // Uma renovação offline ainda não foi confirmada pela ASF.
        delete d.registrada;
      } else {
        const livre = this.proximaEmissaoLiberada();
        if (livre) { showToast('Nova emissão neste dispositivo liberada em ' + livre.toLocaleDateString('pt-BR') + '.'); return; }
        const val = new Date(); val.setFullYear(val.getFullYear() + 1);
        d.validade = val.toLocaleDateString('pt-BR');
        this.registrarEmissao(d.numero);
      }
      this.save(d);
      this.render('carteirinha-content');
      if (!central) showToast('Carteirinha salva neste dispositivo. Baixe seu PNG!');
      if (typeof ASF_GAMIFICATION !== 'undefined') ASF_GAMIFICATION.checkAll();
    } catch (e) {
      showToast('Não foi possível salvar neste navegador. Verifique o armazenamento e tente novamente.', 'error');
    } finally {
      this._saving = false;
      if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = atual.numero ? 'Salvar carteirinha' : 'Gerar minha carteirinha'; }
    }
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
    /* não apaga mais a carteirinha: edita dados preservando número e validade */
    const d = this.load() || {};
    if (d.numero) {
      showToast('Editando dados — número e validade são mantidos ✏️');
    }
    this.render('carteirinha-content', d, true);
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

  render(containerId, prefill, forceForm) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const d = this.load();

    if (forceForm && d && d.numero) { this.renderForm(el, d); return; }
    if (!d || !d.numero) { this.renderForm(el, prefill || {}); return; }
    this.renderCard(el, d);
  },

  renderForm(el, p) {
    const field = (id, label, max, val) => '<label for="'+id+'">'+label+'</label><input id="'+id+'" maxlength="'+max+'" value="'+this.escape(val)+'">';
    el.innerHTML = '<div style="max-width:480px;margin:0 auto"><div class="card">' +
      '<h2>'+(p.numero ? 'Editar sua carteirinha' : 'Crie sua Carteirinha ASF')+'</h2>' +
      '<p>Preencha, gere e baixe sua carteirinha. Foto opcional após a emissão.</p>' +
      field('card-nome','Nome de surfista *',40,p.nome) +
      '<label for="card-nivel">Nível *</label><select id="card-nivel">'+this.niveis.map(n => '<option'+(p.nivel===n ? ' selected' : '')+'>'+n+'</option>').join('')+'</select>' +
      field('card-praia','Praia do coração (opcional)',40,p.praia) +
      '<details><summary>Mais dados (opcional)</summary>' +
      field('card-apelido','Apelido',30,p.apelido) + field('card-cidade','Cidade',40,p.cidade) + field('card-insta','Instagram',30,p.insta) + '</details>' +
      '<label class="card-consent"><input id="card-lgpd" type="checkbox"'+(p.lgpdConsent ? ' checked' : '')+'><span>Autorizo salvar minha carteirinha neste dispositivo. A foto fica neste navegador. <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.</span></label>' +
      '<label class="card-consent"><input id="card-registrar" type="checkbox"'+(p.registrada ? ' checked' : '')+'><span>Também autorizo o registro dos dados preenchidos, número e validade no controle interno ASF, para validar o QR na rede. Não será publicada uma lista de associadas. Opcional; desmarcar não exclui registros anteriores. Para exclusão, contate a ASF.</span></label>' +
      '<label for="card-email">E-mail (necessário apenas para registrar na ASF)</label><input id="card-email" type="email" maxlength="80" autocomplete="email" placeholder="seu@email.com">' +
      '<p style="font-size:12px">O registro usa um hash do e-mail, não o e-mail em texto. O QR confirma somente nível, validade e situação, sem nome ou contatos.</p>' +
      '<button id="card-submit" onclick="ASF_CARD.salvar()" class="btn btn-primary">'+(p.numero ? 'Salvar carteirinha' : 'Gerar minha carteirinha')+'</button>' +
      (p.numero ? '<button onclick="ASF_CARD.init()" class="btn btn-secondary">Voltar à carteirinha</button>' : '') + '</div></div>';
  },

  renderCard(el, d) {
    d = Object.assign({}, d);
    ['nome','nivel','praia','cidade','numero','desde','validade'].forEach(k => d[k] = this.escape(d[k]));
    if (d.foto && !/^data:image\/(jpeg|png|webp);base64,/.test(d.foto)) d.foto = null;
    el.innerHTML =
      '<div style="max-width:480px;margin:0 auto">' +
      '<div id="asf-card-visual" style="background:linear-gradient(135deg,var(--secondary) 0%,var(--primary-dark) 60%,var(--primary) 100%);border-radius:24px;padding:22px;color:white;box-shadow:var(--shadow-lg);margin-bottom:12px;position:relative;overflow:hidden">' +
      '<div style="position:absolute;top:-50px;right:-50px;width:180px;height:180px;background:radial-gradient(circle,rgba(255,255,255,0.12),transparent 70%);border-radius:50%"></div>' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;position:relative">' +
      this.avatarHtml(d, 64) +
      '<div><p style="font-size:18px;font-weight:800;margin:0">' + d.nome + '</p>' +
      '<p style="font-size:12px;opacity:0.8;margin:2px 0 0">' + d.nivel + (d.praia ? ' · 📍 ' + d.praia : '') + (d.cidade ? ' · ' + d.cidade : '') + '</p></div></div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-end;position:relative">' +
      '<div><p style="font-size:10px;opacity:0.6;margin:0;letter-spacing:2px;text-transform:uppercase">Nº da associada</p>' +
      '<p style="font-size:17px;font-weight:800;letter-spacing:1px;margin:2px 0 8px;font-family:monospace">' + d.numero + '</p>' +
      '<p style="font-size:11px;opacity:0.75;margin:0">Associada desde ' + d.desde + ' · Válida até ' + d.validade + '</p></div>' +
      '<a href="' + this.verificacaoUrl(d.numero) + '" target="_blank" rel="noopener"><img src="' + this.qrUrl(d.numero) + '" alt="QR de verificação" style="width:76px;height:76px;border-radius:10px;background:white;padding:4px"></a>' +
      '</div></div>' +
      '<div style="text-align:center;margin:0 0 12px;font-size:13px;font-weight:700">' +
      (this.expirada(d)
        ? '<span style="background:#E74C3C;color:#fff;padding:6px 14px;border-radius:20px">🔴 Expirada — clique em ✏️ Editar e salve para renovar</span>'
        : this.diasParaExpirar(d) <= 30
          ? '<span style="background:#F39C12;color:#fff;padding:6px 14px;border-radius:20px">🟡 Expira em ' + this.diasParaExpirar(d) + ' dias — já pode renovar em ✏️ Editar</span>'
          : '<span style="background:#27AE60;color:#fff;padding:6px 14px;border-radius:20px">🟢 Válida até ' + d.validade + '</span>') +
      '</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:16px">' +
      '<button onclick="ASF_CARD.baixar()" class="btn btn-secondary" style="flex:1;font-size:13px">⬇️ Baixar PNG</button>' +
      '<button onclick="document.getElementById(\'card-foto-input\').click()" class="btn btn-secondary" style="flex:1;font-size:13px">📷 ' + (d.foto ? 'Trocar foto' : 'Adicionar foto') + '</button>' +
      '<button onclick="ASF_CARD.editar()" class="btn btn-secondary" style="flex:1;font-size:13px">✏️ Editar</button>' +
      '<input id="card-foto-input" type="file" accept="image/*" style="display:none" onchange="ASF_CARD.uploadFoto(this)">' +
      '</div>' +
      '<p style="font-size:12px;text-align:center">' + (d.registrada ? 'Registro ASF confirmado. O QR não mostra nome ou contatos.' : 'Salva neste dispositivo. Para validar o QR na rede, use Editar e autorize o registro ASF.') + '</p>' +
      '</div>';
  },

  passoAPassoHtml() {
    const passos = [
      { n: '1', t: 'Preencha seus dados', d: 'nome de surfista, nível e praia do coração' },
      { n: '2', t: 'Adicione sua foto', d: 'opcional — deixa a carteirinha com a sua cara' },
      { n: '3', t: 'Receba seu número único', d: 'com QR code de verificação, válido por 1 ano' },
      { n: '4', t: 'Apresente nos parceiros', d: 'o parceiro escaneia o QR e confirma seu benefício' },
    ];
    return '<div class="card" style="margin-bottom:16px">' +
      '<p style="font-size:14px;font-weight:700;color:var(--secondary);margin:0 0 10px">📋 Como funciona</p>' +
      passos.map(s =>
        '<div style="display:flex;gap:10px;align-items:flex-start;padding:6px 0;border-top:1px solid var(--gray-100)">' +
        '<span style="min-width:24px;height:24px;border-radius:50%;background:var(--primary);color:white;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center">' + s.n + '</span>' +
        '<div><p style="font-size:13px;font-weight:600;margin:0;color:var(--secondary)">' + s.t + '</p>' +
        '<p style="font-size:12px;margin:0;color:var(--gray-600)">' + s.d + '</p></div></div>').join('') +
      '</div>';
  },

  parceriasHtml() {
    return '<div class="card" style="background:linear-gradient(135deg,rgba(0,168,204,0.05),rgba(155,89,182,0.06));border:1.5px dashed rgba(0,168,204,0.3)">' +
      '<p style="font-size:14px;font-weight:700;color:var(--secondary);margin:0 0 4px">🤝 Em breve: rede de benefícios ASF</p>' +
      '<p style="font-size:12px;color:var(--gray-600);margin:0 0 10px">Estamos fechando parcerias! Sua carteirinha terá QR de verificação para valer benefícios em:</p>' +
      this.parcerias.map(p =>
        '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-top:1px solid var(--gray-100)">' +
        '<span style="font-size:20px">' + p.icon + '</span>' +
        '<div><p style="font-size:13px;font-weight:600;margin:0;color:var(--secondary)">' + p.tipo + '</p>' +
        '<p style="font-size:12px;margin:0;color:var(--gray-600)">' + p.desc + '</p></div></div>').join('') +
      '<p style="font-size:12px;color:var(--gray-600);margin:10px 0 0;text-align:center">💜 Crie a sua agora e garanta seu número de associada — os benefícios chegam primeiro para quem já tem carteirinha!</p>' +
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
    let photo = null, qrImage = null, remaining = foto ? 2 : 1, finished = false;
    const finish = () => { if (!finished && --remaining === 0) { finished = true; draw(photo, qrImage); } };
    if (foto) { foto.onload = () => { photo = foto; finish(); }; foto.onerror = finish; foto.src = d.foto; }
    qr.onload = () => { qrImage = qr; finish(); };
    qr.onerror = finish;
    qr.src = this.qrUrl(d.numero);
    // PNG continua disponível se o provedor de QR não responder.
    setTimeout(() => { if (!finished) { finished = true; draw(photo, qrImage); } }, 7000);
  },

  init() { this.render('carteirinha-content'); }
};

/* ─── ASF HOTFIX 2026-09-21 ───────────────────────────────
   Repara cascata de erros do index.html sem precisar editá-lo:
   1) updateNotificationBadge() é chamada antes de existir (linha ~4323)
      -> mata o script que define 'beaches' -> renderSurfConditions quebra.
   2) LEVELS nunca foi definido -> getLevel() quebra conquistas/pontos.
   3) auto-init da carteirinha: evita a seção vazia (quadrado branco).
   4) FIX 2026-09-21b: usar window.X em vez de var X — o index.html declara
      'const beaches' global; 'var beaches' aqui causava SyntaxError de
      redeclaração e derrubava ESTE ARQUIVO INTEIRO (seção morta). */

/* stub seguro: se a função real existir depois, ela sobrescreve via hoisting no próprio script */
if (typeof window.updateNotificationBadge !== 'function') {
  window.updateNotificationBadge = function () {
    try {
      var badge = document.getElementById('notif-badge');
      if (badge) badge.style.display = 'none';
    } catch (e) {}
  };
}

/* praias (espelha a tabela original do index.html) — sem 'var', evita conflito com const do index */
if (!window.beaches) {
  window.beaches = {
    bertioga: { name: 'Bertioga', lat: -23.85, lon: -46.14 },
    santos:   { name: 'Santos',   lat: -23.96, lon: -46.33 },
    guaruja:  { name: 'Guarujá',  lat: -23.99, lon: -46.25 },
    ubatuba:  { name: 'Ubatuba',  lat: -23.43, lon: -45.08 },
    ilhabela: { name: 'Ilhabela', lat: -23.78, lon: -45.36 },
    maresias: { name: 'Maresias', lat: -23.79, lon: -45.36 },
    baleia:   { name: 'Praia da Baleia', lat: -23.82, lon: -45.45 },
    'sao-sebastiao': { name: 'São Sebastião', lat: -23.80, lon: -45.44 },
    itamambuca: { name: 'Itamambuca', lat: -23.45, lon: -45.05 },
    cambraia: { name: 'Cambraia', lat: -23.77, lon: -45.50 }
  };
}

/* níveis de gamificação (usados por getLevel no app.js) */
if (!window.LEVELS) {
  window.LEVELS = [
    { level: 1, name: 'Gotinha',      minPoints: 0 },
    { level: 2, name: 'Maré Leve',    minPoints: 100 },
    { level: 3, name: 'Onda Boa',     minPoints: 300 },
    { level: 4, name: 'Surfista',     minPoints: 500 },
    { level: 5, name: 'Onda Grande',  minPoints: 800 },
    { level: 6, name: 'Maresia',      minPoints: 1200 },
    { level: 7, name: 'Tubulosa',     minPoints: 1700 },
    { level: 8, name: 'Lenda do Mar', minPoints: 2300 }
  ];
}

/* auto-init: renderiza a carteirinha assim que o DOM estiver pronto,
   mesmo sem clique — a seção nunca fica em branco. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function () { ASF_CARD.init(); });
} else {
  ASF_CARD.init();
}

/* Estilos do formulário em qualquer entrada do app. */
if (!document.getElementById('asf-card-form-style')) {
  const style = document.createElement('style'); style.id = 'asf-card-form-style';
  style.textContent = '#carteirinha-content label:not(.card-consent){display:block;margin:12px 0 5px;font-size:13px;font-weight:600}#carteirinha-content input:not([type=checkbox]):not([type=file]),#carteirinha-content select{width:100%;box-sizing:border-box;padding:12px;border:1px solid #ccd6df;border-radius:10px;background:white;color:#0e2439;font:inherit}#carteirinha-content .card-consent{display:flex;gap:10px;margin:16px 0;font-size:13px;line-height:1.5}#carteirinha-content .card-consent input{flex:none;width:18px;height:18px;margin-top:3px}#carteirinha-content details{margin:16px 0}#carteirinha-content .btn{margin-top:8px}';
  document.head.appendChild(style);
}
