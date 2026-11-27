import { steps, stepsNote } from "@/content/steps";

export function StepsTimeline({ showNote = true }: { showNote?: boolean }) {
  return (
    <>
      <ol className="grid gap-px border-y border-basalto/15 md:grid-cols-3 md:gap-0">
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="border-t border-basalto/15 py-8 first:border-t-0 md:border-t-0 md:border-l md:px-8 md:[&:nth-child(3n+1)]:border-l-0 md:[&:nth-child(3n+1)]:pl-0 md:[&:nth-child(n+4)]:border-t"
          >
            <span
              className="t-expanded block text-4xl font-medium text-agua-profunda"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="t-h3 mt-4 text-floresta">{s.title}</h3>
            <p className="mt-2">{s.text}</p>
          </li>
        ))}
      </ol>
      {showNote ? <p className="mt-8 text-agua-profunda">{stepsNote}</p> : null}
    </>
  );
}
