import Image from "next/image";
import Link from "next/link";
import type { Obra } from "@/content/obras-schema";
import { formatM2, obrasPage } from "@/content/pages/obras";

export function ObraCard({ obra, headingLevel = 3 }: { obra: Obra; headingLevel?: 2 | 3 }) {
  const cover = obra.fotos.find((f) => f.tipo === "geral") ?? obra.fotos[0];
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="flex flex-col border-t border-basalto/15 pt-6">
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        sizes="(min-width: 768px) 33vw, 100vw"
        className="aspect-[4/3] w-full rounded-[var(--radius-ui)] object-cover"
      />
      <H className="t-h3 mt-5 text-floresta">{obra.titulo}</H>
      <p className="mt-2 text-agua-profunda">
        {obra.bairro}, {obra.cidade} ·{" "}
        <span className="t-expanded">{formatM2(obra.metragemM2)}</span>
      </p>
      <Link
        href={`/obras/${obra.slug}`}
        className="t-expanded mt-4 font-medium text-floresta underline underline-offset-4"
      >
        {obrasPage.cardLink}
        <span className="sr-only">: {obra.titulo}</span>
      </Link>
    </article>
  );
}
