import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SpecSheet } from "@/components/ui/SpecSheet";
import { Breadcrumb } from "@/components/sections/Breadcrumb";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { ObraGallery } from "@/components/sections/ObraGallery";
import { JsonLd } from "@/components/seo/JsonLd";
import { ViewObra } from "@/components/analytics/ViewObra";
import { breadcrumbsFor } from "@/lib/breadcrumbs";
import { breadcrumbSchema, obraSchema } from "@/lib/schema";
import { getObra, getPublishedObras } from "@/content/obras";
import { defaultCta } from "@/content/pages/cta";
import { obraDescription, obraSpecRows, obrasPage, obraTitle } from "@/content/pages/obras";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  const obras = getPublishedObras();
  // Sem obras, gera um slug inexistente que responde 404 (o Next exige ao menos um parâmetro).
  return obras.length ? obras.map((o) => ({ slug: o.slug })) : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/obras/[slug]">): Promise<Metadata> {
  const obra = getObra((await params).slug);
  if (!obra) return {};
  return pageMetadata({
    path: `/obras/${obra.slug}`,
    title: obraTitle(obra),
    description: obraDescription(obra),
  });
}

export default async function ObraPage({ params }: PageProps<"/obras/[slug]">) {
  const obra = getObra((await params).slug);
  if (!obra) notFound();
  const crumbs = breadcrumbsFor(
    { label: obrasPage.label, href: obrasPage.path },
    { label: obra.titulo, href: `/obras/${obra.slug}` },
  );
  return (
    <>
      <JsonLd data={[breadcrumbSchema(crumbs), obraSchema(obra)]} />
      <ViewObra slug={obra.slug} />
      <section className="on-dark bg-floresta text-pedra">
        <Container className="py-16 md:py-24">
          <Breadcrumb items={crumbs} />
          <h1 className="t-h1 mt-8 max-w-3xl text-pedra">{obra.titulo}</h1>
        </Container>
      </section>
      <section className="bg-pedra py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <SpecSheet caption={obrasPage.specCaption} rows={obraSpecRows(obra)} />
            {obra.descricao ? <p className="t-body mt-8">{obra.descricao}</p> : null}
            <ButtonLink href={obrasPage.cta.href(obra.slug)} className="mt-10">
              {obrasPage.cta.label}
            </ButtonLink>
          </div>
          <div className="md:col-span-7">
            <ObraGallery fotos={obra.fotos} label={obrasPage.galleryLabel} />
          </div>
        </Container>
      </section>
      <CtaFinal cta={defaultCta} />
    </>
  );
}
