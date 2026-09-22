"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { animationConfig } from "@/config/animation";
import { motivationSteps } from "@/data/career";
import { useReducedMotion } from "@/components/shared/hooks";

/**
 * ScrollStory — COMPACT, premium motivation storytelling with a cinematic
 * WORD-BY-WORD reveal.
 * (Same file, same default export, so page.tsx stays untouched.)
 *
 * When the block enters the viewport (framer-motion whileInView, fired
 * ONCE per page visit — scrolling back and forth never replays it), a
 * directed sequence plays — fast-human-typing feel, editorial timing:
 *
 *   0.00s  MY MOTIVATION                      (label, rise + blur-to-sharp)
 *   0.14s  DISCIPLINE · CONSISTENCY · …       (descriptor line)
 *   0.28s  BUILD. → FAIL. → LEARN. → REPEAT.  (each word: opacity 0→1, rise,
 *          blur 8px→sharp, scale 0.98→1, staggered 110ms — the full
 *          statement is on screen by ≈1.1s, well inside the 1.5–2s budget)
 *   1.37s  — and KEEP MOVING FORWARD.         (softer word tokens, delayed
 *          after the statement; the continuous underline fades in with the
 *          phrase and stays intact)
 *   2.20s  — SHALMAN AHMED NIZUM              (attribution)
 *
 * Afterwards the section is completely static: no loops, no floating text,
 * nothing hides again. No terminal cursor is ever rendered — words simply
 * arrive, each feeling physically placed onto the page.
 *
 * Only the APPEARANCE is animated: typography (serif display, weights,
 * sizes, colors, the underline) and layout are exactly as before.
 *
 * prefers-reduced-motion renders the identical composition fully visible
 * immediately — no animation machinery is attached at all.
 */

/** Signature ease shared with the rest of the site's reveal language. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** DISCIPLINE · CONSISTENCY · LEARNING · PROBLEM SOLVING */
const PRINCIPLES = motivationSteps.slice(0, 4);

/** BUILD · FAIL · LEARN · REPEAT — the emotional core. */
const STATEMENT = motivationSteps.slice(4, 8);

/** BUILD and LEARN carry the subtle accent emphasis; FAIL/REPEAT stay ink. */
const ACCENTED = new Set(["BUILD", "LEARN"]);

/** The closing promise — motivationSteps[8]: "KEEP MOVING FORWARD". */
const FORWARD = motivationSteps[8];
const FORWARD_WORDS = FORWARD.split(" ");

/* ── Reveal schedule (seconds after the section becomes visible) ────────── */
const PRINCIPLES_DELAY = 0.14;
const STATEMENT_DELAY = animationConfig.motivationStatementDelay;
/* The statement finishes with its last word: */
const STATEMENT_END =
  STATEMENT_DELAY +
  (STATEMENT.length - 1) * animationConfig.motivationWordStagger +
  animationConfig.motivationWordDuration;
/* …then a short beat of silence before the softer closing line: */
const FORWARD_DELAY = STATEMENT_END + animationConfig.motivationForwardGap;
/* Closing tokens: — and [KEEP MOVING FORWARD] . */
const UNDERLINE_DELAY = FORWARD_DELAY + 2 * animationConfig.motivationTokenStagger;
const PERIOD_DELAY = FORWARD_DELAY + 5 * animationConfig.motivationTokenStagger;
const ATTRIBUTION_DELAY = FORWARD_DELAY + 0.83;

/** Classic site reveal — label, descriptor line and attribution. */
const lineAt = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: animationConfig.motivationRevealDuration,
      ease: EASE,
      delay,
    },
  },
});

/** Statement word — the full cinematic combination (§10): opacity, rise,
    blur-to-sharp and a tiny scale, staggered per word. */
const statementWordAt = (i: number): Variants => ({
  hidden: { opacity: 0, y: 14, scale: 0.98, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: animationConfig.motivationWordDuration,
      ease: EASE,
      delay: STATEMENT_DELAY + i * animationConfig.motivationWordStagger,
    },
  },
});

/** Softer closing token — gentler than the statement (no scale). */
const softTokenAt = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE, delay },
  },
});

/** Rise + sharpen only — opacity is carried by the fading underline wrapper
    so the continuous border stays intact while each word arrives. */
const riseAt = (delay: number): Variants => ({
  hidden: { y: 8, filter: "blur(4px)" },
  visible: {
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE, delay },
  },
});

export default function ScrollStory() {
  const reduced = useReducedMotion();

  /* Reduced motion: same markup, zero animation — every element is simply
     visible. `undefined` variants + `initial={false}` mean no hidden state
     is ever applied and framer attaches no animation. */
  const v = (variants: Variants) => (reduced ? undefined : variants);

  return (
    <section aria-labelledby="motivation-heading" className="relative">
      <h2 id="motivation-heading" className="sr-only">
        Motivation — how I work
      </h2>

      {/* Screen-reader canon: the exact motivationSteps, in order */}
      <ul className="sr-only">
        {motivationSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>

      <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="relative">
          {/* The single decorative element — a hairline accent line fading
              downward into the page background. Static by design. */}
          <span
            aria-hidden
            className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-accent via-accent/45 to-transparent"
          />

          <motion.div
            className="pl-6 sm:pl-10"
            variants={reduced ? undefined : { hidden: {}, visible: {} }}
            initial={reduced ? false : "hidden"}
            whileInView={reduced ? undefined : "visible"}
            viewport={reduced ? undefined : { once: true, amount: 0.3 }}
          >
            {/* Overline — appears first */}
            <motion.p
              variants={v(lineAt(0))}
              className="label-mono text-accent-deep dark:text-accent"
            >
              MY MOTIVATION
            </motion.p>

            {/* Principles — then the small descriptor line */}
            <motion.p
              variants={v(lineAt(PRINCIPLES_DELAY))}
              className="label-mono mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground"
            >
              {PRINCIPLES.map((word, i) => (
                <span key={word} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-faint">
                      ·
                    </span>
                  )}
                  {word}
                </span>
              ))}
            </motion.p>

            {/* Statement — word-by-word cinematic reveal: each word rises,
                sharpens and settles in fast succession (≈150 WPM feeling). */}
            <motion.p
              className="mt-8 font-display text-[clamp(2.2rem,6.2vw,4.5rem)] font-semibold leading-[1.06] tracking-tight text-balance text-ink sm:mt-10"
            >
              {STATEMENT.map((word, i) => (
                <Fragment key={word}>
                  <motion.span
                    variants={v(statementWordAt(i))}
                    className="inline-block"
                  >
                    <span
                      className={
                        ACCENTED.has(word)
                          ? "text-accent-deep dark:text-accent"
                          : undefined
                      }
                    >
                      {word}
                    </span>
                    {"."}
                  </motion.span>
                  {i < STATEMENT.length - 1 ? " " : null}
                </Fragment>
              ))}
            </motion.p>

            {/* Closing line — slightly delayed, softer than the headline.
                The underlined phrase keeps ONE continuous border while its
                words rise into it. */}
            <motion.p
              className="mt-6 text-[clamp(1.05rem,2.2vw,1.375rem)] leading-relaxed text-muted-foreground sm:mt-8"
            >
              <motion.span
                variants={v(softTokenAt(FORWARD_DELAY))}
                className="inline-block"
              >
                —
              </motion.span>{" "}
              <motion.span
                variants={v(
                  softTokenAt(FORWARD_DELAY + animationConfig.motivationTokenStagger)
                )}
                className="inline-block"
              >
                and
              </motion.span>{" "}
              <motion.span
                variants={v(softTokenAt(UNDERLINE_DELAY))}
                className="inline-block border-b border-accent-gold pb-0.5 font-medium text-ink"
              >
                {FORWARD_WORDS.map((word, i) => (
                  <Fragment key={word}>
                    <motion.span
                      variants={v(
                        riseAt(UNDERLINE_DELAY + i * animationConfig.motivationTokenStagger)
                      )}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                    {i < FORWARD_WORDS.length - 1 ? " " : null}
                  </Fragment>
                ))}
              </motion.span>
              <motion.span
                variants={v(softTokenAt(PERIOD_DELAY))}
                className="inline-block"
              >
                .
              </motion.span>
            </motion.p>

            {/* Attribution — the final beat of the sequence */}
            <motion.p
              variants={v(lineAt(ATTRIBUTION_DELAY))}
              className="label-mono mt-10 text-faint sm:mt-12"
            >
              — SHALMAN AHMED NIZUM
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
