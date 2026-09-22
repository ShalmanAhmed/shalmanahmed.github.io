"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { GlassChip, GlassIconButton } from "@/components/shared/LiquidButton";
import {
  TechStatusBadge,
  statusLabel,
} from "@/components/shared/TechStatusBadge";
import { scrollToSection } from "@/components/shared/hooks";
import { projectsForTechnology, type Project } from "@/data/projects";
import {
  TECH_CATEGORIES,
  technologies,
  technologyById,
  relatedFromSharedProjects,
  type TechCategory,
  type Technology,
} from "@/data/technologies";
import { cn } from "@/lib/utils";

type CategoryFilter = "ALL" | TechCategory;
type TechSelectHandler = (id: string) => void;

/**
 * The connected technology map.
 *  - Category pills + search (matches name, category, status label and related project titles).
 *  - Selecting a technology opens a detail panel (sticky right on desktop, inline above the
 *    grid on mobile) with usage, related technologies (explicit + derived from shared
 *    projects) and related projects — multi-hop exploration.
 *  - Selection HIGHLIGHTS connections in the grid; it never hides cards.
 */
export function TechnologyExplorer() {
  const [activeTechId, setActiveTechId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();

  const visibleTechs = useMemo(() => {
    return technologies.filter((t) => {
      if (activeCategory !== "ALL" && t.category !== activeCategory) return false;
      if (!query) return true;
      const matchesProject = projectsForTechnology(t.id).some((p) =>
        p.title.toLowerCase().includes(query)
      );
      return (
        t.name.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        statusLabel(t.status).toLowerCase().includes(query) ||
        matchesProject
      );
    });
  }, [activeCategory, query]);

  const activeTech = activeTechId ? technologyById(activeTechId) : undefined;

  const relatedUnion = useMemo(
    () => (activeTech ? relatedFromSharedProjects(activeTech.id) : []),
    [activeTech]
  );
  const explicitIds = useMemo(
    () => new Set(activeTech?.relatedTechnologyIds ?? []),
    [activeTech]
  );
  const explicitRelated = relatedUnion.filter((t) => explicitIds.has(t.id));
  const derivedRelated = relatedUnion.filter((t) => !explicitIds.has(t.id));
  const highlightIds = useMemo(
    () => new Set(relatedUnion.map((t) => t.id)),
    [relatedUnion]
  );

  const activeProjects = activeTech ? projectsForTechnology(activeTech.id) : [];

  const pristine =
    activeTechId === null && activeCategory === "ALL" && search === "";

  const resetAll = () => {
    setActiveTechId(null);
    setActiveCategory("ALL");
    setSearch("");
  };

  // On mobile, bring the freshly opened detail panel into view.
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previouslySelected = useRef<string | null>(null);

  useEffect(() => {
    const wasUnselected = previouslySelected.current === null;
    previouslySelected.current = activeTechId;
    if (!activeTechId || !wasUnselected) return;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panelRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  }, [activeTechId]);

  return (
    <div>
      {/* ── Toolbar: search + reset + category pills ──────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search technology..."
              aria-label="Search technology"
              className="min-h-11 rounded-full border-hairline bg-secondary/70 pl-11 pr-11"
            />
            {search !== "" && (
              <GlassIconButton
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-1.5 top-1/2 size-8 -translate-y-1/2"
              >
                <X className="size-4" aria-hidden />
              </GlassIconButton>
            )}
          </div>
          <GlassChip type="button" onClick={resetAll} disabled={pristine} className="label-mono">
            <RotateCcw className="size-3.5" aria-hidden />
            All technologies
          </GlassChip>
        </div>

        <div
          role="group"
          aria-label="Filter technologies by category"
          className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0"
        >
          {TECH_CATEGORIES.map((category) => {
            const active = activeCategory === category.id;
            return (
              <GlassChip
                key={category.id}
                aria-pressed={active}
                active={active}
                onClick={() => setActiveCategory(category.id)}
                className="label-mono px-4"
              >
                {category.label}
              </GlassChip>
            );
          })}
        </div>
      </div>

      {/* ── Detail panel (above grid on mobile, sticky right column on lg) ── */}
      <div className="mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8">
        <div ref={panelRef} className="scroll-mt-24 lg:col-start-2 lg:row-start-1">
          <div className="lg:sticky lg:top-28">
            {activeTech ? (
              <TechDetailPanel
                tech={activeTech}
                explicitRelated={explicitRelated}
                derivedRelated={derivedRelated}
                projects={activeProjects}
                onSelect={setActiveTechId}
                onClear={() => setActiveTechId(null)}
              />
            ) : (
              <div
                aria-hidden
                className="hidden rounded-2xl border border-dashed border-hairline p-8 text-center lg:block"
              >
                <p className="label-mono text-muted-foreground">
                  Select a technology
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  Its usage, related technologies and projects will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Technology grid ─────────────────────────────────────────────── */}
        <div className="mt-6 lg:col-start-1 lg:row-start-1 lg:mt-0">
          {visibleTechs.length > 0 ? (
            <div className="max-h-[70vh] overflow-y-auto pb-2 pr-1 lg:max-h-[calc(100vh-15rem)]">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {visibleTechs.map((tech) => {
                  const selected = activeTechId === tech.id;
                  const highlighted = highlightIds.has(tech.id);
                  return (
                    <li key={tech.id}>
                      <TechCard
                        tech={tech}
                        selected={selected}
                        highlighted={highlighted}
                        dimOthers={activeTechId !== null}
                        onSelect={setActiveTechId}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-hairline p-8 text-center">
              <p className="label-mono text-muted-foreground">No matches</p>
              <p className="mt-2 max-w-xs text-sm text-ink-soft">
                No technologies match the current search or category.
              </p>
              <GlassChip type="button" onClick={resetAll} className="mt-4 label-mono">
                <RotateCcw className="size-3.5" aria-hidden />
                Reset filters
              </GlassChip>
            </div>
          )}
          <p className="mt-3 label-mono text-muted-foreground" aria-live="polite">
            Showing {visibleTechs.length} / {technologies.length} technologies
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Grid card ─────────────────────────────────────────────────────────────── */

function TechCard({
  tech,
  selected,
  highlighted,
  dimOthers,
  onSelect,
}: {
  tech: Technology;
  selected: boolean;
  highlighted: boolean;
  dimOthers: boolean;
  onSelect: TechSelectHandler;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(tech.id)}
      aria-pressed={selected}
      className={cn(
        "flex h-full min-h-32 w-full flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-300",
        selected
          ? "border-accent/70 bg-accent-soft ring-2 ring-accent/50"
          : highlighted
            ? "border-accent/40 bg-accent-soft/60 ring-1 ring-accent/30"
            : "border-hairline bg-surface/70 hover:border-accent/40 hover:bg-accent-soft/40",
        activeTechDimmed(dimOthers, selected, highlighted) && "opacity-40"
      )}
    >
      <span className="flex w-full items-start justify-between gap-2">
        <span className="font-semibold leading-snug">{tech.name}</span>
        {tech.verified && (
          <>
            <BadgeCheck className="size-4 shrink-0 text-accent" aria-hidden />
            <span className="sr-only">Verified technology</span>
          </>
        )}
      </span>
      <span className="label-mono text-muted-foreground">{tech.category}</span>
      <TechStatusBadge status={tech.status} />
      <span className="mt-auto pt-1 text-xs text-ink-soft">
        {tech.level}
      </span>
    </button>
  );
}

function activeTechDimmed(
  dimOthers: boolean,
  selected: boolean,
  highlighted: boolean
) {
  // Dim unfocused cards ONLY while a technology is selected — never by
  // default. An idle grid must stay fully opaque and readable.
  return dimOthers && !selected && !highlighted;
}

/* ── Detail panel ──────────────────────────────────────────────────────────── */

function TechDetailPanel({
  tech,
  explicitRelated,
  derivedRelated,
  projects,
  onSelect,
  onClear,
}: {
  tech: Technology;
  explicitRelated: Technology[];
  derivedRelated: Technology[];
  projects: Project[];
  onSelect: TechSelectHandler;
  onClear: () => void;
}) {
  return (
    <div className="glass rounded-2xl p-6 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-mono text-muted-foreground">{tech.category}</p>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl">
            {tech.name}
            {tech.verified && (
              <>
                {" "}
                <BadgeCheck className="inline size-5 text-accent" aria-hidden />
                <span className="sr-only"> (verified)</span>
              </>
            )}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <TechStatusBadge status={tech.status} />
            <span className="label-mono text-muted-foreground">{tech.level}</span>
          </div>
        </div>
        <GlassIconButton
          type="button"
          onClick={onClear}
          aria-label="Clear selected technology"
          className="size-11"
        >
          <X className="size-4" aria-hidden />
        </GlassIconButton>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
        {tech.description}
      </p>

      <div className="my-5 h-px bg-hairline" />

      <section aria-label="Project usage">
        <p className="label-mono text-muted-foreground">Usage</p>
        {tech.usage.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {tech.usage.map((use) => (
              <li key={use} className="flex items-start gap-2.5 text-sm">
                <span
                  aria-hidden
                  className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm italic text-ink-soft">
            No project usage recorded yet.
          </p>
        )}
      </section>

      {(explicitRelated.length > 0 || derivedRelated.length > 0) && (
        <section aria-label="Related technologies" className="mt-6">
          <p className="label-mono text-muted-foreground">Related technologies</p>
          {explicitRelated.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {explicitRelated.map((related) => (
                <RelatedChip
                  key={related.id}
                  tech={related}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
          {derivedRelated.length > 0 && (
            <>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Via shared projects
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {derivedRelated.map((related) => (
                  <RelatedChip
                    key={related.id}
                    tech={related}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      )}

      <section aria-label="Related projects" className="mt-6">
        <p className="label-mono text-muted-foreground">Related projects</p>
        {projects.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection("projects")}
                  aria-label={`View ${project.title} in the projects section`}
                  className="flex w-full items-center gap-3 rounded-xl border border-hairline bg-surface/60 p-2 text-left transition-colors hover:border-accent/40 hover:bg-accent-soft/40"
                >
                  <Image
                    src={project.images[0]}
                    alt={`${project.title} preview`}
                    width={64}
                    height={64}
                    className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {project.title}
                    </span>
                    <span className="label-mono text-muted-foreground">
                      View in projects
                    </span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm italic text-ink-soft">
            Not used in any supplied project.
          </p>
        )}
      </section>
    </div>
  );
}

function RelatedChip({
  tech,
  onSelect,
}: {
  tech: Technology;
  onSelect: TechSelectHandler;
}) {
  return (
    <GlassChip
      type="button"
      onClick={() => onSelect(tech.id)}
      title={tech.name}
      className="min-h-10 px-3.5 text-xs"
    >
      {tech.name}
    </GlassChip>
  );
}
