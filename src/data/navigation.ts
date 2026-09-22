import { profile } from "./profile";

export interface NavItem {
  id: string;
  label: string;
  enabled: boolean;
}

/**
 * Global navigation — mirrors the master prompt.
 * Certificates section is hidden (no real certificates) → no nav item for it.
 */
export const navItems: NavItem[] = [
  { id: "home", label: "Home", enabled: true },
  { id: "about", label: "About", enabled: true },
  { id: "skills", label: "Skills", enabled: true },
  { id: "services", label: "Services", enabled: true },
  { id: "projects", label: "Projects", enabled: true },
  { id: "experience", label: "Experience", enabled: true },
  { id: "education", label: "Education", enabled: true },
  { id: "achievements", label: "Achievements", enabled: true },
  { id: "resume", label: "Resume", enabled: true },
  { id: "contact", label: "Contact", enabled: true },
];

export const sectionIds = navItems
  .filter((n) => n.enabled)
  .map((n) => n.id);

export const siteMetadata = {
  title: "Shalman Ahmed — Front-End Developer & CSE Student",
  description:
    "Portfolio of Shalman Ahmed (Shalman Ahmed Nizum), a Computer Science & Engineering student focused on front-end and web development. Building practical, interactive digital experiences — projects, skills and competitive programming practice.",
  keywords: [
    "Shalman Ahmed",
    "Shalman Ahmed Nizum",
    "Front-End Developer",
    "CSE Student",
    "Web Developer",
    "Chittagong",
    "Portfolio",
  ],
  ogImage: profile.profileImage,
};

export { profile };
