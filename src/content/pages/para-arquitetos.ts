import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/para-arquitetos` (docs/07). */
export const paraArquitetos: PageContent = {
  path: "/para-arquitetos",
  label: "Para arquitetos",
  title: "Jardim vertical para arquitetos | Prumo Paisagismo",
  description:
    "Você especifica, a Prumo executa e cuida. Apoio técnico em espécies, estrutura e irrigação, e manutenção para o cliente final.",
  h1: "Jardim vertical para arquitetos e designers de interiores",
  answer:
    "Você especifica, nós executamos e cuidamos. O projeto do escritório é respeitado, e o cliente final recebe manutenção depois da entrega. Parede verde, muro verde, fachada ou painel interno: conversamos antes de o detalhe fechar.",
  sections: [
    {
      id: "como-trabalha",
      heading: "Como a Prumo trabalha com o seu projeto",
      blocks: [
        {
          type: "features",
          items: [
            {
              title: "Especificação",
              text: "Apoio técnico na escolha de espécies, estrutura e irrigação.",
            },
            {
              title: "Execução",
              text: "Equipe com experiência em obras de construtoras e incorporadoras.",
            },
            {
              title: "Pós-obra",
              text: "Plano de manutenção para o cliente final, com registro das visitas.",
            },
          ],
        },
      ],
    },
    {
      id: "como-comecamos",
      heading: "Como começamos",
      blocks: [
        {
          type: "numbered",
          items: [
            "Você envia fotos, medidas ou o projeto da área.",
            "Retornamos com uma faixa de investimento e as perguntas técnicas, em até um dia útil.",
            "Fazemos a visita técnica, com o cliente quando fizer sentido.",
            "A proposta segue por escrito, com espécies, irrigação, prazo e investimento.",
          ],
        },
      ],
    },
  ],
  cta: {
    ...defaultCta,
    primary: { label: "Enviar um projeto", href: "/orcamento?perfil=arquiteto" },
    whatsapp: "arquitetos",
    links: [
      { label: "Jardim vertical", href: "/jardim-vertical" },
      { label: "Manutenção", href: "/manutencao-de-jardim-vertical" },
    ],
  },
  whatsapp: "arquitetos",
};
