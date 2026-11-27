import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { verifyPass } from "@/lib/antispam";
import { UPLOAD_PATH_RE } from "@/lib/blob";
import { allowedFileTypes, FILE_LIMITS } from "@/lib/quote-schema";

export const runtime = "nodejs";

/**
 * Upload direto do navegador ao Vercel Blob por URL pré-assinada.
 * Funciona com OIDC (BLOB_STORE_ID, padrão dos stores novos) ou com BLOB_READ_WRITE_TOKEN.
 * O token é limitado ao caminho do arquivo, à operação `put`, aos tipos e ao tamanho permitidos.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadPresignedBody;
  try {
    const result = await handleUploadPresigned({
      body,
      request: req,
      getSignedToken: async (pathname, clientPayload) => {
        let passe: string | undefined;
        try {
          passe = (JSON.parse(clientPayload ?? "{}") as { passe?: string }).passe;
        } catch {
          /* payload inválido */
        }
        if (!verifyPass(passe)) throw new Error("passe inválido");
        if (!UPLOAD_PATH_RE.test(pathname)) throw new Error("caminho inválido");
        const validUntil = Date.now() + 30 * 60 * 1000;
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          validUntil,
          allowedContentTypes: allowedFileTypes,
          maximumSizeInBytes: FILE_LIMITS.maxVideoBytes,
        });
        return {
          token,
          urlOptions: {
            validUntil,
            allowedContentTypes: allowedFileTypes,
            maximumSizeInBytes: FILE_LIMITS.maxVideoBytes,
            addRandomSuffix: true,
          },
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error(`[upload] ${(err as Error).message}`);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
