#!/usr/bin/env python3
"""
ASF Mobility Agent
Agente que gera conteúdo diário sobre mobilidade e alongamento
"""

import random
from datetime import datetime
import json

# Exercícios de mobilidade
MOBILITY_EXERCISES = [
    {
        "title": "Rotação de Ombros",
        "description": "Melhora a mobilidade dos ombros para o paddling",
        "duration": "2 min",
        "place": "Em casa",
        "benefits": ["Paddling mais eficiente", "Previne lesões no ombro"],
        "video_tip": "Use uma faixa ou elastico para ampliar o movimento"
    },
    {
        "title": "Alongamento de Costas",
        "description": "Previne dores nas costas causadas pelo remo",
        "duration": "3 min",
        "place": "Em casa",
        "benefits": ["Alivia tensão nas costas", "Melhora flexibilidade"],
        "video_tip": "Respire profundamente e segure cada posição por 30 segundos"
    },
    {
        "title": "Mobilidade de Quadril",
        "description": "Essencial para transferência de peso na prancha",
        "duration": "2 min",
        "place": "Em casa",
        "benefits": ["Melhora manobras", "Previne lesões no quadril"],
        "video_tip": "Faça círculos grandes e depois pequenos"
    },
    {
        "title": "Mobilidade de Tornozelo",
        "description": "Melhora o equilíbrio na prancha",
        "duration": "2 min",
        "place": "Em casa",
        "benefits": ["Equilíbrio melhor", "Previne torções"],
        "video_tip": "Pode fazer sentado ou em pé"
    },
    {
        "title": "Alongamento de Isquiotibiais",
        "description": "Importante para o movimento de pé na prancha",
        "duration": "4 min",
        "place": "Em casa",
        "benefits": ["Flexibilidade para maneuvers", "Previne lesões"],
        "video_tip": "Use uma toalha ou faixa para ajudar no alongamento"
    },
    {
        "title": "Rotina Matinal Completa",
        "description": "10 minutos de mobilidade completa",
        "duration": "10 min",
        "place": "Em casa",
        "benefits": ["Rotina completa", "Pronto parasurf"],
        "video_tip": "Siga a sequência: ombros → costas → quadril → pernas"
    },
    {
        "title": "Aquecimento Pré-Surf",
        "description": "5 minutos antes de entrar na água",
        "duration": "5 min",
        "place": "Na praia",
        "benefits": ["Previne lesões", "Melhora performance"],
        "video_tip": "Foque nos movimentos que você vai usar surfando"
    },
    {
        "title": "Alongamento Pós-Surf",
        "description": "Recuperação depois de surfar",
        "duration": "8 min",
        "place": "Na praia ou em casa",
        "benefits": ["Recuperação mais rápida", "Menos dor muscular"],
        "video_tip": "Alongue os grupos musculares mais usados: ombros, costas, pernas"
    },
]

# Dicas diárias
DAILY_TIPS = [
    "💡 Dica do dia: Faça 5 min de mobilidade antes de surfar!",
    "🧘 A mobilidade de quadril é essencial para fazer bottom turn!",
    "💪 Alongue os ombros todos os dias para um paddling melhor!",
    "🦶 Não esqueça dos tornozelos - eles são essenciais para o equilíbrio!",
    "🌅 Comece o dia com 10 min de mobilidade e note a diferença!",
    "🏄‍♀️ Após surfar, alongue para uma recuperação mais rápida!",
    "🧘‍♀️ A yoga complementa perfeitamente o surf!",
    "💪 Fortaleça o core para mais estabilidade na prancha!",
]

def generate_daily_mobility():
    """Gera conteúdo diário de mobilidade"""
    today = datetime.now().strftime("%Y-%m-%d")
    exercise = random.choice(MOBILITY_EXERCISES)
    tip = random.choice(DAILY_TIPS)
    
    return {
        "date": today,
        "exercise": exercise,
        "daily_tip": tip,
        "generated_at": datetime.now().isoformat()
    }

def create_mobility_message():
    """Cria mensagem de notificação"""
    content = generate_daily_mobility()
    
    message = f"""
🧘 ASF - Mobilidade do Dia!

{exercise['title']}
📍 {exercise['place']} • ⏱️ {exercise['duration']}

{exercise['description']}

💪 Benefícios:
{chr(10).join(f"- {b}" for b in exercise['benefits'])}

🎬 Dica para o vídeo: {exercise['video_tip']}

{content['daily_tip']}

#SurfFeminino #ASF #Mobilidade #Alongamento #Yoga #Surf #HomeWorkout
"""
    return message

if __name__ == "__main__":
    print("🧘 ASF Mobility Agent")
    print("=" * 50)
    content = generate_daily_mobility()
    print(json.dumps(content, indent=2, ensure_ascii=False))