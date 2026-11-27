/** Rascunho preparado por agentes (WebMCP `iniciar_pedido_orcamento`, docs/09). Sem arquivos e sem consentimento. */
export const QUOTE_DRAFT_KEY = "prumo:quote-draft";
export const QUOTE_DRAFT_EVENT = "prumo:quote-draft";
/** Rascunho do próprio formulário (preservado entre recargas na sessão). */
export const QUOTE_FORM_KEY = "prumo:quote-form";

export const draftFields = [
  "perfil",
  "tipo",
  "larguraM",
  "alturaM",
  "naoSeiMedidas",
  "sol",
  "pontoAgua",
  "prazo",
  "mensagem",
  "nome",
  "whatsapp",
  "email",
  "cidade",
  "bairro",
] as const;

export type DraftField = (typeof draftFields)[number];
export type QuoteDraft = Partial<Record<DraftField, string | boolean>>;

/** Mantém só campos conhecidos e com tipos simples; trunca textos. */
export function sanitizeDraft(input: unknown): QuoteDraft {
  if (!input || typeof input !== "object") return {};
  const out: QuoteDraft = {};
  for (const key of draftFields) {
    const v = (input as Record<string, unknown>)[key];
    if (key === "naoSeiMedidas") {
      if (typeof v === "boolean") out[key] = v;
    } else if (typeof v === "string" || typeof v === "number") {
      out[key] = String(v).slice(0, key === "mensagem" ? 1000 : 120);
    }
  }
  return out;
}

export function takeDraft(): QuoteDraft | null {
  try {
    const raw = sessionStorage.getItem(QUOTE_DRAFT_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(QUOTE_DRAFT_KEY);
    return sanitizeDraft(JSON.parse(raw));
  } catch {
    return null;
  }
}
