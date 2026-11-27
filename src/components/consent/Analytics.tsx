"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { CONSENT_EVENT, readConsent, type ConsentState } from "@/lib/consent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };

/**
 * GA4 e Meta Pixel só depois de "Aceitar" (docs/04). Sem consentimento, nenhum script de terceiros.
 * Google Consent Mode v2: começa "denied" e passa a "granted" ao aceitar.
 */
export function Analytics() {
  const [granted, setGranted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const apply = (state: ConsentState | null) => {
      const ok = state?.choice === "granted";
      setGranted(ok);
      const w = window as W;
      if (!ok) {
        // Revogou depois de aceitar: para de medir já; os scripts saem na próxima carga.
        w.gtag?.("consent", "update", {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
        });
        w.fbq?.("consent", "revoke");
      }
    };
    apply(readConsent());
    const onChange = (e: Event) => apply((e as CustomEvent<ConsentState>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Cliques em WhatsApp e e-mail (elementos com data-event).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-event]");
      const ev = el?.dataset.event;
      if (ev === "click_whatsapp") track("click_whatsapp", { pagina: window.location.pathname });
      else if (ev === "click_email") track("click_email", { pagina: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // PageView do Pixel em navegações internas (o GA4 mede pelo histórico).
  useEffect(() => {
    if (granted) (window as W).fbq?.("track", "PageView");
  }, [granted, pathname]);

  if (!granted) return null;

  return (
    <>
      {GA_ID ? (
        <>
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          <Script
            id="ga4"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}
      {PIXEL_ID ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent','grant');fbq('init','${PIXEL_ID}');`}
        </Script>
      ) : null}
    </>
  );
}
