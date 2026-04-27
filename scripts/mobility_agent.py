#!/usr/bin/env python3
"""
ASF Mobility Agent
Gera conteúdo diário de mobilidade e salva em arquivos
"""

import random
import json
from datetime import datetime

MOBILITY_EXERCISES = [
    {
        "title": "Rotação de Ombros",
        "description": "Melhora mobilidade dos ombros para o paddling",
        "duration": "2 min",
        "place": "Em casa",
        "benefits": ["Paddling mais eficiente", "Previne lesões"],
        "video_tip": "Use uma faixa para ampliar o movimento"
    },
    {
        "title": "Alongamento de Costas",
        "description": "Previne dores nas costas causadas pelo remo",
        "duration": "3 min",
        "place": "Em casa",
        "benefits": ["Alivia tensão", "Melhora flexibilidade"],
        "video_tip": "Respire profundamente e segure 30s"
    },
    {
        "title": "Mobilidade de Quadril",
        "description": "Essencial para transferência de peso na prancha",
        "duration": "2 min",
        "place": "Em casa",
        "benefits": ["Melhora manobras", "Previne lesões no quadril"],
        "video_tip": "Faça círculos grandes e depois pequenos"
    },
]

DAILY_TIPS = [
    "Faça 5 min de mobilidade antes de surfar!",
    "A mobilidade de quadril é essencial para bottom turn!",
    "Alongue ombros todos os dias para um paddling melhor!",
]

def generate_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    exercise = random.choice(MOBILITY_EXERCISES)
    tip = random.choice(DAILY_TIPS)
    
    content = {
        "date": today,
        "exercise": exercise,
        "daily_tip": tip,
        "generated_at": datetime.now().isoformat()
    }
    
    os.makedirs('docs/generated', exist_ok=True)
    
    # Save as JSON for programmatic use
    with open('docs/generated/mobility.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    # Save as HTML for display
    html = f"""
<div class="mobility-tip" style="background: linear-gradient(135deg, #2ecc71, #27ae60); padding: 20px; margin: 20px; border-radius: 16px; color: white;">
    <h3 style="margin: 0 0 12px 0;">🧘 {exercise['title']}</h3>
    <p style="margin: 0 0 12px 0; opacity: 0.9;">{exercise['description']}</p>
    <p><strong>⏱️ {exercise['duration']}</strong> • 📍 {exercise['place']}</p>
    <p style="margin: 12px 0 0 0; font-size: 13px; opacity: 0.8;">💡 {exercise['video_tip']}</p>
</div>
"""
    with open('docs/generated/mobility.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    return content

def main():
    print("🧘 ASF Mobility Agent")
    print("=" * 50)
    content = generate_daily()
    print(f"✅ Mobility content generated for {content['date']}")
    print(f"   📌 {content['exercise']['title']}")
    print(f"   💡 {content['daily_tip']}")

if __name__ == "__main__":
    import os
    main()