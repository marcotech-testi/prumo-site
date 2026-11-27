"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { consentContent } from "@/content/consent";
import { Button } from "@/components/ui/Button";
import { CONSENT_OPEN_EVENT, readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";

/** Banner pequeno, sem bloquear rolagem; "Aceitar" e "Recusar" idênticos. */
export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const regionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!readConsent()) setOpen(true);
    }, 0);
    const reopen = () => {
      setOpen(true);
      window.setTimeout(() => regionRef.current?.querySelector("button")?.focus(), 0);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  if (!open) return null;

  const choose = (choice: ConsentChoice) => {
    writeConsent(choice);
    setOpen(false);
  };

  return (
    <section
      ref={regionRef}
      aria-label={consentContent.label}
      className="fixed right-4 bottom-24 left-4 z-50 max-w-md rounded-[var(--radius-ui)] border border-basalto/15 bg-papel p-5 md:right-auto md:bottom-6 md:left-6"
    >
      <p className="text-[0.9375rem] leading-normal">{consentContent.text}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => choose("granted")} className="px-3">
          {consentContent.accept}
        </Button>
        <Button variant="secondary" onClick={() => choose("denied")} className="px-3">
          {consentContent.reject}
        </Button>
      </div>
      <Link
        href="/privacidade"
        className="mt-3 inline-block text-sm text-agua-profunda underline underline-offset-4"
      >
        {consentContent.policyLink}
      </Link>
    </section>
  );
}
