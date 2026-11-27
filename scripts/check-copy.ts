/**
 * Varredura de copy em src/content: sem "!", sem emoji, sem termos proibidos (CLAUDE.md).
 * Exceção: mensagens pré-preenchidas de WhatsApp, que o docs/07 define com "Olá!".
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const EXCEPT = ["src/content/whatsapp-messages.ts"];
const forbidden = [
  /soluções verdes inovadoras/i,
  /verde no prumo/i,
  /®|™/,
  /\bFraunces\b|\bInter\b/,
  /últimas vagas|só hoje|corra|imperdível/i,
];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|mdx)$/.test(f) ? [p] : [];
  });
}

const problems: string[] = [];
for (const file of walk("src/content")) {
  const rel = file.split(path.sep).join("/");
  if (EXCEPT.includes(rel)) continue;
  const src = readFileSync(file, "utf8");
  // Só o texto dentro de strings ("…", `…`), sem comentários e sem código.
  const BS = String.fromCharCode(92);
  const stringRe = new RegExp(
    `"((?:[^"${BS}${BS}]|${BS}${BS}.)*)"|\`((?:[^\`${BS}${BS}]|${BS}${BS}.)*)\``,
    "g",
  );
  const strings = [...src.matchAll(stringRe)].map((m) => m[1] ?? m[2] ?? "");
  for (const s of strings) {
    if (/!/.test(s) && !/^[!=]/.test(s)) problems.push(`${rel}: exclamação em "${s.slice(0, 60)}"`);
    if (/(?![©®™])\p{Extended_Pictographic}/u.test(s))
      problems.push(`${rel}: emoji em "${s.slice(0, 60)}"`);
    for (const re of forbidden)
      if (re.test(s)) problems.push(`${rel}: termo proibido (${re}) em "${s.slice(0, 60)}"`);
  }
}

if (problems.length) {
  console.error(`check:copy falhou:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("check:copy ok");
