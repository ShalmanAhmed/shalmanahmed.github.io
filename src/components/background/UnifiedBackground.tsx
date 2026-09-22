/**
 * UnifiedBackground — the page backdrop. Mounted once in page.tsx as a
 * fixed -z-10 layer behind everything (hero → footer).
 *
 * Layers (back → front):
 *   1. Static CSS base — 4 theme-aware radial washes built from design
 *      tokens (--background-secondary, --accent-soft, --muted-blue, --ink
 *      at low alpha). Pure paint: no particles, no blobs, no scroll
 *      parallax. Nothing here responds to the pointer.
 *   2. AURORA ambient light field — 4 huge, heavily diffused RGB light
 *      sources (soft cyan / blue / violet families, theme-tuned via
 *      --aurora-1..4 tokens) that drift VERY slowly on their own
 *      unsynchronized schedules (34s–58s alternate legs, opacity breath
 *      0.72→1). Pure radial-gradients + compositor-only transforms:
 *      no filter blur, no canvas, no particles, no waves. Radial-gradient
 *      falloff means the boundary of every light is never visible — the
 *      viewer sees LIGHT, never a CIRCLE.
 *      - Light theme: extremely subtle atmospheric tint (aqua / soft blue /
 *        tiny lavender) over the cream canvas.
 *      - Dark theme: the same field breathes more visibly (cyan / blue /
 *        violet) behind the Midnight Atelier navy.
 *      - Mobile: the 4th light is removed → 3 sources, less drift weight.
 *      - prefers-reduced-motion: the field stays, the movement stops.
 *   3. Static fine grain overlay (token dots, opacity 0.04) — the .grain
 *      motif.
 *
 * Depth contract: RGB LIGHT → BACKGROUND → GLASS → CONTENT. This layer is
 * always the lowest visual priority — it shows through translucent glass
 * cards as a faint tint and stays far behind the water buttons, text and
 * images. The ONLY interactive liquid on the site still lives INSIDE the
 * glass buttons (LiquidButton).
 */

/* A single diffused aurora light: an oversized radial-gradient pool with a
 * soft falloff (fully transparent at 72% of its radius) so its edge can
 * never be read as a shape. Size uses max() so lights stay large on small
 * viewports too. */
function AuroraLight({
  tone,
  className,
  style,
}: {
  tone: number;
  className?: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`aurora-light ${className ?? ""}`}
      style={{
        width: "max(430px, 52vmin)",
        height: "max(360px, 44vmin)",
        background: `radial-gradient(closest-side, var(--aurora-${tone}), transparent 72%)`,
        ...style,
      }}
    />
  );
}

export default function UnifiedBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Static tonal base: 4 token washes, theme-aware, never animated.
          Light "Warm Editorial Cream": a champagne glow and a slate whisper
          over the warm cream canvas — no green anywhere. Dark "Midnight
          Atelier": the same structure reads as faint amber/blue/ivory
          atmosphere over the navy. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 38% at 78% 6%, color-mix(in oklab, var(--background-secondary) 55%, transparent), transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 46% at 16% 8%, color-mix(in oklab, var(--accent-soft) 62%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(52% 44% at 86% 78%, color-mix(in oklab, var(--muted-blue) 8%, transparent), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(48% 40% at 6% 92%, color-mix(in oklab, var(--ink) 5%, transparent), transparent 70%)",
        }}
      />

      {/* ── Aurora ambient light field ──────────────────────────────────
          Four autonomous slow lights. Positions deliberately overlap the
          major regions of the page (top corners, mid, bottom) so every
          section receives some atmosphere, while transitions remain
          seamless — the field is fixed and never reacts to scrolling. */}
      {/* Light A — aqua/cyan, upper left, drifts left↔right (34s) */}
      <AuroraLight
        tone={1}
        className="aurora-a"
        style={{ left: "-10%", top: "-12%" }}
      />
      {/* Light B — soft blue, upper right, drifts right↔left (42s) */}
      <AuroraLight
        tone={2}
        className="aurora-b"
        style={{ right: "-12%", top: "16%" }}
      />
      {/* Light C — lavender/violet, middle-lower left, drifts top↔down (50s) */}
      <AuroraLight
        tone={3}
        className="aurora-c"
        style={{ left: "18%", bottom: "-14%" }}
      />
      {/* Light D — steel blue, lower right (desktop only — mobile keeps 3) */}
      <AuroraLight
        tone={4}
        className="aurora-d hidden sm:block"
        style={{ right: "2%", bottom: "-10%" }}
      />

      {/* Static fine grain (same motif as the .grain utility, softer) */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
    </div>
  );
}
