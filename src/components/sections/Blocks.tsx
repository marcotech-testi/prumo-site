import Link from "next/link";
import type { Block } from "@/content/types";
import { SpecList, SpecSheet } from "@/components/ui/SpecSheet";
import { PrintButton } from "@/components/ui/PrintButton";
import { FaqList } from "./FaqList";
import { Features } from "./Features";
import { PriceBlock } from "./PriceBlock";
import { StepsTimeline } from "./StepsTimeline";
import { SystemDiagram } from "./SystemDiagram";

/** Renderiza blocos de conteúdo de src/content. Nenhum texto próprio. */
export function Blocks({
  blocks,
  faqHeadingLevel = 3,
}: {
  blocks: Block[];
  faqHeadingLevel?: 2 | 3;
}) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="t-body">
                {b.text}
              </p>
            );
          case "list":
            return (
              <ul key={i} className="t-body list-disc space-y-2 pl-5">
                {b.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            );
          case "numbered":
            return (
              <ol key={i} className="max-w-3xl border-b border-basalto/15">
                {b.items.map((it, n) => (
                  <li key={it} className="flex gap-6 border-t border-basalto/15 py-5">
                    <span
                      className="t-expanded w-8 shrink-0 text-xl font-medium text-agua-profunda"
                      aria-hidden="true"
                    >
                      {n + 1}
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ol>
            );
          case "spec":
            return (
              <div key={i} className="max-w-3xl">
                <SpecList items={b.items} />
              </div>
            );
          case "features":
            return <Features key={i} items={b.items} />;
          case "steps":
            return <StepsTimeline key={i} />;
          case "faq":
            return (
              <FaqList key={i} ids={b.ids} moreLink={b.moreLink} headingLevel={faqHeadingLevel} />
            );
          case "price":
            return <PriceBlock key={i} />;
          case "specsheet":
            return (
              <div key={i} data-print-area>
                <SpecSheet rows={b.rows} caption={b.caption} />
                <PrintButton label={b.printLabel} />
              </div>
            );
          case "diagram":
            return <SystemDiagram key={i} className="pt-4" />;
          case "links":
            return (
              <ul key={i} className="flex flex-wrap gap-6">
                {b.items.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-floresta underline underline-offset-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
