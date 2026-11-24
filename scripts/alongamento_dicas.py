#!/usr/bin/env python3
"""
ASF Alongamento Dicas
Exercícios de alongamento para surfistas
"""

import random
import json
import os
from datetime import datetime

ALONGAMENTO_EXERCICIOS = [
    {
        "title": "Rotação de Ombros",
        "description": "Faça rotações suaves dos ombros para frente e para trás, dentro de uma amplitude confortável.",
        "steps": [
            "Fique em pé com braços relaxados ao lado do corpo",
            "Gire ombros para frente em círculos grandes (10x)",
            "Gire ombros para trás em círculos grandes (10x)",
            "Repita com círculos menores (10x cada)"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "2 min",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Alongamento de Costas (Gato-Vaca)",
        "description": "Em quatro apoios, alterne lentamente entre arredondar e estender suavemente as costas, sem forçar.",
        "steps": [
            "Apoie mãos e joelhos em uma superfície confortável",
            "Arredonde as costas suavemente",
            "Volte à posição inicial e estenda suavemente as costas",
            "Alterne devagar, respirando naturalmente, sem forçar"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "3 min",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Alongamento de Quadril (Borboleta)",
        "description": "Sentada, aproxime as plantas dos pés e deixe os joelhos para os lados, sem pressioná-los.",
        "steps": [
            "Sente no chão, costas retas",
            "Junte plantas dos pés, deixando joelhos caírem para os lados",
            "Segure pés com as mãos",
            "Incline corpo para frente mantendo coluna reta",
            "Se confortável, mantenha até 30 segundos, respirando naturalmente"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "2 min por lado",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Alongamento de Isquiotibiais",
        "description": "Sentada, estenda uma perna e incline o tronco apenas até sentir uma tensão leve, sem dor.",
        "steps": [
            "Sentada, estique uma perna",
            "Dobre a outra com pé próximo à coxa oposta",
            "Incline-se para frente pela perna esticada",
            "Mantenha coluna reta, não arredonde costas",
            "Segure 30s, troque perna"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "4 min total",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Mobilidade de Tornozelo",
        "description": "Sentada em local firme e seco, mova um tornozelo de cada vez em círculos suaves.",
        "steps": [
            "Sente-se em um apoio estável",
            "Mova um tornozelo em círculos suaves",
            "Inverta o sentido, sem forçar",
            "Repita com o outro tornozelo"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "2 min",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Alongamento Pós-Surf (Rotina leve)",
        "description": "Após surfar, se estiver confortável, faça movimentos suaves de ombros, costas e pernas, sem forçar. Interrompa se sentir dor.",
        "steps": [
            "Faça rotação de ombros (1 min)",
            "Alongamento de gato-vaca (1 min)",
            "Alongamento de quadril borboleta (1 min)",
            "Alongamento de isquiotibiais (1 min cada perna)",
            "Respiração natural, sem prender o ar (até 1 min)"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "6-8 min",
        "place": "Em local firme e seco, fora da água"
    },
    {
        "title": "Rotina Completa Pré-Surf (5 min)",
        "description": "Sugestão de movimentos leves em terra: ombros, costas, quadril e tornozelos. Adapte a rotina com orientação profissional.",
        "steps": [
            "Rotação de ombros: 1 min",
            "Gato-vaca: 1 min",
            "Rotação de quadril: 1 min",
            "Mobilidade tornozelo: 1 min",
            "Respire naturalmente, sem prender o ar"
        ],
        "benefits": ["Movimentos suaves", "Respeito aos limites do corpo", "Respiração natural"],
        "duration": "5 min",
        "place": "Em local firme e seco, fora da água"
    }
]

def get_random_exercise():
    return random.choice(ALONGAMENTO_EXERCICIOS)

def generate_html(exercise):
    steps_html = "".join([f"<li style='margin: 4px 0;'>{step}</li>" for step in exercise['steps']])
    benefits_html = "".join([f"<span style='background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:10px;font-size:11px;margin:2px;'>{b}</span>" for b in exercise['benefits']])

    return f"""
<div class="alongamento-exercise" style="background: linear-gradient(135deg, #27ae60, #2ecc71); padding: 20px; margin: 20px; border-radius: 16px; color: white; box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);">
    <h3 style="margin: 0 0 8px 0; font-size: 20px;">🧘 {exercise['title']}</h3>
    <p style="margin: 0 0 16px 0; line-height: 1.6; opacity: 0.9;">{exercise['description']}</p>
    
    <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 10px; margin: 8px 0 16px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>📋 Passo a passo:</strong></p>
        <ol style="margin: 0; padding-left: 20px; font-size: 14px;">
            {steps_html}
        </ol>
    </div>
    
    <div style="margin-bottom: 12px;">
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>✨ Cuidados:</strong></p>
        <div>{benefits_html}</div>
    </div>
    
    <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
        <span>⏱️ {exercise['duration']}</span>
        <span>📍 {exercise['place']}</span>
        <span>📊 {exercise['level'] if 'level' in exercise else 'Adapte aos seus limites'}</span>
    </div>
    <p style="font-size: 12px; line-height: 1.5;">Orientação geral, não tratamento. Os tempos são sugestões, não metas. Não force nem continue com dor. Se houver lesão ou limitação, procure orientação profissional.</p>
    <p style="font-size: 11px;"><a style="color: inherit;" href="https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/stretching/art-20047931">Fonte: Mayo Clinic — cuidados ao alongar</a></p>
</div>
"""

def save_exercise():
    os.makedirs('docs/generated', exist_ok=True)
    exercise = get_random_exercise()
    html = generate_html(exercise)
    with open('docs/generated/alongamento.html', 'w', encoding='utf-8') as f:
        f.write(html)
    return exercise

def main():
    import os
    exercise = save_exercise()
    print("🧘 Alongamento Gerado")
    print(f"   📌 {exercise['title']}")
    print(f"   ⏱️ {exercise['duration']}")
    print(f"   ✅ Arquivo: docs/generated/alongamento.html")

if __name__ == "__main__":
    main()