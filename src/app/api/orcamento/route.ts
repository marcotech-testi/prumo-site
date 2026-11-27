import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env";
import { isHoneypotFilled, isTooFast, verifyPass } from "@/lib/antispam";
import { isAllowedFileUrl, uploadMode } from "@/lib/blob";
import { confirmationMail, internalQuoteMail, sendMail } from "@/lib/mail";
import { buildQuoteRecord } from "@/lib/quote-record";
import { fieldErrors, quoteRequestSchema, validateFiles, type Arquivo } from "@/lib/quote-schema";
import { sendWebhook } from "@/lib/webhook";

export const runtime = "nodejs";

/** Confere tipo e tamanho reais no Blob (o cliente pode mentir). */
async function verifyBlobFiles(arquivos: Arquivo[]): Promise<Arquivo[] | null> {
  if (uploadMode() === "local") return arquivos;
  try {
    return await Promise.all(
      arquivos.map(async (a) => {
        const meta = await head(a.url);
        return { ...a, tipo: meta.contentType, tamanhoBytes: meta.size };
      }),
    );
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const parsed = quoteRequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 400 });
  }
  const data = parsed.data;

  // Antispam: bots recebem 200 sem e-mail e sem pista.
  if (isHoneypotFilled(data.website) || isTooFast(data.renderedAt) || !verifyPass(data.passe)) {
    console.warn("[orcamento] descartado pelo antispam");
    return NextResponse.json({ ok: true, id: "pq_ok" });
  }

  if (!data.arquivos.every((a) => isAllowedFileUrl(a.url))) {
    return NextResponse.json(
      { ok: false, errors: { fotos: "Arquivo inválido." } },
      { status: 400 },
    );
  }
  const arquivos = await verifyBlobFiles(data.arquivos);
  const fileError = arquivos ? validateFiles(arquivos) : "Arquivo não encontrado.";
  if (!arquivos || fileError) {
    return NextResponse.json({ ok: false, errors: { fotos: fileError } }, { status: 400 });
  }

  const record = buildQuoteRecord({ ...data, arquivos });
  const env = serverEnv();
  const to = (env.QUOTE_TO_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    await sendMail(internalQuoteMail(record, to.length ? to : ["orcamento-local@localhost"]));
  } catch (err) {
    console.error(`[orcamento] falha no e-mail interno ${record.id}: ${(err as Error).message}`);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const confirmation = confirmationMail(record);
  if (confirmation) {
    await sendMail(confirmation).catch((err) =>
      console.error(`[orcamento] falha na confirmação ${record.id}: ${(err as Error).message}`),
    );
  }

  await sendWebhook(record);
  console.log(`[orcamento] recebido ${record.id}`);
  return NextResponse.json({ ok: true, id: record.id });
}
