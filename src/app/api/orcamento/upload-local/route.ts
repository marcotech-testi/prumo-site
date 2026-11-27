import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { verifyPass } from "@/lib/antispam";
import { LOCAL_BLOB_PREFIX, sanitizeFileName, uploadMode } from "@/lib/blob";
import { validateFiles } from "@/lib/quote-schema";

export const runtime = "nodejs";

/** Upload local (só em dev/testes, sem token do Blob e fora da Vercel). Grava em pasta temporária. */
export async function POST(req: Request) {
  if (uploadMode() !== "local") return NextResponse.json({ ok: false }, { status: 404 });
  const form = await req.formData();
  const file = form.get("file");
  if (!verifyPass(String(form.get("passe") ?? "")) || !(file instanceof File)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const error = validateFiles([{ nome: file.name, tipo: file.type, tamanhoBytes: file.size }]);
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  const name = `${randomUUID()}-${sanitizeFileName(file.name)}`;
  const dir = path.join(os.tmpdir(), "prumo-uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, url: `${LOCAL_BLOB_PREFIX}${name}` });
}
