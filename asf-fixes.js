// ASF Fixes — Chatbot unificado (ManaBot 2.0), botão flutuante, saudação e calendário
// Publicado em 19/09/2026
(function(){
"use strict";

/* ============================================================
   1) CÉREBRO UNIFICADO — chatbotFAQs (43 tópicos)
   Usado pelo chat flutuante; ASF_CHATBOT.respond é o fallback.
============================================================ */
window.chatbotFAQs = {
  "previsão": "🌊 Para previsão em tempo real, use a aba Ondas ou o app ASF Previsão do Surf (previsao-surf). Swell, vento e maré atualizados!",
  "previsao": "🌊 Para previsão em tempo real, use a aba Ondas ou o app ASF Previsão do Surf. Swell, vento e maré atualizados!",
  "pontos": "🏆 Você ganha pontos ASF participando de eventos, completando desafios e contribuindo com a comunidade. Veja seu saldo na aba Gamificação!",
  "eventos": "📅 Temos WSL Saquarema, Hang Loose Maresias, ASF Surf Day e mais! Veja o Calendário de Eventos na home ou o app ASF Eventos (20 eventos oficiais).",
  "evento": "📅 Confira o Calendário de Eventos na home — botões 📆 Mês e 📋 Lista alternam as visões. Próximos: WSL Saquarema, Hang Loose Maresias, ASF Surf Day!",
  "contato": "📬 Fale com a ASF pelo WhatsApp da comunidade ou pelo Instagram @asf.surf. Links na seção Contatos!",
  "contatos": "📬 Fale com a ASF pelo WhatsApp da comunidade ou pelo Instagram @asf.surf. Links na seção Contatos!",
  "participar": "💜 Para participar: crie sua conta, pegue sua carteirinha digital (app Carteirinha) e venha para o próximo ASF Surf Day!",
  "como participar": "💜 Para participar: crie sua conta, pegue sua carteirinha digital e venha para o próximo ASF Surf Day!",
  "praia": "🏖️ Iniciante: Praia Verde (SP) — ondas mansas. Intermediária: Maresias. Todos são Safe Spots ASF com salva-vidas!",
  "melhor praia": "🥇 Para começar: Praia Verde (SP), ondas pequenas e mansas. Maresias é perfeita para intermediárias. Tombo e Guarujá Centro servem todos os níveis!",
  "iniciante": "🌱 Dicas para iniciantes: comece em praia de ondas pequenas (Praia Verde), use longboard/funboard 7'-8', surfe de manhã (6h-10h) e nunca sozinha!",
  "prancha": "🏄‍♀️ Primeira prancha: funboard ou longboard de 7' a 8', volume ≥ 2x seu peso em litros. Use a Calculadora de Prancha no app Prancha Ideal!",
  "tamanho de prancha": "📏 Volume ideal: pelo menos 2x o seu peso em litros. Ex.: 60kg → 120L+. O app Prancha Ideal calcula certinho para você!",
  "horário": "⏰ Melhor horário: 6h às 10h — vento fraco, ondas limpas e mar mais vazio. Evite meio-dia (vento terral forte).",
  "horario": "⏰ Melhor horário: 6h às 10h — vento fraco, ondas limpas e mar mais vazio.",
  "wax": "🕯️ Temperatura do wax: água < 15°C = cold; 15-19°C = cool; 19-23°C = warm; > 23°C = tropical. No litoral SP, warm/tropical na maior parte do ano!",
  "parafina": "🕯️ Escolha a parafina pela temperatura da água: cold (<15°C), cool (15-19), warm (19-23), tropical (>23).",
  "wetsuit": "🩱 Água acima de 22°C: biquíni/licra. 19-22°C: short john ou 2mm. Abaixo de 19°C: long john 3/2mm.",
  "roupa de neoprene": "🩱 Água acima de 22°C: licra. 19-22°C: 2mm. Abaixo de 19°C: long john 3/2mm.",
  "swell": "🌊 Swell ideal para SP: L/SE de 10-14s de período. Ventos E fracos deixam o mar glassy. Dados ao vivo na aba Ondas!",
  "vento": "💨 Vento offshore (terra→mar) deixa as ondas limpas. Onshore (mar→terra) bagunça. De manhã cedo geralmente está fraco!",
  "maré": "🌙 Maré cheia funciona bem em bancos de areia; maré vazia em fundo de pedra/coral forma tubos. Varia por praia!",
  "mare": "🌙 Maré cheia em bancos de areia; vazia em fundo de pedra/coral. Veja a maré do dia na aba Ondas!",
  "carteirinha": "🪪 Sua carteirinha digital ASF está no app Carteirinha — gere a sua e desbloqueie benefícios e acesso a eventos!",
  "segurança": "🛡️ Regras de ouro: nunca surfe sozinha, conheça seus limites, respeite a prioridade no pico e use sempre leash!",
  "seguranca": "🛡️ Nunca surfe sozinha, conheça seus limites, respeite a prioridade e use sempre leash!",
  "etiqueta": "🤙 Etiqueta do surf: quem está mais perto do pico tem prioridade; não drope; segure sua prancha; respeite as locais.",
  "prioridade": "🤙 Quem está mais próxima do pico/pocket tem a prioridade. Nunca drope a onda de outra surfista!",
  "alimentação": "🥜 Antes do surf: carboidrato leve (banana, aveia, amendoim). Depois: proteína magra + frutas. Hidrate-se bem!",
  "alimentacao": "🥜 Antes: banana/aveia/amendoim. Depois: proteína magra + frutas. Evite álcool 24h antes!",
  "treino": "💪 Treinos para surf: natação, prancha de equilíbrio, yoga e fortalecimento de core. Veja a aba Aprender!",
  "yoga": "🧘‍♀️ Yoga melhora equilíbrio, respiração e flexibilidade — perfeito para o surf. Conteúdos na aba Bem-estar!",
  "respiração": "🫁 Apneia e respiração diafragmática aumentam sua confiança em sessões de wipeout. Pratique fora d'água!",
  "medo": "💜 Medo é normal! Comece em ondas pequenas, com amigas, e evolua no seu ritmo. A comunidade ASF está aqui para apoiar você!",
  "wsl": "🏆 A etapa WSL de Saquarema está no nosso calendário! Confira datas e detalhes no Calendário de Eventos da home.",
  "saquarema": "🏄‍♀️ Saquarema (RJ) é palco da WSL! Ondas fortes — indicada para surfistas experientes. Evento no nosso calendário!",
  "maresias": "🌊 Maresias (SP): ondas consistentes para nível intermediário, palco do Hang Loose. Safe Spot ASF!",
  "surf day": "🏄‍♀️ O ASF Surf Day é nosso encontro da comunidade! Aulas, free surf e muita energia. Data no Calendário de Eventos!",
  "hang loose": "🌺 Hang Loose Maresias está no calendário oficial! Veja a data no Calendário de Eventos da home.",
  "loja": "🛍️ Produtos e parceiros ASF na seção Lojas. Membros com carteirinha têm descontos!",
  "quiz": "🧠 Teste seus conhecimentos de surf no Quiz ASF e acumule pontos de streak! App Quiz na lista de apps.",
  "diário": "📓 Registre suas sessões no Diário de Surf (app Diário) e acompanhe sua evolução!",
  "diario": "📓 Registre suas sessões no Diário de Surf e acompanhe sua evolução!",
  "viagem": "✈️ Planeje sua surf trip com o app Surf Trip — destinos, votação da galera e dicas!",
  "surf trip": "✈️ Planeje sua surf trip com o app Surf Trip — destinos, votação e dicas da comunidade!",
  "aprender": "📚 A aba Aprender tem tutoriais de take-off, leitura de onda, duck dive e muito mais!",
  "take-off": "🏄‍♀️ Take-off: remada forte, mãos na altura do peito, pé da frente primeiro, olhar no horizonte. Tutorial completo na aba Aprender!",
  "duck dive": "🦆 Duck dive: empurre o nose com os braços, afunde com o joelho e passe por baixo da onda. Treine em ondas pequenas!",
  "oi": "Oi, mana! 🌊 Pode perguntar: praias, prancha, horário, wax, eventos, carteirinha, previsão... o que você precisa?",
  "olá": "Olá! 🌊 Sou a ManaBot. Pergunte sobre praias, prancha, horário, wax, eventos ou carteirinha!",
  "ola": "Olá! 🌊 Sou a ManaBot. Pergunte sobre praias, prancha, horário, wax, eventos ou carteirinha!",
  "obrigada": "De nada, mana! 💜 Bons surfes! Se precisar, estou por aqui.",
  "obrigado": "De nada! 💜 Bons surfes! Se precisar, estou por aqui.",
  "ajuda": "🤖 Posso ajudar com: praias por nível, tamanho de prancha, melhor horário, wax, wetsuit, swell, maré, eventos, carteirinha, alimentação e segurança!",
  "quais eventos": "📅 Eventos oficiais: WSL Saquarema, Hang Loose Maresias, ASF Surf Day e mais 17! Veja o Calendário (botões 📆 Mês / 📋 Lista) ou o app ASF Eventos."
};

/* ============================================================
   2) MOTOR DE RESPOSTA UNIFICADO
============================================================ */
function asfBrainReply(rawMsg){
  const msg = (rawMsg||"").toLowerCase().trim();
  if(!msg) return null;
  for(const key of Object.keys(window.chatbotFAQs)){
    if(msg.includes(key)) return window.chatbotFAQs[key];
  }
  try{
    if(window.ASF_CHATBOT && typeof window.ASF_CHATBOT.respond === "function"){
      const r = window.ASF_CHATBOT.respond(msg);
      if(r && !r.includes("Não tenho essa informação")) return r;
    }
  }catch(e){}
  return "🤔 Ainda não sei essa! Tente: praias, prancha, horário, wax, swell, eventos, carteirinha ou previsão. 🤙";
}

/* ============================================================
   3) CHAT FLUTUANTE — reescrita segura das funções
============================================================ */
window.toggleChatbot = function(){
  const panel = document.getElementById("chatbot-panel");
  if(!panel) return;
  const opening = panel.style.display === "none" || panel.style.display === "";
  panel.style.display = opening ? "block" : "none";
  if(opening) asfFloatGreet();
};

function asfFloatGreet(){
  const msgs = document.getElementById("chatbot-messages");
  if(!msgs || msgs.dataset.asfGreeted) return;
  msgs.dataset.asfGreeted = "1";
  msgs.innerHTML += "<div style='background:#E0F7FA; padding:8px; border-radius:8px; margin:4px 0;'><strong>🤖 ManaBot:</strong> Oi, mana! 🌊 Eu sou a ManaBot, assistente da comunidade ASF. Pergunte sobre praias, prancha, horário, wax, eventos ou carteirinha!</div>";
  msgs.scrollTop = msgs.scrollHeight;
}

window.sendChatbotMessage = function(){
  const input = document.getElementById("chatbot-input");
  const msgs = document.getElementById("chatbot-messages");
  if(!input || !msgs) return;
  const raw = input.value.trim();
  if(!raw) return;
  msgs.innerHTML += "<div style='background:#eee; padding:8px; border-radius:8px; margin:4px 0;'><strong>Você:</strong> " + raw.replace(/</g,"&lt;") + "</div>";
  input.value = "";
  const typing = document.createElement("div");
  typing.id = "asf-typing";
  typing.style.cssText = "padding:8px; margin:4px 0; color:#888; font-style:italic; font-size:12px;";
  typing.textContent = "🤖 ManaBot está digitando...";
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(function(){
    const t = document.getElementById("asf-typing");
    if(t) t.remove();
    msgs.innerHTML += "<div style='background:#E0F7FA; padding:8px; border-radius:8px; margin:4px 0;'><strong>🤖 ManaBot:</strong> " + asfBrainReply(raw) + "</div>";
    msgs.scrollTop = msgs.scrollHeight;
  }, 600);
};

/* ============================================================
   4) BOTÃO 💬 FLUTUANTE + ENTER PARA ENVIAR
============================================================ */
function initFloatingChat(){
  const panel = document.getElementById("chatbot-panel");
  if(!panel) return;
  panel.style.display = "none";

  if(!document.getElementById("asf-chat-fab")){
    const btn = document.createElement("button");
    btn.id = "asf-chat-fab";
    btn.textContent = "💬";
    btn.title = "Falar com a ManaBot";
    btn.setAttribute("aria-label","Abrir chat com a ManaBot");
    btn.style.cssText = "position:fixed; bottom:24px; left:24px; width:56px; height:56px; border-radius:50%; border:none; background:linear-gradient(135deg,#00A8CC,#9b59b6); color:white; font-size:26px; cursor:pointer; z-index:1001; box-shadow:0 6px 20px rgba(0,0,0,0.3); transition:transform .2s;";
    btn.onmouseenter = function(){ btn.style.transform = "scale(1.1)"; };
    btn.onmouseleave = function(){ btn.style.transform = "scale(1)"; };
    btn.onclick = function(){ window.toggleChatbot(); };
    document.body.appendChild(btn);
  }

  const input = document.getElementById("chatbot-input");
  if(input && !input.dataset.asfEnter){
    input.dataset.asfEnter = "1";
    input.addEventListener("keydown", function(e){
      if(e.key === "Enter"){ e.preventDefault(); window.sendChatbotMessage(); }
    });
  }
}

/* ============================================================
   5) MANABOT DA SEÇÃO FINAL — saudação + Enter
============================================================ */
function initAsfSectionChat(){
  const msgs = document.getElementById("chatbot-messages-asf");
  if(msgs && !msgs.dataset.asfGreeted){
    msgs.dataset.asfGreeted = "1";
    msgs.innerHTML += '<div style="display:flex;justify-content:flex-start;margin-bottom:12px"><div style="background:var(--gray-100,#f4f4f4);color:#0E2439;padding:10px 14px;border-radius:16px 16px 16px 4px;font-size:14px;max-width:85%"><strong style="color:#00A8CC">🤖 ManaBot:</strong><br>Oi, mana! 🌊 Eu sou a ManaBot, a assistente da comunidade ASF. Posso te ajudar com dicas de praias para o seu nível, tamanho de prancha, melhor horário para surfar, temperatura do wax, eventos, carteirinha e muito mais. Toca numa sugestão abaixo ou escreve sua pergunta!</div></div>';
  }
  const input = document.getElementById("chatbot-input-asf");
  if(input && !input.dataset.asfEnter){
    input.dataset.asfEnter = "1";
    input.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        try{ if(window.ASF_CHATBOT) window.ASF_CHATBOT.sendAsf(); }catch(err){}
      }
    });
  }
}

/* ============================================================
   6) BOOT
============================================================ */
function asfFixesBoot(){
  try{ initFloatingChat(); }catch(e){ console.warn("ASF fixes (chat flutuante):", e); }
  try{ initAsfSectionChat(); }catch(e){ console.warn("ASF fixes (chat seção):", e); }
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", asfFixesBoot);
}else{
  asfFixesBoot();
}
setTimeout(asfFixesBoot, 1500);

})();

/* ============================================================
   MENU: link "Apps" para o hub de apps e sites satélites
============================================================ */
(function(){
  function addAppsTab(){
    var tabs=document.querySelector('.tabs');
    if(!tabs||tabs.querySelector('.apps-hub-tab'))return;
    var btn=document.createElement('button');
    btn.className='tab apps-hub-tab';
    btn.setAttribute('role','tab');
    btn.setAttribute('aria-selected','false');
    btn.setAttribute('aria-controls','apps-hub');
    btn.onclick=function(){location.href='apps/'};
    btn.innerHTML='<span class="tab-icon">\u{1F6F0}\uFE0F</span> Apps';
    tabs.appendChild(btn);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',addAppsTab);}else{addAppsTab();}
})();

/* ============================================================
   HOME: revive sessões Metas, Segurança e Calendário
============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  try{ if(typeof ASF_METAS!=='undefined') ASF_METAS.init(); }catch(e){console.error('ASF_METAS init',e);}
  try{ if(typeof ASF_BEACH_MAP!=='undefined') ASF_BEACH_MAP.render('seguranca-content'); }catch(e){console.error('ASF_BEACH_MAP init',e);}
  try{ if(typeof ASF_CALENDAR!=='undefined') ASF_CALENDAR.render('calendar-content'); }catch(e){console.error('ASF_CALENDAR init',e);}
});

/* ============================================================
   RODAPÉ: exibe o CNPJ oficial da ASF
============================================================ */
(function(){
  function addCnpjFooter(){
    var ps = document.querySelectorAll('footer p');
    for (var i = 0; i < ps.length; i++){
      if (ps[i].textContent.indexOf('Associação de Surf Feminino') !== -1 && !document.getElementById('asf-cnpj-footer')){
        var p = document.createElement('p');
        p.id = 'asf-cnpj-footer';
        p.style.marginTop = '4px';
        p.textContent = 'CNPJ 44.948.200/0001-46';
        ps[i].parentNode.insertBefore(p, ps[i].nextSibling);
        break;
      }
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',addCnpjFooter);}else{addCnpjFooter();}
})();

/* ============================================================
   HOME: banner hero com a logo oficial da ASF (PNG, completa)
============================================================ */
(function(){
  function swapHeroLogo(){
    var imgs = document.querySelectorAll('img[src*="hero-surf.jpg"], img[src*="asf-logo.png"]');
    for (var i = 0; i < imgs.length; i++){
      if (imgs[i].src.indexOf('asf-logo.png') === -1) imgs[i].src = 'assets/images/asf-logo.png';
      imgs[i].alt = 'Logo oficial da ASF - Associação de Surf Feminino';
      imgs[i].style.objectFit = 'contain';
      imgs[i].style.maxHeight = 'none';
      imgs[i].style.height = 'auto';
      imgs[i].style.width = 'auto';
      imgs[i].style.maxWidth = '240px';
      imgs[i].style.display = 'block';
      imgs[i].style.margin = '12px auto';
      imgs[i].style.background = 'transparent';
    }
    var og = document.querySelector('meta[property="og:image"]');
    if (og) og.setAttribute('content', 'https://acarolmourad-commits.github.io/asf-app/assets/images/asf-logo.png');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',swapHeroLogo);}else{swapHeroLogo();}
  setTimeout(swapHeroLogo, 1500);
})();

/* ============================================================
   HEADER: substitui o ícone SVG pela logo oficial (PNG)
============================================================ */
(function(){
  function swapHeaderLogo(){
    var icons = document.querySelectorAll('.logo-icon');
    for (var i = 0; i < icons.length; i++){
      if (icons[i].querySelector('img.asf-logo-img')) continue;
      icons[i].innerHTML = '<img class="asf-logo-img" src="assets/images/asf-logo.png" alt="Logo oficial da ASF - Associação de Surf Feminino" style="width:44px; height:auto; display:block;">';
      icons[i].style.width = 'auto';
      icons[i].style.height = 'auto';
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',swapHeaderLogo);}else{swapHeaderLogo();}
  setTimeout(swapHeaderLogo, 1500);
})();

/* ============================================================
   REMOVE: seção "Badges Patrocinados" (marcas ilustrativas,
   não representam parcerias vigentes da ASF)
============================================================ */
(function(){
  function removeSponsoredBadges(){
    var hs = document.querySelectorAll('h3');
    for (var i = 0; i < hs.length; i++){
      if (hs[i].textContent.indexOf('Badges Patrocinados') !== -1){
        var box = hs[i].closest('div');
        if (box && box.parentNode) box.parentNode.removeChild(box);
      }
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',removeSponsoredBadges);}else{removeSponsoredBadges();}
  setTimeout(removeSponsoredBadges, 1500);
})();

/* ============================================================
   REMOVE: seção "Ofertas Exclusivas para Manas ASF" (cupons e
   marcas ilustrativos, não representam parcerias vigentes da ASF)
============================================================ */
(function(){
  function removeFakeOffers(){
    var hs = document.querySelectorAll('h3');
    for (var i = 0; i < hs.length; i++){
      if (hs[i].textContent.indexOf('Ofertas Exclusivas') !== -1){
        var box = hs[i].closest('div');
        if (box && box.parentNode) box.parentNode.removeChild(box);
      }
    }
    var grid = document.getElementById('brand-offers');
    if (grid && grid.parentNode) grid.parentNode.removeChild(grid);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',removeFakeOffers);}else{removeFakeOffers();}
  setTimeout(removeFakeOffers, 1500);
  setTimeout(removeFakeOffers, 4000);
})();

/* ============================================================
   REMOVE: linha "Patrocinado por STHILL SURF" no Desafio da
   Semana (marca ilustrativa, não é parceria vigente da ASF)
============================================================ */
(function(){
  function removeFakeSponsor(){
    var sp = document.getElementById('brand-sponsor');
    if (sp && sp.parentNode && sp.parentNode.parentNode){
      sp.parentNode.parentNode.removeChild(sp.parentNode);
    }
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',removeFakeSponsor);}else{removeFakeSponsor();}
  setTimeout(removeFakeSponsor, 1500);
  setTimeout(removeFakeSponsor, 4000);
})();

/* ============================================================
   NEUTRALIZA: grade de marcas parceiras ilustrativas (home +
   Brand Hub) — substitui por estado "em breve" até as primeiras
   parcerias oficiais serem anunciadas
============================================================ */
(function(){
  var COMING_SOON = '<div style="grid-column:1/-1;text-align:center;padding:28px 16px;background:rgba(0,168,204,0.06);border:1px dashed rgba(0,168,204,0.4);border-radius:16px">'
    + '<div style="font-size:36px;margin-bottom:8px">🌊</div>'
    + '<p style="font-weight:600;color:#0E2439;margin:0 0 6px">Em breve: nossas primeiras marcas parceiras!</p>'
    + '<p style="font-size:13px;color:#666;margin:0 0 14px">Estamos fechando parcerias oficiais. Parcerias vigentes serão anunciadas nos canais oficiais da ASF. 💙</p>'
    + '<button onclick="showBrandContact()" style="padding:10px 22px;border-radius:50px;border:none;background:linear-gradient(135deg,#00A8CC,#9B59B6);color:#fff;font-weight:600;cursor:pointer">🤝 Sua marca aqui? Fale com a ASF</button>'
    + '</div>';
  function neutralizeBrands(){
    var card = document.getElementById('brand-home-card');
    if (card){
      card.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">'
        + '<div><p style="font-size:13px;font-weight:600;color:var(--primary,#00A8CC);margin:0;letter-spacing:0.3px">🤝 MARCAS PARCEIRAS</p>'
        + '<p style="font-size:12px;color:var(--gray-400,#999);margin:2px 0 0">Quem apoia o surf feminino</p></div></div>'
        + COMING_SOON;
    }
    var grid = document.getElementById('brand-grid');
    if (grid) grid.innerHTML = COMING_SOON;
    var filter = document.getElementById('brand-filter');
    if (filter) filter.innerHTML = '';
    var cta = document.getElementById('brand-cta-bar');
    if (cta) cta.innerHTML = '';
  }
  window.renderBrands = function(){ neutralizeBrands(); };
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',neutralizeBrands);}else{neutralizeBrands();}
  setTimeout(neutralizeBrands, 1500);
  setTimeout(neutralizeBrands, 4000);
})();


/* ============================================================
   3) UTILITIES — openUtility() (cards da home) + acessibilidade
   Corrige ReferenceError: openUtility is not defined
============================================================ */
(function(){
  "use strict";

  function utilityModal(title, bodyHtml){
    var old = document.getElementById('asf-utility-modal');
    if(old) old.remove();
    var ov = document.createElement('div');
    ov.id = 'asf-utility-modal';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label', title);
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(14,36,57,.55);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    ov.innerHTML = '<div style="background:#fff;border-radius:16px;max-width:420px;width:100%;padding:24px;box-shadow:0 10px 40px rgba(0,0,0,.25);position:relative;">'
      + '<button type="button" aria-label="Fechar" style="position:absolute;top:10px;right:12px;border:none;background:none;font-size:22px;cursor:pointer;color:#666;" id="asf-utility-close">×</button>'
      + '<h3 style="margin:0 0 12px;color:#0E2439;">' + title + '</h3>'
      + '<div style="font-size:14px;line-height:1.6;color:#333;">' + bodyHtml + '</div>'
      + '</div>';
    document.body.appendChild(ov);
    function close(){ ov.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key==='Escape') close(); }
    ov.addEventListener('click', function(e){ if(e.target===ov) close(); });
    ov.querySelector('#asf-utility-close').addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    ov.querySelector('#asf-utility-close').focus();
  }

  window.openUtility = function(key){
    switch(key){
      case 'tides':
        if (typeof window.showMareDetails === 'function') { window.showMareDetails(); return; }
        window.location.href = 'mareas/';
        return;
      case 'sunscreen':
        utilityModal('☀️ Protetor Solar',
          '<p>☀️ <strong>Passe protetor FPS 50+ 30 minutos antes</strong> de entrar na água e reaplique a cada 2 horas.</p>'
          + '<p>• Prefira protetor <strong>reef-safe</strong> (sem oxibenzona) para proteger o mar 🌊</p>'
          + '<p>• Não esqueça orelhas, pescoço e dorso dos pés!</p>'
          + '<p>• Zinc stick no rosto segura melhor durante a sessão.</p>');
        return;
      case 'sessionlog':
        utilityModal('📝 Diário de Surf',
          '<p>Registre cada sessão: ondas, local, condições e sensações. Acompanhe sua evolução ao longo do tempo!</p>'
          + '<p style="margin-top:12px;"><a href="diario/" style="display:inline-block;background:#00A8CC;color:#fff;padding:10px 18px;border-radius:10px;text-decoration:none;font-weight:bold;">Abrir Diário de Surf →</a></p>');
        return;
      case 'wetsuit':
        utilityModal('🧤 Guia de Wetsuit',
          '<p><strong>Água acima de 22°C:</strong> biquíni/licra.<br>'
          + '<strong>19–22°C:</strong> short john ou 2mm.<br>'
          + '<strong>Abaixo de 19°C:</strong> long john 3/2mm.</p></p>'
          + '<p>No litoral norte de SP, um long john 3/2mm cobre o inverno e uma 2mm o resto do ano. 🤙</p>');
        return;
      default:
        if (typeof window.showToast === 'function') window.showToast('Em breve! 💜');
    }
  };

  /* Acessibilidade: cards clicáveis viram "botões" de verdade */
  function a11yCards(){
    document.querySelectorAll('.utility-card[onclick]').forEach(function(card){
      if (card.getAttribute('role')) return;
      card.setAttribute('role','button');
      card.setAttribute('tabindex','0');
      card.addEventListener('keydown', function(e){
        if(e.key==='Enter'||e.key===' '){ e.preventDefault(); card.click(); }
      });
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',a11yCards);}else{a11yCards();}
  setTimeout(a11yCards, 2000);
})();

/* Fix: botão da enquete tinha atributo class duplicado no HTML (o segundo era ignorado) */
(function(){
  function fixPollBtn(){
    var b=document.querySelector('[data-poll-key="destino-Ilhabela"]');
    if(b && !b.classList.contains('poll-voted')) b.classList.add('poll-voted');
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',fixPollBtn);}else{fixPollBtn();}
  setTimeout(fixPollBtn, 2000);
})();

/* ============================================================
   2) REDE DE APPS ASF — anúncio dos 52 apps satélite na página inicial
   Publicado em 23/09/2026
============================================================ */
(function(){
  if (window.__ASF_REDE_BANNER__) return; window.__ASF_REDE_BANNER__ = true;
  var apps = [
    ["asf-previsao","🌊","ASF Previsão","Ondas, vento e maré em tempo real"],
    ["asf-praias","🏖️","ASF Praias","Guia de praias do litoral norte"],
    ["asf-mare","🌙","ASF Maré","Tábua de marés e fases da lua"],
    ["asf-mapa","🗺️","ASF Mapa","Mapa interativo dos picos"],
    ["asf-alerta","🚨","ASF Alerta","Alertas de condições do mar"],
    ["asf-ponto","📍","ASF Ponto","Check-in ao vivo nos picos"],
    ["asf-treino","💪","ASF Treino","Treinos de surf para mulheres"],
    ["asf-manobras","🏄‍♀️","ASF Manobras","Trilha de progressão com XP"],
    ["asf-diario","📖","ASF Diário","Diário de sessões de surf"],
    ["asf-comunidade","🤝","ASF Comunidade","Histórias e rede de apoio"],
    ["asf-eventos","📅","ASF Eventos","Calendário de competições"],
    ["asf-sos","🆘","ASF SOS","Emergência com geolocalização"]
  ];
  function build(){
    if (document.getElementById("asf-rede-apps")) return;
    var footer = document.querySelector("footer");
    if (!footer) return;
    var sec = document.createElement("section");
    sec.id = "asf-rede-apps";
    sec.style.cssText = "max-width:1100px;margin:40px auto;padding:0 16px;text-align:center";
    var html = '<h2 style="font-size:26px;color:#0e2439">🌐 Rede de Apps ASF</h2>' +
      '<p style="color:#567;max-width:640px;margin:8px auto 20px">Conheça nossa constelação de 52 aplicativos gratuitos feitos para surfistas: previsão, treino, segurança, comunidade e muito mais.</p>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">';
    apps.forEach(function(a){
      html += '<a href="https://acarolmourad-commits.github.io/'+a[0]+'/" style="display:block;background:#fff;border-radius:14px;padding:16px;text-decoration:none;color:#0e2439;box-shadow:0 2px 10px rgba(0,0,0,.07);border-top:3px solid #00a8cc">' +
        '<span style="font-size:26px">'+a[1]+'</span><h3 style="margin:6px 0 2px;font-size:15px">'+a[2]+'</h3><p style="font-size:12px;color:#567;margin:0">'+a[3]+'</p></a>';
    });
    html += '</div><p style="margin-top:16px"><a href="satellites.html" style="color:#00a8cc;font-weight:700">Ver todos os 52 apps →</a> · <a href="rede.html" style="color:#00a8cc;font-weight:700">Mapa da rede</a> · <a href="novidades.html" style="color:#00a8cc;font-weight:700">📰 Novidades</a></p>';
    sec.innerHTML = html;
    footer.parentNode.insertBefore(sec, footer);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();

/* ============================================================
   7) BANNER NOVIDADES DA REDE — anuncia novidades.html no topo da home
   Inserido em 23/09/2026
============================================================ */
(function(){
  function mountBanner(){
    if(document.getElementById("asf-novidades-banner"))return;
    var b=document.createElement("div");
    b.id="asf-novidades-banner";
    b.style.cssText="background:linear-gradient(90deg,#00a8cc,#0e2439);color:#fff;text-align:center;padding:10px 14px;font-size:14px;font-family:system-ui,sans-serif";
    b.innerHTML='📰 <strong>Novidade:</strong> a ASF agora tem 53 apps gratuitos de surf feminino! '+
      '<a href="https://acarolmourad-commits.github.io/asf-app/novidades.html" style="color:#f4d03f;font-weight:700;text-decoration:underline">Conheça a rede completa</a>'+
      ' · <a href="https://acarolmourad-commits.github.io/asf-app/satellites.html" style="color:#f4d03f;font-weight:700;text-decoration:underline">Constelação ASF</a>';
    document.body.insertBefore(b,document.body.firstChild);
  }
  if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",mountBanner);}else{mountBanner();}
})();
