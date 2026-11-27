import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { faqByIds } from "@/content/faq";
import type { Link as LinkT } from "@/content/types";

export function FaqList({
  ids,
  moreLink,
  headingLevel = 3,
}: {
  ids: number[];
  moreLink?: LinkT;
  headingLevel?: 2 | 3;
}) {
  const items = faqByIds(ids).map((f) => ({ question: f.question, answer: f.answer }));
  return (
    <div className="max-w-4xl">
      <Accordion items={items} headingLevel={headingLevel} />
      {moreLink ? (
        <Link
          href={moreLink.href}
          className="t-expanded mt-8 inline-block font-medium text-floresta underline underline-offset-4"
        >
          {moreLink.label}
        </Link>
      ) : null}
    </div>
  );
}
