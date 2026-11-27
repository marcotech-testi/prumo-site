/** Verifica o contraste WCAG dos pares de texto aprovados no docs/01. */
const colors = {
  floresta: "#1E3227",
  pedra: "#E9E6DF",
  papel: "#F4F2EE",
  basalto: "#191B19",
  agua: "#8FA6B2",
  aguaProfunda: "#3E5A68",
} as const;

type Name = keyof typeof colors;

const approvedPairs: [text: Name, bg: Name][] = [
  ["pedra", "floresta"],
  ["papel", "floresta"],
  ["basalto", "pedra"],
  ["basalto", "papel"],
  ["agua", "floresta"],
  ["aguaProfunda", "pedra"],
  ["aguaProfunda", "papel"],
  ["floresta", "pedra"],
  ["floresta", "papel"],
];

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

let failed = false;
for (const [text, bg] of approvedPairs) {
  const ratio = contrast(colors[text], colors[bg]);
  const ok = ratio >= 4.5;
  if (!ok) failed = true;
  console.log(`${ok ? "ok  " : "FALHA"} ${text} sobre ${bg}: ${ratio.toFixed(2)}:1`);
}
if (failed) {
  console.error("Contraste abaixo de 4,5:1 em algum par aprovado.");
  process.exit(1);
}
