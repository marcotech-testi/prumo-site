/**
 * Grava em src/content/lastmod.generated.json a data do último commit que alterou
 * o conteúdo de cada página (não a data do build). Roda no prebuild.
 * Em clones rasos (Vercel), mantém a data já commitada quando o git não encontra o arquivo.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { obrasRoute, staticRoutes } from "../src/content/routes";

const OUT = "src/content/lastmod.generated.json";
const previous: Record<string, string> = existsSync(OUT)
  ? JSON.parse(readFileSync(OUT, "utf8"))
  : {};

function lastCommit(files: string[]): string | null {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], {
      encoding: "utf8",
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}

const result: Record<string, string> = {};
for (const r of staticRoutes) {
  const d = lastCommit(r.sources);
  if (d ?? previous[r.path]) result[r.path] = (d ?? previous[r.path])!;
}
const obrasDir = obrasRoute.sources[0];
if (existsSync(obrasDir)) {
  for (const f of readdirSync(obrasDir).filter((x) => x.endsWith(".mdx"))) {
    const key = `obra:${f.replace(/\.mdx$/, "")}`;
    const d = lastCommit([path.join(obrasDir, f)]);
    if (d ?? previous[key]) result[key] = (d ?? previous[key])!;
  }
}
const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
const json = `${JSON.stringify(sorted, null, 2)}\n`;
if (json !== (existsSync(OUT) ? readFileSync(OUT, "utf8") : "")) writeFileSync(OUT, json);
console.log(`lastmod: ${Object.keys(sorted).length} páginas`);
