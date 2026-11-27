export function Features({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ul
      className={`grid gap-px border-y border-basalto/15 ${items.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
    >
      {items.map((it) => (
        <li
          key={it.title}
          className="border-t border-basalto/15 py-8 first:border-t-0 md:border-t-0 md:pr-8"
        >
          <h3 className="t-h3 text-floresta">{it.title}</h3>
          <p className="mt-3 max-w-md">{it.text}</p>
        </li>
      ))}
    </ul>
  );
}
