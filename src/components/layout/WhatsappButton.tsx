"use client";

import { usePathname } from "next/navigation";
import { globals } from "@/content/globals";
import { buttonClass } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/whatsapp";
import { whatsappKeyForPath } from "@/lib/whatsapp-page";
import type { WhatsappMessageKey } from "@/content/whatsapp-messages";

type Props = {
  variant?: "primary" | "secondary";
  tone?: "light" | "dark";
  className?: string;
  message?: WhatsappMessageKey;
};

/** Botão de WhatsApp. Não renderiza nada sem número configurado. */
export function WhatsappButton({
  variant = "secondary",
  tone = "light",
  className = "",
  message,
}: Props) {
  const pathname = usePathname();
  const href = whatsappLink(message ?? whatsappKeyForPath(pathname));
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      data-event="click_whatsapp"
      className={buttonClass(variant, tone, className)}
    >
      {globals.ctaWhatsapp}
    </a>
  );
}
