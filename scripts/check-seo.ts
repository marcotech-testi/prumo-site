/**
 * Verificação de SEO (docs/04) contra um servidor rodando.
 * Uso: pnpm check:seo [baseUrl]   (padrão http://localhost:3100)
 * CHECK_SEO_EXPECT=index exige páginas indexáveis (produção); padrão = noindex (preview/CI).
 */
import { parse } from "node-html-parser";

const base = (process.argv[2] ?? process.env.CHECK_SEO_BASE ?? "http://localhost:3100").replace(
  /\/$/,
  "",
);
const expectIndex = process.env.CHECK_SEO_EXPECT === "index";
const FORBIDDEN = ["address", "geo", "priceRange", "aggregateRating", "review"];
const errors: string[] = [];
const fail = (url: string, msg: string) => errors.push(`${url}: ${msg}`);

const local = (u: string) => u.replace(/^https?:\/\/[^/]+/, base);

function hasForbidden(node: unknown): string | null {
  if (Array.isArray(node)) return node.map(hasForbidden).find(Boolean) ?? null;
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (FORBIDDEN.includes(k)) return k;
      const inner = hasForbidden(v);
      if (inner) return inner;
    }
  }
  return null;
}

async function get(url: string, init?: RequestInit) {
  return fetch(url, { redirect: "manual", ...init });
}

async function main() {
  const sm = await get(`${base}/sitemap.xml`);
  if (sm.status !== 200) throw new Error(`sitemap.xml: ${sm.status}`);
  const urls = [...(await sm.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("sitemap vazio");

  const robots = await (await get(`${base}/robots.txt`)).text();
  if (expectIndex && !/Sitemap: .*\/sitemap\.xml/.test(robots))
    fail("/robots.txt", "não aponta para o sitemap");
  for (const p of ["/llms.txt", "/favicon.ico", "/manifest.webmanifest"]) {
    if ((await get(`${base}${p}`)).status !== 200) fail(p, "não existe");
  }

  const titles = new Map<string, string>();
  const descs = new Map<string, string>();
  const internalLinks = new Set<string>();

  for (const canonicalUrl of urls) {
    const url = local(canonicalUrl);
    const res = await get(url);
    if (res.status !== 200) {
      fail(url, `status ${res.status}`);
      continue;
    }
    const xRobots = res.headers.get("x-robots-tag") ?? "";
    const root = parse(await res.text());
    const meta = (sel: string) => root.querySelector(sel)?.getAttribute("content") ?? "";

    if (root.querySelectorAll("h1").length !== 1) fail(url, "precisa de exatamente um <h1>");
    const title = root.querySelector("title")?.text.trim() ?? "";
    if (title.length < 20 || title.length > 60) fail(url, `title com ${title.length} caracteres`);
    if (titles.has(title)) fail(url, `title repetido de ${titles.get(title)}`);
    titles.set(title, url);
    const desc = meta('meta[name="description"]');
    if (desc.length < 70 || desc.length > 155)
      fail(url, `description com ${desc.length} caracteres`);
    if (descs.has(desc)) fail(url, `description repetida de ${descs.get(desc)}`);
    descs.set(desc, url);
    const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href");
    if (canonical !== canonicalUrl) fail(url, `canonical ${canonical} ≠ ${canonicalUrl}`);
    const robotsMeta = meta('meta[name="robots"]');
    if (expectIndex) {
      if (/noindex/.test(robotsMeta) || /noindex/.test(xRobots)) fail(url, "noindex em produção");
    } else if (!/noindex/.test(robotsMeta) || !/noindex/.test(xRobots)) {
      fail(url, "fora de produção deveria ser noindex (meta e cabeçalho)");
    }
    if (root.querySelector("html")?.getAttribute("lang") !== "pt-BR") fail(url, 'lang ≠ "pt-BR"');
    for (const p of ["og:title", "og:description", "og:image", "og:url", "og:locale"]) {
      if (!meta(`meta[property="${p}"]`)) fail(url, `sem ${p}`);
    }
    if (meta('meta[property="og:locale"]') && meta('meta[property="og:locale"]') !== "pt_BR")
      fail(url, "og:locale ≠ pt_BR");
    for (const img of root.querySelectorAll("img")) {
      if (img.getAttribute("alt") === undefined)
        fail(url, `<img> sem alt: ${img.getAttribute("src")}`);
    }
    let breadcrumbLd: string[] | null = null;
    for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const data = JSON.parse(s.text);
        const bad = hasForbidden(data);
        if (bad) fail(url, `JSON-LD com campo proibido: ${bad}`);
        for (const d of [data].flat()) {
          if (d["@type"] === "BreadcrumbList")
            breadcrumbLd = d.itemListElement.map((i: { name: string }) => i.name);
        }
      } catch {
        fail(url, "JSON-LD inválido");
      }
    }
    const visible = root
      .querySelectorAll('nav[aria-label="Trilha de navegação"] li')
      .map((li) => li.text.replace("/", "").trim());
    const isHome = new URL(canonicalUrl).pathname === "/";
    if (!isHome) {
      if (!breadcrumbLd) fail(url, "sem BreadcrumbList");
      else if (JSON.stringify(breadcrumbLd) !== JSON.stringify(visible)) {
        fail(
          url,
          `breadcrumb visível ${JSON.stringify(visible)} ≠ JSON-LD ${JSON.stringify(breadcrumbLd)}`,
        );
      }
    }
    const mdPath = isHome ? "/index.md" : `${new URL(canonicalUrl).pathname}.md`;
    const md = await get(`${base}${mdPath}`);
    if (md.status !== 200) fail(url, `sem versão Markdown (${mdPath} → ${md.status})`);
    for (const a of root.querySelectorAll("a[href^='/']"))
      internalLinks.add(a.getAttribute("href")!.split("#")[0].split("?")[0]);
  }

  for (const href of internalLinks) {
    if (!href) continue;
    const r = await get(`${base}${href}`);
    if (r.status >= 400) fail(href, `link interno quebrado (${r.status})`);
  }

  if (errors.length) {
    console.error(`check:seo falhou (${errors.length}):\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log(
    `check:seo ok: ${urls.length} URLs, ${internalLinks.size} links internos (${expectIndex ? "produção" : "noindex"})`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
