# ASF - Patch: corrige acentuacao e titulos da secao final do site
# (Seguranca no Surf, Calendario de Eventos, Conteudo ASF, botoes e labels)

src = open('index.html', encoding='utf-8').read()

reps = [
    # 1) Titulo da secao de seguranca (emoji esgrima -> salva-vidas, texto correto)
    ('&#x1F93A; Pontos Femininos - Seguranca</h2>',
     '&#x1F6DF; Segurança no Surf</h2>'),
    # 2) Calendario de Eventos
    ('&#x1F4C5; Calendario de Eventos',
     '&#x1F4C5; Calendário de Eventos'),
    # 3) Botao Mes -> Mês (e aria-label)
    ('aria-label="Ver mes">&#x1F4C6; Mes</button>',
     'aria-label="Ver mês">&#x1F4C6; Mês</button>'),
    # 4) Pergunta rapida do ManaBot
    ('>Melhor horario?</button>',
     '>Melhor horário?</button>'),
    # 5) Conteudo ASF
    ('&#x1F4D6; Conteudo ASF</h2>',
     '&#x1F4D6; Conteúdo ASF</h2>'),
    # 6) Labels dos botoes de filtro (mantidas as chaves JS de filtro)
    ('>&#x1F3CA; Tecnica</button>',
     '>&#x1F3CA; Técnica</button>'),
    ('>&#x1F957; Nutricao</button>',
     '>&#x1F957; Nutrição</button>'),
    # 7) CTA da carteirinha
    ('&#x1FAAA; Gerar Carteirinha Gratis</button>',
     '&#x1FAAA; Gerar Carteirinha Grátis</button>'),
]

total = 0
for old, new in reps:
    n = src.count(old)
    assert n >= 1, f'Trecho nao encontrado: {old[:60]}'
    src = src.replace(old, new)
    total += n
    print(f'OK ({n}x): {old[:60]}')

open('index.html', 'w', encoding='utf-8').write(src)
print(f'Total: {total} substituicoes aplicadas em index.html')
