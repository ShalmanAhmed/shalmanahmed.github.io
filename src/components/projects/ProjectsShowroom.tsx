"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project, type ProjectStatus } from "@/data/projects";
import { technologyById } from "@/data/technologies";
import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import {
  GlassChip,
  LiquidButton,
} from "@/components/shared/LiquidButton";
import { CinematicReel } from "./CinematicReel";
import { ProjectFocusMode } from "./ProjectFocusMode";
import { useIsTouchDevice, useReducedMotion } from "@/components/shared/hooks";
import { animationConfig } from "@/config/animation";
import { cn } from "@/lib/utils";

/**
 * ProjectsShowroom — ALTERNATING GLASS PROJECT SHOWCASE.
 *
 * One project per full-width editorial row. Each row is a 2-column grid on
 * lg: a WHITE/dark GLASS card (token-driven — var(--glass-bg), border,
 * shadow-e2, backdrop blur) on one side and the storytelling detail
 * (typography + whitespace, never another card) on the other. Sides
 * alternate automatically from the row index (even → card left, odd → card
 * right via lg:order); mobile collapses to a single column, card first.
 *
 * Truth rules: category / status / problem / solution / benefits render
 * ONLY when the data carries them — nothing is invented. GitHub / Live
 * buttons stay data-driven (all null today, handled by ProjectFocusMode).
 *
 * Motion discipline (borrowed from LiquidButton): the hover tilt / glare /
 * image zoom run on refs + one rAF loop per card that exists ONLY while
 * there is motion left to settle — no setState per mousemove, zero rAF on
 * an idle card. Desktop pointer devices only; reduced motion gets static
 * content that simply appears.
 *
 * The screenshot area is a CinematicReel: every card auto-plays its image
 * array like a tiny product video (Ken Burns + blur-to-sharp crossfades),
 * pausable by hover/touch/focus, explorable with the existing arrows, with
 * per-card staggered clocks so projects never advance in sync.
 */

const STATUS_META: Record<ProjectStatus, { label: string; dot: string }> = {
  live: { label: "LIVE", dot: "●" },
  active: { label: "ACTIVE", dot: "●" },
  archived: { label: "ARCHIVED", dot: "○" },
};

/** Display names for the card chips + TECHNOLOGY line (id fallback). */
function techNames(project: Project): string[] {
  return project.technologies.map((id) => technologyById(id)?.name ?? id);
}

/* ── Tilt / glare / zoom engine (refs only, settle-and-stop) ─────────────── */

interface TiltAnimState {
  raf: number | null;
  lastT: number;
  rx: number; // current rotateX (deg)
  ry: number; // current rotateY (deg)
  trx: number; // target rotateX
  tyr: number; // target rotateY
  zoom: number; // current image zoom
  tzoom: number; // target image zoom
  gx: number; // current glare x (%)
  gy: number; // current glare y (%)
  tgx: number; // target glare x
  tgy: number; // target glare y
  inside: boolean;
}

function createTiltState(): TiltAnimState {
  return {
    raf: null,
    lastT: 0,
    rx: 0,
    ry: 0,
    trx: 0,
    tyr: 0,
    zoom: 1,
    tzoom: 1,
    gx: 50,
    gy: 50,
    tgx: 50,
    tgy: 50,
    inside: false,
  };
}

const TILT_LERP = 0.14; // per-frame lerp at 60fps, made frame-rate independent below
const SETTLE_TILT_DEG = 0.02;
const SETTLE_ZOOM = 0.001;
const SETTLE_GLARE_PCT = 0.25;

/* ════════════════════════════ Glass project card ════════════════════════ */

function GlassProjectCard({
  project,
  onOpen,
  staggerSeed,
}: {
  project: Project;
  onOpen: (id: string) => void;
  staggerSeed: number;
}) {
  const isTouch = useIsTouchDevice();
  const reduced = useReducedMotion();
  const hoverFx = !isTouch && !reduced; // desktop pointer devices only

  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<TiltAnimState | null>(null);

  const getState = useCallback((): TiltAnimState => {
    if (!animRef.current) animRef.current = createTiltState();
    return animRef.current;
  }, []);

  const stopLoop = useCallback(() => {
    const state = animRef.current;
    if (state && state.raf !== null) {
      cancelAnimationFrame(state.raf);
      state.raf = null;
    }
  }, []);

  /**
   * One rAF loop per card, liquid-button discipline: lerps tilt / glare /
   * zoom toward their targets with frame-rate independent steps, writes
   * styles straight to the DOM through refs, and CANCELS itself once
   * everything has settled — an idle card runs zero rAF.
   */
  const ensureLoop = useCallback(() => {
    const state = getState();
    if (state.raf !== null) return;
    state.lastT = performance.now();

    const tick = (now: number) => {
      const s = getState();
      const dt = Math.min(0.25, Math.max(0.001, (now - s.lastT) / 1000));
      s.lastT = now;
      const k = 1 - Math.pow(1 - TILT_LERP, dt * 60);
      s.rx += (s.trx - s.rx) * k;
      s.ry += (s.tyr - s.ry) * k;
      s.zoom += (s.tzoom - s.zoom) * k;
      s.gx += (s.tgx - s.gx) * k;
      s.gy += (s.tgy - s.gy) * k;

      const tiltEl = tiltRef.current;
      if (tiltEl) {
        if (Math.abs(s.rx) < 0.01 && Math.abs(s.ry) < 0.01) {
          if (tiltEl.style.transform !== "") tiltEl.style.transform = "";
        } else {
          tiltEl.style.transform = `perspective(1100px) rotateX(${s.rx.toFixed(3)}deg) rotateY(${s.ry.toFixed(3)}deg)`;
        }
      }

      const zoomEl = zoomRef.current;
      if (zoomEl) {
        if (Math.abs(s.zoom - 1) < 0.0008) {
          if (zoomEl.style.transform !== "") zoomEl.style.transform = "";
        } else {
          zoomEl.style.transform = `scale(${s.zoom.toFixed(4)})`;
        }
      }

      const glareEl = glareRef.current;
      if (glareEl) {
        glareEl.style.setProperty("--gx", `${s.gx.toFixed(2)}%`);
        glareEl.style.setProperty("--gy", `${s.gy.toFixed(2)}%`);
      }

      // Settle-and-stop: when every value has converged the loop stops
      // completely; the next pointer event restarts it.
      const settled =
        Math.abs(s.rx - s.trx) < SETTLE_TILT_DEG &&
        Math.abs(s.ry - s.tyr) < SETTLE_TILT_DEG &&
        Math.abs(s.zoom - s.tzoom) < SETTLE_ZOOM &&
        Math.abs(s.gx - s.tgx) < SETTLE_GLARE_PCT &&
        Math.abs(s.gy - s.tgy) < SETTLE_GLARE_PCT;

      if (settled) {
        s.raf = null;
        return;
      }
      s.raf = requestAnimationFrame(tick);
    };

    state.raf = requestAnimationFrame(tick);
  }, [getState]);

  const handlePointerEnter = useCallback(() => {
    if (!hoverFx) return;
    const s = getState();
    s.inside = true;
    s.tzoom = animationConfig.projectImageZoom;
    ensureLoop();
  }, [hoverFx, getState, ensureLoop]);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!hoverFx) return;
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      const s = getState();
      s.inside = true;
      // ≤ projectTiltMax — extremely subtle, reads as material not gimmick.
      s.tyr = (nx - 0.5) * 2 * animationConfig.projectTiltMax;
      s.trx = -(ny - 0.5) * 2 * animationConfig.projectTiltMax;
      s.tgx = nx * 100;
      s.tgy = ny * 100;
      s.tzoom = animationConfig.projectImageZoom;
      ensureLoop();
    },
    [hoverFx, getState, ensureLoop]
  );

  const handlePointerLeave = useCallback(() => {
    const s = getState();
    s.inside = false;
    s.trx = 0;
    s.tyr = 0;
    s.tzoom = 1;
    s.tgx = 50;
    s.tgy = 50;
    if (hoverFx) ensureLoop(); // glide back to rest, then the loop stops itself
  }, [hoverFx, getState, ensureLoop]);

  // Never leave a loop behind on unmount.
  useEffect(() => stopLoop, [stopLoop]);

  return (
    <div
      ref={rootRef}
      className="group/card relative"
      data-cursor="project"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* glass surface — token-driven, .card-lift owns the hover language */}
      <div className="card-lift glass relative overflow-hidden rounded-2xl">
        <div
          ref={tiltRef}
          className="relative will-change-transform [transform-style:preserve-3d]"
        >
          <div className="p-5 sm:p-6">
            {/* top row: #01 · category · (status only when the data has one) */}
            <div className="flex items-center justify-between gap-3">
              <span className="label-mono text-accent-deep dark:text-accent">#{project.number}</span>
              <div className="flex items-center gap-3">
                {project.category && (
                  <span className="label-mono text-muted-foreground">
                    {project.category}
                  </span>
                )}
                {project.status && (
                  <span
                    className={cn(
                      "label-mono inline-flex items-center gap-1.5",
                      project.status === "archived"
                        ? "text-faint"
                        : "text-accent-deep dark:text-accent"
                    )}
                  >
                    <span aria-hidden>{STATUS_META[project.status].dot}</span>
                    {STATUS_META[project.status].label}
                  </span>
                )}
              </div>
            </div>

            {/* cinematic screenshot reel — auto-plays like a mini video,
                pauses on hover/touch/focus, explorable with the arrows */}
            <CinematicReel
              images={project.images}
              projectTitle={project.title}
              staggerSeed={staggerSeed}
              zoomRef={zoomRef}
            />

            {/* condensed text — the depth lives in the editorial detail */}
            <h3 className="mt-5 font-display text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label={`${project.title} technologies`}
            >
              {techNames(project).map((name, i) => (
                <li
                  key={`${project.id}-tech-${i}`}
                  className="label-mono rounded-full border border-hairline px-3 py-1.5 text-muted-foreground"
                >
                  {name}
                </li>
              ))}
            </ul>

            {/* CTA — the same glass + clear water system as every button */}
            <div className="mt-5 border-t border-hairline pt-4">
              <LiquidButton
                variant="primary"
                onClick={() => onOpen(project.id)}
                ariaLabel={`View the ${project.title} case study`}
                className="px-6 py-2.5"
              >
                VIEW PROJECT
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </LiquidButton>
            </div>
          </div>

          {/* soft glare that follows the cursor (desktop pointer devices) */}
          {hoverFx && (
            <span
              ref={glareRef}
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
              style={{
                background:
                  "radial-gradient(42% 42% at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 45%, transparent 72%)",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ Editorial detail (deliberately NOT a card) ═════════ */

function ProjectDetail({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (id: string) => void;
}) {
  const names = techNames(project);
  const benefits = project.benefits;

  return (
    <div className="flex gap-5 sm:gap-7">
      {/* number + thin vertical hairline */}
      <div className="flex flex-col items-center gap-4 pt-2">
        <span className="label-mono text-accent-deep dark:text-accent">{project.number}</span>
        <span aria-hidden className="min-h-20 w-px flex-1 bg-hairline" />
      </div>

      {/* text stack — every block omitted when its data is absent */}
      <div className="min-w-0 flex-1">
        <p className="text-lg leading-relaxed text-ink">
          {project.description}
        </p>

        {project.problem && (
          <div className="mt-7">
            <p className="label-mono text-accent-deep dark:text-accent">THE PROBLEM</p>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
              {project.problem}
            </p>
          </div>
        )}

        {project.solution && (
          <div className="mt-7">
            <p className="label-mono text-accent-deep dark:text-accent">THE SOLUTION</p>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
              {project.solution}
            </p>
          </div>
        )}

        {benefits && benefits.length > 0 && (
          <div className="mt-7">
            <p className="label-mono text-accent-deep dark:text-accent">KEY BENEFITS</p>
            <ol className="mt-3.5 space-y-2.5">
              {benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  className="flex items-baseline gap-3 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="label-mono shrink-0 text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {benefit}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-7">
          <p className="label-mono text-accent-deep dark:text-accent">TECHNOLOGY</p>
          <p className="mt-2.5 font-mono text-xs leading-loose text-muted-foreground">
            {names.join("  ·  ")}
          </p>
        </div>

        <GlassChip
          type="button"
          onClick={() => onOpen(project.id)}
          aria-label={`Explore the ${project.title} case study`}
          className="label-mono mt-8 text-accent-deep dark:text-accent"
        >
          EXPLORE CASE STUDY
          <ArrowUpRight
            className="h-4 w-4"
            aria-hidden
          />
        </GlassChip>
      </div>
    </div>
  );
}

/* ══════════════════════════════ Section shell ═══════════════════════════ */

export default function ProjectsShowroom() {
  const [focusId, setFocusId] = useState<string | null>(null);

  const focusProject = useMemo(
    () => projects.find((p) => p.id === focusId) ?? null,
    [focusId]
  );

  const openFocus = useCallback((id: string) => setFocusId(id), []);

  return (
    <SectionShell
      id="projects"
      number="03"
      label="SELECTED WORK"
      heading={"Things I\u2019ve built."}
      intro="An editorial showroom of selected work — five projects, built to be used."
    >
      <div className="mt-14 space-y-24 sm:mt-16 sm:space-y-32">
        {projects.map((project, index) => {
          const cardLeft = index % 2 === 0; // even → card left · odd → detail left
          const baseDelay = index * animationConfig.projectRowStagger;
          /* Deterministic per-card reel offset — first automatic beats are
             spread across the interval so no two projects advance together. */
          const reelSeed =
            animationConfig.reelStaggerBase + index * animationConfig.reelStaggerStep;

          return (
            <article
              key={project.id}
              aria-label={`${project.title} — project ${project.number}`}
              className="relative"
            >
              {/* huge faint background number — behind content, never overflow */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -top-8 select-none font-display text-[7rem] font-medium leading-none sm:-top-12 sm:text-[9rem] lg:-top-16 lg:text-[11rem]",
                  cardLeft ? "right-0 sm:-right-4" : "left-0 sm:-left-4"
                )}
                style={{
                  color: "color-mix(in oklab, var(--ink) 5%, transparent)",
                }}
              >
                {project.number}
              </span>

              <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <Reveal
                  delay={baseDelay}
                  className={cn(!cardLeft && "lg:order-2")}
                >
                  <GlassProjectCard
                    project={project}
                    onOpen={openFocus}
                    staggerSeed={reelSeed}
                  />
                </Reveal>

                <Reveal
                  delay={baseDelay + 0.1}
                  className={cn(!cardLeft && "lg:order-1")}
                >
                  <ProjectDetail project={project} onOpen={openFocus} />
                </Reveal>
              </div>
            </article>
          );
        })}
      </div>

      <ProjectFocusMode
        project={focusProject}
        onClose={() => setFocusId(null)}
        onSelectProject={(id) => setFocusId(id)}
      />
    </SectionShell>
  );
}
