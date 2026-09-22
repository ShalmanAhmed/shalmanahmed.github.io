"use client";

import { ArrowUpRight } from "lucide-react";
import { LiquidButton } from "@/components/shared/LiquidButton";
import { Reveal } from "@/components/shared/SectionShell";
import { CountUp } from "@/components/shared/CountUp";
import { animationConfig } from "@/config/animation";
import { profile } from "@/data/profile";

const AMBER_PREFIX = "200+";

/**
 * COMPETITIVE PROGRAMMING — a distinct editorial band (not in the nav).
 * Typography + whitespace only: one soft corner gradient wash, a giant
 * counting "200+", a mono handle chip, hairline-separated practice rows
 * and a single CTA. No decorative objects — every claim stays the
 * verified "200+ Programming Problems Solved" figure from the data layer.
 */
export default function Codeforces() {
  const { codeforces } = profile;
  const hasAmberPrefix = codeforces.headline.startsWith(AMBER_PREFIX);
  const restOfHeadline = hasAmberPrefix
    ? codeforces.headline.slice(AMBER_PREFIX.length)
    : codeforces.headline;

  const openProfile = () =>
    window.open(codeforces.profileUrl, "_blank", "noopener,noreferrer");

  return (
    <section
      id="codeforces"
      aria-label="Competitive programming"
      className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-secondary/60 p-8 sm:p-12 lg:p-16">
          {/* One soft, static token-based gradient wash — nothing animated */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(62% 85% at 100% 0%, var(--accent-soft) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-3xl">
            {/* Mono amber label with a short rule */}
            <div className="flex items-center gap-4">
              <p className="label-mono text-accent-deep dark:text-accent">Competitive programming</p>
              <span aria-hidden className="h-px w-10 bg-accent/40" />
            </div>

            {/* Headline — "200+" as a giant counting number, wording preserved */}
            <h2 className="mt-8 font-display font-semibold leading-[1.05] tracking-tight text-ink">
              {hasAmberPrefix ? (
                <>
                  <CountUp
                    to={200}
                    suffix="+"
                    duration={animationConfig.countUpDuration}
                    className="block text-7xl text-accent sm:text-8xl"
                  />
                  <span className="mt-3 block text-3xl sm:text-4xl lg:text-[2.75rem]">
                    {restOfHeadline}
                  </span>
                </>
              ) : (
                <span className="text-5xl sm:text-6xl">{restOfHeadline}</span>
              )}
            </h2>

            {/* Handle chip — static mono text, no circles */}
            <p className="mt-7">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-surface/70 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-muted-foreground">
                <span className="text-ink">{codeforces.handle}</span>
                <span aria-hidden className="text-accent">
                  ·
                </span>
                <span>Codeforces</span>
              </span>
            </p>

            {/* Practice points — editorial hairline-separated rows */}
            <div className="mt-10 border-b border-hairline">
              <ul
                aria-label="What competitive programming practice builds"
                className="grid gap-x-10 sm:grid-cols-2"
              >
                {codeforces.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 border-t border-hairline py-3.5"
                  >
                    <span
                      aria-hidden
                      className="size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted-foreground">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="mt-10">
              <LiquidButton
                variant="secondary"
                onClick={openProfile}
                ariaLabel={`View the Codeforces profile of ${codeforces.handle} (opens in a new tab)`}
              >
                View Codeforces profile
                <ArrowUpRight className="size-4" aria-hidden />
              </LiquidButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
