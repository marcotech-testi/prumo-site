import { globals } from "@/content/globals";

export type Crumb = { label: string; href: string };

/** Trilha de uma página interna (a mesma para o HTML visível e o JSON-LD). */
export function breadcrumbsFor(...items: Crumb[]): Crumb[] {
  return [{ label: globals.homeLabel, href: "/" }, ...items];
}
