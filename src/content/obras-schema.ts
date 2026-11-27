import { z } from "zod";

export const obraTipos = [
  "fachada_externa",
  "parede_interna",
  "varanda",
  "area_gourmet",
  "muro",
  "empreendimento",
] as const;

export const obraTipoLabel: Record<(typeof obraTipos)[number], string> = {
  fachada_externa: "Fachada externa",
  parede_interna: "Parede interna",
  varanda: "Varanda",
  area_gourmet: "Área gourmet",
  muro: "Muro",
  empreendimento: "Empreendimento",
};

export const fotoTipos = ["geral", "detalhe", "escala", "irrigacao", "antes", "depois"] as const;

export const fotoSchema = z.object({
  src: z.string().startsWith("/obras/"),
  alt: z.string().min(10, "alt descritivo obrigatório"),
  tipo: z.enum(fotoTipos),
  width: z.number().int().positive().default(1600),
  height: z.number().int().positive().default(1200),
});

export const obraSchema = z.object({
  titulo: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slug só com a-z, 0-9 e hífen"),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  tipo: z.enum(obraTipos),
  metragemM2: z.number().positive(),
  especies: z.array(z.string().min(2)).min(1),
  irrigacao: z.string().min(3),
  prazoDias: z.number().int().positive().optional(),
  ano: z.number().int().min(2000).max(2100),
  autorizacaoUso: z.boolean().default(false),
  fotos: z.array(fotoSchema).default([]),
});

export type Obra = z.infer<typeof obraSchema> & { descricao: string; lastModified?: string };

/** Regra de publicação (docs/02): autorização, ≥ 2 fotos e ao menos uma foto de irrigação. */
export function isPublishable(obra: Pick<Obra, "autorizacaoUso" | "fotos">) {
  return (
    obra.autorizacaoUso === true &&
    obra.fotos.length >= 2 &&
    obra.fotos.some((f) => f.tipo === "irrigacao")
  );
}
