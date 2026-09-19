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
   (asfSafeInit roda antes das declarações const e nunca
   popula #metas-container, #seguranca-content e #calendar-content)
============================================================ */
document.addEventListener('DOMContentLoaded', function(){
  try{ if(typeof ASF_METAS!=='undefined') ASF_METAS.init(); }catch(e){console.error('ASF_METAS init',e);}
  try{ if(typeof ASF_BEACH_MAP!=='undefined') ASF_BEACH_MAP.render('seguranca-content'); }catch(e){console.error('ASF_BEACH_MAP init',e);}
  try{ if(typeof ASF_CALENDAR!=='undefined') ASF_CALENDAR.render('calendar-content'); }catch(e){console.error('ASF_CALENDAR init',e);}
});
