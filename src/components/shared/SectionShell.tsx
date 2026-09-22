"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { animationConfig } from "@/config/animation";
import { useReducedMotion } from "./hooks";
import { CountUp } from "./CountUp";

/**
 * Numbered editorial section shell:
 *   ┌ 01 — ABOUT ┐        (mono label + hairline)
 *   More than just code.  (display heading)
 */
export function SectionShell({
  id,
  number,
  label,
  heading,
  intro,
  align = "left",
  children,
  className,
  headingClassName,
}: {
  id?: string;
  number?: string;
  label: string;
  heading?: string;
  intro?: string;
  align?: "left" | "center";
  children: ReactNode;
  className?: string;
  headingClassName?: string;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative mx-auto w-full max-w-6xl px-5 sm:px-8", className)}
    >
      <Reveal>
        <div
          className={cn(
            "mb-10 flex items-center gap-4 sm:mb-14",
            align === "center" && "justify-center"
          )}
        >
          {number && (
            <span className="label-mono text-accent-deep dark:text-accent">
              <CountUp
                to={parseInt(number, 10)}
                pad={2}
                duration={animationConfig.sectionNumberDuration}
              />
            </span>
          )}
          <span className="label-mono text-muted-foreground">— {label}</span>
          <span
            aria-hidden
            className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
          />
        </div>
      </Reveal>

      {heading && (
        <Reveal delay={0.08}>
          <h2
            className={cn(
              "text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl",
              align === "center" && "text-center",
              headingClassName
            )}
          >
            {heading}
          </h2>
        </Reveal>
      )}

      {intro && (
        <Reveal delay={0.14}>
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {intro}
          </p>
        </Reveal>
      )}

      {children}
    </section>
  );
}

/**
 * Lightweight scroll reveal driven by IntersectionObserver.
 * Respects prefers-reduced-motion (content simply appears).
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible || reducedMotion
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-6 opacity-0 blur-[6px]",
        className
      )}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </Tag>
  );
}
