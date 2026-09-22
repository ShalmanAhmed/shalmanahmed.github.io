"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassIconButton } from "@/components/shared/LiquidButton";

interface ThemeToggleProps {
  className?: string;
}

/* Mount guard without setState-in-effect: false during SSR/hydration, true after. */
const emptySubscribe = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

/**
 * Sun / moon theme switch.
 * Mounted-guarded so the icon never contradicts next-themes during hydration.
 * Both icons stay stacked and crossfade — no layout shift, no mismatch.
 */
export function ThemeToggle(_props: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <GlassIconButton
      type="button"
      aria-label="Toggle theme"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-10 w-10"
    >
      <span aria-hidden className="relative block h-[1.05rem] w-[1.05rem]">
        <Sun
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500",
            isDark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 h-full w-full transition-all duration-500",
            isDark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        />
      </span>
    </GlassIconButton>
  );
}

export default ThemeToggle;
