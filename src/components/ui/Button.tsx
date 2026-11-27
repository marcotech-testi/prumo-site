import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Tone = "light" | "dark";

const base =
  "t-expanded inline-flex min-h-12 items-center justify-center rounded-[var(--radius-ui)] px-6 text-[0.9375rem] font-medium leading-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const styles: Record<Variant, Record<Tone, string>> = {
  primary: {
    light: "bg-floresta text-pedra hover:bg-basalto focus-visible:outline-agua-profunda",
    dark: "bg-pedra text-floresta hover:bg-papel focus-visible:outline-agua",
  },
  secondary: {
    light:
      "border-[1.5px] border-floresta text-floresta hover:bg-floresta hover:text-pedra focus-visible:outline-agua-profunda",
    dark: "border-[1.5px] border-pedra text-pedra hover:bg-pedra hover:text-floresta focus-visible:outline-agua",
  },
};

export function buttonClass(variant: Variant = "primary", tone: Tone = "light", extra = "") {
  return `${base} ${styles[variant][tone]} ${extra}`;
}

type CommonProps = { variant?: Variant; tone?: Tone; children: ReactNode; className?: string };

export function ButtonLink({
  href,
  variant,
  tone,
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  const cls = buttonClass(variant, tone, className);
  if (/^https?:/.test(href)) {
    return (
      <a href={href} className={cls} rel="noopener" {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  tone,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button type={type} className={buttonClass(variant, tone, className)} {...rest}>
      {children}
    </button>
  );
}
