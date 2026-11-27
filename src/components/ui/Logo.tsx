import Image from "next/image";

/** Logo horizontal (718×204). Positivo sobre Pedra/Papel, branco sobre Floresta. */
export function Logo({
  variant = "positivo",
  width = 168,
}: {
  variant?: "positivo" | "branco";
  width?: number;
}) {
  return (
    <Image
      src={`/brand/prumo-logo-horizontal-${variant}.svg`}
      alt="Prumo Paisagismo"
      width={width}
      height={Math.round((width * 204) / 718)}
      priority={variant === "positivo"}
      unoptimized
    />
  );
}
