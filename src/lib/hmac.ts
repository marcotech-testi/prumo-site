import { createHmac, timingSafeEqual } from "node:crypto";

export function hmacSha256Hex(secret: string, body: string) {
  return createHmac("sha256", secret).update(body).digest("hex");
}

export function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}
