#!/usr/bin/env python3
"""
ASF Smart Generator - Gera sugestões inteligentes
"""

import random
import json
from datetime import datetime

NEW_TIPS = [
    {"category": "Técnica", "title": "Como fazer o bottom turn", "content": "O bottom turn é a base. Transfira o peso para o pé da frente e gire a prancha.", "tags": ["Técnica", "Manobras"]},
    {"category": "Equipamento", "title": "Qual leash escolher", "content": "Use leash do mesmo tamanho ou ligeiramente menor que a prancha.", "tags": ["Equipamento", "Leash"]},
    {"category": "Saúde", "title": "Treino de força", "content": "Foque em exercícios compostos: remada com elástico, agachamentos, plank. 2-3x/semana.", "tags": ["Saúde", "Treino"]},
]

UTILITIES = [
    {"name": "Previsão de Ondas", "description": "7 dias de previsão", "icon": "🌊"},
    {"name": "Calculadora de Maré", "description": "Horários de maré", "icon": "🗓️"},
    {"name": "Calculadora de Prancha", "description": "Volume ideal", "icon": "🧮"},
]

IMPROVEMENTS = [
    {"type": "content", "title": "Mais dicas técnicas avançadas", "priority": "high"},
    {"type": "feature", "title": "Medidor de condições do mar", "priority": "high"},
    {"type": "layout", "title": "Modo escuro", "priority": "medium"},
]

def generate_smart():
    today = datetime.now().strftime("%Y-%m-%d")
    
    content = {
        "date": today,
        "new_tip": random.choice(NEW_TIPS),
        "new_utility": random.choice(UTILITIES),
        "improvements": random.sample(IMPROVEMENTS, 2),
        "generated_at": datetime.now().isoformat()
    }
    
    os.makedirs('docs/generated', exist_ok=True)
    
    # Save JSON
    with open('docs/generated/smart.json', 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    
    # Save HTML summary
    html = f"""
<div class="smart-summary" style="background: #f0f0f0; padding: 16px; margin: 16px; border-radius: 12px;">
    <h4 style="margin: 0 0 12px 0;">🤖 Sugestões Inteligentes</h4>
    <p><strong>💡 Nova dica:</strong> {content['new_tip']['title']}</p>
    <p><strong>🔧 Novo utilitário:</strong> {content['new_utility']['name']} - {content['new_utility']['description']}</p>
    <p><strong>✨ Melhorias sugeridas:</strong> {'; '.join(i['title'] for i in content['improvements'])}</p>
    <p style="font-size: 11px; color: #999; margin-top: 12px;">Gerado em {content['generated_at']}</p>
</div>
"""
    with open('docs/generated/smart.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    return content

def main():
    print("🤖 ASF Smart Generator")
    print("=" * 50)
    content = generate_smart()
    print(f"✅ Smart suggestions for {content['date']}")
    print(f"   💡 {content['new_tip']['title']}")
    print(f"   🔧 {content['new_utility']['name']}")

if __name__ == "__main__":
    import os
    main()