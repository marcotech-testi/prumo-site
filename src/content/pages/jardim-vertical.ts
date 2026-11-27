import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/jardim-vertical` (docs/07). */
export const jardimVertical: PageContent = {
  path: "/jardim-vertical",
  label: "Jardim vertical",
  title: "Jardim vertical em Curitiba e região | Prumo",
  description:
    "Projeto, execução e manutenção de jardim vertical natural com irrigação automatizada. Envie fotos e medidas e receba uma faixa de investimento.",
  h1: "Jardim vertical em Curitiba e região metropolitana",
  answer:
    "Jardim vertical é uma parede, fachada ou painel coberto de plantas vivas, fixadas em uma estrutura com irrigação própria. A Prumo projeta, executa e mantém jardins verticais naturais com irrigação automatizada para casas e apartamentos de alto padrão em Curitiba, São José dos Pinhais, Pinhais, Colombo e região, e para os arquitetos que os projetam.",
  serviceType: "Jardim vertical",
  sections: [
    {
      id: "onde-instalar",
      heading: "Onde pode ser instalado",
      blocks: [
        {
          type: "p",
          text: "Fachadas e muros externos, paredes internas, varandas, áreas gourmet, halls e escritórios. Também chamado de parede verde, muro verde ou jardim de parede. A viabilidade depende de luz, ponto de água, drenagem e da estrutura da parede, e é avaliada pelas fotos e, depois, na visita técnica.",
        },
      ],
    },
    {
      id: "como-funciona-o-sistema",
      heading: "Como funciona o sistema",
      blocks: [
        {
          type: "p",
          // REVISAR-PARCEIRO: estrutura, módulo e drenagem
          text: "Uma estrutura fixada na parede recebe as plantas. A irrigação é por gotejamento, com controlador programável: a água certa, na hora certa, sem depender de ninguém. A estrutura, o tipo de módulo e a drenagem variam conforme a parede e são definidos na visita técnica.",
        },
      ],
    },
    {
      id: "especies-e-luz",
      heading: "Espécies e luz",
      blocks: [
        {
          type: "p",
          text: "Cada espécie tem uma necessidade de luz. Uma parede com sol da tarde pede espécies que aguentem; planta de sombra não vive em sol pleno. Escolhemos as espécies para a sua parede e, se a luz não for suficiente para um jardim natural, avisamos antes de propor.",
        },
      ],
    },
    {
      id: "clima-e-parede",
      heading: "Clima de Curitiba e estado da parede",
      blocks: [
        {
          type: "p",
          // REVISAR-PARCEIRO: clima de Curitiba (inverno, geadas, espécies rústicas)
          text: "Curitiba tem inverno frio e geadas ocasionais: fachadas externas pedem espécies rústicas e proteção, e áreas internas são menos exigentes.",
        },
        {
          type: "p",
          // REVISAR-PARCEIRO: umidade e impermeabilização
          text: "Umidade e impermeabilização são o maior risco técnico de um jardim vertical. Avaliamos a parede na visita e registramos o que for necessário na proposta.",
        },
      ],
    },
    {
      id: "investimento",
      heading: "Investimento",
      blocks: [
        {
          type: "p",
          text: "O valor depende da metragem, da exposição ao sol, do tipo de estrutura, das espécies e da irrigação. Por isso não existe um preço único por metro quadrado. Envie fotos e medidas da parede: retornamos com uma faixa de investimento por m² em até um dia útil. O valor fechado vem depois da visita técnica.",
        },
        { type: "price" },
      ],
    },
    {
      id: "prazo-e-garantia",
      heading: "Prazo e garantia",
      blocks: [
        {
          type: "p",
          text: "O prazo de execução, a garantia e a reposição de plantas constam por escrito na proposta, de acordo com o tamanho e a complexidade da obra.",
        },
      ],
    },
    { id: "etapas", heading: "Etapas", blocks: [{ type: "steps" }] },
    {
      id: "perguntas",
      heading: "Perguntas sobre jardim vertical",
      blocks: [{ type: "faq", ids: [1, 2, 3, 6, 7, 8] }],
    },
  ],
  cta: {
    ...defaultCta,
    primary: { label: "Pedir orçamento do seu jardim vertical", href: "/orcamento" },
    whatsapp: "jardimVertical",
    links: [
      { label: "Manutenção", href: "/manutencao-de-jardim-vertical" },
      { label: "Irrigação automatizada", href: "/irrigacao-automatizada-e-paisagismo" },
    ],
  },
  whatsapp: "jardimVertical",
};
