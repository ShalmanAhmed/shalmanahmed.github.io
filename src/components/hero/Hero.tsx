"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  Code2,
  Download,
  Facebook,
  Github,
  Globe,
  Instagram,
  Music2,
  type LucideIcon,
} from "lucide-react";
import { profile, type SocialLink } from "@/data/profile";
import {
  GlassIconButton,
  LiquidButton,
} from "@/components/shared/LiquidButton";
import { scrollToSection, useReducedMotion } from "@/components/shared/hooks";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  github: Github,
  codeforces: Code2,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
};

/* ── Scroll cue ───────────────────────────────────────────────────────────── */
function ScrollCue({ animated }: { animated: boolean }) {
  const line = (
    <>
      <span className="h-px w-10 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <span className="relative block h-10 w-px overflow-hidden bg-border">
        <span className="absolute left-0 top-0 h-4 w-px bg-accent" />
      </span>
      <span className="label-mono !text-[0.6rem] text-muted-foreground">SCROLL</span>
    </>
  );
  if (!animated) {
    return (
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
        {line}
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
      <span className="h-px w-10 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <motion.span
        animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative block h-10 w-px overflow-hidden bg-border"
      >
        <span className="absolute left-0 top-0 h-4 w-px bg-accent" />
      </motion.span>
      <span className="label-mono !text-[0.6rem] text-muted-foreground">SCROLL</span>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
/* Editorial hero: pure typography floating over the site's fixed
 * UnifiedBackground layer. Static and lightweight by design — no canvas,
 * no animation loop, no continuous computation. */

export default function Hero() {
  const reducedMotion = useReducedMotion();

  const socialIcon = (social: SocialLink): LucideIcon =>
    SOCIAL_ICONS[social.id] ?? Globe;

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-center px-5 pb-28 pt-28 sm:px-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-accent" />
            <p className="label-mono text-muted-foreground">{profile.hero.label}</p>
          </div>

          <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.06] tracking-tight text-ink sm:text-6xl lg:text-[4.15rem]">
            {profile.hero.title}
          </h1>

          <p className="mt-5 font-display text-xl leading-snug text-muted-blue sm:text-2xl">
            {profile.hero.subtitle}
          </p>

          <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            {profile.hero.support}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <LiquidButton
              variant="primary"
              onClick={() => scrollToSection(profile.hero.primaryCta.targetSection)}
              ariaLabel="Scroll to my projects"
            >
              {profile.hero.primaryCta.label}
              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            </LiquidButton>
            <LiquidButton
              variant="secondary"
              href={profile.hero.secondaryCta.href ?? undefined}
              download={profile.hero.secondaryCta.downloadName ?? undefined}
              ariaLabel="Download resume PDF"
            >
              {profile.hero.secondaryCta.label}
              <Download className="h-3.5 w-3.5" aria-hidden />
            </LiquidButton>
          </div>

          <div className="mt-10 max-w-xl border-t border-border/60 pt-5">
            <p className="label-mono !text-[0.62rem] text-muted-foreground">
              CHITTAGONG, BANGLADESH · CSE STUDENT · WEB DEVELOPER INTERN
            </p>
            <ul className="mt-4 flex items-center gap-1" aria-label="Social profiles">
              {profile.socials.map((social) => {
                const Icon = socialIcon(social);
                return (
                  <li key={social.id}>
                    <GlassIconButton
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in new tab)`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </GlassIconButton>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <ScrollCue animated={!reducedMotion} />
    </section>
  );
}
