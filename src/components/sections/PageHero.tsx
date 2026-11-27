import { Container } from "@/components/ui/Container";
import { globals } from "@/content/globals";
import { Breadcrumb } from "./Breadcrumb";
import { HeroDecor } from "./HeroDecor";

/** Hero interno: trilha, H1 e resposta direta logo abaixo. */
export function PageHero({
  label,
  path,
  h1,
  answer,
}: {
  label: string;
  path: string;
  h1: string;
  answer?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-floresta text-pedra">
      <HeroDecor />
      <Container className="relative py-16 md:py-24">
        <Breadcrumb
          items={[
            { label: globals.homeLabel, href: "/" },
            { label, href: path },
          ]}
        />
        <div className="max-w-3xl">
          <h1 className="t-h1 mt-8 text-pedra">{h1}</h1>
          {answer ? <p className="t-body mt-6 text-lg text-pedra/85 md:text-xl">{answer}</p> : null}
        </div>
      </Container>
    </section>
  );
}
