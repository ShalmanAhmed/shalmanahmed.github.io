import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { services } from "@/data/services";

/**
 * SERVICES — editorial numbered rows separated by hairlines (no card grid).
 * Desktop hover: subtle amber left rule + indent shift, ghost numeral tints amber.
 * Rows are not links — tap does nothing, hover is purely decorative.
 */
export default function Services() {
  return (
    <SectionShell
      id="services"
      label="Services"
      heading="What I do."
      className="py-14 sm:py-20"
    >
      <div className="mt-10 border-t border-hairline sm:mt-14">
        {services.map((service, index) => (
          <Reveal key={service.id} delay={index * 0.06}>
            <div className="group relative border-b border-hairline py-8 sm:py-10">
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-accent transition-transform duration-500 ease-out group-hover:scale-y-100"
              />
              <div className="grid gap-3 transition-transform duration-500 ease-out group-hover:translate-x-3 md:grid-cols-[minmax(0,150px)_minmax(0,1fr)_minmax(0,1.2fr)] md:items-baseline md:gap-8">
                <span
                  aria-hidden
                  className="font-display text-5xl font-medium leading-none text-ink/10 transition-colors duration-500 group-hover:text-accent/40 sm:text-6xl"
                >
                  {service.number}
                </span>
                <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                  {service.title}
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {service.blurb}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
