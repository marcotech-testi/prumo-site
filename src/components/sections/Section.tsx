import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export type Tone = "pedra" | "papel" | "floresta";

const toneCls: Record<Tone, string> = {
  pedra: "bg-pedra",
  papel: "bg-papel",
  floresta: "on-dark bg-floresta text-pedra",
};

export function Section({
  id,
  tone = "pedra",
  heading,
  headingId,
  children,
  className = "",
}: {
  id?: string;
  tone?: Tone;
  heading?: string;
  headingId?: string;
  children: ReactNode;
  className?: string;
}) {
  const hId = headingId ?? (id ? `${id}-titulo` : undefined);
  return (
    <section
      id={id}
      aria-labelledby={heading ? hId : undefined}
      className={`py-20 md:py-28 ${toneCls[tone]} ${className}`}
    >
      <Container>
        {heading ? (
          <h2
            id={hId}
            className={`t-h2 max-w-3xl ${tone === "floresta" ? "text-pedra" : "text-floresta"}`}
          >
            {heading}
          </h2>
        ) : null}
        <div className={heading ? "mt-10" : undefined}>{children}</div>
      </Container>
    </section>
  );
}
