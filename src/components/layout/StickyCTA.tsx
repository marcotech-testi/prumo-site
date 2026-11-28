"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { globals } from "@/content/globals";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsappButton } from "./WhatsappButton";

/**
 * Barra fixa inferior no mobile. Some na página de orçamento e só aparece
 * depois que o topo da página (que já tem os mesmos botões) sai da tela.
 */
export function StickyCTA() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/orcamento");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hidden) return;
    const hero = document.querySelector("[data-hero]");
    if (!hero || typeof IntersectionObserver === "undefined") {
      const id = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(id);
    }
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [hidden, pathname]);

  if (hidden) return null;
  return (
    <div
      data-sticky-cta
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-basalto/15 bg-pedra px-4 py-3 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="flex gap-3 [&>*]:flex-1">
        <ButtonLink href="/orcamento" className="px-3 whitespace-nowrap">
          {globals.ctaPrimaryShort}
        </ButtonLink>
        <WhatsappButton label={globals.ctaWhatsappShort} className="px-3 whitespace-nowrap" />
      </div>
    </div>
  );
}
