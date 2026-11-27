"use client";

import { Button, ButtonLink } from "@/components/ui/Button";
import { MessagePage } from "@/components/sections/MessagePage";
import { errorContent } from "@/content/pages/erros";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <MessagePage h1={errorContent.h1} text={errorContent.text()}>
      <Button onClick={reset}>{errorContent.retry}</Button>
      {errorContent.links.map((l) => (
        <ButtonLink key={l.href} href={l.href} variant="secondary">
          {l.label}
        </ButtonLink>
      ))}
    </MessagePage>
  );
}
