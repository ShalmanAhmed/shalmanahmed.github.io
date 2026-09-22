import { Check, MapPin } from "lucide-react";
import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { ProfileCard } from "./ProfileCard";
import { profile } from "@/data/profile";

/**
 * 01 — ABOUT. Split-screen editorial layout:
 * left: 3D flip profile card; right: serif about text + focus-area checklist.
 */
export default function About() {
  const ageFact = profile.about.facts.find((fact) => fact.label === "Age");

  return (
    <SectionShell
      id="about"
      number="01"
      label="About"
      heading="More than just code."
      className="py-14 sm:py-20"
    >
      <div className="mt-10 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-12">
        {/* Left — circular profile flip card (centered in its column) */}
        <Reveal className="flex items-start justify-center lg:col-span-5">
          <ProfileCard />
        </Reveal>

        {/* Right — editorial text column */}
        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <figure className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-7 -left-1 select-none font-display text-8xl leading-none text-accent/25"
              >
                &ldquo;
              </span>
              <blockquote className="relative font-display text-xl leading-[1.7] text-ink sm:text-2xl sm:leading-[1.65]">
                <span className="float-left mr-3 hidden text-[2.6em] leading-[0.85] text-accent sm:block">
                  {profile.about.text.charAt(0)}
                </span>
                {profile.about.text.slice(1)}
              </blockquote>
            </figure>
          </Reveal>

          <div className="my-9 h-px bg-hairline" aria-hidden />

          <Reveal delay={0.14}>
            <p className="label-mono text-muted-foreground">Focus areas</p>
            <ul className="mt-5 grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
              {profile.about.focusAreas.map((area) => (
                <li key={area} className="flex items-start gap-3">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-accent"
                    aria-hidden
                  />
                  <span className="text-sm leading-relaxed sm:text-[0.95rem]">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="my-9 h-px bg-hairline" aria-hidden />

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                <MapPin className="size-3.5 text-accent" aria-hidden />
                {profile.contact.location}
              </span>
              {ageFact && (
                <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                  <span
                    aria-hidden
                    className="size-1.5 rounded-full bg-accent"
                  />
                  Age {ageFact.value}
                </span>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
