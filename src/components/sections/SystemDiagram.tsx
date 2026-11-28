import { useId } from "react";
import { sistema } from "@/content/sistema";

/**
 * Elevação esquemática de um jardim vertical com irrigação automatizada.
 * Desenho técnico nas cores da marca (não é foto nem render). Os números do desenho
 * correspondem à legenda em HTML, que é o texto acessível.
 */
const COLS = [50, 130, 210, 290];
const ROWS = [50, 135, 220, 305];
const ROW_H = 85;
const COL_W = 80;
const LEAF = "M0,-13 C7,-6 7,6 0,13 C-7,6 -7,-6 0,-13 Z";
const LEAF_SET = [
  [-38, 1.15, -14, 6],
  [8, 1.35, 2, -4],
  [52, 1.05, 16, 8],
  [-70, 0.85, -4, 22],
  [80, 0.9, 10, 24],
] as const;

function Marker({ n, x, y }: { n: number; x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="11" fill="var(--color-pedra)" stroke="var(--color-floresta)" strokeWidth="1.5" />
      <text
        y="0.5"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="11"
        fontWeight="600"
        fill="var(--color-floresta)"
        style={{ fontStretch: "125%" }}
      >
        {n}
      </text>
    </g>
  );
}

export function SystemDiagram({ className = "" }: { className?: string }) {
  const titleId = useId();
  const legendId = useId();
  const arrowId = `seta-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <figure className={className} aria-labelledby={titleId}>
      <svg
        viewBox="0 0 560 460"
        role="img"
        aria-labelledby={titleId}
        aria-describedby={legendId}
        className="h-auto w-full"
      >
        <title id={titleId}>{sistema.title}</title>

        {/* Parede */}
        <rect x="20" y="20" width="390" height="425" fill="var(--color-papel)" />
        <path
          d="M20 20 V445 M20 445 H410"
          stroke="var(--color-basalto)"
          strokeOpacity="0.25"
          strokeWidth="1"
          fill="none"
        />

        {/* Módulos com as plantas */}
        {ROWS.map((ry, r) =>
          COLS.map((cx, c) => {
            const i = r * 4 + c;
            const leaves = LEAF_SET.slice(0, 3 + (i % 3));
            return (
              <g key={`${r}-${c}`}>
                <rect
                  x={cx + 3}
                  y={ry + 16}
                  width={COL_W - 6}
                  height={ROW_H - 19}
                  rx="2"
                  fill="var(--color-pedra)"
                  stroke="var(--color-floresta)"
                  strokeOpacity="0.35"
                />
                <g transform={`translate(${cx + COL_W / 2} ${ry + 46})`}>
                  {leaves.map(([rot, sc, dx, dy], k) => (
                    <path
                      key={k}
                      d={LEAF}
                      fill="var(--color-floresta)"
                      fillOpacity={0.55 + ((i + k) % 4) * 0.15}
                      transform={`translate(${dx} ${dy}) rotate(${rot + (i % 2) * 14}) scale(${sc})`}
                    />
                  ))}
                </g>
              </g>
            );
          }),
        )}

        {/* Estrutura */}
        <rect
          x="50"
          y="50"
          width="320"
          height="340"
          fill="none"
          stroke="var(--color-floresta)"
          strokeWidth="2.5"
        />
        {ROWS.slice(1).map((ry) => (
          <line
            key={ry}
            x1="50"
            x2="370"
            y1={ry}
            y2={ry}
            stroke="var(--color-floresta)"
            strokeWidth="1.25"
          />
        ))}

        {/* Linhas de gotejamento + gotejadores */}
        {ROWS.map((ry) => (
          <g key={ry}>
            <line
              x1="50"
              x2="385"
              y1={ry + 9}
              y2={ry + 9}
              stroke="var(--color-agua-profunda)"
              strokeWidth="2"
            />
            <line
              className="flow"
              x1="385"
              x2="50"
              y1={ry + 9}
              y2={ry + 9}
              stroke="var(--color-pedra)"
              strokeWidth="1"
              strokeDasharray="4 10"
            />
            {COLS.flatMap((cx) => [cx + 20, cx + 60]).map((dx) => (
              <circle key={dx} cx={dx} cy={ry + 9} r="2.6" fill="var(--color-agua-profunda)" />
            ))}
          </g>
        ))}

        {/* Coluna de alimentação */}
        <path
          d="M385 59 V320 H430"
          stroke="var(--color-agua-profunda)"
          strokeWidth="3"
          fill="none"
        />
        <path
          className="flow"
          d="M430 320 H385 V59"
          stroke="var(--color-pedra)"
          strokeWidth="1"
          strokeDasharray="4 10"
          fill="none"
        />

        {/* Controlador programável */}
        <rect x="430" y="292" width="72" height="50" rx="3" fill="var(--color-floresta)" />
        <rect x="440" y="302" width="34" height="14" rx="1" fill="var(--color-agua)" />
        <circle cx="488" cy="309" r="4" fill="var(--color-pedra)" />
        <path d="M440 328 H492" stroke="var(--color-pedra)" strokeOpacity="0.5" />

        {/* Filtro e controle de pressão */}
        <path d="M466 342 V372" stroke="var(--color-agua-profunda)" strokeWidth="3" />
        <rect
          x="455"
          y="372"
          width="22"
          height="32"
          rx="3"
          fill="var(--color-pedra)"
          stroke="var(--color-floresta)"
          strokeWidth="1.5"
        />
        <path d="M459 382 H473 M459 388 H473 M459 394 H473" stroke="var(--color-floresta)" />

        {/* Ponto de água */}
        <path
          d="M466 404 V425 H520"
          stroke="var(--color-agua-profunda)"
          strokeWidth="3"
          fill="none"
        />
        <rect x="518" y="415" width="14" height="20" rx="2" fill="var(--color-floresta)" />
        <path d="M525 415 V406 H538" stroke="var(--color-floresta)" strokeWidth="3" fill="none" />

        {/* Drenagem */}
        <path
          d="M50 398 H370 V410 H50 Z"
          fill="var(--color-pedra)"
          stroke="var(--color-floresta)"
          strokeWidth="1.5"
        />
        <path d="M62 410 V445" stroke="var(--color-floresta)" strokeWidth="3" />
        <path
          d="M330 404 L90 404"
          stroke="var(--color-agua-profunda)"
          strokeWidth="1"
          strokeDasharray="3 5"
          markerEnd={`url(#${arrowId}-seta)`}
        />
        <defs>
          <marker
            id={`${arrowId}-seta`}
            viewBox="0 0 6 6"
            refX="3"
            refY="3"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0 0 L6 3 L0 6 Z" fill="var(--color-agua-profunda)" />
          </marker>
        </defs>

        <Marker n={1} x={50} y={262} />
        <Marker n={2} x={250} y={177} />
        <Marker n={3} x={330} y={59} />
        <Marker n={4} x={502} y={292} />
        <Marker n={5} x={492} y={388} />
        <Marker n={6} x={545} y={425} />
        <Marker n={7} x={210} y={404} />
      </svg>

      <ol
        id={legendId}
        className="mt-6 grid gap-x-8 border-t border-basalto/15 text-[0.9375rem] sm:grid-cols-2"
      >
        {sistema.parts.map((p) => (
          <li key={p.n} className="flex gap-4 border-b border-basalto/15 py-2.5">
            <span className="t-expanded w-4 shrink-0 font-medium text-agua-profunda">{p.n}</span>
            <span>{p.label}</span>
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 max-w-prose text-sm text-agua-profunda">
        {sistema.caption}
      </figcaption>
    </figure>
  );
}
