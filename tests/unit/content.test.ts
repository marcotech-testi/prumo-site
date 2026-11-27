import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { faq } from "@/content/faq";
import { contentPages, home } from "@/content/pages";
import { siteConfig } from "@/content/site";
import { steps } from "@/content/steps";
import type { Block } from "@/content/types";

const allPages = [home, ...contentPages];

function textsOf(blocks: Block[]): string[] {
  return blocks.flatMap((b) => {
    if (b.type === "p") return [b.text];
    if (b.type === "list" || b.type === "numbered" || b.type === "spec") return b.items;
    if (b.type === "features") return b.items.flatMap((i) => [i.title, i.text]);
    return [];
  });
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = path.join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
  });
}

describe("conteúdo", () => {
  it("tem as 12 perguntas e 6 etapas", () => {
    expect(faq.map((f) => f.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(steps).toHaveLength(6);
  });

  it("títulos ≤ 60 e descrições ≤ 155 caracteres, únicos", () => {
    for (const p of allPages) {
      expect(p.title.length, p.title).toBeLessThanOrEqual(60);
      expect(p.description.length, p.description).toBeLessThanOrEqual(155);
    }
    expect(new Set(allPages.map((p) => p.title)).size).toBe(allPages.length);
    expect(new Set(allPages.map((p) => p.description)).size).toBe(allPages.length);
  });

  it("H1 único e diferente do title em cada página", () => {
    const h1s = [home.hero.h1, ...contentPages.map((p) => p.h1)];
    expect(new Set(h1s).size).toBe(h1s.length);
    for (const p of contentPages) expect(p.h1).not.toBe(p.title);
  });

  it("páginas de serviço têm resposta direta e citam Curitiba", () => {
    for (const p of contentPages.filter((c) => c.serviceType)) {
      expect(p.answer, p.path).toBeTruthy();
      expect(`${p.h1} ${p.answer}`).toMatch(/Curitiba/);
    }
    const jv = contentPages.find((p) => p.path === "/jardim-vertical")!;
    const cities = siteConfig.areaServed.filter((c) => c !== "Curitiba" && jv.answer!.includes(c));
    expect(cities.length).toBeGreaterThanOrEqual(2);
  });

  it("preço desligado por padrão", () => {
    expect(siteConfig.priceRange).toBeNull();
  });

  it("sem exclamação, emoji ou termos proibidos (exceto mensagens de WhatsApp)", () => {
    const texts = [
      ...contentPages.flatMap((p) => [
        p.h1,
        p.answer ?? "",
        p.description,
        ...p.sections.flatMap((s) => textsOf(s.blocks)),
      ]),
      ...faq.flatMap((f) => [f.question, f.answer]),
      home.hero.h1,
      home.hero.subtitle,
      home.answer.text,
    ];
    for (const t of texts) {
      expect(t).not.toMatch(/!/);
      expect(t).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(t).not.toMatch(/®|™|Verde no prumo|soluções verdes inovadoras/i);
    }
  });

  it("nenhum texto de conteúdo está hardcoded em JSX", () => {
    const tsx = [...walk("src/app"), ...walk("src/components")].map((f) => readFileSync(f, "utf8"));
    const texts = [
      ...contentPages.flatMap((p) => [
        p.h1,
        p.answer ?? "",
        ...p.sections.flatMap((s) => textsOf(s.blocks)),
      ]),
      ...faq.map((f) => f.answer),
      home.hero.h1,
      home.answer.text,
    ].filter((t) => t.length > 25);
    for (const t of texts) {
      for (const src of tsx) expect(src.includes(t), t).toBe(false);
    }
  });
});
