"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Subscribe to a media query with useSyncExternalStore (no setState-in-effect). */
function useMediaQueryStore(query: string, serverValue: boolean): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, () => serverValue);
}

/** Respect prefers-reduced-motion across the site. */
export function useReducedMotion(): boolean {
  return useMediaQueryStore("(prefers-reduced-motion: reduce)", false);
}

/** True on touch-first devices (custom cursor and magnetic effects stay off). */
export function useIsTouchDevice(): boolean {
  return useMediaQueryStore("(pointer: coarse)", true);
}

/** Generic media-query hook. */
export function useMediaQuery(query: string): boolean {
  return useMediaQueryStore(query, false);
}

/** Smoothly scroll to a section id, accounting for the floating navbar. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = el.getBoundingClientRect().top + window.scrollY - 88;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
