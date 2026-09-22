"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projectsForTechnology, type Project } from "@/data/projects";
import { technologyById, type Technology } from "@/data/technologies";
import { TechStatusBadge } from "@/components/shared/TechStatusBadge";
import {
  GlassChip,
  GlassIconButton,
} from "@/components/shared/LiquidButton";
import { cn } from "@/lib/utils";

/**
 * ProjectFocusMode — cinematic full-screen project view.
 *
 * Truth rules: GitHub / Live Demo buttons render ONLY if the data carries
 * real URLs (all are null today, so they never appear). Related-project
 * links are derived deterministically from the shared technology arrays.
 */

interface ProjectFocusModeProps {
  project: Project | null;
  onClose: () => void;
  onSelectProject: (id: string) => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ── Gallery: keyed by project id so its state resets on project switch ──── */

function ProjectGallery({ project }: { project: Project }) {
  const [mainIndex, setMainIndex] = useState(0);
  const [mainLoaded, setMainLoaded] = useState(false);

  const galleryKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const total = project.images.length;
      if (total < 2) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setMainIndex((v) => (v + 1) % total);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setMainIndex((v) => (v - 1 + total) % total);
      }
    },
    [project]
  );

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label={`${project.title} gallery — use left and right arrow keys to switch screenshots`}
      onKeyDown={galleryKeyDown}
      className="mt-10 rounded-2xl outline-offset-4"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-hairline bg-secondary">
        {!mainLoaded && (
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-secondary via-background to-secondary"
          />
        )}
        <Image
          key={project.images[mainIndex]}
          src={project.images[mainIndex]}
          alt={`${project.title} — screenshot ${mainIndex + 1}`}
          fill
          sizes="100vw"
          priority
          onLoad={() => setMainLoaded(true)}
          className={cn(
            "object-cover transition-opacity duration-500",
            mainLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {project.images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {project.images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setMainIndex(i)}
              aria-label={`Show screenshot ${i + 1} of ${project.title}`}
              aria-current={i === mainIndex}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
                i === mainIndex
                  ? "border-accent opacity-100 ring-1 ring-accent"
                  : "border-border opacity-60 hover:opacity-100"
              )}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Focus mode overlay ────────────────────────────────────────────────────── */

export function ProjectFocusMode({
  project,
  onClose,
  onSelectProject,
}: ProjectFocusModeProps) {
  const isOpen = Boolean(project);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  /* Open: lock body scroll + move focus into the dialog. */
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /* Close: restore focus to the trigger element. */
  useEffect(() => {
    if (isOpen) return;
    const el = lastFocused.current;
    if (el && typeof el.focus === "function") el.focus();
    lastFocused.current = null;
  }, [isOpen]);

  /* ESC closes. */
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const techs: Technology[] = project
    ? project.technologies
        .map(technologyById)
        .filter((t): t is Technology => Boolean(t))
    : [];

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {project && (
          <motion.div
            key="focus-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] overflow-y-auto"
          >
            {/* dimmed + blurred backdrop */}
            <motion.button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onClick={onClose}
              className="fixed inset-0 cursor-default bg-background/80 backdrop-blur-xl"
            />

            {/* content panel — desktop: centered sheet; mobile: full-height bottom sheet */}
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="glass-strong relative z-10 mx-auto my-[4vh] w-[calc(100%-2rem)] max-w-6xl rounded-3xl max-md:mx-0 max-md:my-0 max-md:min-h-[100dvh] max-md:w-full max-md:rounded-b-none max-md:rounded-t-3xl"
            >
              <div className="p-5 pb-[calc(4rem+env(safe-area-inset-bottom))] sm:p-8 lg:p-12">
                {/* close */}
                <GlassIconButton
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project view"
                  className="absolute right-4 top-4 z-20"
                >
                  <X className="h-5 w-5" aria-hidden />
                </GlassIconButton>

                {/* header */}
                <p className="label-mono text-accent-deep dark:text-accent">PROJECT {project.number}</p>
                <h3 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                  {project.title}
                </h3>
                <p className="mt-5 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground sm:text-base">
                  {project.description}
                </p>

                {/* features — only where the data provides real ones */}
                {project.features.length > 0 && (
                  <div className="mt-9">
                    <p className="label-mono text-muted-foreground">KEY FEATURES</p>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5">
                          <span
                            aria-hidden
                            className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          />
                          <span className="text-sm leading-relaxed text-ink-soft">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* technologies + derived related projects */}
                <div className="mt-10">
                  <p className="label-mono text-muted-foreground">TECHNOLOGIES</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {techs.map((tech) => {
                      const related = projectsForTechnology(tech.id).filter(
                        (p) => p.id !== project.id
                      );
                      return (
                        <div
                          key={tech.id}
                          className="rounded-xl border border-hairline bg-accent-soft/40 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-ink">{tech.name}</span>
                            <TechStatusBadge status={tech.status} />
                          </div>
                          {related.length > 0 && (
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-hairline pt-3">
                              <span className="label-mono !text-[0.55rem] text-muted-foreground">
                                ALSO IN
                              </span>
                              {related.map((rp) => (
                                <button
                                  key={rp.id}
                                  type="button"
                                  onClick={() => onSelectProject(rp.id)}
                                  className="inline-flex items-center gap-1 label-mono !text-[0.6rem] tracking-[0.14em] text-accent-deep underline-offset-4 transition-colors hover:underline dark:text-accent"
                                >
                                  {rp.title}
                                  <ArrowUpRight className="h-3 w-3" aria-hidden />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <ProjectGallery key={project.id} project={project} />

                {/* Links render only when real URLs exist in the data.
                    Today every project has githubUrl/liveUrl = null → never shown. */}
                {(project.githubUrl || project.liveUrl) && (
                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.githubUrl && (
                      <GlassChip
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-mono px-6 text-ink dark:text-foreground"
                      >
                        VIEW SOURCE
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </GlassChip>
                    )}
                    {project.liveUrl && (
                      <GlassChip
                        variant="primary"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="label-mono px-6 text-accent-deep dark:text-accent"
                      >
                        LIVE DEMO
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </GlassChip>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
