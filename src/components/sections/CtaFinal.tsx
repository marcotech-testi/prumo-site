import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsappButton } from "@/components/layout/WhatsappButton";
import type { Cta } from "@/content/types";

export function CtaFinal({ cta }: { cta: Cta }) {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      className="on-dark border-b border-agua/30 bg-floresta py-20 text-pedra md:py-28 print:hidden"
    >
      <Container>
        <h2 id="cta-final-titulo" className="t-h2 text-pedra">
          {cta.heading}
        </h2>
        <p className="t-body mt-4 text-lg text-pedra/85">{cta.text}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={cta.primary.href} tone="dark">
            {cta.primary.label}
          </ButtonLink>
          {cta.whatsapp ? (
            <WhatsappButton variant="secondary" tone="dark" message={cta.whatsapp} />
          ) : null}
        </div>
        {cta.links?.length ? (
          <ul className="mt-10 flex flex-wrap gap-6">
            {cta.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-pedra underline underline-offset-4 hover:text-agua"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
