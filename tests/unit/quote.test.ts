import { describe, expect, it } from "vitest";
import { issuePass, isHoneypotFilled, isTooFast, verifyPass } from "@/lib/antispam";
import { isAllowedFileUrl, sanitizeFileName, UPLOAD_PATH_RE, uploadPathFor } from "@/lib/blob";
import { confirmationMail, internalQuoteMail } from "@/lib/mail";
import { buildQuoteRecord, isoSaoPaulo } from "@/lib/quote-record";
import { quoteFieldsSchema, quoteRequestSchema, validateFiles } from "@/lib/quote-schema";
import { sanitizeDraft } from "@/lib/quote-draft";

const campos = {
  perfil: "cliente",
  tipo: "fachada_externa",
  larguraM: "6",
  alturaM: "3,5",
  naoSeiMedidas: false,
  sol: "meia_sombra",
  pontoAgua: "sim",
  nome: "Ana Teste",
  whatsapp: "(41) 99999-0000",
  email: "",
  cidade: "Curitiba",
  bairro: "Batel",
  consentimento: true,
};

describe("schema do orçamento", () => {
  it("aceita um pedido válido e normaliza números e WhatsApp", () => {
    const r = quoteFieldsSchema.parse(campos);
    expect(r.larguraM).toBe(6);
    expect(r.alturaM).toBe(3.5);
    expect(r.whatsapp).toBe("41999990000");
    expect(r.email).toBeUndefined();
  });
  it("exige medidas ou 'não sei'", () => {
    const r = quoteFieldsSchema.safeParse({ ...campos, larguraM: "", alturaM: "" });
    expect(r.success).toBe(false);
    expect(
      quoteFieldsSchema.safeParse({ ...campos, larguraM: "", alturaM: "", naoSeiMedidas: true })
        .success,
    ).toBe(true);
  });
  it("limita medidas a 0,5–60 m", () => {
    expect(quoteFieldsSchema.safeParse({ ...campos, larguraM: "0,2" }).success).toBe(false);
    expect(quoteFieldsSchema.safeParse({ ...campos, larguraM: "61" }).success).toBe(false);
  });
  it("valida celular com DDD e 9 dígitos", () => {
    expect(quoteFieldsSchema.safeParse({ ...campos, whatsapp: "(41) 3333-0000" }).success).toBe(
      false,
    );
    expect(quoteFieldsSchema.safeParse({ ...campos, whatsapp: "+55 41 99999-0000" }).success).toBe(
      true,
    );
  });
  it("exige consentimento", () => {
    expect(quoteFieldsSchema.safeParse({ ...campos, consentimento: false }).success).toBe(false);
  });
  it("e-mail inválido é recusado", () => {
    expect(quoteFieldsSchema.safeParse({ ...campos, email: "x@" }).success).toBe(false);
  });
  it("rejeita schemaVersion diferente de 1", () => {
    expect(quoteRequestSchema.safeParse({ schemaVersion: 2 }).success).toBe(false);
  });
});

describe("limites de arquivos", () => {
  const img = (n: number) => ({ nome: `f${n}.jpg`, tipo: "image/jpeg", tamanhoBytes: 1_000_000 });
  it("exige ao menos um arquivo e no máximo 6", () => {
    expect(validateFiles([])).toMatch(/pelo menos/);
    expect(validateFiles([1, 2, 3, 4, 5, 6, 7].map(img))).toMatch(/máximo 6/);
  });
  it("recusa tipo e tamanho fora do limite", () => {
    expect(validateFiles([{ nome: "a.pdf", tipo: "application/pdf", tamanhoBytes: 10 }])).toMatch(
      /formato/,
    );
    expect(
      validateFiles([{ nome: "a.jpg", tipo: "image/jpeg", tamanhoBytes: 11 * 1024 * 1024 }]),
    ).toMatch(/10 MB/);
    const v = { nome: "v.mp4", tipo: "video/mp4", tamanhoBytes: 1000 };
    expect(validateFiles([v, { ...v, nome: "w.mp4" }])).toMatch(/1 vídeo/);
  });
  it("aceita fotos e um vídeo dentro do limite", () => {
    expect(
      validateFiles([img(1), { nome: "v.mov", tipo: "video/quicktime", tamanhoBytes: 50_000_000 }]),
    ).toBeNull();
  });
});

describe("antispam", () => {
  it("honeypot e tempo mínimo", () => {
    expect(isHoneypotFilled("http://spam")).toBe(true);
    expect(isHoneypotFilled("")).toBe(false);
    expect(isTooFast(Date.now() - 1000)).toBe(true);
    expect(isTooFast(Date.now() - 5000)).toBe(false);
  });
  it("passe assinado: válido, adulterado e expirado", () => {
    const p = issuePass();
    expect(verifyPass(p)).toBe(true);
    expect(verifyPass(p.slice(0, -1) + (p.endsWith("a") ? "b" : "a"))).toBe(false);
    expect(verifyPass(issuePass(Date.now() - 31 * 60 * 1000))).toBe(false);
    expect(verifyPass(undefined)).toBe(false);
  });
});

describe("upload", () => {
  it("caminho e nome sanitizados", () => {
    expect(sanitizeFileName("Parede Sala (1)ção.JPG")).toBe("Parede-Sala-1-cao.JPG");
    const path = uploadPathFor(
      "foto 1.jpg",
      "123e4567-e89b-12d3-a456-426614174000",
      new Date(2026, 10, 27),
    );
    expect(path).toBe("orcamentos/2026-11/123e4567-e89b-12d3-a456-426614174000-foto-1.jpg");
    expect(UPLOAD_PATH_RE.test(path)).toBe(true);
    expect(UPLOAD_PATH_RE.test("../segredo")).toBe(false);
  });
  it("modo local só aceita URLs locais", () => {
    expect(isAllowedFileUrl("http://localhost/__local-blob/x.jpg")).toBe(true);
    expect(isAllowedFileUrl("https://evil.example.com/x.jpg")).toBe(false);
  });
});

describe("registro e e-mails", () => {
  const req = quoteRequestSchema.parse({
    schemaVersion: 1,
    campos: { ...campos, email: "ana@example.com", mensagem: "Parede da sala" },
    arquivos: [
      {
        url: "http://localhost/__local-blob/a.jpg",
        nome: "a.jpg",
        tipo: "image/jpeg",
        tamanhoBytes: 2_400_000,
      },
    ],
    origem: { pagina: "/jardim-vertical", utm_source: "google", gclid: "abc" },
    renderedAt: 0,
    passe: "x".repeat(20),
  });
  const r = buildQuoteRecord(req, new Date("2026-11-27T19:40:00Z"));

  it("segue o contrato do webhook", () => {
    expect(r.schemaVersion).toBe(1);
    expect(r.id).toMatch(/^pq_[0-9a-f]{32}$/);
    expect(r.receivedAt).toBe("2026-11-27T16:40:00-03:00");
    expect(r.contato).toEqual({
      nome: "Ana Teste",
      whatsapp: "5541999990000",
      email: "ana@example.com",
    });
    expect(r.espaco).toEqual({
      tipo: "fachada_externa",
      larguraM: 6,
      alturaM: 3.5,
      areaAproxM2: 21,
      naoSeiMedidas: false,
    });
    expect(r.origem.utm_source).toBe("google");
    expect(r.origem.fbclid).toBeNull();
    expect(r.consentimento).toEqual({
      aceito: true,
      politicaVersao: "2026-11-27",
      em: r.receivedAt,
    });
  });

  it("e-mail interno traz campos, UTMs e fotos", () => {
    const m = internalQuoteMail(r, ["equipe@example.com"]);
    expect(m.subject).toBe("Novo pedido de orçamento — Fachada ou muro externo — Batel, Curitiba");
    expect(m.replyTo).toBe("ana@example.com");
    expect(m.text).toContain("https://wa.me/5541999990000");
    expect(m.text).toContain("utm_source=google");
    expect(m.text).toContain("gclid / fbclid: sim / não");
    expect(m.text).toContain("a.jpg");
    expect(m.text).toContain("21 m²");
  });

  it("confirmação só com e-mail, sem imagens externas", () => {
    const c = confirmationMail(r)!;
    expect(c.subject).toBe("Recebemos seu pedido — Prumo Paisagismo");
    expect(c.html).not.toMatch(/<img/);
    expect(confirmationMail({ ...r, contato: { ...r.contato, email: null } })).toBeNull();
  });

  it("isoSaoPaulo usa -03:00", () => {
    expect(isoSaoPaulo(new Date("2026-01-01T03:00:00Z"))).toBe("2026-01-01T00:00:00-03:00");
  });
});

describe("rascunho de agente", () => {
  it("ignora campos desconhecidos, consentimento e trunca a mensagem", () => {
    const d = sanitizeDraft({
      nome: "Ana",
      consentimento: true,
      fotos: ["x"],
      mensagem: "a".repeat(2000),
      naoSeiMedidas: true,
    });
    expect(d).toEqual({ nome: "Ana", mensagem: "a".repeat(1000), naoSeiMedidas: true });
  });
});
