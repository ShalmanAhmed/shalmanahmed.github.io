"use client";

import { useState } from "react";
import Image from "next/image";
import { Repeat } from "lucide-react";
import { animationConfig } from "@/config/animation";
import { profile } from "@/data/profile";
import { useReducedMotion } from "@/components/shared/hooks";
import { cn } from "@/lib/utils";

/**
 * Circular 3D flip profile card, wrapped in a static premium ring.
 *  - Front: portrait photo cropped into the circle, name + alias centered
 *    near the bottom, "TAP TO FLIP" chip at the top-center.
 *  - Back: surface-colored circle with the personal facts as tight
 *    hairline-separated rows (mono labels, medium values).
 * Flips via click, tap AND keyboard (native <button>: Enter / Space) — never
 * hover-only. With prefers-reduced-motion the faces swap instantly.
 */
export function ProfileCard() {
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = useReducedMotion();

  const toggle = () => setFlipped((f) => !f);

  const flipHint = (
    <span className="pointer-events-none absolute left-1/2 top-5 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 backdrop-blur-sm">
      <Repeat className="size-3 text-white/90" aria-hidden />
      <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-white/90">
        Tap to flip
      </span>
    </span>
  );

  const photoFace = (
    <div className="relative h-full w-full overflow-hidden rounded-full border border-hairline bg-secondary">
      <Image
        src={profile.profileImage}
        alt="Portrait of Shalman Ahmed"
        fill
        sizes="(min-width: 640px) 360px, 320px"
        className="object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
      />
      {flipHint}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-8 pb-[13%] text-center">
        <p className="font-display text-2xl leading-tight text-white sm:text-[1.7rem]">
          {profile.displayName}
        </p>
        <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.24em] text-accent-highlight">
          {profile.alias}
        </p>
      </div>
    </div>
  );

  const factsFace = (
    <div className="flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full border border-hairline bg-surface px-8 py-8 sm:px-10">
      <div className="flex w-full flex-col items-center">
        <p className="label-mono text-accent-deep dark:text-accent">Profile facts</p>
        <ul className="mt-2.5 w-full divide-y divide-hairline">
          {profile.about.facts.map((fact) => (
            <li
              key={fact.label}
              className="flex items-baseline justify-between gap-3 py-[0.3rem]"
            >
              <span className="shrink-0 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground">
                {fact.label}
              </span>
              <span className="text-right text-[0.7rem] font-medium leading-tight text-ink">
                {fact.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (reducedMotion) {
    // Reduced motion: instant content swap — no 3D rotation at all.
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={flipped}
        aria-label="Toggle between portrait photo and profile facts"
        className="relative mx-auto block aspect-square w-full max-w-[320px] rounded-full border border-accent/25 p-2 text-left sm:max-w-[360px]"
      >
        {flipped ? factsFace : photoFace}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={flipped}
      aria-label="Toggle between portrait photo and profile facts"
      className="relative mx-auto block aspect-square w-full max-w-[320px] rounded-full border border-accent/25 p-2 [perspective:1400px] sm:max-w-[360px]"
    >
      <div
        className={cn(
          "relative aspect-square w-full rounded-full transition-transform ease-[cubic-bezier(0.35,0.1,0.25,1)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
        style={{
          transitionDuration: `${animationConfig.profileFlipDuration}ms`,
        }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {photoFace}
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {factsFace}
        </div>
      </div>
    </button>
  );
}
