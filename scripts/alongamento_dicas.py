#!/usr/bin/env python3
"""
ASF Alongamento Dicas
Exercícios de alongamento para surfistas
"""

import random
import json
from datetime import datetime

ALONGAMENTO_EXERCICIOS = [
    {
        "title": "Rotação de Ombros",
        "description": "10 rotações para frente, 10 para trás. Mantém core engajado durante movimento. Fundamental para paddling saudável.",
        "steps": [
            "Fique em pé com braços relaxados ao lado do corpo",
            "Gire ombros para frente em círculos grandes (10x)",
            "Gire ombros para trás em círculos grandes (10x)",
            "Repita com círculos menores (10x cada)"
        ],
        "benefits": ["Melhora mobilidade para remar", "Previne tendinite no ombro", "Aquecimento rápido"],
        "duration": "2 min",
        "place": "Em qualquer lugar",
        "video_url": "https://exemplo.com/video/ombros"
    },
    {
        "title": "Alongamento de Costas (Gato-Vaca)",
        "description": "De joelhos no chão, alterna entre arquear e curvar coluna. Alonga toda coluna vertebral e alivia tensão do remo.",
        "steps": [
            "Fique de 4 apoios (mãos e joelhos)",
            "Inspire e arquear costas (como gato assustado)",
            "Expire e curve costas (como vaca)",
            "Repita 10 vezes, lentamente"
        ],
        "benefits": ["Alivia dor nas costas", "Aumenta flexibilidade", "Melhora postura na prancha"],
        "duration": "3 min",
        "place": "Na areia ou em casa",
        "video_url": "https://exemplo.com/video/costas"
    },
    {
        "title": "Alongamento de Quadril (Borboleta)",
        "description": "Abre quadril para manobras. Posição sentada com plantas dos pés juntas, joelhos para fora. Segure 30 segundos.",
        "steps": [
            "Sente no chão, costas retas",
            "Junte plantas dos pés, deixando joelhos caírem para os lados",
            "Segure pés com as mãos",
            "Incline corpo para frente mantendo coluna reta",
            "Segure 30 segundos, respire fundo"
        ],
        "benefits": ["Maior mobilidade para bottom turn", "Previne lesões no quadril", "Melhora abertura para manobras"],
        "duration": "2 min por lado",
        "place": "Em qualquer lugar",
        "video_url": "https://exemplo.com/video/quadril"
    },
    {
        "title": "Alongamento de Isquiotibiais",
        "description": "Alongamento posterior da coxa essencial para movimento de pé na prancha. Flexibilidade para manobras e prevenção de lesões.",
        "steps": [
            "Sentada, estique uma perna",
            "Dobre a outra com pé próximo à coxa oposta",
            "Incline-se para frente pela perna esticada",
            "Mantenha coluna reta, não arredonde costas",
            "Segure 30s, troque perna"
        ],
        "benefits": ["Alongamento profundo", "Previne tensão", "Melhora amplitude de movimento"],
        "duration": "4 min total",
        "place": "Em casa ou na praia",
        "video_url": "https://exemplo.com/video/ischio"
    },
    {
        "title": "Mobilidade de Tornozelo",
        "description": "Gire tornozelos em círculos, 10x cada pé. Melhora equilíbrio na prancha e previne torções. Pode fazer sentada ou em pé!",
        "steps": [
            "Sentada ou em pé, cruze uma perna",
            "Gire tornozelo em círculos (10x)",
            "Gire em direção oposta (10x)",
            "Repita no outro pé"
        ],
        "benefits": ["Equilíbrio melhor na prancha", "Previne torções", "Facilita posicionamento dos pés"],
        "duration": "2 min",
        "place": "Qualquer lugar (até na água!)",
        "video_url": "https://exemplo.com/video/tornozelo"
    },
    {
        "title": "Alongamento Pós-Surf (Recuperação)",
        "description": "Músculos aquecidos alongam melhor! Alongue ombros, costas e pernas após surfar. Recuperação 40% mais rápida com alongamento pós-esforço.",
        "steps": [
            "Faça rotação de ombros (1 min)",
            "Alongamento de gato-vaca (1 min)",
            "Alongamento de quadril borboleta (1 min)",
            "Alongamento de isquiotibiais (1 min cada perna)",
            "Respiração profunda (1 min)"
        ],
        "benefits": ["Recuperação muscular mais rápida", "Menor dor no dia seguinte", "Libera tensão acumulada"],
        "duration": "6-8 min",
        "place": "Na praia ou em casa",
        "video_url": "https://exemplo.com/video/pos-surf"
    },
    {
        "title": "Rotina Completa Pré-Surf (5 min)",
        "description": "Aquecimento rápido antes de entrar na água. Sequência: ombros → costas → quadril → tornozelos → respiração.",
        "steps": [
            "Rotação de ombros: 1 min",
            "Gato-vaca: 1 min",
            "Rotação de quadril: 1 min",
            "Mobilidade tornozelo: 1 min",
            "Respiração 4-7-8: 1 min"
        ],
        "benefits": ["Previne lesões", "Melhora performance", "Prepara corpo e mente"],
        "duration": "5 min",
        "place": "Na areia antes de entrar",
        "video_url": "https://exemplo.com/video/pre-surf"
    },
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
        <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>✨ Benefícios:</strong></p>
        <div>{benefits_html}</div>
    </div>
    
    <div style="display: flex; justify-content: space-between; font-size: 12px; opacity: 0.8; margin-top: 12px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
        <span>⏱️ {exercise['duration']}</span>
        <span>📍 {exercise['place']}</span>
        <span>📊 {exercise['level'] if 'level' in exercise else 'Todos'}</span>
    </div>
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