import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/sobre` (docs/07). */
export const sobre: PageContent = {
  path: "/sobre",
  label: "Sobre",
  title: "Sobre a Prumo Paisagismo",
  description:
    "Quem está por trás da Prumo: projeto, atendimento e execução de jardins verticais em Curitiba e região.",
  h1: "Quem está por trás da Prumo",
  answer:
    "A Prumo nasceu de quem já executa jardins verticais para empresas que atendem construtoras e incorporadoras em Curitiba. Agora esse trabalho chega direto a você.",
  sections: [
    {
      id: "pilares",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "Projeto e tecnologia",
              text: "Desenho do jardim, escolha das espécies e automação da irrigação.",
            },
            {
              title: "Atendimento",
              text: "Orçamento, acompanhamento da obra e da manutenção, do primeiro contato em diante.",
            },
            {
              title: "Execução",
              text: "Equipe com várias obras entregues para construtoras e incorporadoras.",
            },
          ],
        },
      ],
    },
    {
      id: "o-nome",
      heading: "O nome",
      blocks: [
        {
          type: "p",
          text: "Prumo é o fio com peso que marca a vertical exata. É também aprumo: alinhamento, firmeza, trabalho bem feito.",
        },
      ],
    },
    {
      id: "como-atendemos",
      heading: "Como atendemos",
      blocks: [
        {
          type: "p",
          text: "Respondemos no mesmo dia útil, sempre com o nome de quem atende. Falamos em faixa de investimento por m² e só fechamos o valor depois da visita técnica.",
        },
      ],
    },
  ],
  cta: defaultCta,
  whatsapp: "geral",
};
