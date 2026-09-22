"use client";

import { useEffect, useRef } from "react";
import { useIsTouchDevice, useReducedMotion } from "@/components/shared/hooks";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]';
const PROJECT_SELECTOR = '[data-cursor="project"]';

const RING_LERP = 0.16; // trailing ring easing
const SCALE_LERP = 0.22; // scale easing for both layers

const DOT_SCALE = { default: 1, hover: 0.5, project: 0 } as const;
const RING_SCALE = { default: 1, hover: 1.6, project: 2.1 } as const;

type CursorMode = keyof typeof DOT_SCALE;

/**
 * Desktop-only custom cursor: an instant amber dot plus a trailing ring
 * (requestAnimationFrame lerp). Touch devices and reduced-motion users get
 * the native cursor — the component renders nothing and never hides it.
 * Everything is transform-based (translate3d) → zero layout shifts.
 */
export default function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const enabled = !isTouch && !reducedMotion;

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const viewRef = useRef<HTMLSpanElement | null>(null);

  /* Safety net: never leave the native cursor hidden when disabled. */
  useEffect(() => {
    if (enabled) return;
    document.documentElement.classList.remove("custom-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const fill = fillRef.current;
    const view = viewRef.current;
    if (!dot || !ring || !fill || !view) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let dotScale = 1;
    let ringScale = 1;
    let targetDotScale: number = DOT_SCALE.default;
    let targetRingScale: number = RING_SCALE.default;
    let visible = false;
    let started = false;
    let raf = 0;

    const applyDot = () => {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${dotScale.toFixed(3)})`;
    };
    const applyRing = () => {
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;
    };

    const setMode = (next: CursorMode) => {
      targetDotScale = DOT_SCALE[next];
      targetRingScale = RING_SCALE[next];
      const project = next === "project";
      fill.style.opacity = project ? "1" : "0";
      view.style.opacity = project ? "1" : "0";
    };

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!started) {
        started = true;
        ringX = mouseX; // ring starts at the cursor, never flies in from a corner
        ringY = mouseY;
        applyRing();
      }
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      applyDot(); // dot follows instantly
    };

    /* Event delegation — one set of listeners for the whole document. */
    const onOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest(PROJECT_SELECTOR)) setMode("project");
      else if (target.closest(INTERACTIVE_SELECTOR)) setMode("hover");
      else setMode("default");
    };

    const hide = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      ringX += (mouseX - ringX) * RING_LERP;
      ringY += (mouseY - ringY) * RING_LERP;
      dotScale += (targetDotScale - dotScale) * SCALE_LERP;
      ringScale += (targetRingScale - ringScale) * SCALE_LERP;
      applyDot();
      applyRing();
      raf = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    raf = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
      root.classList.remove("custom-cursor-active");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Trailing ring — grows on interactive targets, becomes VIEW on projects */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-accent/40 opacity-0"
        style={{ willChange: "transform" }}
      >
        <span
          ref={fillRef}
          className="absolute inset-0 rounded-full bg-accent/15 opacity-0 transition-opacity duration-200"
        />
        <span
          ref={viewRef}
          className="absolute inset-0 flex items-center justify-center font-mono text-[6px] uppercase tracking-[0.2em] text-accent-deep opacity-0 transition-opacity duration-200 dark:text-accent"
        >
          VIEW
        </span>
      </div>
      {/* Instant dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-accent opacity-0"
        style={{ willChange: "transform" }}
      />
    </>
  );
}
