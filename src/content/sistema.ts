/**
 * Esquema do sistema (diagrama ilustrativo). Os rótulos repetem os componentes já descritos
 * em docs/07 (jardim vertical e irrigação); nada aqui é medida, marca ou especificação.
 */
// REVISAR-PARCEIRO: componentes do esquema (estrutura, módulo, gotejamento, filtro, drenagem)
export const sistema = {
  title: "Esquema de um jardim vertical com irrigação automatizada",
  caption:
    "Esquema ilustrativo. A estrutura, o tipo de módulo e a drenagem variam conforme a parede e são definidos na visita técnica.",
  parts: [
    { n: 1, label: "Estrutura fixada na parede" },
    { n: 2, label: "Módulos com as plantas" },
    { n: 3, label: "Linhas de gotejamento" },
    { n: 4, label: "Controlador programável" },
    { n: 5, label: "Filtro e controle de pressão" },
    { n: 6, label: "Ponto de água" },
    { n: 7, label: "Drenagem" },
  ],
} as const;
