import Image from "next/image";
import type { Obra } from "@/content/obras-schema";

export function ObraGallery({ fotos, label }: { fotos: Obra["fotos"]; label: string }) {
  return (
    <ul aria-label={label} className="grid gap-4 md:grid-cols-2">
      {fotos.map((f, i) => (
        <li key={f.src} className={i === 0 ? "md:col-span-2" : undefined}>
          <Image
            src={f.src}
            alt={f.alt}
            width={f.width}
            height={f.height}
            sizes={i === 0 ? "(min-width: 1200px) 1120px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            priority={i === 0}
            className="h-auto w-full rounded-[var(--radius-ui)]"
          />
        </li>
      ))}
    </ul>
  );
}
