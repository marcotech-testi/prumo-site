"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/content/navigation";

export function NavLinks({
  items,
  vertical = false,
  onNavigate,
}: {
  items: NavItem[];
  vertical?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <ul className={vertical ? "flex flex-col" : "flex items-center gap-5"}>
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href} className={vertical ? "border-b border-basalto/15" : undefined}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={current ? "page" : undefined}
              className={
                vertical
                  ? "t-expanded block py-4 text-xl font-medium text-floresta"
                  : `text-[0.9375rem] whitespace-nowrap text-basalto underline-offset-8 hover:text-floresta hover:underline ${current ? "text-floresta underline decoration-1" : ""}`
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
