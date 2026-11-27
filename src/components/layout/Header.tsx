import Link from "next/link";
import { globals } from "@/content/globals";
import { mainNav, visibleNav } from "@/content/navigation";
import { hasPublishedObras } from "@/content/obras";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { WhatsappButton } from "./WhatsappButton";

export function Header() {
  const items = visibleNav(mainNav, hasPublishedObras());
  return (
    <header className="sticky top-0 z-40 border-b border-basalto/15 bg-pedra">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-floresta focus:px-4 focus:py-2 focus:text-pedra"
      >
        {globals.skipToContent}
      </a>
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label={`${globals.homeLabel} — Prumo Paisagismo`} className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label={globals.mainNavLabel} className="hidden xl:block">
          <NavLinks items={items} />
        </nav>
        <div className="hidden items-center gap-3 xl:flex">
          <WhatsappButton variant="secondary" className="min-h-11 px-4" />
          <ButtonLink href="/orcamento" className="min-h-11 px-5">
            {globals.ctaPrimary}
          </ButtonLink>
        </div>
        <MobileMenu items={items} />
      </Container>
    </header>
  );
}
