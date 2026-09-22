import { ArrowUpRight, Trophy } from "lucide-react";
import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { GlassChip } from "@/components/shared/LiquidButton";
import { achievements } from "@/data/career";

/**
 * ACHIEVEMENTS — honest, minimal band. Only verified achievements are
 * rendered; certificates (empty) are intentionally never shown.
 */
export default function Achievements() {
  return (
    <SectionShell
      id="achievements"
      label="Achievements"
      heading="Small, but real."
      className="py-14 sm:py-20"
    >
      <div className="mt-10 space-y-5 sm:mt-14">
        {achievements.map((achievement, index) => (
          <Reveal key={achievement.id} delay={index * 0.06}>
            <article className="flex flex-col gap-6 rounded-2xl border border-hairline bg-surface/60 p-7 sm:flex-row sm:items-center sm:p-8">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                <Trophy className="size-6 text-accent" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="label-mono text-muted-foreground">
                  {achievement.source}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-snug sm:text-3xl">
                  {achievement.title}
                </h3>
              </div>
              {achievement.url && (
                <GlassChip
                  href={achievement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start font-mono text-[0.66rem] uppercase tracking-[0.18em] sm:self-center"
                >
                  View on {achievement.source}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </GlassChip>
              )}
            </article>
          </Reveal>
        ))}
        <Reveal delay={0.12}>
          <p className="label-mono text-muted-foreground">
            Only verified achievements are shown.
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
