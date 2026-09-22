"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { animationConfig } from "@/config/animation";
import { useReducedMotion } from "@/components/shared/hooks";
import { GlassIconButton } from "@/components/shared/LiquidButton";
import { cn } from "@/lib/utils";

/**
 * CinematicReel — the "mini video" that plays inside every project card.
 *
 * Each project's screenshot array becomes an automatic cinematic sequence:
 * every image holds for `slideshowInterval` (3.4s) while a slow Ken Burns
 * camera move plays (one of four zoom + drift variants, assigned per image
 * index), then the next image dissolves in over `reelEnterDuration` (0.9s)
 * with a soft blur-to-sharp entrance — a premium product-reel feel, never a
 * slideshow snap.
 *
 * Crossfade discipline (fade-over): the outgoing image stays fully opaque
 * UNDERNEATH while the incoming one dissolves in above it, and only drops
 * away after the entrance has finished — by then the active layer always
 * covers the frame (Ken Burns scale ≥ 1.03), so the container background
 * can never flash through. No dip, no flicker, no empty gaps.
 *
 * Motion discipline:
 *  - Fixed aspect-ratio figure, overflow-hidden, every layer absolutely
 *    positioned — the surrounding card can never jump, resize or shift.
 *  - transform / opacity / filter only (GPU compositing); no layout
 *    properties are ever animated.
 *  - Exactly one setTimeout per card (the advance clock) + an
 *    IntersectionObserver + a visibilitychange listener: the clock only
 *    runs while the reel is on screen, the tab is visible, and the user is
 *    not interacting. An idle off-screen card costs nothing.
 *  - Hover / touch / keyboard focus pauses the clock and freezes the Ken
 *    Burns camera (animation-play-state via [data-paused]); it never
 *    freezes a half-finished crossfade. Leaving resumes automatically.
 *  - Manual arrows: jump straight to the chosen image with the same
 *    cinematic transition and reset the automatic clock (the clock effect
 *    re-arms on every index change).
 *  - Each card owns its own animation state plus a deterministic stagger
 *    offset, so projects never advance in sync and the page feels alive.
 *  - prefers-reduced-motion: no autoplay, no Ken Burns — manual navigation
 *    only, with the site-wide reduced-motion rules flattening transitions.
 */

/** Four Ken Burns camera moves — assigned per image index for quiet variety. */
const KB_VARIANTS = ["reel-kb-a", "reel-kb-b", "reel-kb-c", "reel-kb-d"];

interface CinematicReelProps {
  images: string[];
  projectTitle: string;
  /** Deterministic per-card offset (ms) before the first automatic advance. */
  staggerSeed: number;
  /** Hover-zoom wrapper ref owned by the card's tilt/zoom engine. */
  zoomRef?: RefObject<HTMLDivElement | null>;
}

export function CinematicReel({
  images,
  projectTitle,
  staggerSeed,
  zoomRef,
}: CinematicReelProps) {
  const reduced = useReducedMotion();
  const total = images.length;
  const autoplay = !reduced && total > 1;

  /* Single state object so every transition is one pure updater. */
  const [reel, setReel] = useState<{ index: number; under: number | null }>({
    index: 0,
    under: null,
  });
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const figureRef = useRef<HTMLElement | null>(null);

  const { index, under } = reel;

  /* ── Navigation (pure updaters — strict-mode safe) ─────────────────────── */
  const goTo = useCallback(
    (next: number) => {
      setReel((s) => {
        const n = ((next % total) + total) % total;
        if (n === s.index) return s;
        return { index: n, under: s.index };
      });
    },
    [total]
  );

  const advance = useCallback(() => {
    setReel((s) => ({ index: (s.index + 1) % total, under: s.index }));
  }, [total]);

  /* ── Retire the "under" (previous) layer after the entrance finishes ──────
     It fades away invisibly beneath the now fully-arrived active layer. */
  useEffect(() => {
    if (under === null) return;
    const t = window.setTimeout(
      () => setReel((s) => (s.under === null ? s : { ...s, under: null })),
      animationConfig.reelEnterDuration + 150
    );
    return () => window.clearTimeout(t);
  }, [under]);

  /* ── The clock only runs while the reel is actually on screen ──────────── */
  useEffect(() => {
    const el = figureRef.current;
    if (!el || !autoplay) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay]);

  /* ── Background tabs never advance ─────────────────────────────────────── */
  useEffect(() => {
    if (!autoplay) return;
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [autoplay]);

  /* ── The automatic clock ──────────────────────────────────────────────────
     First beat is staggered per card; afterwards a full hold each time.
     Re-arming on every index/pause/visibility change is exactly what makes
     manual navigation reset the timer. */
  const seed =
    ((staggerSeed % animationConfig.slideshowInterval) +
      animationConfig.slideshowInterval) %
    animationConfig.slideshowInterval;
  const delay =
    index === 0 && under === null ? seed : animationConfig.slideshowInterval;

  useEffect(() => {
    if (!autoplay || !inView || paused || pageHidden) return;
    const t = window.setTimeout(advance, delay);
    return () => window.clearTimeout(t);
  }, [autoplay, inView, paused, pageHidden, advance, delay, index]);

  /* ── Pause / resume on hover, touch and keyboard focus ─────────────────── */
  const pauseClock = useCallback(() => {
    if (autoplay) setPaused(true);
  }, [autoplay]);
  const resumeClock = useCallback(() => setPaused(false), []);

  const figureStyle = {
    "--reel-enter": `${animationConfig.reelEnterDuration}ms`,
    "--reel-kb": `${animationConfig.reelKbDuration}ms`,
  } as CSSProperties;

  return (
    <figure
      ref={figureRef}
      data-paused={autoplay && paused ? "true" : undefined}
      className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border border-hairline bg-secondary"
      style={figureStyle}
      onPointerEnter={pauseClock}
      onPointerLeave={resumeClock}
      onPointerDown={pauseClock}
      onPointerUp={resumeClock}
      onPointerCancel={resumeClock}
      onFocusCapture={pauseClock}
      onBlurCapture={resumeClock}
    >
      <div ref={zoomRef} className="absolute inset-0 will-change-transform">
        {images.map((src, i) => {
          const isActive = i === index;
          const isUnder = under === i && !isActive;
          return (
            <div
              key={src}
              aria-hidden={!isActive}
              className={cn(
                "reel-layer absolute inset-0",
                isActive && "is-active z-20 visible",
                !isActive && (isUnder ? "z-10 visible" : "z-0 invisible opacity-0")
              )}
            >
              {/* Ken Burns camera — continues on the outgoing layer while it
                  sits "under" a crossfade, so both frames stay alive. */}
              <div
                className={cn(
                  "absolute inset-0",
                  !reduced && "reel-kb",
                  !reduced && KB_VARIANTS[i % KB_VARIANTS.length]
                )}
              >
                <Image
                  src={src}
                  alt={`${projectTitle} screenshot ${i + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* existing controls — unchanged design, now wired to the reel clock */}
      {total > 1 && (
        <figcaption className="absolute inset-x-3 bottom-3 z-30 flex items-end justify-between gap-2">
          {/* Not aria-live: the automatic sequence would chatter on screen
              readers. Manual navigation remains fully labelled via the
              buttons and the active screenshot's alt text. */}
          <span className="glass label-mono rounded-full px-3.5 py-2.5 text-ink">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <div className="flex gap-1.5">
            <GlassIconButton
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label={`Show previous screenshot of ${projectTitle}`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </GlassIconButton>
            <GlassIconButton
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label={`Show next screenshot of ${projectTitle}`}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </GlassIconButton>
          </div>
        </figcaption>
      )}
    </figure>
  );
}
