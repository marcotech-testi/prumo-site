import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/manutencao-de-jardim-vertical` (docs/07). */
export const manutencao: PageContent = {
  path: "/manutencao-de-jardim-vertical",
  label: "Manutenção de jardim vertical",
  title: "Manutenção de jardim vertical em Curitiba | Prumo",
  description:
    "Plano mensal de manutenção de jardim vertical: poda, adubação, ajuste da irrigação e reposição de plantas, com registro de cada visita.",
  h1: "Manutenção de jardim vertical em Curitiba e região",
  answer:
    "Jardim vertical é planta viva sobre uma parede. Com visita técnica regular, ele continua cheio e saudável. A Prumo oferece plano mensal de manutenção, contratado junto com a obra.",
  serviceType: "Manutenção de jardim vertical",
  sections: [
    {
      id: "o-que-inclui",
      heading: "O que inclui",
      blocks: [
        {
          type: "spec",
          items: [
            "Poda e limpeza das plantas",
            "Adubação e controle de pragas",
            "Ajuste e limpeza da irrigação",
            "Reposição de plantas quando necessário",
            "Registro de cada visita para o cliente",
          ],
        },
      ],
    },
    {
      id: "como-contratar",
      heading: "Como contratar",
      blocks: [
        {
          type: "p",
          text: "O plano mensal é combinado na proposta da obra. A frequência das visitas e o investimento mensal dependem da metragem e da exposição da parede e constam por escrito. Todo orçamento de jardim vertical inclui a opção de manutenção.",
        },
      ],
    },
    { id: "perguntas", heading: "Perguntas", blocks: [{ type: "faq", ids: [4, 9] }] },
  ],
  cta: {
    ...defaultCta,
    primary: { label: "Pedir orçamento com manutenção", href: "/orcamento" },
    whatsapp: "manutencao",
    links: [
      { label: "Jardim vertical", href: "/jardim-vertical" },
      { label: "Irrigação automatizada", href: "/irrigacao-automatizada-e-paisagismo" },
    ],
  },
  whatsapp: "manutencao",
};
