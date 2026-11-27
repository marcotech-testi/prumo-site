import type { PageContent } from "@/content/types";
import { Blocks } from "./Blocks";
import { CtaFinal } from "./CtaFinal";
import { PageHero } from "./PageHero";
import { Section } from "./Section";

/** Página interna genérica, montada só a partir de PageContent. */
export function ContentPage({ page }: { page: PageContent }) {
  return (
    <>
      <PageHero label={page.label} path={page.path} h1={page.h1} answer={page.answer} />
      {page.sections.map((s, i) => (
        <Section key={s.id} id={s.id} heading={s.heading} tone={i % 2 === 0 ? "pedra" : "papel"}>
          <Blocks blocks={s.blocks} faqHeadingLevel={s.heading ? 3 : 2} />
        </Section>
      ))}
      <CtaFinal cta={page.cta} />
    </>
  );
}
