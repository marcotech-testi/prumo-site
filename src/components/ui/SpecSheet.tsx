export type SpecRow = { label: string; value: string };

/** Ficha técnica: rótulo em eyebrow, valor em Basalto, linhas finas. */
export function SpecSheet({ rows, caption }: { rows: SpecRow[]; caption?: string }) {
  return (
    <table className="w-full border-collapse text-left">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-t border-basalto/15 last:border-b">
            <th scope="row" className="t-eyebrow w-2/5 py-4 pr-6 align-top text-agua-profunda">
              {row.label}
            </th>
            <td className="py-4 align-top text-basalto">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Lista de itens no estilo ficha técnica (uma linha por item, numerada). */
export function SpecList({ items }: { items: string[] }) {
  return (
    <ol className="border-b border-basalto/15">
      {items.map((item, i) => (
        <li key={item} className="flex gap-6 border-t border-basalto/15 py-4">
          <span className="t-eyebrow w-8 shrink-0 pt-1 text-agua-profunda" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
