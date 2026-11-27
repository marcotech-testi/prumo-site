"use client";

import { useId, useState } from "react";

export type AccordionItem = { question: string; answer: string };

/** FAQ acessível: botão com aria-expanded, sem animação de altura. */
export function Accordion({
  items,
  headingLevel = 3,
}: {
  items: AccordionItem[];
  headingLevel?: 2 | 3;
}) {
  const baseId = useId();
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set());
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const toggle = (i: number) =>
    setOpenIdx((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  return (
    <div className="border-b border-basalto/15">
      {items.map((item, i) => {
        const open = openIdx.has(i);
        const btnId = `${baseId}-q${i}`;
        const panelId = `${baseId}-a${i}`;
        return (
          <div key={item.question} className="border-t border-basalto/15">
            <Heading className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="flex w-full cursor-pointer items-start justify-between gap-6 py-5 text-left text-lg font-medium text-floresta"
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="t-expanded shrink-0 text-agua-profunda">
                  {open ? "−" : "+"}
                </span>
              </button>
            </Heading>
            {/* Conteúdo sempre no DOM (legível por buscadores e agentes); oculto até abrir. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!open}
              className="t-body pb-6"
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
