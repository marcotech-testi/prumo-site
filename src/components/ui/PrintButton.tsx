"use client";

/** Abre a impressão do navegador (que também salva em PDF). Some no papel. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="t-expanded mt-6 font-medium text-floresta underline underline-offset-4 print:hidden"
    >
      {label}
    </button>
  );
}
