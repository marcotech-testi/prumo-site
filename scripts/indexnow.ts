/**
 * Envia ao IndexNow (Bing e outros) as URLs do sitemap alteradas recentemente.
 * Uso: INDEXNOW_KEY=... pnpm indexnow [--all] [--days=2]
 * O Google não usa IndexNow: para ele valem o sitemap e o Search Console.
 */
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.prumopaisagismo.com.br").replace(
  /\/$/,
  "",
);
const key = process.env.INDEXNOW_KEY;
const all = process.argv.includes("--all");
const days = Number(process.argv.find((a) => a.startsWith("--days="))?.split("=")[1] ?? 2);

async function main() {
  if (!key) {
    console.log("INDEXNOW_KEY ausente: nada a enviar.");
    return;
  }
  const xml = await (await fetch(`${site}/sitemap.xml`)).text();
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const urls = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)]
    .map((m) => ({
      loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
      lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    }))
    .filter((u) => u.loc && (all || (u.lastmod && Date.parse(u.lastmod) >= since)))
    .map((u) => u.loc!);
  if (!urls.length) {
    console.log("Nenhuma URL alterada no período.");
    return;
  }
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(site).host,
      key,
      keyLocation: `${site}/${key}.txt`,
      urlList: urls,
    }),
  });
  console.log(`IndexNow: HTTP ${res.status} para ${urls.length} URL(s)`);
  if (res.status >= 400) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
