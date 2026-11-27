import type { Origem } from "./quote-schema";

/** Atribuição de origem do visitante (docs/04): primeira visita da sessão, 30 min. */
export const UTM_STORAGE_KEY = "prumo:origem";
const TTL_MS = 30 * 60 * 1000;
const PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

type Stored = { origem: Origem; at: number };

/** Extrai a origem de uma URL e do referrer (função pura, testável). */
export function parseOrigem(url: string, referrer: string): Origem {
  const u = new URL(url);
  const origem: Origem = { pagina: u.pathname };
  for (const p of PARAMS) {
    const v = u.searchParams.get(p);
    if (v) origem[p] = v.slice(0, 200);
  }
  if (referrer) {
    try {
      const r = new URL(referrer);
      if (r.host !== u.host) origem.referrer = `${r.origin}${r.pathname}`.slice(0, 500);
    } catch {
      /* referrer inválido */
    }
  }
  return origem;
}

/** Captura na primeira visita da sessão; renova o prazo a cada página. Chamar no cliente. */
export function captureOrigem() {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as Stored) : null;
    const current = parseOrigem(window.location.href, document.referrer);
    const hasCampaign = PARAMS.some((p) => current[p]);
    if (!stored || now - stored.at > TTL_MS || hasCampaign) {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({ origem: current, at: now }));
    } else {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify({ ...stored, at: now }));
    }
  } catch {
    /* storage bloqueado */
  }
}

export function readOrigem(): Origem {
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (raw) return (JSON.parse(raw) as Stored).origem;
  } catch {
    /* storage bloqueado */
  }
  return typeof window === "undefined" ? {} : parseOrigem(window.location.href, document.referrer);
}
