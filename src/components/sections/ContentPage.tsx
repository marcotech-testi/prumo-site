import type { Block, PageContent, Section as SectionData } from "@/content/types";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { Blocks } from "./Blocks";
import { CtaFinal } from "./CtaFinal";
import { PageHero } from "./PageHero";
import { Section } from "./Section";

/** Blocos que pedem a largura toda (grades, linha do tempo, FAQ). */
const WIDE: Block["type"][] = ["steps", "faq", "features"];
const isWide = (s: SectionData) => s.blocks.some((b) => WIDE.includes(b.type));

/**
 * Seção de texto no formato de prancha: número e título à esquerda, texto à direita,
 * separadas por um fio. Seções seguidas formam uma só banda, sem trocar o fundo.
 */
function SheetSection({
  section,
  index,
  first,
}: {
  section: SectionData;
  index: number;
  first: boolean;
}) {
  const hId = `${section.id}-titulo`;
  return (
    <section
      id={section.id}
      aria-labelledby={section.heading ? hId : undefined}
      className={first ? "pt-16 md:pt-24" : "pt-12 md:pt-16"}
    >
      <Container>
        <div className="grid gap-6 border-t border-basalto/15 pt-8 lg:grid-cols-12 lg:gap-12 lg:pt-10">
          {section.heading ? (
            <div className="lg:col-span-4">
              <span
                className="t-expanded block text-sm font-medium text-agua-profunda"
                aria-hidden="true"
              >
                {String(index).padStart(2, "0")}
              </span>
              <h2 id={hId} className="t-h3 mt-3 text-floresta md:text-2xl">
                {section.heading}
              </h2>
            </div>
          ) : null}
          <div className={section.heading ? "lg:col-span-8" : "lg:col-span-8 lg:col-start-5"}>
            <Blocks blocks={section.blocks} faqHeadingLevel={section.heading ? 3 : 2} />
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Página interna genérica, montada só a partir de PageContent. */
export function ContentPage({ page, heroCta = true }: { page: PageContent; heroCta?: boolean }) {
  const faqIds = page.sections.flatMap((s) =>
    s.blocks.flatMap((b) => (b.type === "faq" ? b.ids : [])),
  );

  // Agrupa seções de texto consecutivas numa banda Pedra; seções largas ganham banda Papel.
  const groups: { wide: boolean; items: SectionData[] }[] = [];
  for (const s of page.sections) {
    const wide = isWide(s);
    const last = groups.at(-1);
    if (last && !last.wide && !wide) last.items.push(s);
    else groups.push({ wide, items: [s] });
  }
  // Seções largas seguidas alternam Papel e Pedra para não virarem um bloco só.
  const tones = groups.map((g, i) =>
    g.wide && groups[i - 1]?.wide ? "pedra" : g.wide ? "papel" : "pedra",
  );
  for (let i = 1; i < groups.length; i++) {
    if (groups[i].wide && groups[i - 1].wide && tones[i - 1] === "pedra") tones[i] = "papel";
  }
  let n = 0;

  return (
    <>
      {page.serviceType ? (
        <JsonLd
          data={serviceSchema({
            name: page.h1,
            serviceType: page.serviceType,
            description: page.answer ?? page.description,
            path: page.path,
          })}
        />
      ) : null}
      {faqIds.length ? <JsonLd data={faqSchema(faqIds)} /> : null}
      <PageHero
        label={page.label}
        path={page.path}
        h1={page.h1}
        answer={page.answer}
        whatsapp={heroCta ? page.whatsapp : undefined}
        cta={heroCta}
        primary={page.cta.primary}
      />
      {groups.map((g, gi) =>
        g.wide ? (
          g.items.map((s) => (
            <Section key={s.id} id={s.id} heading={s.heading} tone={tones[gi] as "papel" | "pedra"}>
              <Blocks blocks={s.blocks} faqHeadingLevel={s.heading ? 3 : 2} />
            </Section>
          ))
        ) : (
          <div key={`g${gi}`} className="bg-pedra pb-20 md:pb-28">
            {g.items.map((s, i) => (
              <SheetSection key={s.id} section={s} index={s.heading ? ++n : n} first={i === 0} />
            ))}
          </div>
        ),
      )}
      <CtaFinal cta={page.cta} />
    </>
  );
}
