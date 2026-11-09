#!/usr/bin/env python3
"""
ASF Respiração Dicas
Técnicas de respiração para surfistas
"""

import random
import json
import os
from datetime import datetime

RESPIRAÇÃO_DICAS = [
    {
        "title": "Respiração suave em terra",
        "description": "Sentada em local seguro e seco, deixe o ar entrar e sair suavemente, sem forçar e sem prender a respiração.",
        "when_to_use": "Durante uma pausa tranquila, fora da água",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    },
    {
        "title": "Respiração sem metas de tempo",
        "description": "Se ajudar, conte devagar enquanto inspira e expira. Use um ritmo confortável, sem tentar atingir uma contagem fixa e sem pausas para prender o ar.",
        "when_to_use": "Em repouso, sentada e fora da água",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    },
    {
        "title": "Observe sua respiração",
        "description": "Em uma posição confortável, observe o movimento da respiração. Não force a barriga nem tente encher os pulmões ao máximo.",
        "when_to_use": "Em local seguro e seco, fora da água",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    },
    {
        "title": "Pausa antes da sessão",
        "description": "Ainda em terra, reserve uma pausa para observar como você está. Respire naturalmente; não faça séries de respirações profundas ou rápidas para se preparar para submergir.",
        "when_to_use": "Em terra, antes de decidir entrar no mar",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    },
    {
        "title": "Segurança na água vem primeiro",
        "description": "Exercícios de respiração não são técnica de resgate. Não pratique retenção de ar nem hiperventilação na água. Se estiver em dificuldade, peça ajuda ao guarda-vidas.",
        "when_to_use": "Lembrete de segurança antes da sessão; não é exercício para fazer na água",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    },
    {
        "title": "Após um susto no mar",
        "description": "Interrompa a sessão e busque um local seguro. Não tente compensar falta de ar com ciclos de apneia. Se houver dificuldade para respirar após submersão, procure atendimento imediato.",
        "when_to_use": "Após um incidente, priorize ajuda e avaliação, não exercícios respiratórios",
        "benefits": ["Sem prender o ar", "Segurança em primeiro lugar"],
        "level": "Orientação geral"
    }
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
    <p style="font-size: 12px; line-height: 1.5;">Pratique apenas em terra, sem forçar. Pare se sentir tontura ou desconforto. Não use estas dicas para tratar falta de ar ou substituir atendimento.</p>
    <p style="font-size: 11px;"><a style="color: inherit;" href="https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/">Fonte: NHS — respiração confortável</a> · <a style="color: inherit;" href="https://www.ausport.gov.au/ais/position_statements/breath-hold-training">AIS — riscos de apneia e hiperventilação</a></p>
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