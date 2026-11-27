import { Container } from "@/components/ui/Container";
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
};

/** Hero interno: trilha visível (= JSON-LD BreadcrumbList), H1 e resposta direta logo abaixo. */
export function PageHero({ label, path, h1, answer, crumbs, decor = true }: Props) {
  const trail = crumbs ?? breadcrumbsFor({ label: label ?? h1, href: path ?? "/" });
  return (
    <section className="on-dark relative overflow-hidden bg-floresta text-pedra">
      <JsonLd data={breadcrumbSchema(trail)} />
      {decor ? <HeroDecor /> : null}
      <Container className="relative py-16 md:py-24">
        <Breadcrumb items={trail} />
        <div className="max-w-3xl">
          <h1 className="t-h1 mt-8 text-pedra">{h1}</h1>
          {answer ? <p className="t-body mt-6 text-lg text-pedra/85 md:text-xl">{answer}</p> : null}
        </div>
      </Container>
    </section>
  );
}
