import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { WhatsappButton } from "@/components/layout/WhatsappButton";
import { globals } from "@/content/globals";
import type { WhatsappMessageKey } from "@/content/whatsapp-messages";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbsFor, type Crumb } from "@/lib/breadcrumbs";
import { breadcrumbSchema } from "@/lib/schema";
import { Breadcrumb } from "./Breadcrumb";
import { HeroDecor } from "./HeroDecor";

type Props = {
  h1: string;
  answer?: string;
  /** Trilha completa; por padrão Início › {label}. */
  crumbs?: Crumb[];
  label?: string;
  path?: string;
  decor?: boolean;
  /** Mostra "Pedir orçamento" (e WhatsApp) logo abaixo da resposta direta. */
  cta?: boolean;
  /** Botão principal do topo; padrão "Pedir orçamento". */
  primary?: { label: string; href: string };
  whatsapp?: WhatsappMessageKey;
};

/** Hero interno: trilha visível (= JSON-LD BreadcrumbList), H1 e resposta direta logo abaixo. */
export function PageHero({
  label,
  path,
  h1,
  answer,
  crumbs,
  decor = true,
  cta = false,
  primary,
  whatsapp,
}: Props) {
  const trail = crumbs ?? breadcrumbsFor({ label: label ?? h1, href: path ?? "/" });
  return (
    <section data-hero className="on-dark relative overflow-hidden bg-floresta text-pedra">
      <JsonLd data={breadcrumbSchema(trail)} />
      {decor ? <HeroDecor /> : null}
      <Container className="relative py-16 md:py-24">
        <Breadcrumb items={trail} />
        <div className="max-w-3xl">
          <h1 className="t-h1 mt-8 text-pedra">{h1}</h1>
          {answer ? <p className="t-body mt-6 text-lg text-pedra/85 md:text-xl">{answer}</p> : null}
          {cta ? (
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={primary?.href ?? "/orcamento"} tone="dark">
                {primary?.label ?? globals.ctaPrimary}
              </ButtonLink>
              {whatsapp ? (
                <WhatsappButton variant="secondary" tone="dark" message={whatsapp} />
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
