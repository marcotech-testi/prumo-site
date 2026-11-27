/** Modo de upload: Vercel Blob (produção/preview) ou local (dev/testes sem token, fora da Vercel). */
export function uploadMode(): "blob" | "local" {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL ? "blob" : "local";
}

export const LOCAL_BLOB_PREFIX = "http://localhost/__local-blob/";

/** Id do store a partir do token (vercel_blob_rw_<storeId>_<segredo>). */
function storeId() {
  const m = (process.env.BLOB_READ_WRITE_TOKEN ?? "").match(/^vercel_blob_rw_([a-z0-9]+)_/i);
  return m?.[1]?.toLowerCase() ?? null;
}

/** Só aceita URLs do store de Blob do projeto (ou locais, no modo local). */
export function isAllowedFileUrl(url: string) {
  if (uploadMode() === "local") return url.startsWith(LOCAL_BLOB_PREFIX);
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" || !u.hostname.endsWith(".public.blob.vercel-storage.com"))
      return false;
    const id = storeId();
    return id ? u.hostname.startsWith(`${id}.`) : true;
  } catch {
    return false;
  }
}

export const UPLOAD_PATH_RE = /^orcamentos\/\d{4}-\d{2}\/[0-9a-f-]{36}-[A-Za-z0-9._-]{1,100}$/;

export function sanitizeFileName(name: string) {
  const clean = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(-100);
  return clean || "arquivo";
}

export function uploadPathFor(name: string, uuid: string, now = new Date()) {
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return `orcamentos/${ym}/${uuid}-${sanitizeFileName(name)}`;
}
