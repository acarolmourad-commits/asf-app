#!/usr/bin/env python3
# MISSÃO HERMES — Quizzes: substituir resultado genérico por arquétipo com
# explicação + próximo passo real. Substituições exatas e idempotentes.
import io

TARGET = 'index.html'
with io.open(TARGET, encoding='utf-8') as f:
    src = f.read()
original = src

OLD_BASIC = (
    "            const emoji = pct >= 80 ? '\U0001f3c6' : pct >= 50 ? '\U0001f44d' : '\U0001f4da';\n"
    "            showToast(`${emoji} ${correct}/${total} acertos (${pct}%)! +${pts} pontos`);\n"
    "            earnPoints('quiz', pts);"
)
NEW_BASIC = (
    "            const arq = pct >= 80\n"
    "                ? {e:'\U0001f3c6', t:'Mana Expert', d:'Voc\u00ea domina a base do surf! Pr\u00f3ximo passo: desafios e metas no app.'}\n"
    "                : pct >= 50\n"
    "                ? {e:'\U0001f30a', t:'Mana em Evolu\u00e7\u00e3o', d:'Boa base! Reforce com o guia de etiqueta no mar e siga praticando.'}\n"
    "                : {e:'\U0001f331', t:'Mana Come\u00e7ando', d:'Todo mundo come\u00e7a do zero! Leia o guia Como come\u00e7ar a surfar (menu Aprender) e tente de novo.'};\n"
    "            showToast(`${arq.e} ${arq.t} — ${correct}/${total} acertos (${pct}%)! +${pts} pontos\\n${arq.d}`);\n"
    "            earnPoints('quiz', pts);"
)

OLD_SEG = (
    "            const emoji = pct >= 80 ? '\U0001f3c6' : pct >= 50 ? '\U0001f44d' : '\U0001f4da';\n"
    "            showToast(`${emoji} Seguran\u00e7a: ${correct}/${total} acertos (${pct}%)! +${pts} pontos`);\n"
    "            earnPoints('quiz', pts);"
)
NEW_SEG = (
    "            const arqSeg = pct >= 80\n"
    "                ? {e:'\U0001f3c6', t:'Guardi\u00e3 do Line-up', d:'Seguran\u00e7a em dia! Compartilhe o guia de etiqueta com uma mana iniciante.'}\n"
    "                : pct >= 50\n"
    "                ? {e:'\U0001f30a', t:'Mana Atenta', d:'Quase l\u00e1! Revise prioridade de onda e queda segura no guia de etiqueta.'}\n"
    "                : {e:'\U0001f331', t:'Mana Precavida', d:'Antes da pr\u00f3xima sess\u00e3o, leia Etiqueta no mar (menu Aprender) e refa\u00e7a o quiz.'};\n"
    "            showToast(`${arqSeg.e} ${arqSeg.t} — Seguran\u00e7a: ${correct}/${total} acertos (${pct}%)! +${pts} pontos\\n${arqSeg.d}`);\n"
    "            earnPoints('quiz', pts);"
)

changes = 0
if OLD_BASIC in src:
    src = src.replace(OLD_BASIC, NEW_BASIC, 1); changes += 1; print('✅ quiz básico: arquétipos aplicados')
else:
    print('ℹ️ quiz básico já atualizado')
if OLD_SEG in src:
    src = src.replace(OLD_SEG, NEW_SEG, 1); changes += 1; print('✅ quiz segurança: arquétipos aplicados')
else:
    print('ℹ️ quiz segurança já atualizado')

if src != original:
    with io.open(TARGET, 'w', encoding='utf-8') as f:
        f.write(src)
    assert src.count('<style') == src.count('</style>')
    print(f'💾 index.html atualizado ({changes} quizzes)')
else:
    print('ℹ️ sem alterações')
