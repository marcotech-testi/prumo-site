import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsappButton } from "@/components/layout/WhatsappButton";
import type { WhatsappMessageKey } from "@/content/whatsapp-messages";
import type { Link } from "@/content/types";
import { HeroDecor } from "./HeroDecor";

type Props = {
  eyebrow: string;
  h1: string;
  subtitle: string;
  primary: Link;
  microcopy: string;
  whatsapp: WhatsappMessageKey;
};

/** Hero da home (Floresta, tipográfico, sem foto). */
export function Hero({ eyebrow, h1, subtitle, primary, microcopy, whatsapp }: Props) {
  return (
    <section className="on-dark relative overflow-hidden bg-floresta text-pedra">
      <HeroDecor />
      <Container className="relative py-24 md:py-36">
        <div className="max-w-3xl">
          <p className="t-eyebrow text-agua">{eyebrow}</p>
          <h1 className="t-h1 mt-6 text-pedra">{h1}</h1>
          <p className="t-body mt-6 text-lg text-pedra/85 md:text-xl">{subtitle}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={primary.href} tone="dark">
              {primary.label}
            </ButtonLink>
            <WhatsappButton variant="secondary" tone="dark" message={whatsapp} />
          </div>
          <p className="mt-5 max-w-md text-[0.9375rem] text-agua">{microcopy}</p>
        </div>
      </Container>
    </section>
  );
}
