import { QuoteForm } from "@/components/forms/QuoteForm";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { orcamento } from "@/content/pages/orcamento";
import { uploadMode } from "@/lib/blob";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(orcamento);

export default function OrcamentoPage() {
  return (
    <>
      <PageHero
        label={orcamento.label}
        path={orcamento.path}
        h1={orcamento.h1}
        answer={orcamento.intro}
      />
      <Section tone="pedra">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <QuoteForm mode={uploadMode()} />
          </div>
          <aside aria-labelledby="depois-titulo" className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 id="depois-titulo" className="t-h3 text-floresta">
                {orcamento.aside.heading}
              </h2>
              <ol className="mt-6 border-b border-basalto/15">
                {orcamento.aside.steps.map((s, i) => (
                  <li key={s} className="flex gap-5 border-t border-basalto/15 py-4">
                    <span
                      className="t-expanded w-6 shrink-0 font-medium text-agua-profunda"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
