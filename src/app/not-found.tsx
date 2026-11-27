import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { MessagePage } from "@/components/sections/MessagePage";
import { notFoundContent } from "@/content/pages/erros";

export const metadata: Metadata = {
  title: notFoundContent.title,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <MessagePage h1={notFoundContent.h1} text={notFoundContent.text}>
      {notFoundContent.links.map((l, i) => (
        <ButtonLink
          key={l.href}
          href={l.href}
          variant={i === notFoundContent.links.length - 1 ? "primary" : "secondary"}
        >
          {l.label}
        </ButtonLink>
      ))}
    </MessagePage>
  );
}
