import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { FaqList } from "@/components/sections/FaqList";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Section } from "@/components/sections/Section";
import { ServiceCards } from "@/components/sections/ServiceCards";
import { StepsTimeline } from "@/components/sections/StepsTimeline";
import { SystemDiagram } from "@/components/sections/SystemDiagram";
import { getPublishedObras } from "@/content/obras";
import { ObraCard } from "@/components/sections/ObraCard";
import { home } from "@/content/pages";
import { whyItems } from "@/content/pages/home";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";

export const metadata = pageMetadata(home);

export default function HomePage() {
  const obras = getPublishedObras().slice(0, 3);
  const showObras = obras.length > 0;
  return (
    <>
      <JsonLd data={faqSchema([...home.faq.ids])} />
      <Hero {...home.hero} whatsapp={home.whatsapp} />

      <div className="border-b border-basalto/15 bg-pedra">
        <Container>
          <ul className="t-eyebrow grid grid-cols-2 text-agua-profunda md:grid-cols-4">
            {home.strip.map((item) => (
              <li
                key={item}
                className="border-basalto/15 py-6 odd:pr-4 md:border-l md:px-6 md:first:border-l-0 md:first:pl-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </div>

      <section id="resposta" aria-labelledby="resposta-titulo" className="bg-pedra py-20 md:py-28">
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:col-span-5">
              <h2 id="resposta-titulo" className="t-h2 text-floresta">
                {home.answer.heading}
              </h2>
              <p className="t-body mt-8 text-lg">{home.answer.text}</p>
            </div>
            <SystemDiagram className="lg:col-span-7" />
          </div>
        </Container>
      </section>

      <Section id="servicos" heading={home.services.heading} tone="papel">
        <ServiceCards />
      </Section>

      <Section id="por-que" heading={home.why.heading} tone="pedra">
        <Features items={whyItems(showObras)} />
      </Section>

      {showObras ? (
        <Section id="obras" heading={home.obras.heading} tone="papel">
          <div className="grid gap-10 md:grid-cols-3">
            {obras.map((o) => (
              <ObraCard key={o.slug} obra={o} />
            ))}
          </div>
          <Link
            href={home.obras.moreLink.href}
            className="t-expanded mt-10 inline-block font-medium text-floresta underline underline-offset-4"
          >
            {home.obras.moreLink.label}
          </Link>
        </Section>
      ) : null}

      <Section id="como-funciona" heading={home.steps.heading} tone={showObras ? "pedra" : "papel"}>
        <StepsTimeline />
      </Section>

      <Section
        id="arquitetos"
        heading={home.architects.heading}
        tone={showObras ? "papel" : "pedra"}
      >
        <p className="t-body text-lg">{home.architects.text}</p>
        <Link
          href={home.architects.link.href}
          className="t-expanded mt-8 inline-block font-medium text-floresta underline underline-offset-4"
        >
          {home.architects.link.label}
        </Link>
      </Section>

      <Section id="perguntas" heading={home.faq.heading} tone={showObras ? "pedra" : "papel"}>
        <FaqList ids={[...home.faq.ids]} moreLink={home.faq.moreLink} />
      </Section>

      <CtaFinal cta={home.cta} />
    </>
  );
}
