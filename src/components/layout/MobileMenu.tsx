"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { globals } from "@/content/globals";
import type { NavItem } from "@/content/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { NavLinks } from "./NavLinks";
import { WhatsappButton } from "./WhatsappButton";

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Fecha ao trocar de rota.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const list = [toggleRef.current!, ...focusables()];
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <div className="xl:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => (open ? close() : setOpen(true))}
        className="t-expanded relative z-50 min-h-12 rounded-[var(--radius-ui)] border-[1.5px] border-floresta px-4 text-[0.9375rem] font-medium text-floresta"
      >
        {open ? globals.menuClose : globals.menuOpen}
      </button>
      <div
        id="menu-mobile"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto border-t border-basalto/15 bg-pedra shadow-[0_1px_0_rgba(25,27,25,0.15)]"
      >
        <nav aria-label={globals.mainNavLabel} className="px-5 pt-4 pb-10">
          <NavLinks items={items} vertical onNavigate={() => setOpen(false)} />
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink href="/orcamento" onClick={() => setOpen(false)}>
              {globals.ctaPrimary}
            </ButtonLink>
            <WhatsappButton />
          </div>
        </nav>
      </div>
    </div>
  );
}
