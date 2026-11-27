import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { isPublishable, obraSchema, type Obra } from "./obras-schema";

const DIR = path.join(process.cwd(), "src/content/obras");

/** Em desenvolvimento, PRUMO_SHOW_EXAMPLE_OBRA=true exibe a obra de exemplo para validar o layout. */
const showExample =
  process.env.NODE_ENV !== "production" && process.env.PRUMO_SHOW_EXAMPLE_OBRA === "true";

export function parseObraFile(raw: string, file: string): Obra {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: frontmatter ausente`);
  const result = obraSchema.safeParse(parse(match[1]));
  if (!result.success) {
    throw new Error(
      `${file}: frontmatter inválido\n${result.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n")}`,
    );
  }
  return { ...result.data, descricao: match[2].trim() };
}

let cache: Obra[] | null = null;

/** Todas as obras válidas (a validação falha o build se houver frontmatter inválido). */
export function getAllObras(): Obra[] {
  if (cache) return cache;
  if (!fs.existsSync(DIR)) return (cache = []);
  cache = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx"))
    .filter((f) => !f.startsWith("_") || showExample)
    .map((f) => {
      const obra = parseObraFile(fs.readFileSync(path.join(DIR, f), "utf8"), f);
      return f.startsWith("_") ? { ...obra, autorizacaoUso: true } : obra;
    })
    .sort((a, b) => b.ano - a.ano || a.titulo.localeCompare(b.titulo));
  return cache;
}

export function getPublishedObras(): Obra[] {
  return getAllObras().filter(isPublishable);
}

export function getObra(slug: string) {
  return getPublishedObras().find((o) => o.slug === slug);
}

export function hasPublishedObras() {
  return getPublishedObras().length > 0;
}
