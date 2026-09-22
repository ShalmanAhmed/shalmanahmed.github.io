"use client";

import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { CountUp } from "@/components/shared/CountUp";
import { animationConfig } from "@/config/animation";
import { languageProficiency } from "@/data/skills";
import { technologies, type TechStatus } from "@/data/technologies";

/**
 * Truthful status label for a non-verified language.
 * Percentages are NEVER shown for these — only what the data actually says.
 */
const STATUS_LABEL: Record<TechStatus, string> = {
  verified: "VERIFIED",
  "project-used": "PROJECT USED",
  learning: "LEARNING",
  showcase: "SHOWCASE",
  explored: "SHOWCASE",
};

const verifiedRows = languageProficiency.verified.flatMap((entry) => {
  const tech = technologies.find((t) => t.id === entry.techId);
  if (!tech || !tech.verified) return [];
  return [{ id: tech.id, name: tech.name, level: entry.level }];
});

const additionalLanguages = technologies
  .filter((t) => t.category === "LANGUAGES" && !t.verified)
  .map((t) => ({ id: t.id, name: t.name, label: STATUS_LABEL[t.status] }));

/**
 * PROGRAMMING LANGUAGES — premium editorial panel.
 * Verified languages: animated scaleX proficiency bar + counting % (fixed,
 * self-assessed values from skills.ts — never generated).
 * Non-verified languages: mono status chips only, no bars, no percentages.
 */
export function LanguageProficiency() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Start the bar animation once, when the panel is 30% visible.
     setState inside the IO callback is async — safe for the lint rule. */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-label="Programming languages proficiency"
      className="rounded-3xl border border-hairline bg-surface p-6 sm:p-8"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <p className="label-mono text-ink">Programming languages</p>
        <div className="flex flex-col items-start gap-0.5 sm:items-end">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
            Self-assessed · Fixed values
          </span>
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-accent-deep dark:text-accent">
            Verified languages only
          </span>
        </div>
      </div>

      {/* Verified rows — animated bar + counting % */}
      <ul className="mt-8 space-y-5">
        {verifiedRows.map((row) => (
          <li
            key={row.id}
            className="grid grid-cols-[minmax(6rem,8rem)_1fr_auto] items-center gap-x-4 sm:gap-x-6"
          >
            <span className="text-sm font-medium text-ink">{row.name}</span>

            <div
              role="img"
              aria-label={`${row.name} self-assessed proficiency ${row.level} percent`}
              className="h-1.5 overflow-hidden rounded-full bg-hairline"
            >
              <div
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-accent/70 to-accent"
                style={{
                  transform: `scaleX(${visible ? row.level / 100 : 0})`,
                  transition: `transform ${animationConfig.skillCounterDuration}ms ease-out`,
                }}
              />
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <CountUp
                to={row.level}
                suffix="%"
                duration={animationConfig.skillCounterDuration}
                className="font-mono text-sm text-accent-deep dark:text-accent"
              />
              <span className="inline-flex items-center gap-1 font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted-foreground">
                <BadgeCheck
                  className="size-3.5 text-accent"
                  aria-hidden
                />
                Verified
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Additional languages — status chips only, truthfully un-quantified */}
      <div className="mt-8 border-t border-hairline pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <p className="label-mono text-muted-foreground">
            Additional languages
          </p>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted-foreground">
            Showcase / learning / project-used — not presented as verified
            skills.
          </p>
        </div>
        <ul className="mt-5 flex flex-wrap gap-2.5">
          {additionalLanguages.map((lang) => (
            <li
              key={lang.id}
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-secondary/50 px-3.5 py-1.5"
            >
              <span className="text-xs font-medium text-ink">
                {lang.name}
              </span>
              <span
                aria-hidden
                className="size-1 rounded-full bg-accent/60"
              />
              <span className="font-mono text-[0.55rem] uppercase tracking-[0.16em] text-muted-foreground">
                {lang.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
