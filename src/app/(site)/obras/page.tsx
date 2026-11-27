import { notFound } from "next/navigation";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { ObraCard } from "@/components/sections/ObraCard";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { getPublishedObras } from "@/content/obras";
import { defaultCta } from "@/content/pages/cta";
import { obrasPage } from "@/content/pages/obras";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(obrasPage);

export default function ObrasPage() {
  const obras = getPublishedObras();
  if (obras.length === 0) notFound();
  return (
    <>
      <PageHero
        label={obrasPage.label}
        path={obrasPage.path}
        h1={obrasPage.h1}
        answer={obrasPage.intro}
      />
      <Section tone="pedra">
        <div className="grid gap-10 md:grid-cols-3">
          {obras.map((o) => (
            <ObraCard key={o.slug} obra={o} headingLevel={2} />
          ))}
        </div>
      </Section>
      <CtaFinal cta={defaultCta} />
    </>
  );
}
