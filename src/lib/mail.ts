import { Resend } from "resend";
import { optionLabel } from "@/content/pages/orcamento";
import { siteConfig } from "@/content/site";
import type { QuoteRecord } from "./quote-record";
import { whatsappLinkFromBrazilianPhone } from "./whatsapp";

export type Mail = { to: string[]; subject: string; text: string; html: string; replyTo?: string };

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
const fmtNum = (n: number | null) => (n === null ? "—" : n.toLocaleString("pt-BR"));

export function internalQuoteMail(r: QuoteRecord, to: string[]): Mail {
  const tipo = optionLabel("tipo", r.espaco.tipo);
  const wa = whatsappLinkFromBrazilianPhone(r.contato.whatsapp);
  const medidas = r.espaco.naoSeiMedidas
    ? "não sabe"
    : `${fmtNum(r.espaco.larguraM)} m × ${fmtNum(r.espaco.alturaM)} m`;
  const o = r.origem;
  const rows: [string, string][] = [
    ["Perfil", optionLabel("perfil", r.perfil)],
    ["Nome", r.contato.nome],
    ["WhatsApp", wa],
    ["E-mail", r.contato.email ?? "—"],
    ["Cidade / bairro", `${r.local.cidade} / ${r.local.bairro}`],
    ["Onde", tipo],
    ["Medidas", medidas],
    ["Área aproximada", r.espaco.areaAproxM2 === null ? "—" : `${fmtNum(r.espaco.areaAproxM2)} m²`],
    ["Luz", optionLabel("sol", r.condicoes.sol)],
    ["Ponto de água", optionLabel("pontoAgua", r.condicoes.pontoAgua)],
    ["Prazo", optionLabel("prazo", r.prazo ?? undefined)],
    ["Mensagem", r.mensagem ?? "—"],
    [
      "Origem",
      `utm_source=${o.utm_source ?? "—"} · utm_medium=${o.utm_medium ?? "—"} · utm_campaign=${o.utm_campaign ?? "—"}`,
    ],
    ["gclid / fbclid", `${o.gclid ? "sim" : "não"} / ${o.fbclid ? "sim" : "não"}`],
    ["Página de entrada", o.pagina ?? "—"],
    ["Referrer", o.referrer ?? "—"],
    ["Obra", o.obra ?? "—"],
    ["Pedido", r.id],
    ["Recebido em", r.receivedAt],
  ];
  const files = r.arquivos.map(
    (a) => `${a.nome} (${(a.tamanhoBytes / 1024 / 1024).toFixed(1)} MB): ${a.url}`,
  );
  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Arquivos:",
    ...files.map((f) => `- ${f}`),
  ].join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => {
      const val = k === "WhatsApp" ? `<a href="${esc(v)}">${esc(v)}</a>` : esc(v);
      return `<tr><th align="left" style="border-bottom:1px solid #ddd">${esc(k)}</th><td style="border-bottom:1px solid #ddd">${val}</td></tr>`;
    })
    .join("")}</table><p><strong>Arquivos</strong></p><ul>${r.arquivos
    .map(
      (a) =>
        `<li><a href="${esc(a.url)}">${esc(a.nome)}</a> (${(a.tamanhoBytes / 1024 / 1024).toFixed(1)} MB)</li>`,
    )
    .join("")}</ul>`;
  return {
    to,
    subject: `Novo pedido de orçamento — ${tipo} — ${r.local.bairro}, ${r.local.cidade}`,
    text,
    html,
    replyTo: r.contato.email ?? undefined,
  };
}

export function confirmationMail(r: QuoteRecord): Mail | null {
  if (!r.contato.email) return null;
  const host = siteConfig.url.replace(/^https?:\/\//, "");
  const lines = [
    `Olá, ${r.contato.nome}.`,
    "Recebemos as fotos e as medidas da sua parede. Retornamos com uma faixa de investimento em até um dia útil, em horário comercial.",
    `— Prumo Paisagismo · ${host} · ${siteConfig.email}`,
  ];
  return {
    to: [r.contato.email],
    subject: "Recebemos seu pedido — Prumo Paisagismo",
    text: lines.join("\n\n"),
    html: lines
      .map((l) => `<p style="font-family:Arial,sans-serif;font-size:15px">${esc(l)}</p>`)
      .join(""),
  };
}

/** Envia pelo Resend; sem RESEND_API_KEY, registra no console (desenvolvimento). */
export async function sendMail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(
      `\n[e-mail local] Para: ${mail.to.join(", ")}\nAssunto: ${mail.subject}\n${mail.text}\n`,
    );
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.QUOTE_FROM_EMAIL || "Prumo Paisagismo <onboarding@resend.dev>",
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: mail.replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
