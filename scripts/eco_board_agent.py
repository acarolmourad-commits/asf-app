#!/usr/bin/env python3
"""
ASF Surfboard & Eco Agent
Agente que gera conteúdo diário sobre pranchas e sustentabilidade
"""

import random
from datetime import datetime
import json

# Conteúdo sobre pranchas
BOARD_CONTENT = [
    {
        "title": "Longboard: O clássico atemporal",
        "content": "Longboards são pranchas de 9'0\" ou mais. Perfeitas para ondas pequenas e para quem busca estabilidade. O estilo classic surfing com trilhos paralelos está voltando com força!",
        "tags": ["Longboard", "Técnica", "Clássico"]
    },
    {
        "title": "Funboard: O estilo versátil",
        "content": "Funboards (7'0\" - 8'6\") são ideais para quem quer evoluir. Mais ágil que o longboard, oferece mais manobras mantendo a estabilidade. Perfeito transição!",
        "tags": ["Funboard", "Evolução", "Versátil"]
    },
    {
        "title": "Shortboard: Radical e performance",
        "content": "Shortboards (5'6\" - 6'6\") são para quem busca performance. Mais rápida, ideal para ondas médias a grandes. Requer mais técnica e condition física.",
        "tags": ["Shortboard", "Performance", "Radical"]
    },
    {
        "title": "Fish: Ondas pequenas não são problema",
        "content": "A shape fish tem outline mais curto e largo. Perfeita para ondas fracas! Twin fin ou quad fin gives mais speed em ondas pequenas.",
        "tags": ["Fish", "Ondas Pequenas", "Speed"]
    },
    {
        "title": "Evolua da Foam para Hardboard",
        "content": "Quando você conseguir fazer paddling, pop-up e bottom turn com facilidade, é hora de pensar em移行 para prancha de fiberglass. A transição gradual é fundamental!",
        "tags": ["Evolução", "Iniciante", "Dicas"]
    },
]

# Conteúdo sobre Phenix Teccel
PHENIX_CONTENT = [
    {
        "title": "O que é o Bloco Phenix Teccel?",
        "content": "É um núcleo de EPS (poliestireno expandido) ecologicamente correto, desenvolvido pela Phenix Teccel. Pode ser 100% reciclado ou biodegradado, reduzindo significativamente o impacto ambiental.",
        "category": "Sustentabilidade"
    },
    {
        "title": "Benefícios do Bloco Ecológico",
        "content": "1. ♻️ 100% reciclável\n2. 🌿 Biodegradável\n3. 🧊 Livre de CFC\n4. 💧 Menor consumo de água\n5. 🎯 Maior durabilidade\n\nEscolha consciente!",
        "category": "Meio Ambiente"
    },
    {
        "title": "Por que escolher prancha com bloco ecológico?",
        "content": "Quando sua prancha chegar ao fim da vida útil, o bloco Phenix Teccel pode ser reciclado corretamente ou se degrada naturalmente. Menos lixo nos oceanos!",
        "category": "Consumo Consciente"
    },
    {
        "title": "Inovação que respeito o mar",
        "content": "A Phenix Teccel desenvolveu uma tecnologia que mantém a performance (flutuação, leveza) sem comprometer o planeta. O surf do futuro é sustentável!",
        "category": "Inovação"
    },
    {
        "title": " ciclo de vida da prancha sustentável",
        "content": "1. Fabricação: menos água e energia\n2. Uso: performance excellent\n3. Fim de vida: reciclagem ou biodegradação\n\n闭环!",
        "category": "Sustentabilidade"
    },
]

# Dicas diárias
DAILY_TIPS = [
    "Hoje as ondas estãosubindo em Bertioga! 🌊 Altura: 0.8m. Bom para Longboard e Funboard!",
    "Você sabia? O bloco Phenix Teccel pode ser recicladonem pontos de coleta específicos!",
    "Maré baixa às 11:45 hoje - melhor momento para iniciantes!",
    "Protoção solar é essencial! Reaplique a cada 2 horas.",
    "Hidratação: beba 500ml de água antes de surfar!",
    "Alongue ombros e costas antes de entrar na água!",
    "Respeite os maisexperientes no lineup - Etiqueta no mar!",
    "Longboard é ideal para ondas abaixo de 1m!",
    "Funboard ofrece o melhor equilíbrio entre estabilidade e manobras!",
    "O bloco ecológico Phenix Teccel é biodegradável! 🌱",
]

def generate_daily_content():
    """Gera conteúdo diário"""
    today = datetime.now().strftime("%Y-%m-%d")
    
    return {
        "date": today,
        "board_tip": random.choice(BOARD_CONTENT),
        "phenix_tip": random.choice(PHENIX_CONTENT),
        "daily_message": random.choice(DAILY_TIPS),
        "generated_at": datetime.now().isoformat()
    }

def create_notification_message():
    """Cria mensagem de notificação diária"""
    content = generate_daily_content()
    
    message = f"""
🏄‍♀️ ASF - Dicas do Dia!

{content['daily_message']}

💡 {content['board_tip']['title']}
{content['board_tip']['content']}

🌱 Eco Dica: {content['phenix_tip']['title']}
{content['phenix_tip']['content']}

#SurfFeminino #ASF #Sustentabilidade #PhenixTeccel #EcoSurf
"""
    return message

if __name__ == "__main__":
    print("🏄‍♀️ ASF Surfboard & Eco Agent")
    print("=" * 50)
    content = generate_daily_content()
    print(json.dumps(content, indent=2, ensure_ascii=False))
    
    print("\n" + "=" * 50)
    print("📱 Mensagem de notificação:")
    print(create_notification_message())