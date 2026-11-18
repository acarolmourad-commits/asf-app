// ASF Network Interlinks — conecta todos os apps satélite à rede ASF
// Atualizado em 18/11/2026 — catálogo canônico, navegação responsiva a domínios e legado preservado
(function(){
"use strict";
var HUB="https://asf.surf/";
var APPS=[{"u":"https://acarolmourad-commits.github.io/asf-previsao/","n":"🌊 ASF Previsão"},{"u":"https://acarolmourad-commits.github.io/asf-praias/","n":"🏖️ ASF Praias"},{"u":"https://acarolmourad-commits.github.io/asf-mapa/","n":"🗺️ ASF Mapa"},{"u":"https://acarolmourad-commits.github.io/asf-atlas/","n":"🧭 ASF Atlas"},{"u":"https://acarolmourad-commits.github.io/asf-alerta/","n":"🚨 ASF Alerta"},{"u":"https://acarolmourad-commits.github.io/asf-ponto/","n":"📍 ASF Ponto"},{"u":"https://acarolmourad-commits.github.io/asf-leitura/","n":"👁️ ASF Leitura de Mar"},{"u":"https://acarolmourad-commits.github.io/asf-goldenhour/","n":"🌅 ASF Golden Hour"},{"u":"https://treino.asf.surf/","n":"🏋️ ASF Treino"},{"u":"https://acarolmourad-commits.github.io/asf-manobras/","n":"⚡ ASF Manobras"},{"u":"https://acarolmourad-commits.github.io/asf-popup/","n":"⏱️ ASF Pop-up"},{"u":"https://apnea.asf.surf/","n":"🫁 ASF Apneia"},{"u":"https://respira.asf.surf/","n":"🌬️ ASF Respira"},{"u":"https://acarolmourad-commits.github.io/asf-yoga/","n":"🧘 ASF Yoga"},{"u":"https://acarolmourad-commits.github.io/asf-volume/","n":"🏄 ASF Volume"},{"u":"https://acarolmourad-commits.github.io/asf-comunidade/","n":"💬 ASF Comunidade"},{"u":"https://acarolmourad-commits.github.io/asf-parceiras/","n":"🤝 ASF Parceiras"},{"u":"https://acarolmourad-commits.github.io/asf-mentorias/","n":"🎓 ASF Mentorias"},{"u":"https://acarolmourad-commits.github.io/asf-carona/","n":"🛖 ASF Carona"},{"u":"https://galeria.asf.surf/","n":"📸 ASF Galeria"},{"u":"https://acarolmourad-commits.github.io/asf-mercado/","n":"🛒 ASF Mercado"},{"u":"https://acarolmourad-commits.github.io/asf-eco/","n":"🌱 ASF Eco"},{"u":"https://acarolmourad-commits.github.io/asf-viagens/","n":"✈️ ASF Viagens"},{"u":"https://acarolmourad-commits.github.io/asf-patrocinio/","n":"💛 ASF Patrocínio"},{"u":"https://acarolmourad-commits.github.io/asf-glossario/","n":"📖 ASF Glossário"},{"u":"https://acarolmourad-commits.github.io/asf-historia/","n":"📜 ASF História"},{"u":"https://acarolmourad-commits.github.io/asf-kids/","n":"🧒 ASF Kids"},{"u":"https://acarolmourad-commits.github.io/asf-checklist/","n":"✅ ASF Checklist"},{"u":"https://acarolmourad-commits.github.io/asf-quiz/","n":"🧠 ASF Quiz"},{"u":"https://acarolmourad-commits.github.io/asf-ranking/","n":"🏆 ASF Ranking"},{"u":"https://acarolmourad-commits.github.io/asf-desafio/","n":"🗓️ ASF Desafio 30"},{"u":"https://acarolmourad-commits.github.io/asf-memoria/","n":"🏏 ASF Memória"},{"u":"https://acarolmourad-commits.github.io/asf-diario/","n":"📓 ASF Diário"},{"u":"https://acarolmourad-commits.github.io/asf-mala/","n":"🎒 ASF Mala"},{"u":"https://acarolmourad-commits.github.io/asf-seguranca/","n":"🛟 ASF Segurança"},{"u":"https://sos.asf.surf/","n":"🆘 ASF SOS"},{"u":"https://acarolmourad-commits.github.io/asf-sono/","n":"😴 ASF Sono"},{"u":"https://acarolmourad-commits.github.io/asf-bemestar/","n":"💖 ASF Bem-Estar"},{"u":"https://acarolmourad-commits.github.io/asf-mental/","n":"🧠 ASF Mental"},{"u":"https://acarolmourad-commits.github.io/asf-nutricao/","n":"🥗 ASF Nutrição"},{"u":"https://acarolmourad-commits.github.io/asf-equipamento/","n":"🏄‍♀️ ASF Equipamento"},{"u":"https://acarolmourad-commits.github.io/asf-desafios/","n":"🎯 ASF Desafios"},{"u":"https://acarolmourad-commits.github.io/asf-filmes/","n":"🎬 ASF Filmes"},{"u":"https://acarolmourad-commits.github.io/asf-podcast/","n":"🎧 ASF Podcast"},{"u":"https://acarolmourad-commits.github.io/asf-inspiracao/","n":"✨ ASF Inspiração"},{"u":"https://acarolmourad-commits.github.io/asf-sonhos/","n":"🌠 ASF Sonhos"},{"u":"https://asf.surf/#carteirinha","n":"💳 ASF Clube → Carteirinha"},{"u":"https://acarolmourad-commits.github.io/asf-achados/","n":"🔍 ASF Achados"},{"u":"https://acarolmourad-commits.github.io/asf-matematica/","n":"🔢 ASF Matemática"},{"u":"https://acarolmourad-commits.github.io/asf-tempo/","n":"⛅ ASF Tempo"}];
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
    if(u.hostname==="asf.surf"&&u.hash==="#carteirinha")return "asf-clube";
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