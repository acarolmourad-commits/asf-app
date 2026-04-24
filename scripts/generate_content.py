#!/usr/bin/env python3
"""
ASF Content Generator - Gera conteúdo automaticamente
"""

import os
import random
from datetime import datetime

# Dicas de Surf (banco de dados)
TIPS = [
    {"categoria": "Iniciante", "titulo": "Como escolher sua primeira prancha", "conteudo": "Para iniciantes, pranchas foam entre 7'0\" e 8'0\" são ideais. São mais largas e facilitam o aprendizado!", "tags": ["Iniciante", "Prancha"]},
    {"categoria": "Técnica", "titulo": "Como fazer o paddling correto", "conteudo": "Mantém o corpo reto, cabeça alinhada com a coluna. Usa braços longos para maximizar a eficiência.", "tags": ["Técnica", "Paddling"]},
    {"categoria": "Saúde", "titulo": "Alongamento para surfistas", "conteudo": "Alongue ombros, costas e pernas antes de entrar na água. Isso previne lesões!", "tags": ["Saúde", "Alongamento"]},
    {"categoria": "Nutrição", "titulo": "O que comer antes de surfar", "conteudo": "Prefira alimentos leves e ricos em carboidratos: frutas, barras de cereal, pão integral.", "tags": ["Nutrição", "Alimentação"]},
    {"categoria": "Mental", "titulo": "Como lidar com o medo", "conteudo": "O medo é normal. Respira fundo, foca no momento presente.", "tags": ["Mental", "Foco"]},
    {"categoria": "Mulher", "titulo": "Mulher no surf", "conteudo": "O surf é para todos! Não importa o corpo, idade ou experiência.", "tags": ["Mulher", "Empoderamento"]},
    {"categoria": "Equipamento", "titulo": "Como cuidar da sua prancha", "conteudo": "Enxagua com água doce após o surf. Seca ao sol (mas não diretamente).", "tags": ["Equipamento", "Manutenção"]},
    {"categoria": "Técnica", "titulo": "Leitura de onda", "conteudo": "Observa o mar por 15-20 min antes de entrar. Nota o padrão das ondas (sets).", "tags": ["Técnica", "Ocean"]},
    {"categoria": "Saúde", "titulo": "Hidratação no mar", "conteudo": "Beba 500ml de água antes de entrar no mar. Não espere ter sede!", "tags": ["Saúde", "Hidratação"]},
    {"categoria": "Iniciante", "titulo": "Segurança básica", "conteudo": "Sempre surf dentro dos seus limites. Respeita os surfistas mais experientes.", "tags": ["Iniciante", "Segurança"]},
    {"categoria": "Equipamento", "titulo": "Como ajustar as quilhas da prancha", "conteudo": "Ajuste as quilhas na posição correta: frente mais próxima da borda para manobras rápidas, ou centralizada para estabilidade.", "tags": ["Técnica", "Equipamento"]},
    {"categoria": "Saúde", "titulo": "Benefícios do yoga para surfistas", "conteudo": "O yoga melhora a flexibilidade, equilíbrio e foco – essencial para manobras precisas e prevenção de lesões.", "tags": ["Saúde", "Mental", "Yoga"]},
    {"categoria": "Técnica", "titulo": "Como ler a maré para o surf", "conteudo": "Marés baixas expõem bancos de areia, criando ondas mais cavadas. Marés altas suavizam a quebra da onda.", "tags": ["Técnica", "Ocean", "Maré"]},
    {"categoria": "Nutrição", "titulo": "Nutrição pós-surf: recuperação rápida", "conteudo": "Ingere proteínas e carboidratos em até 30 min após o surf: iogurte com frutas ou um shake de whey.", "tags": ["Nutrição", "Saúde", "Recuperação"]},
    {"categoria": "Segurança", "titulo": "Dica de etiqueta: direito de preferência", "conteudo": "O surfista que está mais próximo da quebra da onda tem prioridade. Não furas a fila!", "tags": ["Segurança", "Etiqueta", "Surf"]},
]

# Frases motivacionais
QUOTES = [
    "A melhor onda é a que você pega.",
    "O mar ensina a serenidade.",
    "Não existe onda impossível, só onda que ainda não chegou.",
    "Cada onda é uma chance de recomeçar.",
    "O surf é meditation em movimento.",
    "Mulher que surfa não tem limites.",
    "A onda espera por ninguém. Entre nela!",
]

def generate_new_tip():
    """Gera uma nova dica aleatória"""
    tip = random.choice(TIPS)
    return f"### {tip['categoria']}\n\n**{tip['titulo']}**\n\n{tip['conteudo']}\n\nTags: {', '.join(tip['tags'])}\n"

def generate_community_post():
    """Gera um post de comunidade"""
    author = random.choice(["Carol", "Grazielle", "Márcia", "Leticia"])
    topics = [
        "aulão de surf este fim de semana",
        "encontro na praia",
        "desconto em lycras",
        "nova trip confirmada",
        "vídeo de aula",
        "dica de equipamento"
    ]
    topic = random.choice(topics)
    post = f"**{author}**\n\n{topic.title()}! Quem quer participar?"
    return post

def generate_new_content():
    """Gera novo conteúdo para o app"""
    content = {
        "tip": generate_new_tip(),
        "quote": random.choice(QUOTES),
        "post": generate_community_post(),
        "generated_at": datetime.now().isoformat()
    }
    return content

if __name__ == "__main__":
    print("🎲 ASF Content Generator")
    print("=" * 30)
    content = generate_new_content()
    print(content)
