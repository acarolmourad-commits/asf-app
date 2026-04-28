#!/usr/bin/env python3
"""
ASF Daily Mental Tip Generator
Gera uma dica mental diária
"""

import os
from datetime import datetime

TIPS = [
    {"cat": "🧠 Mindfulness", "title": "Respiração 4-7-8", "text": "Inspire 4s, segure 7s, expire 8s. Repita 3x. Acalma instantaneamente!"},
    {"cat": "🌊 Surf Mental", "title": "Uma onda de cada vez", "text": "Foque apenas na próxima onda. O presente é seu aliado."},
    {"cat": "💪 Confiança", "title": "Você sabe surfar", "text": "Lembre-se de 3 ondas que você conseguiu. Você é capaz!"},
    {"cat": "😰 Ansiedade", "title": "Olha o horizonte", "text": "Quando ansiedade subir, olhe para horizonte. A vista larga ajuda."},
    {"cat": "🧘 Meditação", "title": "5 minutos de paz", "text": "Senta na areia antes de surfar. Fecha olhos. Sente o som do mar."},
    {"cat": "🌅 Motivação", "title": "Novo dia", "text": "Cada sessão é uma chance de recomeçar. O que passou não define hoje."},
    {"cat": "🧠 Mindfulness", "title": "Corpo presente", "text": "Sente pés na prancha. Sente água. Mente divagando? Traz pro corpo."},
]

def main():
    today = datetime.now()
    day_of_year = today.timetuple().tm_yday
    tip = TIPS[day_of_year % len(TIPS)]

    html = f'''<div style="background:linear-gradient(135deg,#9B59B6,#8E44AD);padding:20px;margin:20px;border-radius:16px;color:white;">
<p style="font-size:12px;opacity:0.9;">{tip['cat']}</p><h3 style="margin:8px 0;">{tip['title']}</h3><p style="font-size:14px;line-height:1.6;">{tip['text']}</p><p style="font-size:11px;opacity:0.8;margin-top:12px;">⏰ {today.strftime('%d/%m/%Y')}</p></div>'''

    os.makedirs('docs', exist_ok=True)
    with open('docs/daily-tip.html', 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"✅ Daily tip generated: {tip['title']}")
    print(f"   File: docs/daily-tip.html ({len(html)} bytes)")

if __name__ == "__main__":
    main()
