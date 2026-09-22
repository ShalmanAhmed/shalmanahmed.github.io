import { cn } from "@/lib/utils";
import type { TechStatus } from "@/data/technologies";

const STATUS_LABELS: Record<TechStatus, string> = {
  verified: "Verified",
  "project-used": "Project Used",
  showcase: "Showcase",
  learning: "Learning",
  explored: "Explored",
};

const STATUS_STYLES: Record<TechStatus, string> = {
  verified:
    "border-accent/50 bg-accent-soft text-accent-deep dark:text-accent",
  "project-used":
    "border-sage/55 bg-sage-soft text-sage-deep dark:text-sage",
  showcase:
    "border-accent-gold/50 bg-accent-gold/12 text-accent-deep dark:text-accent-highlight",
  learning:
    "border-border bg-secondary text-ink-soft dark:text-ink-soft",
  explored:
    "border-border bg-transparent text-muted-foreground",
};

export function TechStatusBadge({
  status,
  className,
}: {
  status: TechStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 label-mono !text-[0.6rem] tracking-[0.14em]",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export function statusLabel(status: TechStatus): string {
  return STATUS_LABELS[status];
}
