"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
  type RefObject,
} from "react";
import { cn } from "@/lib/utils";
import { animationConfig } from "@/config/animation";
import { useIsTouchDevice, useReducedMotion } from "./hooks";

/* ── Public API — fully backwards compatible ──────────────────────────────
 * The site-wide button is a TRANSPARENT GLASS CAPSULE containing a real,
 * animated mass of blue water:
 *
 *   .lq                 capsule root — clips the water, lifts on hover,
 *                       presses down on click (see globals.css)
 *   ├── .lq-glass       glass shell — crystal (light) / smoked (dark) body,
 *   │                   bevelled rim (directional light ring), wall-thickness
 *   │                   line, backdrop blur, layered contact→ambient shadow
 *   ├── .lq-liquid      THE WATER MASS — oversized, spring-driven, clipped;
 *   │                   ::before meniscus scatter, ::after floor glow
 *   │     ├── wave b    back swell — slower, translucent (depth layer)
 *   │     ├── wave a    front water — cyan surface → deep blue base,
 *   │     │             irregular natural surface curve + tension line
 *   │     │             + faint refraction double-line just below
 *   │     ├── surface   light pooled just above the waterline
 *   │     └── bubbles   physical bubbles (rim + specular) rising inside
 *   ├── .lq-base        thick glass bottom wall in front of the water
 *   ├── .lq-gloss       top-left / top-right specular glass reflections
 *   ├── .lq-ceiling     wide ceiling reflection along the upper glass
 *   ├── .lq-glint       idle light streak drifting across the glass
 *   ├── .lq-shine       diagonal reflection sweeping across on hover
 *   ├── .lq-ripple      press ripple ring at the press point
 *   └── .lq-content     label — always above the water, perfectly readable
 *
 * PHYSICS — the cursor is a magnet, the water is a heavy liquid mass:
 *   force = stiffness × (target − position) − damping × velocity
 *   • The pointer NEVER moves the water directly — it only updates the
 *     target. A single spring-damper simulation (semi-implicit Euler,
 *     deltaTime-based, frame-rate independent) owns position & velocity.
 *   • Press = a small downward velocity impulse (liquid compression) plus
 *     a ripple ring spawned at the press point.
 *   • Idle water still LIVES via CSS: slow wave drift, drifting glint,
 *     rising bubbles — all transform/opacity compositing, zero rAF.
 *   • Touch devices and prefers-reduced-motion: the spring and the ripple
 *     stand down; the CSS liquid keeps its calm continuous motion (and
 *     reduced motion kills that too, globally).
 *
 * DISCIPLINE:
 *   • The capsule and the text never translate (except the 1.5px hover
 *     lift) — the water, the reflections and the ripple move, nothing else.
 *   • The water is clipped by the capsule's rounded overflow — it can
 *     never escape or spill outside the glass.
 *   • Colors come exclusively from the --water-* / --lq-* / --btn-glass
 *     tokens, so light and dark themes are one physical system, re-tuned.
 * ───────────────────────────────────────────────────────────────────────── */

type NormalizedVariant = "primary" | "secondary" | "ghost";

interface LiquidButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  download?: string;
  variant?: NormalizedVariant | "amber" | "outline";
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
}

function normalizeVariant(variant: LiquidButtonProps["variant"]): NormalizedVariant {
  if (variant === "amber") return "primary";
  if (variant === "outline") return "secondary";
  return variant ?? "primary";
}

/* ── Water artwork ────────────────────────────────────────────────────────
 * viewBox 400×30 stretched over an oversized box (200% × liquid layer)
 * with preserveAspectRatio="none". The surface rests at y≈6 of 30 with
 * ±2.4 units of irregular, natural curvature — a clearly visible curved
 * water surface with two unequal crests and a wide trough, like the
 * reference: a real meniscus, never a cartoon zig-zag. The tile is drawn
 * twice (0–200, 200–400) so the drift loop is perfectly seamless. */

const WAVE_TILE =
  "M0,6 C8,6 16,4.2 28,3.9 C40,3.6 48,5.4 60,7 C72,8.6 80,9 92,8.4 " +
  "C104,7.8 112,5.6 124,4.6 C136,3.6 146,3.8 158,4.8 C170,5.8 178,7.4 " +
  "190,7.2 C194,7.1 198,6.3 200,6";
const WAVE_CLOSED = `${WAVE_TILE} L200,30 L0,30 Z`;

/** One wave layer: two seamless tiles. The front layer carries the body
 * gradient, the depth volume and the surface tension line; the back layer
 * is a translucent swell sliding the opposite way (parallax depth). */
function WaveLayer({ uid, layer }: { uid: string; layer: "a" | "b" }) {
  const isFront = layer === "a";
  return (
    <svg
      className={`lq-wave lq-wave--${layer}`}
      viewBox="0 0 400 30"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-${layer}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--water-1)" }} />
          <stop offset="0.5" style={{ stopColor: "var(--water-2)" }} />
          <stop offset="0.88" style={{ stopColor: "var(--water-3)" }} />
        </linearGradient>
        {isFront && (
          <linearGradient id={`${uid}-depth`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.45" style={{ stopColor: "rgba(0,0,0,0)" }} />
            <stop offset="1" style={{ stopColor: "var(--water-shadow)" }} />
          </linearGradient>
        )}
      </defs>
      <path d={WAVE_CLOSED} fill={`url(#${uid}-${layer})`} />
      <path
        d={WAVE_CLOSED}
        fill={`url(#${uid}-${layer})`}
        transform="translate(200 0)"
      />
      {isFront && (
        <>
          <path d={WAVE_CLOSED} fill={`url(#${uid}-depth)`} />
          <path
            d={WAVE_CLOSED}
            fill={`url(#${uid}-depth)`}
            transform="translate(200 0)"
          />
          <path
            d={WAVE_TILE}
            fill="none"
            stroke="var(--water-highlight)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.72"
          />
          <path
            d={WAVE_TILE}
            fill="none"
            stroke="var(--water-highlight)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.72"
            transform="translate(200 0)"
          />
          {/* refraction double-line — the faint second image of the surface
              just below the waterline, as seen through real water */}
          <path
            d={WAVE_TILE}
            fill="none"
            stroke="var(--water-highlight)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.3"
            transform="translate(0 1.8)"
          />
          <path
            d={WAVE_TILE}
            fill="none"
            stroke="var(--water-highlight)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            opacity="0.3"
            transform="translate(200 1.8)"
          />
        </>
      )}
    </svg>
  );
}

/* ── Water simulation state ─────────────────────────────────────────────── */

interface WaterState {
  raf: number | null;
  lastT: number; // last rAF timestamp (ms)
  x: number; // mass displacement from rest (px, +right)
  y: number; // mass displacement from rest (px, +down)
  vx: number; // velocity (px/s)
  vy: number;
  tx: number; // target displacement (px) — written by pointer handlers only
  ty: number;
  w: number; // cached button size for displacement clamps
  h: number;
}

function createWaterState(): WaterState {
  return {
    raf: null,
    lastT: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    tx: 0,
    ty: 0,
    w: 0,
    h: 0,
  };
}

/* ── Spring physics hook — shared by every glass capsule ────────────────── */

function useWaterSpring(
  enabled: boolean,
  rootRef: RefObject<HTMLElement | null>,
  liquidRef: RefObject<HTMLSpanElement | null>
) {
  const stateRef = useRef<WaterState | null>(null);

  const getState = useCallback((): WaterState => {
    if (!stateRef.current) stateRef.current = createWaterState();
    return stateRef.current;
  }, []);

  /** Cache the button box (displacement clamps are size-relative). */
  const measure = useCallback(() => {
    const el = rootRef.current;
    const state = getState();
    if (el) {
      const rect = el.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
    }
  }, [getState, rootRef]);

  /** Write the water layer transform: mass translation (primary) + a
   * whisper of tilt derived from the mass's own velocity (secondary). */
  const paint = useCallback(() => {
    const el = liquidRef.current;
    if (!el) return;
    const s = getState();
    const tilt = Math.max(
      -animationConfig.waterTiltMaxDeg,
      Math.min(animationConfig.waterTiltMaxDeg, -s.vx * animationConfig.waterTiltGain)
    );
    if (Math.abs(s.x) < 0.05 && Math.abs(s.y) < 0.05 && Math.abs(tilt) < 0.02) {
      if (el.style.transform !== "") el.style.transform = "";
      return;
    }
    el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${tilt.toFixed(3)}deg)`;
  }, [getState, liquidRef]);

  const stopLoop = useCallback(() => {
    const state = getState();
    if (state.raf !== null) {
      cancelAnimationFrame(state.raf);
      state.raf = null;
    }
  }, [getState]);

  /** One physics step of the mass: integrate, clamp, paint, self-stop. */
  const tickRef = useRef<(now: number) => void>(() => {});

  const tick = useCallback(
    (now: number) => {
      const s = getState();
      const dt = Math.min(0.05, Math.max(0.001, (now - s.lastT) / 1000));
      s.lastT = now;

      const k = animationConfig.waterSpringStiffness;
      const c = animationConfig.waterSpringDamping;
      const m = animationConfig.waterSpringMass;

      // Semi-implicit Euler — stable for stiff springs at any frame rate.
      s.vx += ((k * (s.tx - s.x) - c * s.vx) / m) * dt;
      s.vy += ((k * (s.ty - s.y) - c * s.vy) / m) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;

      // The water may lean hard toward the cursor but must never leave
      // its resting area inside the glass.
      const maxX = Math.max(8, s.w * animationConfig.waterMaxDisplacementX);
      const maxY = Math.max(2, s.h * animationConfig.waterMaxDisplacementY);
      s.x = Math.max(-maxX, Math.min(maxX, s.x));
      s.y = Math.max(-maxY, Math.min(maxY, s.y));

      paint();

      const settled =
        Math.abs(s.tx - s.x) < animationConfig.waterConvergePositionPx &&
        Math.abs(s.ty - s.y) < animationConfig.waterConvergePositionPx &&
        Math.abs(s.vx) < animationConfig.waterConvergeVelocityPps &&
        Math.abs(s.vy) < animationConfig.waterConvergeVelocityPps;

      if (settled) {
        // Park exactly on the target for a clean final frame, then stop
        // completely — an idle button runs zero rAF.
        s.x = s.tx;
        s.y = s.ty;
        s.vx = 0;
        s.vy = 0;
        paint();
        s.raf = null;
        return;
      }
      s.raf = requestAnimationFrame((t) => tickRef.current(t));
    },
    [getState, paint]
  );

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const wake = useCallback(() => {
    const state = getState();
    if (state.raf !== null) return;
    if (state.w < 2) measure();
    state.lastT = performance.now();
    state.raf = requestAnimationFrame(tick);
  }, [getState, measure, tick]);

  /** The pointer is a magnet: it only ever updates the TARGET. */
  const setTargetFromEvent = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const state = getState();
      state.w = rect.width;
      state.h = rect.height;
      const nx = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1)
      );
      const ny = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1)
      );
      state.tx = nx * rect.width * animationConfig.waterMaxDisplacementX;
      state.ty =
        ny *
        rect.height *
        animationConfig.waterMaxDisplacementY *
        animationConfig.waterVerticalGain;
    },
    [getState, rootRef]
  );

  const onEnter = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      setTargetFromEvent(event);
      wake();
    },
    [setTargetFromEvent, wake]
  );

  const onMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      setTargetFromEvent(event);
      wake();
    },
    [setTargetFromEvent, wake]
  );

  const onLeave = useCallback(() => {
    const s = getState();
    // Magnet removed → the mass glides back to rest through the same
    // spring, then the loop cancels itself. No snap, no fade.
    s.tx = 0;
    s.ty = 0;
    wake();
  }, [getState, wake]);

  const onDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      const s = getState();
      // Liquid compression: a brief downward pressure impulse the spring
      // naturally rebounds from. Subtle by design.
      s.vy += animationConfig.waterPressImpulse;
      wake();
    },
    [getState, wake]
  );

  /* Lifecycle: track size changes; never leave a loop behind. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !enabled) return;
    measure();
    const observer = new ResizeObserver(() => {
      measure();
      paint();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, measure, paint]);

  useEffect(() => {
    if (!enabled) stopLoop();
  }, [enabled, stopLoop]);
  useEffect(() => () => stopLoop(), [stopLoop]);

  return { rootRef, liquidRef, onEnter, onMove, onLeave, onDown };
}

/* ── Press ripple ───────────────────────────────────────────────────────── */

interface Ripple {
  x: number;
  y: number;
  k: number;
}

function usePressRipple(enabled: boolean) {
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const counter = useRef(0);

  const spawnRipple = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width < 2) return;
      counter.current += 1;
      setRipple({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        k: counter.current,
      });
    },
    [enabled]
  );

  const clearRipple = useCallback(() => setRipple(null), []);

  return { ripple, spawnRipple, clearRipple };
}

/* ── Shared capsule interior ────────────────────────────────────────────── */

function CapsuleInterior({
  uid,
  liquidRef,
  ripple,
  onRippleEnd,
}: {
  uid: string;
  liquidRef: Ref<HTMLSpanElement>;
  ripple: Ripple | null;
  onRippleEnd: () => void;
}) {
  return (
    <>
      {/* glass shell */}
      <span aria-hidden className="lq-glass" />

      {/* the water mass — the ONLY element the spring simulation moves */}
      <span ref={liquidRef} aria-hidden className="lq-liquid">
        <span className="lq-wavebox">
          <WaveLayer uid={uid} layer="b" />
          <WaveLayer uid={uid} layer="a" />
        </span>
        {/* refracted light patches — the water's transparent areas */}
        <span aria-hidden className="lq-caustic" />
        {/* light pooled just above the waterline — travels with the mass */}
        <span aria-hidden className="lq-surface" />
        {/* tiny bubbles rising inside the liquid */}
        <span aria-hidden className="lq-bubbles">
          <span />
          <span />
          <span />
          <span />
        </span>
      </span>

      {/* thick glass bottom wall — the vessel's base in front of the water */}
      <span aria-hidden className="lq-base" />

      {/* specular reflections + moving glass light */}
      <span aria-hidden className="lq-gloss" />
      {/* wide ceiling reflection along the inside of the upper glass */}
      <span aria-hidden className="lq-ceiling" />
      <span aria-hidden className="lq-glint" />
      <span aria-hidden className="lq-shine" />

      {/* press ripple ring */}
      {ripple && (
        <span
          key={ripple.k}
          aria-hidden
          className="lq-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          onAnimationEnd={onRippleEnd}
        />
      )}
    </>
  );
}

/* ── Assembled pointer handlers (spring + ripple) ───────────────────────── */

/** Shared interaction plumbing. The component owns the refs (created via
 * useRef in the component body) and hands them in; the returned handlers
 * are attached in JSX exactly like the original implementation. */
function useCapsuleInteraction(
  rootRef: RefObject<HTMLElement | null>,
  liquidRef: RefObject<HTMLSpanElement | null>,
  physicsOn: boolean
) {
  const reducedMotion = useReducedMotion();
  const rippleOn = !reducedMotion;

  const spring = useWaterSpring(physicsOn, rootRef, liquidRef);
  const { ripple, spawnRipple, clearRipple } = usePressRipple(rippleOn);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      spring.onDown(event);
      spawnRipple(event);
    },
    [spring, spawnRipple]
  );

  const pointerHandlers = physicsOn
    ? {
        onPointerEnter: spring.onEnter,
        onPointerMove: spring.onMove,
        onPointerLeave: spring.onLeave,
        onPointerDown,
      }
    : rippleOn
      ? { onPointerDown }
      : {};

  const uid = useId();

  return { ripple, clearRipple, pointerHandlers, uid };
}

/* ══════════════════════════════ LiquidButton ════════════════════════════ */

export function LiquidButton({
  children,
  onClick,
  href,
  download,
  variant = "primary",
  className,
  disabled,
  ariaLabel,
  type = "button",
}: LiquidButtonProps) {
  const variantKey = normalizeVariant(variant);
  const waterRendered = variantKey !== "ghost";
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const physicsOn = waterRendered && !reducedMotion && !isTouch;

  const rootRef = useRef<HTMLElement | null>(null);
  const liquidRef = useRef<HTMLSpanElement | null>(null);
  const { ripple, clearRipple, pointerHandlers, uid } = useCapsuleInteraction(
    rootRef,
    liquidRef,
    physicsOn
  );

  const glassBase = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 min-h-11",
    "label-mono !text-[0.72rem] font-medium tracking-[0.18em]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/55 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    // The capsule: glass + water + reflections. Only the appearance is
    // animated; typography and metrics are exactly as before.
    waterRendered && ["lq group", `lq--${variantKey}`],
    variantKey === "ghost" &&
      "relative text-foreground/90 transition-colors duration-300 hover:text-accent-deep dark:hover:text-accent",
    className
  );

  const interior = (
    <>
      {waterRendered && (
        <CapsuleInterior
          uid={uid}
          liquidRef={liquidRef}
          ripple={ripple}
          onRippleEnd={clearRipple}
        />
      )}
      <span className={cn(waterRendered && "lq-content", "flex items-center gap-2")}>
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={rootRef as Ref<HTMLAnchorElement | null>}
        href={href}
        download={download}
        onClick={() => onClick?.()}
        aria-label={ariaLabel}
        className={glassBase}
        {...pointerHandlers}
      >
        {interior}
      </a>
    );
  }

  return (
    <button
      ref={rootRef as Ref<HTMLButtonElement | null>}
      type={type}
      onClick={() => onClick?.()}
      disabled={disabled}
      aria-label={ariaLabel}
      className={glassBase}
      {...pointerHandlers}
    >
      {interior}
    </button>
  );
}

/* ══════════════════════════ GlassIconButton ═════════════════════════════ */

interface GlassIconButtonProps
  extends Omit<ComponentPropsWithoutRef<"button">, "ref"> {
  variant?: "primary" | "secondary";
  href?: string;
  /** Anchor-only attributes, valid when the capsule renders as a link. */
  target?: string;
  rel?: string;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

/** Compact circular glass capsule with a small amount of blue liquid —
 * the same physical material as LiquidButton. Renders an <a> when href
 * is given (social links), otherwise a <button>. */
export function GlassIconButton({
  variant = "secondary",
  className,
  children,
  href,
  type = "button",
  ref,
  ...rest
}: GlassIconButtonProps) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLElement | null>(null);
  const liquidRef = useRef<HTMLSpanElement | null>(null);
  const { ripple, clearRipple, pointerHandlers, uid } = useCapsuleInteraction(
    rootRef,
    liquidRef,
    !reducedMotion && !isTouch
  );

  const classes = cn(
    "lq lq--icon group inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
    variant === "primary" && "lq--primary",
    className
  );

  const interior = (
    <>
      <CapsuleInterior
        uid={uid}
        liquidRef={liquidRef}
        ripple={ripple}
        onRippleEnd={clearRipple}
      />
      <span className="lq-content inline-flex items-center justify-center">
        {children}
      </span>
    </>
  );

  if (href) {
    const { disabled: _disabled, ...anchorRest } = rest;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...pointerHandlers}
        {...(anchorRest as unknown as ComponentPropsWithoutRef<"a">)}
      >
        {interior}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...pointerHandlers}
      {...rest}
    >
      {interior}
    </button>
  );
}

/* ═════════════════════════════ GlassChip ════════════════════════════════ */

interface GlassChipProps
  extends Omit<ComponentPropsWithoutRef<"button">, "ref"> {
  variant?: "primary" | "secondary";
  /** Selected state: the SAME glass capsule with the water risen and the
   * rim lit (.lq.is-active) — the caller only tints the label. */
  active?: boolean;
  /** Renders the capsule as a link when provided. */
  href?: string;
  target?: string;
  rel?: string;
  ref?: Ref<HTMLButtonElement | HTMLAnchorElement>;
}

/** Compact capsule for filter pills, reset actions and related chips —
 * same glass/water material, softer liquid. */
export function GlassChip({
  variant = "secondary",
  active = false,
  className,
  children,
  href,
  type = "button",
  ref,
  ...rest
}: GlassChipProps) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();

  const rootRef = useRef<HTMLElement | null>(null);
  const liquidRef = useRef<HTMLSpanElement | null>(null);
  const { ripple, clearRipple, pointerHandlers, uid } = useCapsuleInteraction(
    rootRef,
    liquidRef,
    !reducedMotion && !isTouch
  );

  const classes = cn(
    "lq lq--chip group inline-flex min-h-11 shrink-0 items-center justify-center rounded-full px-5",
    active && "is-active",
    variant === "primary" && "lq--primary",
    className
  );

  const interior = (
    <>
      <CapsuleInterior
        uid={uid}
        liquidRef={liquidRef}
        ripple={ripple}
        onRippleEnd={clearRipple}
      />
      <span className="lq-content inline-flex items-center gap-2">{children}</span>
    </>
  );

  if (href) {
    const { disabled: _disabled, ...anchorRest } = rest;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...pointerHandlers}
        {...(anchorRest as unknown as ComponentPropsWithoutRef<"a">)}
      >
        {interior}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...pointerHandlers}
      {...rest}
    >
      {interior}
    </button>
  );
}
