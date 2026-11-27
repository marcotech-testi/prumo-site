import { describe, expect, it } from "vitest";
import { contentPages } from "@/content/pages";
import { llmsTxt } from "@/lib/llms";
import { markdownFor, markdownPaths } from "@/lib/markdown";
import {
  breadcrumbSchema,
  businessSchema,
  faqSchema,
  FORBIDDEN_SCHEMA_KEYS,
  serviceSchema,
  websiteSchema,
} from "@/lib/schema";
import { breadcrumbsFor } from "@/lib/breadcrumbs";

function keys(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(keys);
  if (node && typeof node === "object")
    return Object.entries(node).flatMap(([k, v]) => [k, ...keys(v)]);
  return [];
}

describe("JSON-LD", () => {
  const all = [
    businessSchema(),
    websiteSchema(),
    serviceSchema({ name: "x", serviceType: "y", description: "z", path: "/jardim-vertical" }),
    breadcrumbSchema(breadcrumbsFor({ label: "Jardim vertical", href: "/jardim-vertical" })),
    faqSchema([1, 2, 3]),
  ];
  it("é JSON válido e sem campos proibidos", () => {
    for (const s of all) {
      const parsed = JSON.parse(JSON.stringify(s));
      for (const k of FORBIDDEN_SCHEMA_KEYS) expect(keys(parsed)).not.toContain(k);
    }
  });
  it("negócio sem telefone e sem sameAs quando não configurados", () => {
    const b = businessSchema();
    expect(b).not.toHaveProperty("telephone");
    expect(b).not.toHaveProperty("sameAs");
    expect(b["@type"]).toEqual(["Organization", "HomeAndConstructionBusiness"]);
  });
  it("breadcrumb com posições e URLs absolutas", () => {
    const b = breadcrumbSchema(breadcrumbsFor({ label: "Sobre", href: "/sobre" }));
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(b.itemListElement[1].item).toMatch(/^https:\/\/.+\/sobre$/);
  });
});

describe("Markdown e llms.txt", () => {
  it("toda página pública tem Markdown com H1, resposta direta e link de orçamento", () => {
    for (const path of markdownPaths()) {
      const md = markdownFor(path)!;
      expect(md, path).toMatch(/^# /);
      expect(md).toContain("Para pedir orçamento:");
    }
    for (const p of contentPages) {
      const md = markdownFor(p.path)!;
      if (p.answer) expect(md).toContain(p.answer);
      for (const s of p.sections) if (s.heading) expect(md).toContain(`## ${s.heading}`);
    }
  });
  it("rota inexistente não tem Markdown", () => {
    expect(markdownFor("/nao-existe")).toBeNull();
  });
  it("llms.txt lista serviços, .md e MCP", () => {
    const t = llmsTxt();
    expect(t).toMatch(/^# Prumo Paisagismo/);
    expect(t).toContain("/jardim-vertical.md");
    expect(t).toContain("/mcp");
    expect(t).not.toMatch(/R\$/);
  });
});
