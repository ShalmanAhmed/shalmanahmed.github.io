/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CENTRAL ANIMATION CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * The single place to tune every time-based visual behaviour on the site.
 * Components import from here — the same value is never hard-coded in
 * multiple components. Edit a number here and the whole site follows.
 */

export const animationConfig = {
  /* ── Signature intro (handwritten "Shalman" → hero) ──────────────────────
   * The opening shows a handwritten signature being DRAWN (SVG stroke
   * animation), not typed text. Total = signatureIntroDuration (2000ms).
   *   0–150        ink frame settles, the pen touches down
   *   150–1000     main signature strokes are drawn (one continuous mark)
   *   1000–1400    final flourish completes
   *   1400–1700    signature held clearly visible
   *   1700–2000    smooth fade into the already-rendered hero
   * Nothing is awaited — purely time-based, resources load in parallel. */
  signatureIntroDuration: 2000, // ms total before the overlay is removed
  signatureDrawDelay: 150, // ms — pen touches down after the frame settles
  signatureDrawDuration: 850, // ms — main strokes drawn (ends at 1000ms)
  signatureFlourishDelay: 1000, // ms — flourish/underline starts
  signatureFlourishDuration: 400, // ms — flourish completes (ends at 1400ms)
  signatureSubtextDelay: 1150, // ms — small SHALMAN AHMED NIZUM line fades in
  signatureExitStart: 1700, // ms — hold ends, exit transition begins
  signatureExitDuration: 300, // ms — final fade into the hero (ends at 2000ms)

  /* ── Projects entrance: scattered → convergence → assembly ─────────────── */
  projectEntranceDuration: 0.9, // s — card fly-in duration
  projectStagger: 0.12, // s — delay between consecutive cards
  projectScatterStrength: 1, // multiplier for scatter offsets (0 = straight fade)
  imageAssemblyDuration: 0.7, // s — screenshot settles into the card
  imageAssemblyDelay: 0.4, // s — after its card starts converging

  /* ── Alternating project showcase ────────────────────────────────────────
   * Each project is a full-width row: glass card + editorial detail, sides
   * alternate by index. Hover: gentle lift, image zoom, subtle tilt. */
  projectRowStagger: 0.08, // s entrance stagger between rows
  projectImageZoom: 1.04, // hover image zoom inside the glass frame
  projectTiltMax: 1.6, // deg — extremely subtle 3D tilt (desktop only)

  /* ── Cinematic project reel (auto-playing screenshots in every card) ──────
   * Each card plays its image array like a tiny product video: every
   * screenshot holds for slideshowInterval while its own Ken Burns camera
   * move (zoom + drift) plays, then dissolves into the next one with a
   * blur-to-sharp crossfade. Cards carry a deterministic stagger offset so
   * projects never advance in sync; hover / touch / keyboard focus pauses
   * the clock, manual arrows reset it, and reduced motion gets manual-only
   * navigation with no autoplay. */
  slideshowInterval: 3400, // ms each screenshot stays on screen (3–4s)
  reelEnterDuration: 900, // ms blur-to-sharp crossfade entrance (0.8–1.2s)
  reelKbDuration: 4400, // ms per Ken Burns leg (zoom + drift, alternate loop)
  reelStaggerBase: 400, // ms before the very first automatic advance
  reelStaggerStep: 900, // ms between consecutive cards' first beats

  /* ── Profile flip card ──────────────────────────────────────────────────── */
  profileFlipDuration: 650, // ms 3D flip

  /* ── Magnetic water buttons (glass + clear water physics) ────────────────
   * Every glass button holds ONE coherent liquid mass attracted toward the
   * cursor like a magnet. The pointer only ever sets the TARGET — a single
   * spring-damper simulation owns the motion:
   *
   *     force = stiffness × (target − position) − damping × velocity
   *
   * PRIMARY motion   → the whole water mass translates toward the cursor.
   * SECONDARY motion → the surface tilts a fraction of a degree from the
   * mass's own velocity (leading side rises slightly); deformation is
   * derived from the mass and never animated independently. Idle water is
   * perfectly still; the rAF loop cancels itself once the mass settles. */
  waterSpringStiffness: 120, // k — attraction strength (80–160 typical)
  waterSpringDamping: 15, // c — heavy, controlled settle (slightly under-damped)
  waterSpringMass: 1,
  waterMaxDisplacementX: 0.32, // max horizontal shift, × button width
  waterMaxDisplacementY: 0.1, // max vertical shift, × button height
  waterVerticalGain: 0.8, // vertical response weight (horizontal dominates)
  waterTiltGain: 0.012, // deg of surface tilt per px/s of horizontal velocity
  waterTiltMaxDeg: 1.2, // hard cap — deformation stays a whisper
  waterPressImpulse: 150, // px/s downward velocity on press (liquid compression)
  waterConvergePositionPx: 0.35, // "arrived" threshold, px
  waterConvergeVelocityPps: 4, // "at rest" threshold, px/s

  /* ── Unified background (FULLY STATIC by design) ──────────────────────────
   * No particles, no blobs, no drifting light, no cursor water on the page:
   * the ONLY liquid on the site lives inside the glass buttons. */

  /* ── Count-up numbers ───────────────────────────────────────────────────── */
  skillCounterDuration: 1500, // ms 0 → target for language percentage bars
  sectionNumberDuration: 550, // ms section-number roll (01 — ABOUT)
  countUpDuration: 1800, // ms big numbers (200+ etc.)

  /* ── Motivation (compact storytelling, reveal ONCE on view) ───────────────
   * The section reveals as a directed cinematic sequence when ~30% enters
   * the viewport: label → descriptor → word-by-word statement (fast human
   * typing feel, complete ≤ ~1.2s) → softer closing line → attribution.
   * After it completes everything stays STATIC — no loops, nothing hides. */
  motivationRevealStep: 0.15, // s between consecutive supporting lines
  motivationRevealDuration: 0.45, // s each supporting line takes to appear
  motivationStatementDelay: 0.28, // s — label + descriptor lead before word one
  motivationWordStagger: 0.11, // s between BUILD / FAIL / LEARN / REPEAT (80–140ms)
  motivationWordDuration: 0.5, // s each word takes to blur-to-sharp
  motivationForwardGap: 0.26, // s pause after the statement before the closing line
  motivationTokenStagger: 0.09, // s between closing-line word tokens
};

export type AnimationConfig = typeof animationConfig;
