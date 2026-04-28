#!/usr/bin/env python3
"""
ASF Content Generator - Updated with breathing & stretching tips
Gera conteúdo automaticamente e salva em arquivos
"""

import os
import random
from datetime import datetime

# ========================================
# DICAS DE SURF (com novas categorias!)
# ========================================
TIPS = [
    # --- RESPIRAÇÃO ---
    {"categoria": "Respiração", "titulo": "Respiração 4-7-8", "conteudo": "Inspire 4s, segure 7s, expire 8s. Repita 3x. Acalma instantaneamente o sistema nervoso e reduz ansiedade antes de surfar!", "tags": ["Respiração", "Mental", "Calma"]},
    {"categoria": "Respiração", "titulo": "Respiração Box (4-4-4-4)", "conteudo": "Inspire 4s → segure 4s → expire 4s → segure 4s. Padrão quadrado que equilibra corpo e mente. Usado por atletas olímpicos!", "tags": ["Respiração", "Foco", "Controle"]},
    {"categoria": "Respiração", "titulo": "Respiração Abdominal", "conteudo": "Mãos na barriga. Inspire expandindo barriga (não peito!). Expira completamente. Ativa nervo vago e sistema parassimpático.", "tags": ["Respiração", "Saúde", "Relaxamento"]},
    {"categoria": "Respiração", "titulo": "Respiração before Paddling", "conteudo": "3 respirações profundas antes de remar. Inhala nariz, exhala boca. Oxigena músculos e prepara para esforço!", "tags": ["Respiração", "Performance", "Paddling"]},

    # --- ALONGAMENTO ---
    {"categoria": "Alongamento", "titulo": "Rotação de Ombros", "conteudo": "10 rotações para frente, 10 para trás. Mantém core engajado. Melhora mobilidade para paddling e previne lesões!", "tags": ["Alongamento", "Ombros", "Paddling"]},
    {"categoria": "Alongamento", "titulo": "Alongamento Costas (Gato-Vaca)", "conteudo": "De joelhos, alterna arquear/curvar coluna. 10x. Alivia tensão do remo e aumenta flexibilidade.", "tags": ["Alongamento", "Costas", "Mobilidade"]},
    {"categoria": "Alongamento", "titulo": "Alongamento Quadril (Borboleta)", "conteudo": "Sentada, plantas pés juntas, joelhos fora. Segure 30s. Abre quadril para bottom turn e manobras!", "tags": ["Alongamento", "Quadril", "Manobras"]},
    {"categoria": "Alongamento", "titulo": "Alongamento Isquiotibiais", "conteudo": "Sentada, perna esticada, inclina frente. 30s cada lado. Flexibilidade essencial para movimento de pé na prancha.", "tags": ["Alongamento", "Pernas", "Flexibilidade"]},
    {"categoria": "Alongamento", "titulo": "Mobilidade Tornozelo", "conteudo": "Gire tornozelos em círculos, 10x cada pé. Melhora equilíbrio na prancha e previne torções!", "tags": ["Alongamento", "Tornozelo", "Equilíbrio"]},
    {"categoria": "Alongamento", "titulo": "Alongamento Pós-Surf", "conteudo": "Alongue ombros, costas e pernas após surfar. Músculos aquecidos alongam 40% melhor! Recuperação mais rápida!", "tags": ["Alongamento", "Recuperação", "Pós-surf"]},

    # --- TÉCNICA ---
    {"categoria": "Iniciante", "titulo": "Escolher primeira prancha", "conteudo": "Para iniciantes, pranchas foam 7'0\"-8'0\" são ideais. Mais largas e flutuantes facilitam aprendizado!", "tags": ["Iniciante", "Prancha"]},
    {"categoria": "Técnica", "titulo": "Paddling correto", "conteudo": "Corpo reto, cabeça alinhada, braços longos. Mergulhe alternadamente. Movimento longo sem afundar prancha!", "tags": ["Técnica", "Paddling"]},
    {"categoria": "Técnica", "titulo": "Leitura de onda", "conteudo": "Observe mar 15-20min antes de entrar. Identifique padrões (sets), direção e força. Conhecimento previne medo!", "tags": ["Técnica", "Ocean"]},
    {"categoria": "Técnica", "titulo": "Bottom Turn", "conteudo": "Base de todas as manobras. Desça onda, transfira peso para pé da frente e gire com ombros/quadris.", "tags": ["Técnica", "Manobras"]},
    {"categoria": "Técnica", "titulo": "Leitura de maré", "conteudo": "Marés baixas expõem bancos → ondas cavadas. Marés altas suavizam quebra. Planeje conforme maré!", "tags": ["Técnica", "Maré"]},

    # --- SAÚDE ---
    {"categoria": "Saúde", "titulo": "Hidratação no mar", "conteudo": "Beba 500ml água antes de entrar. Reaplique a cada 1h! Não espere ter sede - desidratação compromete performance.", "tags": ["Saúde", "Hidratação"]},
    {"categoria": "Saúde", "titulo": "Alimentação pós-surf", "conteudo": "Em 30min após surfar: proteína + carboidrato (ex: shake whey + banana). Recuperação muscular 40% mais rápida!", "tags": ["Saúde", "Nutrição", "Recuperação"]},
    {"categoria": "Saúde", "titulo": "Proteção solar", "conteudo": "FPS 50+ resistente à água. Reaplique a cada 2h. Protetor é sua 1ª linha contra câncer de pele!", "tags": ["Saúde", "Proteção"]},

    # --- MENTAL ---
    {"categoria": "Mental", "titulo": "Visualização positiva", "conteudo": "Antes de entrar, visualize você surfando bem. Sinta ondas, movimento, alegria. Sua mente acredita no que visualiza!", "tags": ["Mental", "Foco", "Confiança"]},
    {"categoria": "Mental", "titulo": "Lidar com medo", "conteudo": "Medo é normal. Aceite, não lute. Use como combustível! Respira 4-7-8 e lembre-se: você já sobreviveu a ondas antes!", "tags": ["Mental", "Coragem", "Medo"]},
    {"categoria": "Mental", "titulo": "Foco no presente", "conteudo": "Mente divagando? Olhe para horizonte/água. Foque só nisso. Corta espiral de pensamentos ansiosos.", "tags": ["Mental", "Mindfulness", "Presença"]},

    # --- EQUIPAMENTO ---
    {"categoria": "Equipamento", "titulo": "Cuidados com prancha", "conteudo": "Enxágue com água doce após surfar. Seque na sombra (não sol direto!). Use capinha para transportar. Evita danos!", "tags": ["Equipamento", "Manutenção"]},
    {"categoria": "Equipamento", "titulo": "Escolher leash", "conteudo": "Leash mesmo tamanho ou 10cm menor que prancha. Longboard: 9-10'. CHECK antes de cada sessão!", "tags": ["Equipamento", "Leash", "Segurança"]},
    {"categoria": "Equipamento", "titulo": "Wax correto", "conteudo": "Wax quente para águas frias (<18°C). Wax frio para águas quentes (>22°C). Base coat primeiro, depois top coat!", "tags": ["Equipamento", "Wax", "Aderência"]},

    # --- SEGURANÇA ---
    {"categoria": "Segurança", "titulo": "Etiqueta no mar", "conteudo": "Quem está mais próximo da quebra tem prioridade. Não fuça fila. Respeite experientes. Sorriso resolve 90% dos conflitos!", "tags": ["Segurança", "Etiqueta", "Respeito"]},
    {"categoria": "Segurança", "titulo": "Sinal de socorro", "conteudo": "Braço levantado + waved. Se virar embarcação, acene com prancha. Tenha emergência salva no celular (proteja com capinha!).", "tags": ["Segurança", "Emergência"]},

    # --- MULHER ---
    {"categoria": "Mulher", "titulo": "Mulher no surf", "conteudo": "O surf é para todos! Não importa corpo, idade, experiência. Cada mulher na água inspira outras. #SurfFeminino", "tags": ["Mulher", "Empoderamento", "Comunidade"]},
    {"categoria": "Mulher", "titulo": "Força da comunidade", "conteudo": "Surfar em grupo é mais seguro e divertido! Chame amigas. ASF existe para conectar mulheres surfistas.", "tags": ["Mulher", "Comunidade", "Apoio"]},
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
    topics = ["aulão de surf", "encontro na praia", "desconto em lycras", "nova trip", "vídeo de aula", "dica de equipamento"]
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

    # Tip HTML
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

    # Quote HTML
    quote_html = f'''
<div class="auto-quote" style="text-align: center; padding: 20px; margin: 20px; font-style: italic; font-size: 16px; color: #555;">
    "{content['quote']}"
</div>
'''
    with open('docs/generated/quote.html', 'w', encoding='utf-8') as f:
        f.write(quote_html)

    # Community post HTML
    post_html = f"""
<div class="auto-post" style="background: #fff; padding: 16px; margin: 10px 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    {content['community_post']}
    <p style="font-size: 11px; color: #999; margin-top: 8px;">Gerado em {content['date']}</p>
</div>
"""
    with open('docs/generated/post.html', 'w', encoding='utf-8') as f:
        f.write(post_html)

    return content

def main():
    print("🎲 ASF Content Generator (Updated)")
    print("=" * 50)
    content = generate_content()
    saved = save_content(content)

    print(f"✅ Generated for {saved['date']}")
    print(f"   📌 Tip: {saved['tip']['titulo']}")
    print(f"   📊 Category: {saved['tip']['categoria']}")
    print(f"   💬 Quote: {saved['quote'][:50]}...")
    print(f"\n📁 Files saved to docs/generated/")

if __name__ == "__main__":
    main()