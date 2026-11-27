import { siteConfig } from "@/content/site";
import { whatsappMessages, type WhatsappMessageKey } from "@/content/whatsapp-messages";

/** Só dígitos; vazio quando não configurado. */
export function normalizeWhatsapp(value: string | undefined | null) {
  return (value ?? "").replace(/\D/g, "");
}

/** Link wa.me com mensagem pré-preenchida, ou null se não houver número. */
export function whatsappLink(key: WhatsappMessageKey = "geral", number = siteConfig.whatsapp) {
  const digits = normalizeWhatsapp(number);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(whatsappMessages[key])}`;
}

/** Link wa.me para um número brasileiro digitado no formulário (DDD + número). */
export function whatsappLinkFromBrazilianPhone(phone: string) {
  const digits = normalizeWhatsapp(phone);
  const full = digits.startsWith("55") && digits.length > 11 ? digits : `55${digits}`;
  return `https://wa.me/${full}`;
}
