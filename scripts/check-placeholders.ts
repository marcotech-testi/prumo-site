/**
 * Lista o que ainda falta para o go-live (deve coincidir com docs/08).
 * Padrão: modo aviso (sai com 0). `--strict` (T12): falha se houver pendência.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { getPublishedObras } from "../src/content/obras";

const strict = process.argv.includes("--strict");
const PROD = "https://www.prumopaisagismo.com.br";
const issues: string[] = [];
const info: string[] = [];

const env = (k: string) => (process.env[k] ?? "").trim();

const wa = env("NEXT_PUBLIC_WHATSAPP").replace(/\D/g, "");
if (!wa) issues.push("NEXT_PUBLIC_WHATSAPP vazio (WhatsApp comercial)");
else if (wa === "5541900000000")
  issues.push("NEXT_PUBLIC_WHATSAPP é o número de exemplo (41) 9 0000-0000");

const legal = env("NEXT_PUBLIC_LEGAL_NAME");
if (!legal)
  issues.push(
    "NEXT_PUBLIC_LEGAL_NAME vazio (razão social + CNPJ; privacidade usa {{CONTROLADOR}})",
  );

const obras = getPublishedObras().length;
if (obras < 3)
  issues.push(`${obras} obra(s) publicada(s); o go-live exige ≥ 3 com autorização de uso`);

if (env("NEXT_PUBLIC_SITE_URL").replace(/\/$/, "") !== PROD) {
  issues.push(`NEXT_PUBLIC_SITE_URL ≠ ${PROD}`);
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx|mdx)$/.test(f) ? [p] : [];
  });
}

const markers: Record<string, string[]> = {};
for (const file of [...walk("src/content"), ...walk("src/app")]) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const rel = file.split(path.sep).join("/");
    // O marcador {{CONTROLADOR}} é resolvido por NEXT_PUBLIC_LEGAL_NAME.
    const isControlador = line.includes("{{CONTROLADOR}}") && !!legal;
    for (const m of ["{{", "⟦", "REVISAR-"]) {
      // "{{" só como marcador {{NOME}} (não o style={{…}} do JSX).
      const found = m === "{{" ? /\{\{[A-Z_]+\}\}/.test(line) : line.includes(m);
      if (found && !(m === "{{" && isControlador)) {
        (markers[m] ??= []).push(`${rel}:${i + 1}`);
      }
    }
  });
}
for (const [m, where] of Object.entries(markers)) {
  const label = m === "REVISAR-" ? "trechos a revisar (parceiro/jurídico)" : `marcador "${m}"`;
  issues.push(`${where.length} ${label}: ${where.join(", ")}`);
}

for (const k of [
  "NEXT_PUBLIC_GA_ID",
  "NEXT_PUBLIC_META_PIXEL_ID",
  "NEXT_PUBLIC_GBP_URL",
  "NEXT_PUBLIC_WEBMCP_OT_TOKEN",
  "INDEXNOW_KEY",
]) {
  if (!env(k)) info.push(`${k} vazio (opcional)`);
}
if (env("NEXT_PUBLIC_SOCIAL_LIVE") !== "true")
  info.push("Redes sociais ocultas (NEXT_PUBLIC_SOCIAL_LIVE ≠ true)");

console.log(`check:placeholders${strict ? " --strict" : ""}`);
for (const i of issues) console.log(`  ${strict ? "FALTA" : "aviso"}: ${i}`);
for (const i of info) console.log(`  info:  ${i}`);
if (!issues.length) console.log("  Nenhuma pendência que bloqueie o go-live.");
if (strict && issues.length) process.exit(1);
