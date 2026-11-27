import type { PageContent } from "../types";
import { irrigacao } from "./irrigacao";
import { jardimVertical } from "./jardim-vertical";
import { manutencao } from "./manutencao";
import { paraArquitetos } from "./para-arquitetos";
import { perguntasFrequentes } from "./perguntas-frequentes";
import { sobre } from "./sobre";

export { home } from "./home";

/** Páginas internas no formato PageContent (fonte para HTML, Markdown, JSON-LD e agentes). */
export const contentPages: PageContent[] = [
  jardimVertical,
  irrigacao,
  manutencao,
  paraArquitetos,
  sobre,
  perguntasFrequentes,
];

export const servicePages = [jardimVertical, irrigacao, manutencao];

export function pageByPath(path: string) {
  return contentPages.find((p) => p.path === path);
}

export { irrigacao, jardimVertical, manutencao, paraArquitetos, perguntasFrequentes, sobre };
