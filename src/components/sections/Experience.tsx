import { FlaskConical } from "lucide-react";
import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { experience, research } from "@/data/career";

/**
 * 04 — EXPERIENCE. Single editorial timeline entry (no dates — none were
 * provided), plus a truthfully framed "Research Work" sub-block.
 */
export default function Experience() {
  return (
    <SectionShell
      id="experience"
      number="04"
      label="Experience"
      heading="Where I&rsquo;m learning the craft."
      className="py-14 sm:py-20"
    >
      <div className="mt-10 sm:mt-14">
        {/* Timeline entry */}
        <Reveal>
          <ol className="space-y-2">
            {experience.map((item) => (
              <li key={item.id} className="relative pl-8 sm:pl-10">
                <span
                  aria-hidden
                  className="absolute left-0 top-2 size-2.5 rounded-full bg-accent ring-4 ring-accent/15"
                />
                <p className="label-mono text-accent-deep dark:text-accent">{item.field}</p>
                <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                  {item.role}
                </h3>
                <p className="mt-2.5 text-lg text-muted-foreground">
                  {item.company}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Research Work — framed honestly as work in progress */}
        <Reveal delay={0.1}>
          <div className="mt-14 border-t border-hairline pt-10 sm:mt-16">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full border border-hairline bg-surface/70">
                <FlaskConical className="size-4 text-accent" aria-hidden />
              </span>
              <span className="label-mono text-muted-foreground">
                {research.label}
              </span>
            </div>
            <h3 className="mt-5 max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
              {research.title}
            </h3>
            <p className="mt-4 text-sm italic text-muted-foreground">
              Ongoing work — presented here as research in progress.
            </p>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
