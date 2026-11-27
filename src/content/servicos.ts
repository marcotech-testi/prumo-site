/** Serviços (cards da home, docs/07). */
export const servicos = [
  {
    title: "Jardim vertical",
    text: "Paredes e fachadas verdes, internas ou externas, com espécies escolhidas para a luz de cada lugar.",
    href: "/jardim-vertical",
  },
  {
    title: "Irrigação automatizada e paisagismo",
    text: "Gotejamento com controlador programável: a água certa, na hora certa, sem depender de ninguém.",
    href: "/irrigacao-automatizada-e-paisagismo",
  },
  {
    title: "Manutenção",
    text: "Visitas técnicas periódicas para o jardim seguir saudável.",
    href: "/manutencao-de-jardim-vertical",
  },
];

export const servicoCardLink = "Ver detalhes";

/** Bloco condicional de preço (docs/07, Jardim vertical › Investimento). */
export const priceText = (minM2: number, maxM2: number, note: string) =>
  `Faixa de referência para jardim vertical natural com irrigação automatizada: de R$ ${minM2.toLocaleString("pt-BR")} a R$ ${maxM2.toLocaleString("pt-BR")} por m². ${note}`.trim();
