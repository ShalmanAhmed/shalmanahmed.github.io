"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/components/shared/hooks";
import { animationConfig } from "@/config/animation";

type Phase = "hold" | "exit" | "done";

/**
 * SignatureIntro — the site opens on a HANDWRITTEN SIGNATURE being drawn,
 * not on typed text. "Shalman" is rendered as flowing SVG vector strokes
 * (one continuous mark + a final flourish) animated like a pen signing
 * the page — "Shalman has just signed this portfolio."
 *
 * Identity rule: the signature is the visual identity element only. The
 * professional name SHALMAN AHMED NIZUM appears beneath it in normal
 * typography (and everywhere else on the site). "BLACK HOLE" is only a
 * private alias and never appears here.
 *
 * Timeline (animationConfig — total = 2000ms):
 *   0–150      ink frame settles, pen touches down
 *   150–1000   main strokes are drawn (one continuous handwritten mark)
 *   1000–1400  final flourish completes
 *   1400–1700  signature held clearly visible
 *   1700–2000  smooth fade into the already-rendered hero
 *
 * It is NOT a loading screen: nothing is awaited, resources load in
 * parallel. Skipped entirely for prefers-reduced-motion. Body scroll is
 * locked only while the overlay is up.
 *
 * Debug conveniences (no visual impact normally):
 *   /?intro=off   → skip the intro entirely
 *   /?intro=still → hold the finished signature (for visual inspection)
 */

/* ── The signature ─────────────────────────────────────────────────────────
 * Hand-drawn single-stroke "Shalman" cursive, one continuous path:
 * S → h → a → l → m → a → n → exit tail. A second short path adds the
 * classic signature flourish underneath (the only "pen lift").
 * The group is sheared ~6° so the word leans naturally to the right. */
const SIGNATURE_NAME =
  "M 154 78 " +
  "C 138 60 106 62 92 86 " + // S — top arc
  "C 80 106 84 128 104 146 " + // S — left side into the diagonal
  "C 122 162 144 172 150 190 " + // S — lower bowl
  "C 153 202 147 211 136 212 " + // S — round the bottom
  "C 130 213 130 208 138 202 " + // S — pen turn at the exit
  "C 146 196 158 194 172 198 " + // connector to h
  "C 182 190 190 150 195 112 " + // h — upstroke
  "C 197 96 198 86 198 80 " + // h — reach the ascender
  "C 200 112 200 165 198 202 " + // h — downstroke
  "C 200 184 208 154 222 148 " + // h — arch
  "C 236 143 243 163 243 192 " + // h — arch down
  "C 243 200 247 203 253 196 " + // h — exit
  "C 259 188 264 168 270 154 " + // a — entry rise
  "C 263 146 252 148 247 160 " + // a — over the top
  "C 243 172 244 188 251 197 " + // a — left side
  "C 257 204 267 204 272 197 " + // a — bottom
  "C 277 190 280 174 280 162 " + // a — right side up
  "C 280 154 278 150 276 147 " + // a — close at the waist
  "C 274 162 274 184 274 199 " + // a — downstroke
  "C 275 205 280 205 286 193 " + // a — exit
  "C 296 176 308 122 314 90 " + // l — upstroke
  "C 317 79 324 81 323 95 " + // l — narrow loop at the top
  "C 319 132 314 172 314 200 " + // l — down
  "C 315 207 320 207 326 194 " + // l — exit
  "C 332 185 338 164 344 151 " + // m — entry
  "C 346 166 346 186 346 201 " + // m — first stem
  "C 348 184 356 153 370 147 " + // m — arch one
  "C 384 142 390 163 390 194 " + // m — arch one down
  "C 392 178 400 150 414 145 " + // m — arch two
  "C 428 141 434 162 434 192 " + // m — arch two down
  "C 435 200 440 202 446 191 " + // m — exit
  "C 452 183 458 164 464 151 " + // a — entry rise
  "C 457 143 446 145 441 157 " + // a — over the top
  "C 437 169 438 185 445 194 " + // a — left side
  "C 451 201 461 201 466 194 " + // a — bottom
  "C 471 187 474 171 474 159 " + // a — right side up
  "C 474 151 472 147 470 144 " + // a — close at the waist
  "C 468 159 468 181 468 196 " + // a — downstroke
  "C 469 202 474 202 480 190 " + // a — exit
  "C 486 181 492 160 498 147 " + // n — entry
  "C 500 162 500 182 500 199 " + // n — stem
  "C 502 182 510 151 524 145 " + // n — arch
  "C 538 140 544 161 544 190 " + // n — arch down
  "C 546 199 554 207 570 212 " + // exit tail sweeps out
  "C 594 218 628 218 656 208 " +
  "C 670 203 678 195 682 186"; // tail tapers upward

const SIGNATURE_FLOURISH =
  "M 176 248 " +
  "C 300 266 452 264 578 240 " + // long underline swash
  "C 596 236 610 229 618 218"; // small terminal hook

export default function SignatureIntro() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("hold");
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new CustomEvent("portfolio:loaded"));
      return;
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get("intro") === "off") {
      // debug: skip the intro entirely — deferred so the effect body stays
      // synchronous-free (no cascading render inside the effect).
      const raf = window.requestAnimationFrame(() => setPhase("done"));
      window.dispatchEvent(new CustomEvent("portfolio:loaded"));
      return () => window.cancelAnimationFrame(raf);
    }
    const still = params.get("intro") === "still";

    const timers = timersRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // scroll locked while the overlay is up

    if (still) return; // hold the finished signature — no exit timers

    const { signatureIntroDuration, signatureExitStart } = animationConfig;

    timers.push(
      window.setTimeout(() => setPhase("exit"), signatureExitStart),
      window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        window.dispatchEvent(new CustomEvent("portfolio:loaded"));
        setPhase("done"); // → removed from the DOM, scroll never blocked again
      }, signatureIntroDuration)
    );

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (reducedMotion || phase === "done") return null;

  const exiting = phase === "exit";
  const { signatureDrawDelay, signatureDrawDuration, signatureFlourishDelay, signatureFlourishDuration, signatureSubtextDelay, signatureExitDuration } =
    animationConfig;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden motion-reduce:hidden"
      style={{ background: "var(--background)" }}
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: signatureExitDuration / 1000, ease: "easeInOut" }}
    >
      {/* static, barely-there vignette so the ink frame has quiet depth */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(62% 52% at 50% 44%, color-mix(in oklab, var(--surface) 60%, transparent) 0%, transparent 74%)",
        }}
      />

      <motion.div
        className="relative flex flex-col items-center px-6"
        animate={
          exiting
            ? { opacity: 0, y: -8, filter: "blur(4px)" }
            : { opacity: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{
          duration: signatureExitDuration / 1000,
          ease: "easeIn",
        }}
      >
        {/* ── The handwritten signature ── */}
        <svg
          viewBox="30 30 690 264"
          className="h-auto w-[min(80vw,580px)]"
          role="img"
          aria-label="Shalman — handwritten signature"
          style={{ filter: "drop-shadow(0 2px 8px rgba(41,42,44,0.10))" }}
        >
          <g
            transform="skewX(-6)"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* soft ink bleed halo (drawn in sync, slightly wider + blurred) */}
            <motion.path
              d={SIGNATURE_NAME}
              stroke="var(--signature-ink)"
              strokeWidth={11}
              opacity={0.14}
              style={{ filter: "blur(2px)" }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: signatureDrawDelay / 1000,
                duration: signatureDrawDuration / 1000,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
            {/* the main signature stroke */}
            <motion.path
              d={SIGNATURE_NAME}
              stroke="var(--signature-ink)"
              strokeWidth={6.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                delay: signatureDrawDelay / 1000,
                duration: signatureDrawDuration / 1000,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
            {/* ink halo for the flourish */}
            <motion.path
              d={SIGNATURE_FLOURISH}
              stroke="var(--accent)"
              strokeWidth={10}
              style={{ filter: "blur(2px)" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.12 }}
              transition={{
                pathLength: {
                  delay: signatureFlourishDelay / 1000,
                  duration: signatureFlourishDuration / 1000,
                  ease: "easeOut",
                },
                opacity: { delay: signatureFlourishDelay / 1000, duration: 0.03 },
              }}
            />
            {/* the flourish — a refined terminal swash in the accent ink */}
            <motion.path
              d={SIGNATURE_FLOURISH}
              stroke="var(--accent)"
              strokeWidth={5.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  delay: signatureFlourishDelay / 1000,
                  duration: signatureFlourishDuration / 1000,
                  ease: "easeOut",
                },
                opacity: { delay: signatureFlourishDelay / 1000, duration: 0.03 },
              }}
            />
          </g>
        </svg>

        {/* hairline + professional name — small, minimal, normal typography */}
        <motion.span
          className="mt-7 block h-px w-16 origin-center bg-border sm:w-20"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={exiting ? { opacity: 0 } : { scaleX: 1, opacity: 1 }}
          transition={{
            duration: 0.35,
            delay: (signatureSubtextDelay - 50) / 1000,
            ease: "easeOut",
          }}
        />
        <motion.p
          className="label-mono mt-5 text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={exiting ? { opacity: 0 } : { opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: signatureSubtextDelay / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          SHALMAN AHMED NIZUM
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
