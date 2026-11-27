# Base de conhecimento do assistente de IA da Prumo

Documentação para alimentar o assistente que responde dúvidas sobre a Prumo Paisagismo: a empresa, os serviços, os diferenciais, o orçamento e as perguntas frequentes.

**Este README é interno. Não entregue ao assistente.** Entregue os arquivos `00` a `07`.

## Arquivos

| Arquivo | Para que serve | Como entregar ao agente |
|---|---|---|
| `00-instrucoes-do-assistente.md` | Papel, voz, regras absolutas, quando passar para uma pessoa | **Prompt de sistema** (sempre carregado) |
| `01-empresa.md` | Quem é a Prumo, o nome, como atende, área, contato | Base de conhecimento |
| `02-servicos.md` | Jardim vertical, irrigação, manutenção, paisagismo sob consulta, o que não fazemos | Base de conhecimento |
| `03-diferenciais.md` | Por que a Prumo, como escolher uma empresa, objeções comuns | Base de conhecimento |
| `04-orcamento-e-processo.md` | As 6 etapas, o que enviar, o formulário, o que acontece depois | Base de conhecimento |
| `05-perguntas-frequentes.md` | As 12 perguntas oficiais, com a resposta aprovada | Base de conhecimento |
| `06-para-arquitetos.md` | Atendimento a arquitetos, designers e construtoras | Base de conhecimento |
| `07-limites-e-respostas-padrao.md` | Temas sem dado público (preço, prazo, garantia, obras etc.) e a resposta padrão de cada um | Base de conhecimento **e** trecho do prompt de sistema |

Cada arquivo é autocontido e dividido em seções curtas com título, para funcionar bem em busca por trechos (RAG).

## De onde vem o conteúdo

- Fonte da verdade: `docs/07-conteudo-final.md` (texto aprovado do site) e `docs/00-decisoes.md`. No código, o mesmo texto está em `src/content/`.
- O texto dos arquivos `01` a `06` é o texto do site, reorganizado por tema. Nada foi acrescentado sobre preço, prazo, garantia, obras, clientes, equipe ou endereço.
- **Adaptações do texto do site** (revise):
  - "pelo site ou pelo WhatsApp" virou "pelo site" na etapa 1 e na FAQ 10, porque o WhatsApp comercial ainda não existe. Volte ao texto original quando ele for divulgado.
  - Na área de atendimento do `01`, incluí Fazenda Rio Grande, que está em `siteConfig.areaServed` mas não na FAQ 11.
- **Texto novo para revisão**: escrito agora, no tom da marca, porque o site não tem esse texto. Revise antes de ativar o assistente:
  - o arquivo `00` inteiro;
  - as respostas padrão do `07`;
  - em `02`: as notas para o assistente e a seção "O que a Prumo não faz";
  - em `03`: "O que muda na prática" e as respostas a objeções (montadas a partir de frases do site);
  - em `04`: "Dicas para boas fotos" e "O que o assistente pode e não pode fazer";
  - em `06`: "Construtoras e incorporadoras" e "O que o assistente não informa".

## O que ficou de fora de propósito (informação interna)

Não aparece em nenhum arquivo entregue ao agente, porque o assistente fala com o público:

- o ticket de referência do modelo de negócio e qualquer valor por m²;
- a estrutura interna (quem faz o quê, CNPJ usado no MVP, nome do parceiro de execução);
- concorrentes;
- o número de exemplo `(41) 9 0000-0000` dos materiais;
- a hipótese de garantia de 90 dias e de laudo de impermeabilização;
- a assinatura "Verde no prumo" (em validação).

## Trechos técnicos que o parceiro ainda precisa validar

Estão marcados `REVISAR-PARCEIRO` no `docs/07`. Até a validação, o assistente repete o texto aprovado sem detalhar além dele:

1. Estrutura, tipo de módulo e drenagem (definidos na visita técnica).
2. Clima de Curitiba: espécies rústicas e proteção em fachadas externas.
3. Umidade e impermeabilização como maior risco técnico.
4. Funcionamento da irrigação: filtro, controle de pressão, drenagem, abastecimento sem ponto de água.
5. "O jardim vertical estraga a parede?" (fixação e drenagem).

## Atualize esta base quando o Marco resolver (ver `docs/08`)

| Pendência | O que muda aqui |
|---|---|
| WhatsApp comercial definido | `01-empresa.md` (Contato) e `07` (resposta "Qual o WhatsApp?") |
| Redes `@prumopaisagismo` no ar | `01-empresa.md` (Contato) e `07` |
| Obras reais autorizadas | `07` (resposta "Vocês têm fotos de obras?") e, se quiser, um arquivo `08-obras.md` com a ficha técnica de cada obra (bairro, metragem, espécies, irrigação, ano), **sem nome de cliente nem endereço** |
| Faixa de preço publicada (`siteConfig.priceRange`) | `07` (resposta sobre preço) e FAQ 1 |
| Prazo e garantia reais | `07` e FAQ 8 e 9 |
| Razão social e CNPJ | `01-empresa.md` (Dados formais) |
| Validação do parceiro | Remover a lista acima e ajustar os trechos, se mudarem |

Regra: quando o site mudar, mude aqui no mesmo PR.
