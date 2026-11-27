import { faq } from "../faq";
import type { PageContent } from "../types";
import { defaultCta } from "./cta";

/** `/perguntas-frequentes` (docs/07). */
export const perguntasFrequentes: PageContent = {
  path: "/perguntas-frequentes",
  label: "Perguntas frequentes",
  title: "Perguntas sobre jardim vertical | Prumo",
  description:
    "Custo, manutenção, irrigação, apartamento, garantia e como escolher uma empresa de jardim vertical em Curitiba.",
  h1: "Perguntas frequentes sobre jardim vertical",
  sections: [{ id: "perguntas", blocks: [{ type: "faq", ids: faq.map((f) => f.id) }] }],
  cta: defaultCta,
  whatsapp: "geral",
};
