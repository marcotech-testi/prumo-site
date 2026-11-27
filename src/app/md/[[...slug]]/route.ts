import { markdownFor, markdownPaths } from "@/lib/markdown";
import { absoluteUrl } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return markdownPaths().map((p) => ({ slug: p === "/" ? [] : p.slice(1).split("/") }));
}

/** Versão Markdown (via /{rota}.md, /index.md ou Accept: text/markdown — ver rewrites). */
export async function GET(_req: Request, ctx: RouteContext<"/md/[[...slug]]">) {
  const { slug } = await ctx.params;
  const parts = (slug ?? []).filter((s) => s !== "index");
  const path = parts.length ? `/${parts.join("/")}` : "/";
  const md = markdownFor(path);
  if (!md)
    return new Response("Não encontrado.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  return new Response(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      Link: `<${absoluteUrl(path)}>; rel="canonical"`,
    },
  });
}
