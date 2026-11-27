import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { sendWebhook, signWebhook } from "@/lib/webhook";
import { parseOrigem } from "@/lib/utm";

describe("webhook", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("assina com HMAC-SHA256 do corpo bruto", () => {
    const body = JSON.stringify({ a: 1 });
    const expected = createHmac("sha256", "segredo").update(body).digest("hex");
    expect(signWebhook("segredo", body)).toBe(`sha256=${expected}`);
  });

  it("envia cabeçalhos e tenta 2 vezes sem lançar erro", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await sendWebhook({ id: "pq_1" }, { url: "https://example.com/hook", secret: "s" });
    expect(r.sent).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const headers = fetchMock.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["X-Prumo-Signature"]).toBe(signWebhook("s", JSON.stringify({ id: "pq_1" })));
    expect(headers["X-Prumo-Timestamp"]).toMatch(/^\d{10}$/);
  });

  it("sem URL configurada não envia", async () => {
    expect((await sendWebhook({}, { url: undefined, secret: undefined })).sent).toBe(false);
  });
});

describe("utm", () => {
  it("captura UTMs, gclid, fbclid, página e referrer externo", () => {
    const o = parseOrigem(
      "https://www.prumopaisagismo.com.br/jardim-vertical?utm_source=meta&utm_campaign=jv&fbclid=XYZ",
      "https://l.instagram.com/x?y=1",
    );
    expect(o).toEqual({
      pagina: "/jardim-vertical",
      utm_source: "meta",
      utm_campaign: "jv",
      fbclid: "XYZ",
      referrer: "https://l.instagram.com/x",
    });
  });
  it("ignora referrer do próprio site", () => {
    expect(parseOrigem("https://a.com/x", "https://a.com/y").referrer).toBeUndefined();
  });
});
