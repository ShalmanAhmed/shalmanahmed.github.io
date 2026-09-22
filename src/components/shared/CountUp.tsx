"use client";

import { useEffect, useRef, useState } from "react";
import { animationConfig } from "@/config/animation";
import { useReducedMotion } from "./hooks";

interface CountUpProps {
  /** Final (real, configured) value — the animation always ends exactly here. */
  to: number;
  /** ms — animation duration. Defaults to the big-number count duration. */
  duration?: number;
  /** Zero-pad width, e.g. pad={2} → "01". */
  pad?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Accessible label — defaults to the final value so screen readers never hear the count. */
  ariaLabel?: string;
}

/**
 * CountUp — animates 0 → `to` once, when the element enters the viewport.
 * - IntersectionObserver-triggered, rAF-driven, eased.
 * - Final displayed value is ALWAYS the real configured value (no random, no loops).
 * - prefers-reduced-motion: the final value renders immediately, no counting.
 */
export function CountUp({
  to,
  duration = animationConfig.countUpDuration,
  pad,
  prefix = "",
  suffix = "",
  className,
  ariaLabel,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);
  const [value, setValue] = useState(0);
  const reducedMotion = useReducedMotion();

  /* Start once, when visible. setState inside the IO callback is async — safe. */
  useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setStarted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  /* The actual count. */
  useEffect(() => {
    if (!started || reducedMotion) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, duration, to, reducedMotion]);

  const display = reducedMotion ? to : value;
  const text = `${prefix}${
    pad ? String(display).padStart(pad, "0") : String(display)
  }${suffix}`;

  return (
    <span ref={ref} className={className} aria-label={ariaLabel ?? `${prefix}${to}${suffix}`}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
