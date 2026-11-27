/** Gera public/{INDEXNOW_KEY}.txt no build (o arquivo não é commitado). */
import { readdirSync, unlinkSync, writeFileSync } from "node:fs";

const key = process.env.INDEXNOW_KEY?.trim();
for (const f of readdirSync("public")) {
  if (/^[a-f0-9-]{8,128}\.txt$/i.test(f) && f !== `${key}.txt`) unlinkSync(`public/${f}`);
}
if (key) {
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(key))
    throw new Error("INDEXNOW_KEY inválida (8–128 caracteres a-z, 0-9, hífen)");
  writeFileSync(`public/${key}.txt`, key);
  console.log("IndexNow: arquivo de chave gerado");
}
