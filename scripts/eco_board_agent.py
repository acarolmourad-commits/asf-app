#!/usr/bin/env python3
"""
ASF Eco Board Agent
Gera conteúdo sobre pranchas e sustentabilidade
"""

import random
import json
from datetime import datetime

BOARD_CONTENT = [
    {"title": "Longboard: O clássico", "content": "Longboards (9'0\"+) são perfeitas para ondas pequenas e estabilidade.", "tags": ["Longboard", "Clássico"]},
    {"title": "Funboard: A versátil", "content": "Funboards (7'0\"-8'6\") são ideais para evolução. Mais ágil que longboard, mantém estabilidade.", "tags": ["Funboard", "Evolução"]},
    {"title": "Shortboard: Performance", "content": "Shortboards (5'6\"-6'6\") são para performance. Requer técnica e condicionamento.", "tags": ["Shortboard", "Performance"]},
    {"title": "Fish: Para ondas pequenas", "content": "Shape com outline curto e largo. Perfeita para ondas fracas! Twin ou quad fin para mais speed.", "tags": ["Fish", "Speed"]},
]

PHENIX_CONTENT = [
    {"title": "Bloco Phenix Teccel", "content": "Núcleo EPS ecológico. Pode ser 100% reciclado ou biodegradado. Menor impacto ambiental.", "category": "Sustentabilidade"},
    {"title": "Benefícios do Bloco Ecológico", "content": "1. ♻️ 100% reciclável 2. 🌿 Biodegradável 3. 🧊 Livre de CFC 4. 💧 Menor consumo de água", "category": "Meio Ambiente"},
    {"title": "Por que escolher ecológico?", "content": "Quando a prancha chegar ao fim, o bloco pode ser reciclado ou se degrada naturalmente!", "category": "Consumo Consciente"},
]

DAILY_TIPS = [
    "Maré baixa às 11:45 hoje - melhor para iniciantes!",
    "Você sabia? O bloco Phenix Teccel pode ser reciclado!",
    "Protetor solar: reaplique a cada 2 horas!",
    "Hidrate-se: 500ml de água antes de surfar!",
    "Alongue ombros e costas antes de entrar na água!",
]

def generate_daily():
    today = datetime.now().strftime("%Y-%m-%d")
    board = random.choice(BOARD_CONTENT)
    eco = random.choice(PHENIX_CONTENT)
    tip = random.choice(DAILY_TIPS)
    
    content = {
        "date": today,
        "board_tip": board,
        "eco_tip": eco,
        "daily_message": tip,
        "generated_at": datetime.now().isoformat()
    }
    
    os.makedirs('docs/generated', exist_ok=True)
    
    # Save JSON
    with open('docs/generated/eco-board.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    # Save HTML
    html = f"""
<div class="eco-content" style="background: linear-gradient(135deg, #f1f8e9, #dcedc8); padding: 20px; margin: 20px; border-radius: 16px;">
    <h3 style="color: #2e7d32; margin: 0 0 12px 0;">🏄 {board['title']}</h3>
    <p style="color: #333; margin: 0 0 16px 0;">{board['content']}</p>
    <div style="background: #fff; padding: 12px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        <h4 style="margin: 0 0 8px 0; color: #2e7d32;">🌱 {eco['title']}</h4>
        <p style="margin: 0; color: #555; font-size: 14px;">{eco['content']}</p>
    </div>
    <p style="margin-top: 16px; font-style: italic; color: #666;">💡 {tip}</p>
</div>
"""
    with open('docs/generated/eco-board.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    return content

def main():
    print("🏄‍♀️ ASF Eco Board Agent")
    print("=" * 50)
    content = generate_daily()
    print(f"✅ Eco content for {content['date']}")
    print(f"   📌 Board: {content['board_tip']['title']}")
    print(f"   🌱 Eco: {content['eco_tip']['title']}")

if __name__ == "__main__":
    import os
    main()