// ASF Network Interlinks — conecta todos os apps satélite à rede ASF
// Atualizado em 18/11/2026 — catálogo canônico, navegação responsiva a domínios e legado preservado
(function(){
"use strict";
var HUB="https://asf.surf/";
var APPS=[{"u": "https://previsao.asf.surf/", "n": "🌊 ASF Previsão"}, {"u": "https://praias.asf.surf/", "n": "🏖️ ASF Praias"}, {"u": "https://mapa.asf.surf/", "n": "🗺️ ASF Mapa"}, {"u": "https://atlas.asf.surf/", "n": "🧭 ASF Atlas"}, {"u": "https://alerta.asf.surf/", "n": "🚨 ASF Alerta"}, {"u": "https://ponto.asf.surf/", "n": "📍 ASF Ponto"}, {"u": "https://leitura.asf.surf/", "n": "👁️ ASF Leitura de Mar"}, {"u": "https://goldenhour.asf.surf/", "n": "🌅 ASF Golden Hour"}, {"u": "https://treino.asf.surf/", "n": "🏋️ ASF Treino"}, {"u": "https://manobras.asf.surf/", "n": "⚡ ASF Manobras"}, {"u": "https://popup.asf.surf/", "n": "⏱️ ASF Pop-up"}, {"u": "https://apnea.asf.surf/", "n": "🫁 ASF Apneia"}, {"u": "https://respira.asf.surf/", "n": "🌬️ ASF Respira"}, {"u": "https://yoga.asf.surf/", "n": "🧘 ASF Yoga"}, {"u": "https://volume.asf.surf/", "n": "🏄 ASF Volume"}, {"u": "https://comunidade.asf.surf/", "n": "💬 ASF Comunidade"}, {"u": "https://parceiras.asf.surf/", "n": "🤝 ASF Parceiras"}, {"u": "https://mentorias.asf.surf/", "n": "🎓 ASF Mentorias"}, {"u": "https://carona.asf.surf/", "n": "🛖 ASF Carona"}, {"u": "https://galeria.asf.surf/", "n": "📸 ASF Galeria"}, {"u": "https://mercado.asf.surf/", "n": "🛒 ASF Mercado"}, {"u": "https://eco.asf.surf/", "n": "🌱 ASF Eco"}, {"u": "https://viagens.asf.surf/", "n": "✈️ ASF Viagens"}, {"u": "https://patrocinio.asf.surf/", "n": "💛 ASF Patrocínio"}, {"u": "https://glossario.asf.surf/", "n": "📖 ASF Glossário"}, {"u": "https://historia.asf.surf/", "n": "📜 ASF História"}, {"u": "https://kids.asf.surf/", "n": "🧒 ASF Kids"}, {"u": "https://checklist.asf.surf/", "n": "✅ ASF Checklist"}, {"u": "https://quiz.asf.surf/", "n": "🧠 ASF Quiz"}, {"u": "https://ranking.asf.surf/", "n": "🏆 ASF Ranking"}, {"u": "https://desafio.asf.surf/", "n": "🗓️ ASF Desafio 30"}, {"u": "https://memoria.asf.surf/", "n": "🏏 ASF Memória"}, {"u": "https://diario.asf.surf/", "n": "📓 ASF Diário"}, {"u": "https://mala.asf.surf/", "n": "🎒 ASF Mala"}, {"u": "https://seguranca.asf.surf/", "n": "🛟 ASF Segurança"}, {"u": "https://sos.asf.surf/", "n": "🆘 ASF SOS"}, {"u": "https://sono.asf.surf/", "n": "😴 ASF Sono"}, {"u": "https://bemestar.asf.surf/", "n": "💖 ASF Bem-Estar"}, {"u": "https://mental.asf.surf/", "n": "🧠 ASF Mental"}, {"u": "https://nutricao.asf.surf/", "n": "🥗 ASF Nutrição"}, {"u": "https://equipamento.asf.surf/", "n": "🏄‍♀️ ASF Equipamento"}, {"u": "https://desafios.asf.surf/", "n": "🎯 ASF Desafios"}, {"u": "https://filmes.asf.surf/", "n": "🎬 ASF Filmes"}, {"u": "https://podcast.asf.surf/", "n": "🎧 ASF Podcast"}, {"u": "https://inspiracao.asf.surf/", "n": "✨ ASF Inspiração"}, {"u": "https://sonhos.asf.surf/", "n": "🌠 ASF Sonhos"}, {"u": "https://achados.asf.surf/", "n": "🔍 ASF Achados"}, {"u": "https://matematica.asf.surf/", "n": "🔢 ASF Matemática"}, {"u": "https://tempo.asf.surf/", "n": "⛅ ASF Tempo"}, {"u": "https://asf.surf/emitir.html", "n": "💳 ASF Clube → Carteirinha"}];
function here(){
  var p=location.pathname.split("/").filter(Boolean);
  if(p.length)return p[0];
  var h=location.hostname||"";
  if(h==="asf.surf")return "asf-app";
  if(h.endsWith(".asf.surf"))return "asf-"+h.split(".")[0];
  return "";
}
function appKey(a){
  try{
    var u=new URL(a.u);
    if(u.hostname==="asf.surf"&&(u.pathname==="/emitir.html"||u.hash==="#carteirinha"))return "asf-clube";
    var p=u.pathname.split("/").filter(Boolean);
    if(p.length)return p[0];
    if(u.hostname.endsWith(".asf.surf"))return "asf-"+u.hostname.split(".")[0];
  }catch(e){}
  return "";
}
function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function dedupeNavs(){
  // Remove menus inline legados de interlinks (duplicados da barra Rede ASF)
  var navs=document.querySelectorAll("nav");
  navs.forEach(function(n){
    if(n.id==="asf-network-bar")return;
    if(n.getAttribute("aria-label")==="breadcrumb")return;
    var links=n.querySelectorAll('a[href*="acarolmourad-commits.github.io"]');
    if(links.length>=2){n.remove();}
  });
}
function mount(){
  if(document.getElementById("asf-network-bar"))return;
  dedupeNavs();
  var me=here();
  var others=APPS.filter(function(a){return appKey(a)!==me;});
  var picks=shuffle(others.slice()).slice(0,6);
  var bar=document.createElement("nav");
  bar.id="asf-network-bar";
  bar.setAttribute("aria-label","Rede de apps ASF");
  bar.style.cssText="margin-top:32px;padding:20px 12px;background:#0E2439;color:#fff;text-align:center;font-family:system-ui,sans-serif;border-radius:16px 16px 0 0";
  var h='<div style="font-weight:800;font-size:15px;margin-bottom:10px">🌐 Explore a Rede ASF — apps gratuitos de surf feminino</div>';
  h+='<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center">';
  h+='<a href="'+HUB+'" style="background:#00A8CC;color:#fff;padding:6px 12px;border-radius:999px;font-size:12px;text-decoration:none;font-weight:700">🏄‍♀️ App ASF (hub)</a>';
  h+='<a href="'+HUB+'guia-apps.html" style="background:#F4D03F;color:#0E2439;padding:6px 12px;border-radius:999px;font-size:12px;text-decoration:none;font-weight:700">⭐ Catálogo completo de apps</a>';
  h+='<a href="'+HUB+'novidades.html" style="background:#ffffff22;color:#fff;padding:6px 12px;border-radius:999px;font-size:12px;text-decoration:none;font-weight:700">📰 Novidades</a>';
  picks.forEach(function(a){h+='<a href="'+a.u+'" style="background:#ffffff14;color:#fff;padding:6px 12px;border-radius:999px;font-size:12px;text-decoration:none">'+a.n+'</a>';});
  h+='</div>';
  bar.innerHTML=h;
  var footer=document.querySelector("footer");
  if(footer&&footer.parentNode){footer.parentNode.insertBefore(bar,footer);}
  else{document.body.appendChild(bar);}
}
if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",mount);}else{mount();}
})();