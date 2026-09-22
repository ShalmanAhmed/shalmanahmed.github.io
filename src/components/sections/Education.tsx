import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { education, educationMeta } from "@/data/career";

/**
 * 05 — EDUCATION. Editorial vertical timeline (hairline rail, amber nodes).
 * Exact GPAs, years and the expected completion date are shown as provided.
 */
export default function Education() {
  return (
    <SectionShell
      id="education"
      number="05"
      label="Education"
      heading="Foundations, in progress."
      className="py-14 sm:py-20"
    >
      <ol className="relative mt-10 space-y-12 border-l border-hairline pl-8 sm:mt-14 sm:pl-12">
        {education.map((item, index) => (
          <li key={item.id} className="relative">
            <Reveal delay={index * 0.08}>
              <span
                aria-hidden
                className="absolute -left-[37px] top-2 size-2.5 rounded-full bg-accent ring-4 ring-accent/15 sm:-left-[53px]"
              />
              <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                <div>
                  <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                    {item.degree}
                  </h3>
                  <p className="mt-1.5 text-muted-foreground">
                    {item.institution}
                  </p>
                </div>
                {item.current ? (
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent-soft px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-accent-deep dark:text-accent">
                    <span
                      aria-hidden
                      className="size-1.5 rounded-full bg-accent"
                    />
                    In progress
                  </span>
                ) : (
                  item.year && (
                    <span className="label-mono pt-1.5 text-muted-foreground">
                      {item.year}
                    </span>
                  )
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-2.5">
                {item.detail && (
                  <span className="text-sm text-ink-soft">{item.detail}</span>
                )}
                {item.current && (
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Expected completion — {educationMeta.bscExpectedCompletion}
                  </span>
                )}
                {item.resultLabel && item.result && (
                  <span className="flex items-baseline gap-2.5">
                    <span className="label-mono text-muted-foreground">
                      {item.resultLabel}
                    </span>
                    <span className="font-display text-xl text-ink">
                      {item.result}
                    </span>
                  </span>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
