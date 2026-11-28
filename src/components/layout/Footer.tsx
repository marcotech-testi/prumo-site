import Link from "next/link";
import { globals } from "@/content/globals";
import {
  footerColumns,
  footerContactTitle,
  footerSocialTitle,
  visibleNav,
} from "@/content/navigation";
import { hasPublishedObras } from "@/content/obras";
import { siteConfig, socialLinks } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { whatsappLink } from "@/lib/whatsapp";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";

const linkCls = "text-pedra/90 underline-offset-4 hover:text-pedra hover:underline";

export function Footer() {
  const hasObras = hasPublishedObras();
  const wa = whatsappLink("geral");
  return (
    <footer className="on-dark bg-floresta pt-20 pb-28 text-pedra md:pb-12">
      <Container>
        <div className="grid gap-12 border-b border-agua/30 pb-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo variant="branco" width={180} />
            <p className="mt-6 max-w-xs text-pedra/85">{globals.descriptor}</p>
          </div>
          <nav
            aria-label={globals.footerNavLabel}
            className="grid gap-10 sm:grid-cols-2 md:col-span-5"
          >
            {footerColumns.map((col) => (
              <div key={col.title}>
                <h2 className="t-eyebrow text-agua">{col.title}</h2>
                <ul className="mt-4 space-y-3">
                  {visibleNav(col.items, hasObras).map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkCls}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="md:col-span-3">
            <h2 className="t-eyebrow text-agua">{footerContactTitle}</h2>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={`mailto:${siteConfig.email}`} data-event="click_email" className={linkCls}>
                  {/* Quebra depois do @, nunca no meio da palavra */}
                  {siteConfig.email.split("@")[0]}@
                  <wbr />
                  {siteConfig.email.split("@")[1]}
                </a>
              </li>
              {wa ? (
                <li>
                  <a
                    href={wa}
                    target="_blank"
                    rel="noopener"
                    data-event="click_whatsapp"
                    className={linkCls}
                  >
                    {globals.ctaWhatsapp}
                  </a>
                </li>
              ) : null}
              {siteConfig.phone ? (
                <li>
                  <a href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`} className={linkCls}>
                    {siteConfig.phone}
                  </a>
                </li>
              ) : null}
            </ul>
            {siteConfig.socialLive ? (
              <>
                <h2 className="t-eyebrow mt-8 text-agua">{footerSocialTitle}</h2>
                <ul className="mt-4 space-y-3">
                  {socialLinks.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener me" className={linkCls}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-8 text-sm text-pedra/85 md:flex-row md:items-center md:justify-between">
          <p>
            {globals.copyright(new Date().getFullYear())}
            {siteConfig.legalName ? ` · ${siteConfig.legalName}` : null}
          </p>
          <ul className="flex flex-wrap gap-6">
            <li>
              <Link href="/privacidade" className={linkCls}>
                {globals.privacyLink}
              </Link>
            </li>
            <li>
              <CookiePreferencesLink className={linkCls} />
            </li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
