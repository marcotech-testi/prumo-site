import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/sections/Section";
import { privacidade, privacidadeSections } from "@/content/pages/privacidade";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(privacidade);

export default function PrivacidadePage() {
  return (
    <>
      <PageHero label={privacidade.label} path={privacidade.path} h1={privacidade.h1} />
      <Section tone="pedra">
        <p className="t-eyebrow text-agua-profunda">
          {privacidade.updatedLabel}{" "}
          <time dateTime={privacidade.updatedAtIso}>{privacidade.updatedAt}</time>
        </p>
        <ol className="mt-10 max-w-3xl space-y-8">
          {privacidadeSections().map((s, i) => (
            <li key={s.title} className="flex gap-6">
              <span
                className="t-expanded w-6 shrink-0 font-medium text-agua-profunda"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <p className="t-body">
                <strong className="text-floresta">{s.title}</strong> {s.text}
              </p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
