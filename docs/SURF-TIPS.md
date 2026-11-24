# Dicas de Surf: catálogo curado e seleção diária

## Fonte única

`data/surf-tips-catalog.json` é a fonte editorial das Dicas de Surf da página inicial. Esta edição contém dez orientações curtas nas categorias Começar, Segurança, Equipamento e Treino.

O catálogo não é alimentado pelos geradores legados de respiração, alongamento, mobilidade, sugestões, frases ou posts. O processo não cria texto, HTML, citações, estatísticas, alegações de novidade nem posts em nome da ASF. Uma seleção diária não significa uma dica recém-escrita.

Os outros jobs e conteúdos legados não foram removidos por esta integração. Isso não significa que foram revisados ou aprovados para uso nas Dicas de Surf.

## Contrato JSON, versão 1

O catálogo de entrada tem exatamente `schema_version`, `catalog_version` e `tips`.

O feed público `docs/generated/surf-tips.json` tem exatamente:

| Campo | Significado |
| --- | --- |
| `schema_version` | Inteiro `1`, versão do contrato técnico. |
| `catalog_version` | Data `YYYY-MM-DD` da edição editorial do catálogo. Não é revisão médica nem data de publicação diária. |
| `selection_date` | Data `YYYY-MM-DD` da seleção em `America/Sao_Paulo`. |
| `generated_at` | Momento real da geração em UTC, `YYYY-MM-DDTHH:MM:SSZ`. Não é data de escrita ou aprovação do conteúdo. |
| `featured_id` | ID de uma das dicas, escolhido deterministicamente para a data. |
| `tips` | Lista completa de 8 a 12 dicas, com IDs únicos e as quatro categorias representadas. |

Cada dica tem exatamente `id`, `category`, `title`, `summary`, `action`, `label` e `href`. `summary` explica a orientação; `action` sugere um próximo passo; `label` nomeia o destino do link. Os campos de texto não aceitam HTML ou scripts.

Limites por campo: `id` 3–64 caracteres em kebab-case ASCII minúsculo; `title` 6–96; `summary` 20–300; `action` 12–260; `label` 3–60. O arquivo completo deve ter no máximo 64 KiB. Campos extras, chaves JSON repetidas, caracteres de controle/invisíveis, entidades HTML, markup, scripts e URLs fora da lista exata são rejeitados.

## Seleção e datas

Ordenam-se os IDs alfabeticamente e escolhe-se `date.toordinal() % quantidade`. Assim, o catálogo completo é percorrido uma vez por ciclo, sem sorteio dependente de processo, hora ou ordem do JSON. A data padrão usa a zona IANA `America/Sao_Paulo`, inclusive regras históricas. Não se presume que a data UTC seja a data brasileira.

Reexecutar no mesmo dia, com os mesmos dados, preserva o arquivo e o primeiro `generated_at`. Alterar o catálogo ou a data causa uma nova gravação. A data da edição só deve mudar quando houver alteração editorial real.

Em todo feed, a edição do catálogo deve ser anterior ou igual à seleção, e a seleção não pode ser posterior ao dia atual em São Paulo. O instante de geração não pode estar no futuro nem ocorrer em um dia local anterior à seleção. Isso também impede datas de edição futuras. Testes podem injetar um relógio nas funções Python; a CLI operacional não tem flag de simulação de relógio.

Um feed antigo pode continuar contendo orientações educativas úteis, mas sua seleção não deve aparecer como sendo de hoje. O consumidor deve mostrar a data real ou usar seu fallback conservador, sem inventar atualização. `validate_feed(feed)` valida estrutura, seleção e coerência temporal; `validate_feed(feed, expected_date)` também exige a data esperada. O modo `--check` usa a data atual local por padrão e falha explicitamente para seleção antiga ou futura. Com `--date`, pode verificar uma seleção histórica desde a edição do catálogo, mas nunca uma seleção futura.

## Destinos permitidos

A allowlist é exata, sem parâmetros, normalizações, redirecionadores arbitrários ou curingas:

- `/aprender/`
- `/previsao-surf/`
- `/diario/`
- `/guias/previsao-de-ondas/`
- `/guias/pos-surf-e-aprendizado/`
- `https://treino.asf.surf/#plano-30-dias`

Os destinos locais são verificados no checkout a cada validação. A página `/previsao-surf/` encaminha para a central ASF de previsão. O destino de Treino já está referenciado no checkout; não é necessário acessá-lo pela rede nos testes e não é utilizado pelas dicas desta edição.

Os guias específicos de previsão e pós-surf foram lidos antes de selecionados. Têm ressalvas sobre estimativas, condições locais e orientação profissional. Não se direciona para os guias legados de correntes ou etiqueta que contêm orientações excessivamente gerais sobre canais, nem para conteúdo de apneia ou retenção respiratória.

## Regras editoriais

- Orientação educativa não substitui instrutora, guarda-vidas ou avaliação profissional.
- Não prescrever exercícios, séries, intensidade, retenção respiratória ou práticas de apneia.
- Não prometer benefícios médicos, segurança garantida ou evolução em prazo fixo.
- Não apresentar águas calmas ou ausência de ondas como garantia de segurança.
- Não inventar métricas, fontes, avaliações, autoria, aprovação clínica ou novidade editorial.
- Rever o texto e o conteúdo do destino ao adicionar uma dica. A validação automática verifica o contrato e alguns padrões perigosos, mas não substitui revisão editorial humana.

## Comandos e testes

Requisitos: Python 3.11+ e base de zonas IANA disponível no sistema. Somente biblioteca padrão, sem dependências de rede ou chaves.

```sh
# Testes isolados: não alteram docs/generated nem outros arquivos de produção.
python3 -B -m unittest discover -s tests -p 'test_surf_tips.py' -v

# Geração operacional para o dia em São Paulo e validação sem escrita.
python3 scripts/generate_surf_tips.py
python3 scripts/generate_surf_tips.py --check

# Reprodução em diretório temporário, independente da data atual.
python3 scripts/generate_surf_tips.py --date 2026-11-05 --output-dir /tmp/asf-surf-tips
python3 scripts/generate_surf_tips.py --date 2026-11-05 --output-dir /tmp/asf-surf-tips --check
```

`--date` controla apenas a seleção, dentro do intervalo da edição do catálogo até hoje em São Paulo; `generated_at` continua sendo o instante real da geração. Não é permitido datar a seleção antes da existência desta edição nem publicar uma seleção futura. `--check` exige também correspondência integral entre o catálogo e as dicas do feed. Entrada inválida, saída existente corrompida, destino ausente ou falha de escrita terminam com erro, sem criar dica fictícia nem declarar sucesso.

A gravação valida tudo antes, escreve em arquivo temporário no mesmo diretório, sincroniza e usa substituição atômica. Uma falha de substituição preserva o feed anterior e limpa o temporário. Para recuperar uma saída corrompida, investigue o erro e restaure o arquivo válido antes de reexecutar; o gerador não esconde esse problema.

O job `daily-content` de `.github/workflows/main.yml` testa, gera e verifica o feed antes dos passos legados. O feed é incluído pelo passo de commit já existente. Como o job também pode rodar em outros gatilhos, a idempotência evita mudanças artificiais dentro do mesmo dia.

Os dois jobs que enviam commits agora terminam com erro se todas as tentativas de push falharem, em vez de declarar sucesso. No `daily-content`, o catálogo é regenerado e verificado novamente após cada rebase: uma edição concorrente não pode ser acompanhada de uma seleção desatualizada. Só o feed é incluído no commit adicional, sem force-push. Testes de shell simulam falhas e concorrência sem acessar o GitHub.

Cobertura: contrato positivo/negativo, tamanho, URLs, chaves repetidas, HTML/scripts, datas, passagem da meia-noite brasileira, fuso histórico, repetibilidade, ciclo completo, seleção antiga/futura, divergência do catálogo, publicação atômica e erro sem mutação de produção.

Os testes de interface usam Node.js e `jsdom`, apenas como dependência de desenvolvimento. Exemplo isolado, sem alterar dependências de produção:

```sh
npm install --prefix /tmp/asf-test-deps --no-audit --no-fund jsdom@31.0.0
NODE_PATH=/tmp/asf-test-deps/node_modules node --test tests/*.test.cjs
```

A suíte cobre filtro, catálogo completo na busca real da home, navegação da busca após filtro, falhas de rede, timeout, repetição da inicialização, validação de URLs e conteúdo, datas e preservação de formulários e armazenamento. Os testes de retry usam funções falsas de Git e nunca enviam commits. DOM simulado não comprova layout, contraste renderizado, comportamento de navegador ou publicação no domínio; estes exigem uma verificação separada antes de aprovação visual.
