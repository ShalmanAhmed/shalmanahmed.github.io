"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/components/shared/hooks";
import { profile } from "@/data/profile";

type Phase = "alias" | "name" | "exit" | "done";

/* Timeline (ms) — total ≈ 1.65s */
const ALIAS_TO_NAME = 800;
const EXIT_START = 1300;
const DONE = 1650;

/**
 * Cinematic intro (~1.6s):
 *   BLACK HOLE (mono, absorbing ring around a dark core)
 *   → crossfade → SHALMAN AHMED (display serif)
 *   → overlay fades away and is removed from the DOM.
 *
 * Skipped entirely for prefers-reduced-motion users (renders nothing,
 * announces "portfolio:loaded" immediately). Body scroll is locked only
 * while the overlay is up; a "portfolio:loaded" window event fires on finish.
 */
export default function LoadingSequence() {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("alias");
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    // Reduced motion: no intro at all — announce readiness right away.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new CustomEvent("portfolio:loaded"));
      return;
    }

    const timers = timersRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // scroll locked while the overlay is up

    const at = (ms: number, run: () => void) => {
      timers.push(window.setTimeout(run, ms));
    };

    at(ALIAS_TO_NAME, () => setPhase("name"));
    at(EXIT_START, () => setPhase("exit"));
    at(DONE, () => {
      document.body.style.overflow = previousOverflow;
      window.dispatchEvent(new CustomEvent("portfolio:loaded"));
      setPhase("done"); // → removed from the DOM, scroll never blocked again
    });

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      timers.length = 0;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (reducedMotion || phase === "done") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background motion-reduce:hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
    >
      <AnimatePresence>
        {phase === "alias" ? (
          <motion.div
            key="alias"
            className="absolute inset-0 flex flex-col items-center justify-center gap-9"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeIn" } }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {/* Black-hole mark: dark core with a ring being absorbed inward */}
            <span className="relative flex h-16 w-16 items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full border border-accent/60"
                animate={{ scale: [1, 0.4], opacity: [0.85, 0] }}
                transition={{ duration: 1.05, repeat: Infinity, ease: "easeIn" }}
              />
              <motion.span
                className="h-7 w-7 rounded-full bg-black shadow-[0_0_30px_-6px_var(--accent)]"
                animate={{ scale: [1, 0.92, 1] }}
                transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <p className="-mr-[0.55em] font-mono text-xs uppercase tracking-[0.55em] text-foreground/80 md:text-sm">
              {profile.alias}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="name"
            className="absolute inset-0 flex items-center justify-center px-6 text-center font-display text-3xl tracking-[0.04em] text-ink md:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            {profile.displayName.toUpperCase()}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
