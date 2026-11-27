import { z } from "zod";

/** Schema do orçamento, compartilhado entre o cliente e o servidor (docs/05). */
export const perfis = ["cliente", "arquiteto", "construtora"] as const;
export const tiposEspaco = [
  "fachada_externa",
  "parede_interna",
  "varanda",
  "area_gourmet",
  "empreendimento",
  "outro",
] as const;
export const luzes = ["sol_pleno", "meia_sombra", "sombra", "nao_sei"] as const;
export const pontosAgua = ["sim", "nao", "nao_sei"] as const;
export const prazos = ["o_quanto_antes", "1_3_meses", "planejando", "sem_pressa"] as const;

export const FILE_LIMITS = {
  maxFiles: 6,
  imageTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  videoTypes: ["video/mp4", "video/quicktime"],
  maxImageBytes: 10 * 1024 * 1024,
  maxVideoBytes: 100 * 1024 * 1024,
  maxVideos: 1,
  maxTotalBytes: 150 * 1024 * 1024,
} as const;

export const allowedFileTypes: string[] = [...FILE_LIMITS.imageTypes, ...FILE_LIMITS.videoTypes];

export type FileMeta = { nome: string; tipo: string; tamanhoBytes: number };

/** Valida tipo, tamanho e quantidade dos arquivos. Devolve a mensagem de erro ou null. */
export function validateFiles(files: FileMeta[]): string | null {
  if (files.length === 0) return "Envie pelo menos uma foto ou um vídeo da parede.";
  if (files.length > FILE_LIMITS.maxFiles)
    return `Envie no máximo ${FILE_LIMITS.maxFiles} arquivos.`;
  let total = 0;
  let videos = 0;
  for (const f of files) {
    total += f.tamanhoBytes;
    const isImage = (FILE_LIMITS.imageTypes as readonly string[]).includes(f.tipo);
    const isVideo = (FILE_LIMITS.videoTypes as readonly string[]).includes(f.tipo);
    if (!isImage && !isVideo)
      return `"${f.nome}" não é um formato aceito (JPG, PNG, WEBP, HEIC, MP4 ou MOV).`;
    if (isImage && f.tamanhoBytes > FILE_LIMITS.maxImageBytes) return `"${f.nome}" passa de 10 MB.`;
    if (isVideo) {
      videos++;
      if (f.tamanhoBytes > FILE_LIMITS.maxVideoBytes) return `"${f.nome}" passa de 100 MB.`;
    }
  }
  if (videos > FILE_LIMITS.maxVideos) return "Envie no máximo 1 vídeo.";
  if (total > FILE_LIMITS.maxTotalBytes) return "Os arquivos somam mais de 150 MB.";
  return null;
}

/** Número com vírgula ou ponto; vazio = undefined. */
const medida = z.preprocess(
  (v) => {
    if (v === "" || v === null || v === undefined) return undefined;
    if (typeof v === "number") return v;
    return Number(String(v).replace(/\s/g, "").replace(",", "."));
  },
  z
    .number({ error: "Informe um número." })
    .min(0.5, "Mínimo 0,5 m.")
    .max(60, "Máximo 60 m.")
    .optional(),
);

/** Celular brasileiro: DDD (2 dígitos) + 9 dígitos começando com 9. Guarda só os dígitos. */
export const whatsappBr = z
  .string()
  .transform((v) => v.replace(/\D/g, "").replace(/^55(?=\d{11}$)/, ""))
  .refine(
    (v) => /^[1-9]{2}9\d{8}$/.test(v),
    "Informe DDD e celular com 9 dígitos, ex.: (41) 90000-0000.",
  );

const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Use no máximo ${max} caracteres.`)
    .optional()
    .transform((v) => (v && v.trim() ? v.trim() : undefined));

export const origemSchema = z
  .object({
    pagina: z.string().max(300).optional(),
    referrer: z.string().max(500).optional(),
    utm_source: z.string().max(200).optional(),
    utm_medium: z.string().max(200).optional(),
    utm_campaign: z.string().max(200).optional(),
    utm_content: z.string().max(200).optional(),
    utm_term: z.string().max(200).optional(),
    gclid: z.string().max(300).optional(),
    fbclid: z.string().max(300).optional(),
    obra: z.string().max(100).optional(),
  })
  .partial()
  .default({});

/** Campos que a pessoa preenche (validados no cliente e no servidor). */
export const quoteFieldsSchema = z
  .object({
    perfil: z.enum(perfis, { error: "Escolha uma opção." }),
    tipo: z.enum(tiposEspaco, { error: "Escolha onde será o jardim." }),
    larguraM: medida,
    alturaM: medida,
    naoSeiMedidas: z.boolean().default(false),
    sol: z.enum(luzes, { error: "Escolha a luz na parede." }),
    pontoAgua: z.enum(pontosAgua, { error: "Escolha uma opção." }),
    prazo: z.enum(prazos).optional(),
    mensagem: optionalText(1000),
    nome: z.string().trim().min(2, "Informe seu nome.").max(80, "Use no máximo 80 caracteres."),
    whatsapp: whatsappBr,
    email: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ? v : undefined))
      .pipe(z.email("E-mail inválido.").optional()),
    cidade: z.string().trim().min(2, "Informe a cidade.").max(80),
    bairro: z.string().trim().min(2, "Informe o bairro.").max(60, "Use no máximo 60 caracteres."),
    consentimento: z.literal(true, { error: "É preciso concordar para enviar o pedido." }),
  })
  .superRefine((v, ctx) => {
    if (!v.naoSeiMedidas) {
      if (v.larguraM === undefined)
        ctx.addIssue({
          code: "custom",
          path: ["larguraM"],
          message: 'Informe a largura ou marque "Não sei as medidas".',
        });
      if (v.alturaM === undefined)
        ctx.addIssue({
          code: "custom",
          path: ["alturaM"],
          message: 'Informe a altura ou marque "Não sei as medidas".',
        });
    }
  });

export const arquivoSchema = z.object({
  url: z.url(),
  nome: z.string().min(1).max(200),
  tipo: z.string().min(3).max(100),
  tamanhoBytes: z.number().int().nonnegative(),
});

/** Corpo do POST /api/orcamento. */
export const quoteRequestSchema = z.object({
  schemaVersion: z.literal(1),
  campos: quoteFieldsSchema,
  arquivos: z.array(arquivoSchema).min(1).max(FILE_LIMITS.maxFiles),
  origem: origemSchema,
  website: z.string().optional().default(""),
  renderedAt: z.number(),
  passe: z.string().min(10),
});

export type QuoteFields = z.infer<typeof quoteFieldsSchema>;
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;
export type Arquivo = z.infer<typeof arquivoSchema>;
export type Origem = z.infer<typeof origemSchema>;

/** Área aproximada em m² (1 casa decimal). */
export function areaAprox(largura?: number, altura?: number) {
  if (largura === undefined || altura === undefined) return null;
  return Math.round(largura * altura * 10) / 10;
}

/** Erros por campo (primeira mensagem de cada). */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[issue.path.length - 1] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
