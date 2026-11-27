import { NextResponse } from "next/server";
import { z } from "zod";
import { issuePass, verifyTurnstile } from "@/lib/antispam";

export const runtime = "nodejs";

/** Verifica o Turnstile (uma vez) e emite um passe assinado para os uploads e o envio. */
export async function POST(req: Request) {
  const body = z
    .object({ turnstileToken: z.string().nullish() })
    .safeParse(await req.json().catch(() => ({})));
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!body.success || !(await verifyTurnstile(body.data.turnstileToken ?? undefined, ip))) {
    return NextResponse.json({ ok: false, error: "antispam" }, { status: 403 });
  }
  return NextResponse.json({ ok: true, passe: issuePass() });
}
