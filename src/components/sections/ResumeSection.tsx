"use client";

import { Download } from "lucide-react";
import { LiquidButton } from "@/components/shared/LiquidButton";
import { Reveal } from "@/components/shared/SectionShell";
import { profile } from "@/data/profile";

/**
 * RESUME — centered glass band with a working download button.
 * The CV file exists on disk, so the button is always real (no placeholder).
 */
export default function ResumeSection() {
  return (
    <section
      id="resume"
      aria-label="Resume"
      className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20"
    >
      <Reveal>
        <div className="glass rounded-3xl px-6 py-14 text-center sm:px-12">
          <p className="label-mono text-accent-deep dark:text-accent">Resume</p>
          <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            The one-page overview.
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
            Everything above, condensed into a single PDF.
          </p>
          <div className="mt-9 flex justify-center">
            <LiquidButton
              href={profile.resume.file}
              download={profile.resume.downloadName}
              variant="primary"
              ariaLabel={`Download resume PDF (${profile.resume.downloadName})`}
            >
              <Download className="size-4" aria-hidden />
              Download resume
            </LiquidButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
