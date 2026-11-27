import { globals } from "@/content/globals";
import Link from "next/link";
import type { Crumb } from "@/lib/breadcrumbs";

/** Trilha visível (igual ao JSON-LD BreadcrumbList). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label={globals.breadcrumbLabel}>
      <ol className="t-eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-agua">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-3">
              {last ? (
                <span aria-current="page">{c.label}</span>
              ) : (
                <>
                  <Link href={c.href} className="underline-offset-4 hover:underline">
                    {c.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
