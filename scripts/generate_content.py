#!/usr/bin/env python3
"""
ASF Content Generator - Gera conteúdo automaticamente e salva em arquivos
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
    {"categoria": "Técnica", "titulo": "Bottom Turn", "conteudo": "O bottom turn é a base de todas as manobras. Transfira o peso para o pé da frente e gire a prancha.", "tags": ["Técnica", "Manobras"]},
    {"categoria": "Saúde", "titulo": "Yoga para surfistas", "conteudo": "O yoga melhora flexibilidade, equilíbrio e foco – essencial para manobras precisas.", "tags": ["Saúde", "Yoga"]},
    {"categoria": "Técnica", "titulo": "Leitura de maré", "conteudo": "Marés baixas expõem bancos de areia criando ondas cavadas. Marés altas suavizam a quebra.", "tags": ["Técnica", "Maré"]},
    {"categoria": "Mental", "titulo": "Visualização", "conteudo": "Visualize as ondas que quer pegar antes de entrar. Isso program sua mente para o sucesso!", "tags": ["Mental", "Foco"]},
]

QUOTES = [
    "A melhor onda é a que você pega.",
    "O mar ensina a serenidade.",
    "Não existe onda impossível, só onda que ainda não chegou.",
    "Cada onda é uma chance de recomeçar.",
    "O surf é meditação em movimento.",
    "Mulher que surfa não tem limites.",
    "A onda espera por ninguém. Entre nela!",
]

def generate_content():
    """Gera conteúdo para o app"""
    tip = random.choice(TIPS)
    quote = random.choice(QUOTES)
    author = random.choice(["Carol", "Grazielle", "Márcia", "Letícia"])
    topics = ["aulão de surf", "encontro na praia", "desconto em lycras", "nova trip", "vídeo de aula"]
    topic = random.choice(topics)
    
    return {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "tip": tip,
        "quote": quote,
        "community_post": f"**{author}**\n\n**{topic.title()}**! Quem quer participar?",
        "generated_at": datetime.now().isoformat()
    }

def save_content(content):
    """Salva conteúdo em arquivos"""
    os.makedirs('docs/generated', exist_ok=True)
    
    # Save tip
    tip_html = f"""
<div class="auto-tip" style="background: #f8f9fa; padding: 16px; margin: 16px 20px; border-radius: 12px; border-left: 4px solid #00A8CC;">
    <p style="font-size: 12px; color: #666; margin: 0;">{content['tip']['categoria']}</p>
    <h4 style="margin: 8px 0; color: #0E2439;">{content['tip']['titulo']}</h4>
    <p style="font-size: 14px; line-height: 1.6; color: #333;">{content['tip']['conteudo']}</p>
    <p style="font-size: 11px; color: #999; margin-top: 8px;">Tags: {', '.join(content['tip']['tags'])}</p>
</div>
"""
    with open('docs/generated/tip.html', 'w', encoding='utf-8') as f:
        f.write(tip_html)
    
    # Save quote
    quote_html = f"""
<div class="auto-quote" style="text-align: center; padding: 20px; margin: 20px; font-style: italic; font-size: 16px; color: #555;">
    "{content['quote']}"
</div>
"""
    with open('docs/generated/quote.html', 'w', encoding='utf-8') as f:
        f.write(quote_html)
    
    # Save community post
    post_html = f"""
<div class="auto-post" style="background: #fff; padding: 16px; margin: 10px 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    {content['community_post']}
    <p style="font-size: 11px; color: #999; margin-top: 8px;">Gerado automaticamente em {content['date']}</p>
</div>
"""
    with open('docs/generated/post.html', 'w', encoding='utf-8') as f:
        f.write(post_html)
    
    return content

def main():
    print("🎲 ASF Content Generator")
    print("=" * 50)
    content = generate_content()
    saved = save_content(content)
    
    print(f"✅ Generated content for {saved['date']}")
    print(f"   📌 Tip: {saved['tip']['titulo']}")
    print(f"   💬 Quote: {saved['quote'][:50]}...")
    print(f"   👤 Post: {saved['community_post'][:50]}...")
    print(f"\n📁 Files saved to docs/generated/")

if __name__ == "__main__":
    main()