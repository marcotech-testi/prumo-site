import Link from "next/link";
import { servicoCardLink, servicos } from "@/content/servicos";

export function ServiceCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {servicos.map((s, i) => (
        <li
          key={s.href}
          className="flex flex-col rounded-[var(--radius-ui)] border border-basalto/15 bg-papel p-8"
        >
          <span className="t-expanded text-sm font-medium text-agua-profunda" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="t-h3 mt-6 text-floresta">{s.title}</h3>
          <p className="mt-3 flex-1">{s.text}</p>
          <Link
            href={s.href}
            className="t-expanded mt-8 font-medium text-floresta underline underline-offset-4"
          >
            {servicoCardLink}
            <span className="sr-only">: {s.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
