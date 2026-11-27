/** Símbolo branco gigante a ~9% e o "fio de prumo" em Água a 40%. Decorativo. */
export function HeroDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[14%] right-[-38%] aspect-[120/190] h-[140%] sm:right-[-6%] md:right-[4%]"
    >
      <div className="absolute bottom-[92.1%] left-1/2 h-[200vh] w-px -translate-x-1/2 bg-agua/40" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/prumo-simbolo-branco.svg" alt="" className="h-full w-full opacity-[0.09]" />
    </div>
  );
}
