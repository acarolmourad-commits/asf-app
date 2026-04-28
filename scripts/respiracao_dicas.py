#!/usr/bin/env python3
"""
ASF Respiração Dicas
Técnicas de respiração para surfistas
"""

import random
import json
from datetime import datetime

RESPIRAÇÃO_DICAS = [
    {
        "title": "Respiração 4-7-8",
        "description": "Inspire 4s → segure 7s → expire 8s. Repita 3x. Técnica comprovada para acalmar sistema nervoso instantaneamente.",
        "when_to_use": "Antes de entrar na água, durante ansiedade, antes de manobras difíceis",
        "benefits": ["Reduz cortisol", "Diminui frequência cardíaca", "Aumenta foco"],
        "level": "Todos"
    },
    {
        "title": "Respiração Box (4-4-4-4)",
        "description": "Inspire 4s → segure 4s → expire 4s → segure 4s. Padrão quadrado que equilibra corpo e mente. Muito usado por atletas olímpicos.",
        "when_to_use": "No lineup esperando onda, entre sets, quando nervosa",
        "benefits": ["Controle da ansiedade", "Foco no presente", "Regular sistema nervoso"],
        "level": "Todos"
    },
    {
        "title": "Respiração Abdominal (Diafragmática)",
        "description": "Mãos na barriga. Inspire expandindo barriga (não peito). Expira completamente. Ativa nervo vago e sistema parassimpático.",
        "when_to_use": "Antes de remar, após queda de onda, momentos de pânico",
        "benefits": ["Mais oxigênio no sangue", "Reduz cortisol", "Aumenta calma"],
        "level": "Todos"
    },
    {
        "title": "Respiração before Paddling",
        "description": "3 respirações profundas antes de começar a remada. Inhala pelo nariz, exhala pela boca. Prepara corpo para esforço aeróbico.",
        "when_to_use": "Antes de sair para o lineup, antes de remar para onda grande",
        "benefits": ["Oxygena músculos", "Prepara diafragma", "Diminui sensação de cansaço"],
        "level": "Iniciante+"
    },
    {
        "title": "Respiração durante wipeout",
        "description": "Na queda, proteja cabeça e concentre-se em expirar lentamente. Isso evita pânico e conserve ar. Confie na prancha e no leash!",
        "when_to_use": "Durante queda, quando onda te virar, em situações de sufocamento",
        "benefits": ["Mantém calma", "Conserva ar", "Reduz pânico"],
        "level": "Intermediário+"
    },
    {
        "title": "Respiração recovering",
        "description": "Depois de passar porwave difícil, faça 5 ciclos de 4-7-8. Acalma coração e mente antes de voltar a remar.",
        "when_to_use": "Após queda assustadora, depois de passar muito tempo debaixo d'água",
        "benefits": ["Recuperação rápida", "Controle emocional", "Prepara para próxima"],
        "level": "Todos"
    },
]

def get_random_tip():
    return random.choice(RESPIRAÇÃO_DICAS)

def generate_html(tip):
    return f"""
<div class="respiracao-tip" style="background: linear-gradient(135deg, #3498db, #2980b9); padding: 20px; margin: 20px; border-radius: 16px; color: white; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);">
    <h3 style="margin: 0 0 12px 0; font-size: 20px;">🧘 {tip['title']}</h3>
    <p style="margin: 0 0 16px 0; line-height: 1.6; opacity: 0.9;">{tip['description']}</p>
    
    <div style="background: rgba(255,255,255,0.15); padding: 12px; border-radius: 10px; margin-bottom: 12px;">
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>📌 Quando usar:</strong></p>
        <p style="margin: 0; font-size: 12px; opacity: 0.9;">{tip['when_to_use']}</p>
    </div>
    
    <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px;">
        <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 11px;">✅ {tip['benefits'][0]}</span>
        <span style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 11px;">✅ {tip['benefits'][1]}</span>
    </div>
    <p style="font-size: 11px; opacity: 0.7; margin-top: 12px;">Nível: {tip['level']}</p>
</div>
"""

def save_tip():
    os.makedirs('docs/generated', exist_ok=True)
    tip = get_random_tip()
    html = generate_html(tip)
    with open('docs/generated/respiracao.html', 'w', encoding='utf-8') as f:
        f.write(html)
    return tip

def main():
    import os
    tip = save_tip()
    print("🧘 Respiração Dica Gerada")
    print(f"   📌 {tip['title']}")
    print(f"   💡 {tip['description'][:60]}...")
    print("   ✅ Arquivo: docs/generated/respiracao.html")

if __name__ == "__main__":
    main()