# ASF - Patch: Quiz do Dia inativo
import re

src = open('index.html', encoding='utf-8').read()
orig = src

# 1) Inicialização resiliente: roda mesmo se o DOM já estiver pronto e isola erros
old = "if(window.ASF_QUIZ)ASF_QUIZ.render();if(window.ASF_QUIZ_HOME)ASF_QUIZ_HOME.init();if(window.ASF_BRAND_HOME)ASF_BRAND_HOME.init();if(window.ASF_METAS)ASF_METAS.init()\n})}"
assert old in src, 'init block not found'
new = """})
function asfSafeInit(){
  if(window.__asfInitDone)return;window.__asfInitDone=true;
  try{window.ASFAutoInit&&ASFAutoInit()}catch(e){console.error('ASFAutoInit',e)}
  try{window.updateXPBar&&updateXPBar()}catch(e){console.error('updateXPBar',e)}
  try{window.ASF_QUIZ&&ASF_QUIZ.render()}catch(e){console.error('ASF_QUIZ',e)}
  try{window.ASF_QUIZ_HOME&&ASF_QUIZ_HOME.init()}catch(e){console.error('ASF_QUIZ_HOME',e)}
  try{window.ASF_BRAND_HOME&&ASF_BRAND_HOME.init()}catch(e){console.error('ASF_BRAND_HOME',e)}
  try{window.ASF_METAS&&ASF_METAS.init()}catch(e){console.error('ASF_METAS',e)}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',asfSafeInit)}else{asfSafeInit()}"""
src = src.replace(old, new, 1)

# 2) Corrige seed negativo no sorteio diário das perguntas (hash JS pode ser negativo)
old2 = "return(seed*(pd+3))%(total-pd+1)"
assert old2 in src, 'seed line not found'
src = src.replace(old2, "return Math.abs(seed*(pd+3))%(total-pd+1)", 1)

open('index.html', 'w', encoding='utf-8').write(src)
print('index.html quiz patch ok:', len(orig), '->', len(src))
