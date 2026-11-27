import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { SpecSheet } from "@/components/ui/SpecSheet";

// Página interna de referência visual. Bloqueada em produção, fora do sitemap.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "Floresta", hex: "#1E3227", cls: "bg-floresta text-pedra" },
  { name: "Pedra", hex: "#E9E6DF", cls: "bg-pedra text-basalto border border-basalto/15" },
  { name: "Papel", hex: "#F4F2EE", cls: "bg-papel text-basalto border border-basalto/15" },
  { name: "Basalto", hex: "#191B19", cls: "bg-basalto text-pedra" },
  { name: "Água", hex: "#8FA6B2", cls: "bg-agua text-basalto" },
  { name: "Água Profunda", hex: "#3E5A68", cls: "bg-agua-profunda text-pedra" },
];

export default function Styleguide() {
  if (process.env.VERCEL_ENV === "production") notFound();
  return (
    <main className="py-16">
      <Container className="space-y-16">
        <section className="space-y-4">
          <p className="t-eyebrow text-agua-profunda">Styleguide · interno</p>
          <h1 className="t-h1 text-floresta">Archivo expandida 125%, peso 500</h1>
          <h2 className="t-h2 text-floresta">Título H2 em expandida</h2>
          <h3 className="t-h3">Título H3 em expandida</h3>
          <p className="t-body">
            Texto corrido em Archivo largura normal, 17 px, entrelinha 1,65, no máximo 68 caracteres
            por linha. <strong>Negrito em 600.</strong> Medidas em expandida:{" "}
            <span className="t-expanded">18 m²</span>.
          </p>
          <p className="t-body" style={{ fontStretch: "62%" }}>
            Largura condensada 62% (só para conferir o eixo wdth da fonte variável).
          </p>
        </section>

        <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {swatches.map((s) => (
            <div key={s.name} className={`rounded-[var(--radius-ui)] p-6 ${s.cls}`}>
              <p className="t-eyebrow">{s.name}</p>
              <p className="t-expanded mt-2">{s.hex}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-wrap gap-4">
          <Button>Pedir orçamento</Button>
          <Button variant="secondary">Falar no WhatsApp</Button>
          <ButtonLink href="/">Link primário</ButtonLink>
        </section>

        <section className="on-dark flex flex-wrap items-center gap-4 bg-floresta p-8">
          <Logo variant="branco" />
          <Button tone="dark">Pedir orçamento</Button>
          <Button variant="secondary" tone="dark">
            Falar no WhatsApp
          </Button>
          <p className="t-eyebrow text-agua">Água sobre Floresta</p>
        </section>

        <section className="space-y-6">
          <Logo />
          <SpecSheet
            caption="Ficha técnica de exemplo"
            rows={[
              { label: "Local", value: "Batel, Curitiba" },
              { label: "Metragem", value: "18 m²" },
              { label: "Irrigação", value: "Gotejamento com controlador programável" },
            ]}
          />
        </section>
      </Container>
    </main>
  );
}
