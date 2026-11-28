import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/irrigacao-automatizada-e-paisagismo` (docs/07). */
export const irrigacao: PageContent = {
  path: "/irrigacao-automatizada-e-paisagismo",
  label: "Irrigação automatizada e paisagismo",
  title: "Irrigação automatizada e paisagismo em Curitiba | Prumo",
  description:
    "Como funciona a irrigação automatizada de um jardim vertical e como a Prumo projeta o sistema junto com o jardim. Curitiba e região.",
  h1: "Irrigação automatizada e paisagismo em Curitiba e região",
  answer:
    "A irrigação automatizada mantém o jardim vivo sem depender de rega manual: um controlador programável aciona gotejadores em horários definidos. A Prumo projeta o sistema junto com o jardim vertical, e avalia projetos de paisagismo para varandas e áreas externas caso a caso.",
  serviceType: "Irrigação automatizada",
  sections: [
    {
      id: "como-funciona-a-irrigacao",
      heading: "Como funciona a irrigação automatizada",
      blocks: [
        {
          type: "p",
          // REVISAR-PARCEIRO: componentes da irrigação e abastecimento sem ponto de água
          text: "Um controlador programável liga a água em ciclos definidos. A água segue por tubulação até gotejadores, que distribuem o volume certo para cada trecho da parede. Filtro, controle de pressão e drenagem evitam entupimento e excesso de água. Quando não há ponto de água próximo, a solução de abastecimento é definida na visita técnica.",
        },
        { type: "diagram" },
      ],
    },
    {
      id: "por-que-faz-diferenca",
      heading: "Por que ela faz diferença",
      blocks: [
        {
          type: "p",
          text: "Planta em parede depende de rega constante e regular. Com a irrigação automatizada, quem viaja não precisa deixar alguém regando, e a programação é ajustada à estação e à exposição de cada parede. Por isso a irrigação entra no projeto desde o primeiro desenho, e não como acessório no fim da obra.",
        },
      ],
    },
    {
      id: "paisagismo-sob-consulta",
      heading: "Paisagismo, sob consulta",
      blocks: [
        {
          type: "p",
          text: "O foco da Prumo é o jardim vertical. Projetos de paisagismo para jardins, varandas e áreas externas são avaliados caso a caso. Conte o que você tem em mente pelo orçamento e respondemos se a Prumo é a equipe certa para o projeto.",
        },
      ],
    },
    { id: "perguntas", heading: "Perguntas", blocks: [{ type: "faq", ids: [5, 6, 10] }] },
  ],
  cta: {
    ...defaultCta,
    whatsapp: "irrigacao",
    links: [
      { label: "Jardim vertical", href: "/jardim-vertical" },
      { label: "Manutenção", href: "/manutencao-de-jardim-vertical" },
    ],
  },
  whatsapp: "irrigacao",
};
