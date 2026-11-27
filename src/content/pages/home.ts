import { defaultCta } from "./cta";

/** Home `/` (docs/07). */
export const home = {
  path: "/",
  label: "Início",
  title: "Jardim vertical em Curitiba | Prumo Paisagismo",
  description:
    "Jardins verticais e paisagismo com irrigação automatizada em Curitiba e região. Projeto, execução e manutenção. Orçamento em até um dia útil.",
  hero: {
    eyebrow: "Jardins verticais · Curitiba e região",
    h1: "Jardins verticais que continuam vivos.",
    subtitle:
      "Projeto, execução, irrigação automatizada e manutenção para casas e apartamentos em Curitiba e região metropolitana. Uma equipe só, do desenho ao cuidado.",
    primary: { label: "Pedir orçamento", href: "/orcamento" },
    microcopy:
      "Envie fotos e medidas da parede. Retornamos com uma faixa de investimento em até um dia útil.",
  },
  strip: ["Projeto", "Execução", "Irrigação automatizada", "Manutenção"],
  answer: {
    heading: "Um jardim vertical só é bonito se continuar vivo.",
    text: "Parede verde morre quando a irrigação é improvisada e ninguém cuida depois. Na Prumo, o sistema de irrigação faz parte do projeto desde o primeiro desenho, e a manutenção é planejada junto com a obra.",
  },
  services: { heading: "O que fazemos" },
  why: {
    heading: "Por que a Prumo",
    items: [
      {
        title: "Uma equipe, do projeto à manutenção.",
        text: "Quem desenha é quem instala e quem cuida depois. Ninguém empurra o problema para outro.",
      },
      {
        title: "Irrigação pensada desde o início.",
        text: "O sistema faz parte do projeto, não é um acessório. É o que mantém a parede viva.",
      },
      {
        title: "Experiência de obra.",
        text: "Execução com o rigor de quem trabalha para construtoras e incorporadoras.",
      },
      {
        title: "Obras reais.",
        text: "Mostramos trabalhos executados, com bairro e metragem. Sem imagem de catálogo e sem render.",
      },
    ],
  },
  obras: { heading: "Obras", moreLink: { label: "Ver todas as obras", href: "/obras" } },
  steps: { heading: "Como funciona" },
  architects: {
    heading: "Para arquitetos e designers de interiores",
    text: "Você especifica, nós executamos e cuidamos. O projeto do escritório é respeitado, e o cliente final recebe manutenção depois da entrega.",
    link: { label: "Para arquitetos", href: "/para-arquitetos" },
  },
  faq: {
    heading: "Perguntas frequentes",
    ids: [1, 3, 4, 6],
    moreLink: { label: "Ver todas", href: "/perguntas-frequentes" },
  },
  cta: defaultCta,
  whatsapp: "geral",
} as const;
