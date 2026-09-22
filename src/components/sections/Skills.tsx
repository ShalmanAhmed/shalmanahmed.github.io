import { SectionShell, Reveal } from "@/components/shared/SectionShell";
import { TechnologyExplorer } from "./TechnologyExplorer";
import { DatabaseExplorer } from "./DatabaseExplorer";
import { LanguageProficiency } from "./LanguageProficiency";

/**
 * 02 — SKILLS. The signature section: verified language proficiency graphs,
 * then a connected technology map (TechnologyExplorer) and a focused
 * DatabaseExplorer.
 */
export default function Skills() {
  return (
    <SectionShell
      id="skills"
      number="02"
      label="Skills"
      heading="A connected technology map."
      intro="Every technology links to the technologies it shares projects with, and to the projects where it was actually used. Select any technology to trace its connections — or search to find one quickly. Selection highlights connections; nothing is ever hidden."
      className="py-14 sm:py-20"
    >
      <Reveal delay={0.16} className="mt-10 sm:mt-12">
        <LanguageProficiency />
      </Reveal>

      <div className="mt-12 h-px bg-hairline" aria-hidden />

      <Reveal delay={0.18}>
        <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.24em] text-muted-foreground">
          Technology <span className="text-accent">→</span> Related technologies{" "}
          <span className="text-accent">→</span> Projects
        </p>
      </Reveal>

      <Reveal delay={0.22} className="mt-6">
        <TechnologyExplorer />
      </Reveal>

      <div className="mt-16 border-t border-hairline pt-12 sm:mt-24 sm:pt-14">
        <Reveal>
          <DatabaseExplorer />
        </Reveal>
      </div>
    </SectionShell>
  );
}
