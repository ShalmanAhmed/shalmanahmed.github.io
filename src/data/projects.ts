/**
 * Projects — the technology arrays below are the SINGLE SOURCE OF TRUTH
 * for Technology ↔ Project relationships.
 * No GitHub / live URLs exist, so none are invented (they stay null and hidden).
 *
 * Storytelling fields (category / year / status / problem / solution /
 * benefits) are OPTIONAL — the showcase renders a block only when the
 * field carries real information, and omits it otherwise. The entries
 * below are populated with REAL project details; status / year remain
 * unset (nothing invented). Never fabricate content.
 */

export type ProjectStatus = "live" | "active" | "archived";

export interface Project {
  id: string;
  number: string;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  images: string[];
  githubUrl: string | null;
  liveUrl: string | null;

  /* ── Optional storytelling (omit the UI block when absent) ─────────────── */
  category?: string; // e.g. "FULL STACK" — shown on the card top-right
  year?: string; // e.g. "2026" — card/row metadata
  status?: ProjectStatus; // tiny ● LIVE / ● ACTIVE / ○ ARCHIVED dot
  problem?: string; // THE PROBLEM block
  solution?: string; // THE SOLUTION block
  benefits?: string[]; // KEY BENEFITS — numbered list
}

export const projects: Project[] = [
  {
    id: "classrep",
    number: "01",
    title: "ClassRep",
    description:
      "A classroom management system designed for students and class representatives.",
    technologies: ["javascript", "nextjs", "appwrite", "html", "css"],
    features: [],
    images: [
      "/assets/projects/classrep/classrep1.jpg",
      "/assets/projects/classrep/classrep2.jpg",
      "/assets/projects/classrep/classrep3.jpg",
      "/assets/projects/classrep/classrep4.jpg",
      "/assets/projects/classrep/classrep5.jpg",
    ],
    githubUrl: null,
    liveUrl: null,
    category: "WEB APPLICATION",
    problem:
      "Class communication is scattered — notices, materials and day-to-day coordination between students and class representatives get lost across disconnected channels.",
    solution:
      "ClassRep brings classroom management into one focused web application: a single place where class representatives organise the class and students stay in sync.",
    benefits: [
      "One organised home for class information",
      "Clear roles for representatives and students",
      "Modern Next.js front end backed by Appwrite",
    ],
  },
  {
    id: "turf-management",
    number: "02",
    title: "Turf Management",
    description: "A turf management application.",
    technologies: [
      "csharp",
      "aspnet-core",
      "dotnet",
      "sqlserver",
      "html",
      "css",
      "javascript",
    ],
    features: [],
    images: [
      "/assets/projects/turf/turf1.png",
      "/assets/projects/turf/turf2.png",
      "/assets/projects/turf/turf3.png",
      "/assets/projects/turf/turf4.png",
      "/assets/projects/turf/turf5.png",
      "/assets/projects/turf/turf6.png",
    ],
    githubUrl: null,
    liveUrl: null,
    category: "FULL STACK",
    problem:
      "Managing turf bookings and records by hand makes it easy to double-book slots and lose track of schedules.",
    solution:
      "A full-stack ASP.NET Core application with a SQL Server database that digitalises turf operations — records, scheduling and administration — in one system.",
    benefits: [
      "End-to-end turf operations in a single system",
      "Structured data with a SQL Server backbone",
      "Built on the ASP.NET Core ecosystem",
    ],
  },
  {
    id: "online-shop",
    number: "03",
    title: "Online Shop",
    description: "An online shopping application.",
    technologies: ["java", "javascript", "mysql", "phpmyadmin", "html", "css"],
    features: [],
    images: [
      "/assets/projects/online-shop/shop1.jpg",
      "/assets/projects/online-shop/shop2.jpg",
      "/assets/projects/online-shop/shop3.jpg",
      "/assets/projects/online-shop/shop4.jpg",
    ],
    githubUrl: null,
    liveUrl: null,
    category: "WEB APPLICATION",
    problem:
      "A shop needs reliable product data and order handling — manual records do not scale past a handful of items.",
    solution:
      "A Java-based online shopping application with a MySQL database managed through phpMyAdmin, covering the core storefront flow.",
    benefits: [
      "Product browsing backed by a relational MySQL schema",
      "Classic Java web stack with a clean HTML/CSS/JS front end",
      "Database administration via phpMyAdmin",
    ],
  },
  {
    id: "blood-donation",
    number: "04",
    title: "Blood Donation App",
    description:
      "A blood donation application with donor registration, login, donor listing/filtering and request form functionality.",
    technologies: ["html", "css", "javascript"],
    features: [
      "Donor registration",
      "Login",
      "Donor listing & filtering",
      "Request form",
    ],
    images: [
      "/assets/projects/blood-donation/blood1.png",
      "/assets/projects/blood-donation/blood2.png",
    ],
    githubUrl: null,
    liveUrl: null,
    category: "WEB APPLICATION",
    problem:
      "Finding willing donors and managing blood requests is slow when it depends on word of mouth and phone calls.",
    solution:
      "A JavaScript web application where donors register and log in, anyone can browse and filter the donor list, and blood requests are submitted through a structured form.",
    benefits: [
      "Donor registration with login",
      "Searchable, filterable donor listing",
      "Structured request form for blood seekers",
    ],
  },
  {
    id: "smart-notes",
    number: "05",
    title: "Smart Notes",
    description:
      "A browser-based notes application supporting add, edit, delete and search functionality with persistent LocalStorage data.",
    technologies: ["html", "css", "javascript", "localstorage"],
    features: [
      "Add notes",
      "Edit notes",
      "Delete notes",
      "Search notes",
      "LocalStorage persistence",
    ],
    images: [
      "/assets/projects/smart-notes/note1.png",
      "/assets/projects/smart-notes/note2.png",
    ],
    githubUrl: null,
    liveUrl: null,
    category: "WEB APPLICATION",
    problem:
      "Quick thoughts deserve a faster home than scattered paper notes or heavyweight apps.",
    solution:
      "A browser-based notes application supporting add, edit, delete and search — with every note persisted locally through LocalStorage.",
    benefits: [
      "Full add / edit / delete / search workflow",
      "Instant persistence with LocalStorage — no backend needed",
      "Zero-friction: opens and runs in the browser",
    ],
  },
];

/** Derive projects related to a technology from the project data (deterministic). */
export function projectsForTechnology(techId: string): Project[] {
  return projects.filter((p) => p.technologies.includes(techId));
}
