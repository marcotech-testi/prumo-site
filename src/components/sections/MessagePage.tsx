import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function MessagePage({
  h1,
  text,
  children,
}: {
  h1: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <h1 className="t-h1 text-floresta">{h1}</h1>
        <p className="t-body mt-6 text-lg">{text}</p>
        {children ? <div className="mt-10 flex flex-wrap gap-4">{children}</div> : null}
      </Container>
    </section>
  );
}
