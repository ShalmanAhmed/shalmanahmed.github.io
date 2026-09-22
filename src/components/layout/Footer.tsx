"use client";

import { ArrowUp, Code2, Facebook, Github, Instagram, Music2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { navItems } from "@/data/navigation";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/components/shared/hooks";
import { GlassIconButton } from "@/components/shared/LiquidButton";

/* Quick-nav subset specified for the footer, resolved against navItems data. */
const FOOTER_NAV_IDS = [
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "contact",
];

const socialIcons: Record<string, LucideIcon> = {
  github: Github,
  codeforces: Code2,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
};

/**
 * Editorial footer — the "BLACK HOLE" creative signature, quick navigation,
 * real social links, back-to-top and a quiet mono copyright line.
 * `mt-auto` keeps it pinned to the bottom of the viewport on short pages.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const quickLinks = navItems.filter((item) => FOOTER_NAV_IDS.includes(item.id));

  const handleBackToTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <footer className="grain relative mt-auto overflow-hidden border-t border-hairline">
      {/* ambient gradient band */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background/70 to-secondary/40"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-8 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Creative signature */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex items-center gap-4">
              <span
                aria-hidden
                className="relative flex h-10 w-10 shrink-0 items-center justify-center"
              >
                <span className="absolute inset-0 rounded-full border border-accent/50" />
                <span className="h-[18px] w-[18px] rounded-full bg-black shadow-[0_0_20px_-2px_var(--accent)]" />
              </span>
              <p className="font-display text-3xl tracking-[0.06em] text-ink md:text-4xl">
                {profile.alias}
              </p>
            </div>
            <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-ink">
              {profile.name.toUpperCase()}
            </p>
            <div className="mt-4 space-y-1.5">
              <p className="label-mono text-muted-foreground">CSE</p>
              <p className="label-mono text-muted-foreground">
                Front-End / Web Development
              </p>
            </div>
          </div>

          {/* Quick navigation */}
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="label-mono text-muted-foreground">Navigate</p>
            <ul className="mt-5 space-y-1">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="group flex min-h-10 items-center text-left text-sm text-ink-soft transition-colors duration-300 hover:text-accent-deep dark:hover:text-accent"
                  >
                    <span
                      aria-hidden
                      className="mr-3 h-px w-4 bg-foreground/25 transition-all duration-300 group-hover:w-6 group-hover:bg-accent"
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social links — real URLs only, no LinkedIn (not in data) */}
          <div className="md:col-span-3">
            <p className="label-mono text-muted-foreground">Elsewhere</p>
            <ul className="mt-5 space-y-1">
              {profile.socials.map((social) => {
                const Icon = socialIcons[social.id];
                if (!Icon) return null;
                return (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-10 items-center gap-3 text-sm text-ink-soft transition-colors duration-300 hover:text-accent-deep dark:hover:text-accent"
                    >
                      <Icon
                        aria-hidden
                        className="h-4 w-4 text-muted-foreground transition-colors duration-300 group-hover:text-accent"
                      />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-start gap-6 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.65rem] tracking-[0.12em] text-muted-foreground">
            © {year} Shalman Ahmed Nizum. All rights reserved.
          </p>
          <GlassIconButton
            type="button"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            <ArrowUp
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5"
            />
          </GlassIconButton>
        </div>
      </div>
    </footer>
  );
}
