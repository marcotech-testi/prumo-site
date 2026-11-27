import { siteConfig } from "@/content/site";

/** Páginas 404 e erro (docs/07). */
export const notFoundContent = {
  title: "Página não encontrada",
  h1: "Página não encontrada.",
  text: "O endereço não existe ou mudou.",
  links: [
    { label: "Início", href: "/" },
    { label: "Jardim vertical", href: "/jardim-vertical" },
    { label: "Pedir orçamento", href: "/orcamento" },
  ],
} as const;

export const errorContent = {
  h1: "Algo deu errado.",
  text: (email = siteConfig.email) =>
    `Tente de novo em instantes. Se continuar, escreva para ${email}.`,
  retry: "Tentar de novo",
  links: [
    { label: "Início", href: "/" },
    { label: "Pedir orçamento", href: "/orcamento" },
  ],
} as const;
