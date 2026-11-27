/** As 12 perguntas frequentes (docs/07). As páginas escolhem por id. Usadas também no JSON-LD FAQPage. */
export type FaqItem = { id: number; question: string; answer: string };

export const faq: FaqItem[] = [
  {
    id: 1,
    question: "Quanto custa um jardim vertical em Curitiba?",
    answer:
      "Depende da metragem, da exposição ao sol, do tipo de estrutura, das espécies e da irrigação. Portais genéricos misturam jardim natural, preservado e artificial, e por isso as faixas variam muito. Envie fotos e medidas da sua parede: retornamos com uma faixa de investimento por m² em até um dia útil. O valor fechado vem depois da visita técnica.",
  },
  {
    id: 2,
    question: "Jardim vertical natural ou artificial: qual escolher?",
    answer:
      "A Prumo trabalha com jardim vertical natural e irrigação automatizada. O natural precisa de luz adequada, ponto de água e manutenção, e entrega planta viva. O artificial dispensa rega, mas não é vivo, e a exposição direta ao sol exige material com proteção contra UV. Se o seu local não tem luz suficiente para um jardim natural, avisamos antes de propor.",
  },
  {
    id: 3,
    question: "O jardim vertical estraga a parede?",
    // REVISAR-PARCEIRO: umidade, impermeabilização, fixação e drenagem
    answer:
      "Não precisa estragar, desde que a parede seja avaliada antes. Umidade e impermeabilização são o maior risco técnico, e por isso verificamos a parede na visita técnica e registramos o que for necessário na proposta. A fixação e a drenagem são definidas conforme cada parede.",
  },
  {
    id: 4,
    question: "Jardim vertical precisa de manutenção?",
    answer:
      "Sim. É planta viva: precisa de poda, adubação, controle de pragas, ajuste da irrigação e reposição de plantas quando necessário. A Prumo oferece plano mensal de manutenção, com registro de cada visita.",
  },
  {
    id: 5,
    question: "Como funciona a irrigação automatizada?",
    // REVISAR-PARCEIRO: funcionamento da irrigação (filtro, pressão, drenagem)
    answer:
      "Um controlador programável liga a água em ciclos definidos, e a água chega às plantas por gotejadores. Filtro, controle de pressão e drenagem evitam entupimento e excesso de água. A programação é ajustada à estação e à exposição da parede.",
  },
  {
    id: 6,
    question: "Dá para fazer jardim vertical em apartamento ou varanda?",
    answer:
      "Pode funcionar, desde que haja luz adequada, ponto de água ou solução de abastecimento e drenagem. Confira as regras do condomínio e avalie vento e fixação. Enviando fotos e medidas, dizemos o que é viável e fazemos a visita técnica se você quiser avançar.",
  },
  {
    id: 7,
    question: "Funciona em parede com sol forte ou pouca luz?",
    answer:
      "Cada espécie tem uma necessidade de luz, e escolhemos as plantas conforme a sua parede: sol da tarde pede espécies que aguentem, e planta de sombra não vive em sol pleno. Se a luz for insuficiente para um jardim natural, avisamos antes de propor.",
  },
  {
    id: 8,
    question: "Quanto tempo leva a instalação?",
    answer:
      "Depende do tamanho e da complexidade da parede. O prazo de execução consta por escrito na proposta.",
  },
  {
    id: 9,
    question: "E se uma planta morrer? Existe garantia?",
    answer:
      "O prazo de garantia e as regras de reposição de plantas constam por escrito na proposta. A manutenção regular reduz o risco, porque o cuidado começa antes de a planta sofrer.",
  },
  {
    id: 10,
    question: "Como funciona o orçamento?",
    answer:
      "Você envia fotos ou um vídeo da parede e as medidas aproximadas, pelo site ou pelo WhatsApp. Retornamos com uma faixa de investimento por m² em até um dia útil. A visita técnica é agendada para quem decide avançar, e a proposta final segue por escrito.",
  },
  {
    id: 11,
    question: "Quais cidades vocês atendem?",
    answer:
      "Curitiba e região metropolitana, como São José dos Pinhais, Pinhais, Colombo, Araucária e Campo Largo. Se a sua cidade não está na lista, mande o pedido: avaliamos caso a caso.",
  },
  {
    id: 12,
    question: "Como escolher uma empresa de jardim vertical?",
    answer:
      "Compare propostas com o mesmo escopo e peça: visita técnica antes do orçamento fechado; descrição do sistema de irrigação e da drenagem; espécies indicadas para a luz da sua parede; garantia e reposição de plantas por escrito; plano de manutenção; e obras reais com bairro e metragem. Desconfie de promessa de jardim que não dá trabalho nenhum.",
  },
];

export function faqByIds(ids: number[]) {
  return ids.map((id) => {
    const item = faq.find((f) => f.id === id);
    if (!item) throw new Error(`Pergunta ${id} não existe`);
    return item;
  });
}
