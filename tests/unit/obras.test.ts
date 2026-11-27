import { describe, expect, it } from "vitest";
import { getAllObras, getPublishedObras, parseObraFile } from "@/content/obras";
import { isPublishable } from "@/content/obras-schema";

const foto = (tipo: "geral" | "irrigacao" | "detalhe") => ({
  src: "/obras/x/1.jpg",
  alt: "Foto descritiva da obra",
  tipo,
  width: 1600,
  height: 1200,
});

describe("regra de publicação de obras", () => {
  it("exige autorização de uso", () => {
    expect(
      isPublishable({ autorizacaoUso: false, fotos: [foto("geral"), foto("irrigacao")] }),
    ).toBe(false);
  });
  it("exige ao menos 2 fotos", () => {
    expect(isPublishable({ autorizacaoUso: true, fotos: [foto("irrigacao")] })).toBe(false);
  });
  it("exige uma foto de irrigação", () => {
    expect(isPublishable({ autorizacaoUso: true, fotos: [foto("geral"), foto("detalhe")] })).toBe(
      false,
    );
  });
  it("publica quando tudo está presente", () => {
    expect(isPublishable({ autorizacaoUso: true, fotos: [foto("geral"), foto("irrigacao")] })).toBe(
      true,
    );
  });
});

describe("leitura de obras", () => {
  it("frontmatter inválido falha", () => {
    expect(() => parseObraFile("---\ntitulo: x\n---\n", "ruim.mdx")).toThrow(
      /frontmatter inválido/,
    );
  });
  it("exemplo não é publicado fora do modo de exemplo", () => {
    expect(getAllObras().some((o) => o.slug === "exemplo-fachada")).toBe(false);
    expect(getPublishedObras()).toHaveLength(0);
  });
});
