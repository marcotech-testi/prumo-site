import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { verifyPass } from "@/lib/antispam";
import { UPLOAD_PATH_RE } from "@/lib/blob";
import { allowedFileTypes, FILE_LIMITS } from "@/lib/quote-schema";

export const runtime = "nodejs";

/** Emite token temporário para upload direto do navegador ao Vercel Blob. */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let passe: string | undefined;
        try {
          passe = (JSON.parse(clientPayload ?? "{}") as { passe?: string }).passe;
        } catch {
          /* payload inválido */
        }
        if (!verifyPass(passe)) throw new Error("passe inválido");
        if (!UPLOAD_PATH_RE.test(pathname)) throw new Error("caminho inválido");
        return {
          allowedContentTypes: allowedFileTypes,
          maximumSizeInBytes: FILE_LIMITS.maxVideoBytes,
          addRandomSuffix: true,
          validUntil: Date.now() + 30 * 60 * 1000,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(`[upload] ${(err as Error).message}`);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
