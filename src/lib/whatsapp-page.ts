import type { WhatsappMessageKey } from "@/content/whatsapp-messages";

/** Mensagem de WhatsApp adequada à rota atual. */
export function whatsappKeyForPath(pathname: string): WhatsappMessageKey {
  if (pathname.startsWith("/jardim-vertical")) return "jardimVertical";
  if (pathname.startsWith("/irrigacao")) return "irrigacao";
  if (pathname.startsWith("/manutencao")) return "manutencao";
  if (pathname.startsWith("/para-arquitetos")) return "arquitetos";
  return "geral";
}
