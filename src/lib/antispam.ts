import { randomUUID } from "node:crypto";
import { hmacSha256Hex, safeEqual } from "./hmac";

export const MIN_FILL_MS = 4000;
const PASS_TTL_MS = 30 * 60 * 1000;

/** Sem Turnstile configurado fora da Vercel (dev/testes locais), a verificação passa. */
export function turnstileBypass() {
  return !process.env.TURNSTILE_SECRET_KEY && !process.env.VERCEL;
}

export function isHoneypotFilled(website: string | undefined) {
  return !!website && website.trim() !== "";
}

export function isTooFast(renderedAt: number, now = Date.now()) {
  return !Number.isFinite(renderedAt) || now - renderedAt < MIN_FILL_MS;
}

/** Verifica um token do Turnstile (uso único) na API da Cloudflare. */
export async function verifyTurnstile(
  token: string | undefined,
  ip?: string | null,
): Promise<boolean> {
  if (turnstileBypass()) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

function passSecret() {
  return process.env.TURNSTILE_SECRET_KEY || process.env.QUOTE_WEBHOOK_SECRET || "prumo-dev-only";
}

/**
 * Passe assinado emitido depois de o Turnstile ser verificado uma vez.
 * Autoriza os uploads e o envio do mesmo pedido por 30 minutos.
 */
export function issuePass(now = Date.now()) {
  const payload = `${randomUUID()}.${now + PASS_TTL_MS}`;
  return `${payload}.${hmacSha256Hex(passSecret(), payload)}`;
}

export function verifyPass(pass: string | null | undefined, now = Date.now()) {
  if (!pass) return false;
  const parts = pass.split(".");
  if (parts.length !== 3) return false;
  const [id, exp, sig] = parts;
  if (!safeEqual(sig, hmacSha256Hex(passSecret(), `${id}.${exp}`))) return false;
  return Number(exp) > now;
}
