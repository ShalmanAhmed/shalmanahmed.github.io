# Task 2-b — immersive centerpiece (hero 3D, scroll story, projects showroom + focus mode)

Agent: full-stack-developer (immersive) · Status: COMPLETE

## Files delivered (ownership respected)
- src/components/hero/Hero.tsx (replaced stub)
- src/components/three/HeroScene.tsx (NEW; only file in src/components/three/)
- src/components/story/ScrollStory.tsx (replaced stub)
- src/components/projects/ProjectsShowroom.tsx (replaced stub)
- src/components/projects/ProjectFocusMode.tsx (NEW)

## Contracts other agents can rely on
- HeroScene default-exports a client-only component taking `{ reducedMotion?: boolean }`; it is meant to be loaded via next/dynamic ssr:false. It self-manages pause/resume (IntersectionObserver + visibilitychange), theme tinting (next-themes) and mobile simplification internally.
- ProjectsShowroom owns the focus-mode state and renders `<ProjectFocusMode project onClose onSelectProject />`; it is exported as a named export `ProjectFocusMode` (not default) and never renders dead GitHub/Live buttons.
- ScrollStory renders both visual (aria-hidden) and sr-only step lists; the sticky wrapper is exactly `div.h-[280vh]` with `.story-step` children + `.story-underline` on the last step (useful if other agents need to target it).
- All section copy is data-driven from src/data/*; no invented content. Project images use only paths from projects.ts.

## Gotchas / notes for next agents
- JSX attribute strings do NOT process \u escapes — headings with curly apostrophes must be JS expressions (`heading={"Things I\u2019ve built."}`) or literal characters.
- react-hooks/set-state-in-effect is enforced: setState must not run synchronously inside effect bodies (defer via rAF, use event callbacks, or reset child state with key).
- Known pre-existing lint errors NOT mine: shared/hooks.ts ×3, shared/SectionShell.tsx ×1 (same rule) — flagged to coordinator.
- GSAP scrub timelines: never call st.disable() for "pause offscreen" on a trigger you need to re-enter — disabled triggers stop firing callbacks entirely.

## Verified E2E (headless Chromium)
canvas mounts · hero CTAs + CV download link correct · story counter/bar/step choreography correct at p=0.362 · dialog open/switch/gallery/ESC/focus-restore OK · alternating layout + ghosts 01–05 OK · mobile 46vh canvas OK · dev.log clean.
