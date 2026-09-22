import { TechStatusBadge } from "@/components/shared/TechStatusBadge";
import { projectsForTechnology } from "@/data/projects";
import {
  databaseTechnologies,
  relatedFromSharedProjects,
} from "@/data/technologies";

/**
 * A calm, editorial focused view of the five database technologies.
 * Static rows (no expanders) — name + status + usage + deterministic
 * related projects and related technologies. Stacks on mobile.
 */
export function DatabaseExplorer() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <h3 className="font-display text-2xl sm:text-3xl">Database Explorer</h3>
        <p className="label-mono text-muted-foreground">
          {databaseTechnologies.map((tech) => tech.name).join(" · ")}
        </p>
      </div>

      <div className="mt-8 border-t border-hairline">
        {databaseTechnologies.map((tech) => {
          const relatedProjects = projectsForTechnology(tech.id);
          const relatedTechs = relatedFromSharedProjects(tech.id);

          return (
            <article
              key={tech.id}
              className="grid gap-5 border-b border-hairline py-8 md:grid-cols-[minmax(0,230px)_minmax(0,1fr)] md:gap-10"
            >
              <div>
                <h4 className="font-display text-xl sm:text-2xl">{tech.name}</h4>
                <div className="mt-3">
                  <TechStatusBadge status={tech.status} />
                </div>
                <p className="mt-3 label-mono text-muted-foreground">
                  {tech.level}
                </p>
              </div>

              <div className="space-y-4">
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {tech.description}
                </p>

                <p className="text-sm">
                  <span className="label-mono mr-3 text-muted-foreground">
                    Usage
                  </span>
                  {tech.usage.length > 0 ? (
                    <span>{tech.usage.join(" · ")}</span>
                  ) : (
                    <span className="italic text-ink-soft">
                      No project usage recorded yet.
                    </span>
                  )}
                </p>

                {relatedProjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="label-mono mr-1 text-muted-foreground">
                      Projects
                    </span>
                    {relatedProjects.map((project) => (
                      <span
                        key={project.id}
                        className="inline-flex items-center rounded-full border border-hairline bg-surface/70 px-3 py-1 text-xs"
                      >
                        {project.title}
                      </span>
                    ))}
                  </div>
                )}

                {relatedTechs.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="label-mono mr-1 text-muted-foreground">
                      Related
                    </span>
                    {relatedTechs.map((related) => (
                      <span
                        key={related.id}
                        className="inline-flex items-center rounded-full border border-hairline px-3 py-1 text-xs text-muted-foreground"
                      >
                        {related.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
