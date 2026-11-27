import { priceText } from "@/content/servicos";
import { siteConfig } from "@/content/site";

/** Só renderiza se siteConfig.priceRange estiver preenchido (hoje: null). */
export function PriceBlock() {
  const range = siteConfig.priceRange;
  if (!range) return null;
  return (
    <p className="t-body mt-6 border-l-2 border-floresta pl-5 font-medium text-floresta">
      {priceText(range.minM2, range.maxM2, range.note)}
    </p>
  );
}
