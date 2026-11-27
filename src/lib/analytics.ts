/** Eventos sem dados pessoais (docs/04). Os destinos (GA4/Pixel) só existem após consentimento (T10). */
export type AnalyticsEvent =
  "click_whatsapp" | "start_quote" | "submit_quote" | "click_email" | "view_obra";

type Gtag = (cmd: "event", name: string, params?: Record<string, string>) => void;
type Fbq = (cmd: "track", name: string, params?: Record<string, string>) => void;

export function track(event: AnalyticsEvent, params: Record<string, string> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag; fbq?: Fbq };
  try {
    w.gtag?.("event", event, params);
    if (event === "submit_quote") w.fbq?.("track", "Lead");
    if (event === "click_whatsapp") w.fbq?.("track", "Contact");
  } catch {
    /* nunca quebrar a página */
  }
}
