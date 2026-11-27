import { describe, expect, it } from "vitest";
import { normalizeWhatsapp, whatsappLink, whatsappLinkFromBrazilianPhone } from "@/lib/whatsapp";

describe("whatsapp", () => {
  it("sem número devolve null (botões somem)", () => {
    expect(whatsappLink("geral", "")).toBeNull();
  });
  it("monta link wa.me com mensagem codificada", () => {
    const link = whatsappLink("jardimVertical", "+55 (41) 99999-0000");
    expect(link).toMatch(/^https:\/\/wa\.me\/5541999990000\?text=/);
    expect(decodeURIComponent(link!.split("text=")[1])).toContain("jardim vertical");
  });
  it("normaliza dígitos", () => {
    expect(normalizeWhatsapp("(41) 9 9999-0000")).toBe("41999990000");
  });
  it("número do formulário ganha DDI 55", () => {
    expect(whatsappLinkFromBrazilianPhone("(41) 99999-0000")).toBe("https://wa.me/5541999990000");
  });
});
