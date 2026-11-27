/** Navegação (docs/07 — Globais). `requiresObras` some quando não há obra publicada. */
export type NavItem = { label: string; href: string; requiresObras?: boolean };

export const mainNav: NavItem[] = [
  { label: "Jardim vertical", href: "/jardim-vertical" },
  { label: "Irrigação e paisagismo", href: "/irrigacao-automatizada-e-paisagismo" },
  { label: "Manutenção", href: "/manutencao-de-jardim-vertical" },
  { label: "Obras", href: "/obras", requiresObras: true },
  { label: "Para arquitetos", href: "/para-arquitetos" },
  { label: "Perguntas", href: "/perguntas-frequentes" },
];

export const footerColumns: { title: string; items: NavItem[] }[] = [
  {
    title: "Serviços",
    items: [
      { label: "Jardim vertical", href: "/jardim-vertical" },
      {
        label: "Irrigação automatizada e paisagismo",
        href: "/irrigacao-automatizada-e-paisagismo",
      },
      { label: "Manutenção", href: "/manutencao-de-jardim-vertical" },
    ],
  },
  {
    title: "Empresa",
    items: [
      { label: "Sobre", href: "/sobre" },
      { label: "Obras", href: "/obras", requiresObras: true },
      { label: "Para arquitetos", href: "/para-arquitetos" },
      { label: "Perguntas frequentes", href: "/perguntas-frequentes" },
    ],
  },
];

export const footerContactTitle = "Contato";
export const footerSocialTitle = "Redes";

export function visibleNav(items: NavItem[], hasObras: boolean) {
  return items.filter((i) => !i.requiresObras || hasObras);
}
