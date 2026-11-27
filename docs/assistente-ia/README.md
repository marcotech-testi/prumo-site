# Base de conhecimento do assistente de IA da Prumo

Documentação para alimentar o assistente que responde dúvidas do público sobre a Prumo Paisagismo: a empresa, os serviços, os diferenciais, o orçamento e as perguntas frequentes.

**Este README é interno. Não entregue ao assistente.** Entregue os arquivos `00` a `07`.

## Nome

A assistente se chama **Vera**: lembra "vertical" e "verdade", o que conversa com a voz honesta da marca. Ela se apresenta como assistente virtual, uma IA, já na primeira mensagem.

## Canal

A assistente atende o WhatsApp oficial **(41) 93618-6969**: todo mundo que escreve para esse número conversa primeiro com ele. Por isso, ele:

- nunca manda a pessoa "chamar no WhatsApp";
- recebe o pedido de orçamento na própria conversa (fotos, medidas, luz, água, cidade e bairro, nome), pede o consentimento à pessoa e passa para a equipe;
- reconhece as mensagens prontas que o site envia (`docs/07`, "Mensagens de WhatsApp") e segue o assunto de cada uma.

### O que a plataforma do assistente precisa ter (configuração, fora destes arquivos)

- **Transferência para humano** ("passar para a equipe"): o prompt manda transferir, mas o mecanismo é da plataforma. Sem ele, o pedido não chega a ninguém.
- **Receber imagens, vídeo e PDF** e deixar os arquivos visíveis para a equipe.
- **Registro do consentimento** (o "sim" da pessoa, com data) junto do pedido, para a LGPD.
- Idealmente, os mesmos campos do formulário do site (contrato do webhook em `docs/05`), para os pedidos do WhatsApp e do site chegarem no mesmo formato.
- Se a plataforma tiver horário de atendimento humano, a mensagem de transferência já diz "em horário comercial".

## Arquivos

| Arquivo | Para que serve | Como entregar ao agente |
|---|---|---|
| `00-instrucoes-do-assistente.md` | Papel, voz, regras absolutas, quando passar para uma pessoa, contatos | **Prompt de sistema** (sempre carregado) |
| `01-empresa.md` | Quem é a Prumo, a promessa, o nome, como atende, área, contato | Base de conhecimento |
| `02-servicos.md` | Jardim vertical, irrigação, manutenção, paisagismo sob consulta, o que não fazemos | Base de conhecimento |
| `03-diferenciais.md` | Promessa, por que a Prumo, como escolher uma empresa, objeções comuns | Base de conhecimento |
| `04-orcamento-e-processo.md` | As 6 etapas, o que enviar, o formulário, o que vem na proposta | Base de conhecimento |
| `05-perguntas-frequentes.md` | As 12 perguntas oficiais, com a resposta aprovada | Base de conhecimento |
| `06-para-arquitetos.md` | Atendimento a arquitetos, designers e construtoras | Base de conhecimento |
| `07-limites-e-respostas-padrao.md` | Temas sem dado público (preço, prazo, garantia, obras, concorrentes etc.) e a resposta padrão de cada um | Base de conhecimento **e** trecho do prompt de sistema |

Cada arquivo é autocontido e dividido em seções curtas com título, para funcionar bem em busca por trechos (RAG).

## Fontes lidas

Usadas no conteúdo:

- `docs/07-conteudo-final.md` (texto aprovado do site, fonte principal), `docs/00`, `01`, `02`, `05`, `08` e `src/content/site.ts`.
- `03-marca/Manual da Marca - Prumo Paisagismo v2.pdf`: promessa, essência, voz e tom, símbolo, canais.
- `05-comercial/Apresentacao Prumo Paisagismo.pdf`: confirma o texto do site e o WhatsApp.
- `03-marca/documentos/modelo-orcamento.html`: só a estrutura da proposta, sem valores nem condições.
- `01-pesquisa-ia/protocolo-ia-jardim-vertical.md`: as 12 perguntas reais de cliente, usadas para cobrir dúvidas no `07`.
- `README.md` da pasta do projeto.

Lidas só como contexto, sem nada levado para os arquivos do agente (dados internos): `Resumo do projeto - Prumo.pdf`, `MVP - Prumo Paisagismo.pdf`, `Business Plan - Prumo Paisagismo.pdf`.

Não lidas: modelo financeiro (interno), resultados brutos das IAs e o PDF de presença em IAs (falam de concorrentes, não da Prumo), e os docs técnicos do site (`03`, `04`, `06`, `09`).

## O que ficou de fora de propósito (informação interna)

- ticket de referência, faixas de preço do business plan, preços de portais, margens, custos, metas e qualquer valor;
- estrutura interna (quem faz o quê, CNPJ usado no MVP, parceiro, sociedade, critérios de decisão);
- concorrentes e o que se sabe deles;
- condições do modelo de proposta: garantia de 90 dias, sinal de 50%, parcelas, validade de 15 dias, "não inclui obras civis, pontos de água e energia". O próprio modelo diz que são exemplos a confirmar com jurídico e contador;
- ideias do business plan que não viraram oferta: jardim preservado/artificial, sensor de umidade com alerta, laudo de impermeabilização, visita técnica paga, parede-vitrine;
- "dezenas de obras entregues" (manual): número de obras não é publicado; a base usa "várias obras", como o site;
- a assinatura "Verde no prumo" (em validação).

## Divergências entre documentos (decida e me avise se quiser mudar)

1. **WhatsApp (resolvido).** O **(41) 93618-6969** está ativo para clientes, confirmado pelo Marco em 27/11/2026, e a base usa esse número. Falta acertar o site: `docs/08` ainda diz que o WhatsApp não existe, e a variável `NEXT_PUBLIC_WHATSAPP` na Vercel deve receber `5541936186969`.
2. **Paisagismo.** A apresentação lista "Paisagismo: projeto e execução de jardins, varandas e áreas externas" como serviço. O site e `docs/00` tratam como "sob consulta, caso a caso". A base segue o site.
3. **Obras reais.** A apresentação diz "Mais obras em @prumopaisagismo", mas as redes ainda não existem. A base não indica perfis.

## Texto novo para revisão

Escrito no tom da marca porque nenhum documento tinha esse texto. Revise antes de ativar o assistente:

- o arquivo `00` inteiro;
- as respostas padrão do `07`;
- em `02`: as notas para o assistente e a seção "O que a Prumo não faz";
- em `03`: "O que muda na prática" e as respostas a objeções (montadas a partir de frases do site);
- em `04`: "Dicas para boas fotos", "O que vem na proposta" e "O que o assistente pode e não pode fazer";
- em `06`: "Construtoras e incorporadoras" e "O que o assistente não informa".

Adaptação do texto do site: em `01`, a área de atendimento inclui Fazenda Rio Grande, que está em `siteConfig.areaServed` mas não na FAQ 11.

## Trechos técnicos que o parceiro ainda precisa validar

Estão marcados `REVISAR-PARCEIRO` no `docs/07`. Até a validação, o assistente repete o texto aprovado sem detalhar além dele:

1. Estrutura, tipo de módulo e drenagem (definidos na visita técnica).
2. Clima de Curitiba: espécies rústicas e proteção em fachadas externas.
3. Umidade e impermeabilização como maior risco técnico.
4. Funcionamento da irrigação: filtro, controle de pressão, drenagem, abastecimento sem ponto de água.
5. "O jardim vertical estraga a parede?" (fixação e drenagem).

## Atualize esta base quando

| Pendência | O que muda aqui |
|---|---|
| Redes `@prumopaisagismo` no ar | `01` (Contato) e `07` (Instagram e redes) |
| Obras reais autorizadas | `07` (fotos de obras) e, se quiser, um `08-obras.md` com a ficha de cada obra (bairro, metragem, espécies, irrigação, ano), **sem nome de cliente nem endereço** |
| Faixa de preço publicada (`siteConfig.priceRange`) | `07` (preço) e FAQ 1 |
| Prazo, garantia e condições de pagamento confirmados | `04` (proposta), `07` e FAQ 8 e 9 |
| Razão social e CNPJ | `01` (Dados formais) |
| Validação do parceiro | Remover a lista acima e ajustar os trechos, se mudarem |
| Paisagismo virar serviço | `02`, `07` e a regra 4 do `00` |

Regra: quando o site mudar, mude aqui no mesmo PR.
