"use client";

import { globals } from "@/content/globals";
import { openConsentPreferences } from "@/lib/consent";

export function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openConsentPreferences}
      className={`cursor-pointer ${className ?? ""}`}
    >
      {globals.cookiePrefsLink}
    </button>
  );
}
