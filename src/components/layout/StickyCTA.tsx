"use client";

import { usePathname } from "next/navigation";
import { globals } from "@/content/globals";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappButton } from "./WhatsappButton";

/** Barra fixa inferior no mobile. Some na página de orçamento. */
export function StickyCTA() {
  const pathname = usePathname();
  if (pathname.startsWith("/orcamento")) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-basalto/15 bg-pedra px-4 py-3 md:hidden">
      <div className="flex gap-3 [&>*]:flex-1">
        <ButtonLink href="/orcamento">{globals.ctaPrimary}</ButtonLink>
        <WhatsappButton />
      </div>
    </div>
  );
}
