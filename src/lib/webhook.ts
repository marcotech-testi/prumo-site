import { hmacSha256Hex } from "./hmac";

/** Assinatura do webhook: sha256=<HMAC-SHA256 do corpo bruto>. */
export function signWebhook(secret: string, rawBody: string) {
  return `sha256=${hmacSha256Hex(secret, rawBody)}`;
}

/** Envia o webhook (timeout 5 s, 2 tentativas). Nunca lança: falha só é registrada. */
export async function sendWebhook(
  record: unknown,
  opts = { url: process.env.QUOTE_WEBHOOK_URL, secret: process.env.QUOTE_WEBHOOK_SECRET },
) {
  if (!opts.url || !opts.secret) return { sent: false as const, reason: "não configurado" };
  const raw = JSON.stringify(record);
  const headers = {
    "Content-Type": "application/json",
    "X-Prumo-Signature": signWebhook(opts.secret, raw),
    "X-Prumo-Timestamp": String(Math.floor(Date.now() / 1000)),
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(opts.url, {
        method: "POST",
        headers,
        body: raw,
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) return { sent: true as const };
      console.error(`[webhook] tentativa ${attempt}: HTTP ${res.status}`);
    } catch (err) {
      console.error(`[webhook] tentativa ${attempt}: ${(err as Error).message}`);
    }
  }
  return { sent: false as const, reason: "falhou" };
}
