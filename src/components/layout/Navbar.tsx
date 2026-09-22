"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { Code2, Facebook, Github, Instagram, Menu, Music2, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { navItems, sectionIds } from "@/data/navigation";
import { profile } from "@/data/profile";
import { scrollToSection } from "@/components/shared/hooks";
import { ThemeToggle } from "./ThemeToggle";
import { GlassIconButton } from "@/components/shared/LiquidButton";
import { cn } from "@/lib/utils";

/* profile.socials ids → lucide icons (Code2 = Codeforces, Music2 = TikTok) */
const socialIcons: Record<string, LucideIcon> = {
  github: Github,
  codeforces: Code2,
  facebook: Facebook,
  instagram: Instagram,
  tiktok: Music2,
};

/**
 * Floating glass navbar.
 *  - ≥ md: full pill with all navItems, theme toggle next to the links.
 *  - < md: compact pill (signature mark + hamburger) with a slide-out menu.
 *  - Active section: IntersectionObserver over sectionIds, scroll-math fallback.
 *    A missing "home" section is handled gracefully (active stays null until "about").
 */
export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const updateActive = useCallback((id: string | null) => {
    setActiveSection((prev) => (prev === id ? prev : id));
  }, []);

  /**
   * Fallback when the observer reports nothing inside its band.
   * A missing "home" element simply never matches → active stays null
   * until "about" crosses the mark, exactly as specified.
   */
  const computeByScroll = useCallback(() => {
    const mark = window.innerHeight * 0.4;
    let current: string | null = null;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= mark) current = id;
    }
    updateActive(current);
  }, [updateActive]);

  /* Primary source: the most visible observed section. */
  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          );
        }
        const ranked = Array.from(ratios.entries()).sort((a, b) => b[1] - a[1]);
        const top = ranked[0];
        if (top && top[1] > 0) updateActive(top[0]);
        else computeByScroll();
      },
      { rootMargin: "-12% 0px -32% 0px", threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75, 1] }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [updateActive, computeByScroll]);

  /* Scroll-math fallback + glass background state (rAF-throttled). */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 24);
        computeByScroll();
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [computeByScroll]);

  /* Mobile menu: scroll lock, Escape to close, initial focus into the dialog. */
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    event.preventDefault(); // smooth scroll only — the URL stays untouched
    setMenuOpen(false);
    updateActive(id);
    scrollToSection(id);
  };

  const handleBrandClick = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  /* Small black-hole signature: dark circle inside an amber ring. */
  const brandMark = (
    <span
      aria-hidden
      className="relative flex h-4 w-4 shrink-0 items-center justify-center"
    >
      <span className="absolute inset-0 rounded-full border border-accent/70" />
      <span className="h-[7px] w-[7px] rounded-full bg-black" />
    </span>
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* ── Floating glass pill ─────────────────────────────────────────── */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto relative flex min-h-12 items-center gap-1 rounded-full py-1.5 pl-3 pr-1.5 md:gap-1.5 md:pl-4"
        >
          {/* stronger background once the page scrolls (> 24px) */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full bg-background/85 transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-0"
            )}
          />

          <button
            type="button"
            onClick={handleBrandClick}
            aria-label="Shalman Ahmed — back to top"
            className="relative flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-opacity duration-300 hover:opacity-75"
          >
            {brandMark}
            <span className="hidden font-display text-[0.95rem] tracking-[0.1em] text-ink lg:inline">
              {profile.displayName.toUpperCase()}
            </span>
          </button>

          <ul className="hidden items-center md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(event) => handleNavClick(event, item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative flex items-center px-1.5 py-3 font-mono text-[0.6rem] uppercase tracking-[0.11em] transition-colors duration-300 lg:px-2.5 lg:text-[0.66rem] lg:tracking-[0.15em]",
                      isActive
                        ? "text-accent-deep dark:text-accent"
                        : "text-foreground hover:text-accent-deep dark:hover:text-accent"
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-accent transition-all duration-300",
                        isActive ? "scale-100 opacity-100" : "scale-0 opacity-0"
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <GlassIconButton
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="md:hidden"
          >
            <Menu aria-hidden className="h-5 w-5" />
          </GlassIconButton>
        </nav>
      </header>

      {/* ── Mobile slide-out menu ───────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-[70] md:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 h-full w-full cursor-default bg-background/55 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              className="glass absolute right-0 top-0 flex h-full w-[84%] max-w-xs flex-col rounded-l-3xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-center justify-between px-5 pb-2 pt-5">
                <span className="label-mono text-muted-foreground">Menu</span>
                <GlassIconButton
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X aria-hidden className="h-5 w-5" />
                </GlassIconButton>
              </div>

              <motion.ul
                className="flex-1 overflow-y-auto px-3 py-2"
                initial="closed"
                animate="open"
                variants={{
                  open: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } },
                }}
              >
                {navItems.map((item) => (
                  <motion.li
                    key={item.id}
                    variants={{
                      closed: { opacity: 0, x: 28 },
                      open: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.35, ease: "easeOut" },
                      },
                    }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => handleNavClick(event, item.id)}
                      aria-current={activeSection === item.id ? "true" : undefined}
                      className={cn(
                        "flex min-h-12 items-center rounded-xl px-4 text-base transition-colors duration-300",
                        activeSection === item.id
                          ? "text-accent-deep dark:text-accent"
                          : "text-foreground hover:text-accent-deep dark:hover:text-accent"
                      )}
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>

              <div className="border-t border-hairline px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {profile.socials.map((social) => {
                      const Icon = socialIcons[social.id];
                      if (!Icon) return null;
                      return (
                        <a
                          key={social.id}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:text-accent-deep dark:hover:text-accent"
                        >
                          <Icon aria-hidden className="h-[18px] w-[18px]" />
                        </a>
                      );
                    })}
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
