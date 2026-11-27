import { siteConfig } from "@/content/site";

export type ConsentChoice = "granted" | "denied";
export type ConsentState = { choice: ConsentChoice; version: string; at: string };

export const CONSENT_COOKIE = "prumo_consent";
export const CONSENT_STORAGE_KEY = "prumo:consent";
/** Disparado quando a escolha muda (detail: ConsentState). */
export const CONSENT_EVENT = "prumo:consent";
/** Disparado para reabrir o banner (link "Preferências de cookies"). */
export const CONSENT_OPEN_EVENT = "prumo:consent-open";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function parseConsent(raw: string | null | undefined): ConsentState | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<ConsentState>;
    if (
      (v.choice === "granted" || v.choice === "denied") &&
      v.version === siteConfig.consentVersion
    ) {
      return { choice: v.choice, version: v.version, at: String(v.at ?? "") };
    }
  } catch {
    /* valor inválido */
  }
  return null;
}

function readCookie(): string | null {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)) : null;
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    /* storage bloqueado */
  }
  return parseConsent(raw) ?? parseConsent(readCookie());
}

export function writeConsent(choice: ConsentChoice): ConsentState {
  const state: ConsentState = {
    choice,
    version: siteConfig.consentVersion,
    at: new Date().toISOString(),
  };
  const raw = JSON.stringify(state);
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, raw);
  } catch {
    /* storage bloqueado: o cookie basta */
  }
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(raw)}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

export function openConsentPreferences() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
