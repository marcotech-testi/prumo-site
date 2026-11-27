/**
 * Símbolo branco gigante a ~9% e o "fio de prumo" em Água a 40%. Decorativo.
 * SVG inline (mesmos traços de assets/logo/prumo-simbolo-branco.svg) para não virar o LCP da página.
 */
export function HeroDecor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-[14%] right-[-38%] aspect-[120/190] h-[140%] sm:right-[-6%] md:right-[4%]"
    >
      <div className="absolute bottom-[92.1%] left-1/2 h-[200vh] w-px -translate-x-1/2 bg-agua/40" />
      <svg viewBox="0 0 120 190" className="h-full w-full opacity-[0.09]" focusable="false">
        <defs>
          <mask id="hero-decor-mask" maskUnits="userSpaceOnUse">
            <rect x="-4" y="15" width="128" height="170" fill="#fff" />
            <path
              d="M60.00,93.93 L60.00,162.20 M60.00,121.67 L74.93,107.80 M60.00,140.87 L45.07,127.00"
              stroke="#000"
              strokeWidth="3.41"
              strokeLinecap="round"
              fill="none"
            />
          </mask>
        </defs>
        <rect x="45.07" y="15" width="29.87" height="4.27" rx="1.07" fill="#E9E6DF" />
        <rect x="58.51" y="18.2" width="2.99" height="60.8" fill="#E9E6DF" />
        <path
          d="M60.00,76.87 C94.13,98.20 95.20,140.87 60.00,172.87 C24.80,140.87 25.87,98.20 60.00,76.87 Z"
          fill="#E9E6DF"
          mask="url(#hero-decor-mask)"
        />
      </svg>
    </div>
  );
}
