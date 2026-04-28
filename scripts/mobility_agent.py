#!/usr/bin/env python3
"""
ASF Mobility Agent - Updated with new breathing & stretching content
Gera conteúdo diário de mobilidade, respiração e alongamento
"""

import random
import json
from datetime import datetime

# Exercícios de mobilidade
MOBILITY_EXERCISES = [
    {
        "title": "Rotação de Ombros",
        "description": "10 rotações para frente, 10 para trás. Mantém core engajado. Melhora mobilidade para paddling.",
        "duration": "2 min",
        "level": "Essencial",
        "benefits": ["Paddling mais eficiente", "Previne lesões no ombro"]
    },
    {
        "title": "Alongamento de Costas (Gato-Vaca)",
        "description": "De joelhos, alterna arquear e curvar coluna. 10 repetições. Alivia tensão do remo.",
        "duration": "3 min",
        "level": "Essencial",
        "benefits": ["Alivia tensão nas costas", "Melhora flexibilidade"]
    },
    {
        "title": "Mobilidade de Quadril (Borboleta)",
        "description": "Sentada, plantas dos pés juntas, joelhos para fora. Segure 30s. Abre quadril para manobras.",
        "duration": "2 min",
        "level": "Essencial",
        "benefits": ["Melhora manobras", "Previne lesões no quadril"]
    },
    {
        "title": "Mobilidade de Tornozelo",
        "description": "Gire tornozelos em círculos, 10x cada pé. Melhora equilíbrio na prancha.",
        "duration": "2 min",
        "level": "Essencial",
        "benefits": ["Equilíbrio melhor", "Previne torções"]
    },
    {
        "title": "Alongamento de Isquiotibiais",
        "description": "Sentada, uma perna esticada, inclina para frente. 30s cada lado.",
        "duration": "3 min",
        "level": "Avançado",
        "benefits": ["Flexibilidade para maneuvers", "Previne lesões"]
    },
]

def generate_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    exercise = random.choice(MOBILITY_EXERCISES)

    content = {
        "date": today,
        "exercise": exercise,
        "generated_at": datetime.now().isoformat()
    }

    import os
    os.makedirs('docs/generated', exist_ok=True)

    # Save JSON
    with open('docs/generated/mobility.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)

    # Save HTML
    html = f"""
<div class="mobility-tip" style="background: linear-gradient(135deg, #2ecc71, #27ae60); padding: 20px; margin: 20px; border-radius: 16px; color: white; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">
    <h3 style="margin: 0 0 12px 0; font-size: 20px;">🧘 {exercise['title']}</h3>
    <p style="margin: 0 0 12px 0; opacity: 0.9;">{exercise['description']}</p>
    
    <div style="background: rgba(0,0,0,0.15); padding: 10px; border-radius: 8px; margin-bottom: 12px;">
        <p style="margin: 0; font-size: 13px;"><strong>⏱️ Duração:</strong> {exercise['duration']}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px;"><strong>📊 Nível:</strong> {exercise['level']}</p>
    </div>
    
    <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px;">
        {"".join(f'<span style="background:rgba(255,255,255,0.2);padding:2px 10px;border-radius:10px;font-size:11px;">{benefit}</span>' for benefit in exercise['benefits'])}
    </div>
</div>
"""
    with open('docs/generated/mobility.html', 'w', encoding='utf-8') as f:
        f.write(html)

    return content

def main():
    print("🧘 ASF Mobility Agent (Updated)")
    print("=" * 50)
    content = generate_daily()
    print(f"✅ Mobility content for {content['date']}")
    print(f"   📌 {content['exercise']['title']}")

if __name__ == "__main__":
    main()