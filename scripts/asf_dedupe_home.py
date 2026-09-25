#!/usr/bin/env python3
"""One-shot (25/09/2026): deduplica e corrige a home do ASF App.

1. window.dicas: remove 869 dicas duplicadas e reduz a 365 dicas unicas
   (uma por dia do ano), balanceadas por categoria.
2. Remove objeto de traducoes morto `removed = {...}` (duplicata de
   data/translations.js, ja carregado via <script src>).
3. Card "Quiz do Surf": texto corrigido (trilha de 5 niveis, nao "perfil
   de surfista, 6 perguntas") + nota explicando que as conquistas de quiz
   ficam bloqueadas ate a primeira resposta e quais quizzes contam.
4. Badge "Estudiosa": corrige "3 quizzes" -> "5 quizzes" (alinha com a
   logica renderAchievements que exige data.quizzes >= 5).
5. Interlinks: pills "Versao completa no app" nos headers das secoes da
   home que duplicam apps satelites (Nutricao, Mental, Praias, Eventos,
   Historia, Metas, Checklist, Tecnica, Treino, Seguranca, Calendario).
Idempotente.
"""
import re, random, sys

INDEX = "index.html"

def main():
    with open(INDEX, encoding="utf-8") as f:
        html = f.read()
    log = []

    # 1) dedupe + trim window.dicas -------------------------------------
    d = html.find("window.dicas = [")
    if d != -1 and "ASF-DICAS-DEDUPE" not in html:
        dend = html.find("];", d)
        arr = html[d:dend]
        entries = re.findall(r"\{\s*text:[^}]*?\},", arr)
        seen, uniq = set(), []
        for e in entries:
            m = re.search(r"text:\s*(\\?['\"])(.*?)\1\s*,\s*category", e)
            key = m.group(2) if m else e
            if key in seen:
                continue
            seen.add(key); uniq.append(e)
        random.seed(42); random.shuffle(uniq)
        per, kept = {}, []
        for e in uniq:
            m = re.search(r"category:\s*(\\?['\"])(.*?)\1", e)
            c = m.group(2) if m else "?"
            if per.get(c, 0) < 40:
                per[c] = per.get(c, 0) + 1; kept.append(e)
            if len(kept) >= 365:
                break
        newarr = ("window.dicas = [ <!-- ASF-DICAS-DEDUPE -->\n            "
                  + "\n            ".join(kept) + "\n        ")
        html = html[:d] + newarr + html[dend:]
        log.append(f"dicas: {len(entries)} -> {len(kept)}")
    else:
        log.append("dicas: nada a fazer")

    # 2) remove dead translations object --------------------------------
    m = re.search(r"\n\s*\n\s*removed = \{.*?\n\};\n", html, re.S)
    if m and len(re.findall(r"\bremoved\b", html)) == 1:
        html = html[:m.start()] + "\n" + html[m.end():]
        log.append("objeto 'removed' morto removido")
    else:
        log.append("removed: nada a fazer")

    # 3) quiz card fix + nota de conquistas -----------------------------
    old = ('<b style="display:block">Quiz do Surf</b>'
           '<small style="color:#666">Qual \u00e9 o seu perfil de surfista? 6 perguntas, 1 minuto</small>')
    new = ('<b style="display:block">Quiz do Surf \U0001F9E0 Trilha de Conhecimento</b>'
           '<small style="color:#666">5 n\u00edveis sequenciais, +50 pts por n\u00edvel. '
           '\U0001F31F \u00c9 o 1\u00ba quiz que desbloqueia suas conquistas!</small>')
    if old in html:
        html = html.replace(old, new)
        pos = html.find("Quiz do Surf \U0001F9E0 Trilha")
        endcard = html.find("</a>", pos) + 4
        note = ('<p style="font-size:12px;color:#5A6B7A;margin:0 20px 8px;text-align:center">'
                '\U0001F3C6 <b>Como funcionam as conquistas de quiz:</b> \U0001F31F Primeira Onda (1 quiz), '
                '\U0001F4DA Estudiosa (5 quizzes) e \U0001F3C4 Surfista Completa (10 quizzes) ficam '
                '<b>bloqueadas \U0001F512 aguardando sua primeira resposta</b>. '
                'Comece pelo <a href="quiz/" style="color:#00A8CC;font-weight:700">Quiz do Surf (trilha de 5 n\u00edveis)</a> '
                'e continue no <a href="https://acarolmourad-commits.github.io/asf-quiz/" style="color:#00A8CC;font-weight:700">Quiz Di\u00e1rio</a> '
                '\u2014 cada quiz conclu\u00eddo soma pontos e desbloqueia o pr\u00f3ximo n\u00edvel!</p>')
        html = html[:endcard] + note + html[endcard:]
        log.append("quiz card + nota de conquistas")
    else:
        log.append("quiz card: nada a fazer")

    # 4) badge Estudiosa 3 -> 5 quizzes ---------------------------------
    ob = ('Estudiosa</div>\n                    <div style="font-size: 10px; '
          'color: var(--gray-400);">3 quizzes</div>')
    if ob in html:
        html = html.replace(ob, ob.replace("3 quizzes", "5 quizzes"))
        log.append("badge Estudiosa corrigido")
    else:
        log.append("badge: nada a fazer")

    # 5) interlinks nas secoes duplicadas --------------------------------
    links = {
        "\U0001F957 Alimenta\u00e7\u00e3o & Nutri\u00e7\u00e3o": ("https://acarolmourad-commits.github.io/asf-nutricao/", "ASF Nutri\u00e7\u00e3o"),
        "\U0001F9E0 Mental & Calmaria": ("https://acarolmourad-commits.github.io/asf-mental/", "ASF Mental"),
        "\U0001F3D6\uFE0F Guia de Praias - Litoral Paulista": ("https://acarolmourad-commits.github.io/asf-praias/", "ASF Praias"),
        "\U0001F3C6 Competi\u00e7\u00f5es & Eventos": ("https://acarolmourad-commits.github.io/asf-eventos/", "ASF Eventos"),
        "\U0001F3DB\uFE0F Hist\u00f3rias do Surf": ("https://acarolmourad-commits.github.io/asf-historia/", "ASF Hist\u00f3ria"),
        "\U0001F3AF Metas de Surf": ("https://acarolmourad-commits.github.io/asf-sonhos/", "ASF Sonhos"),
        "\u2705 Checklist P\u00f3s-Surf": ("https://acarolmourad-commits.github.io/asf-checklist/", "ASF Checklist"),
        "\U0001F3C4\u200d\u2640\uFE0F T\u00e9cnica de Surf": ("https://acarolmourad-commits.github.io/asf-manobras/", "ASF Manobras"),
        "\U0001F4AA Sa\u00fade & Treino Funcional": ("https://acarolmourad-commits.github.io/asf-bemestar/", "ASF Bem-estar"),
        "&#x1F6DF; Seguran\u00e7a no Surf": ("https://acarolmourad-commits.github.io/asf-seguranca/", "ASF Seguran\u00e7a"),
        "&#x1F4C5; Calend\u00e1rio de Eventos": ("https://acarolmourad-commits.github.io/asf-eventos/", "ASF Eventos"),
    }
    count = 0
    for title, (url, name) in links.items():
        done = re.compile(r'<h2[^>]*>\s*' + re.escape(title) + r'\s*</h2>\s*<p style="text-align:center;margin:6px 0 0">')
        if done.search(html):
            continue
        pat = re.compile(r'(<h2[^>]*>\s*' + re.escape(title) + r'\s*)</h2>')
        mm = pat.search(html)
        if mm:
            pill = (f'</h2>\n<p style="text-align:center;margin:6px 0 0">'
                    f'<a href="{url}" style="display:inline-block;background:linear-gradient(90deg,#00A8CC,#0E2439);color:#fff;'
                    f'padding:6px 14px;border-radius:999px;font-size:12.5px;font-weight:700;text-decoration:none">'
                    f'\U0001F680 Vers\u00e3o completa no app {name} \u2192</a></p>')
            html = html[:mm.start()] + mm.group(1) + pill + html[mm.end():]
            count += 1
    log.append(f"interlinks adicionados: {count}")

    with open(INDEX, "w", encoding="utf-8") as f:
        f.write(html)
    print("OK:", " | ".join(log))

if __name__ == "__main__":
    main()
