import { projects } from "./projects";

/**
 * Technology data — statuses follow the truth rules:
 *  - "verified"    → explicitly verified/provided by the portfolio owner (C, C++, Java, JavaScript)
 *  - "project-used"→ explicitly present in supplied project data
 *  - "showcase"    → provided in the owner's stack lists, not verified nor used in a supplied project
 *  - "learning"    → owner lists it as a learning/showcase technology
 *  - "explored"    → owner lists it as an explored/showcase technology
 *
 * Notes:
 *  - HTML and CSS are WEB technologies, not programming languages.
 *  - phpMyAdmin is a database administration TOOL, not a database.
 *  - LocalStorage is browser/platform storage (OTHER), not a traditional database.
 *  - relatedTechnologyIds: only explicitly configured pairs. Everything else shown in the
 *    UI is deterministically derived from shared projects.
 */

export type TechCategory =
  | "LANGUAGES"
  | "WEB"
  | "FRAMEWORKS"
  | "RUNTIME"
  | "DATABASE"
  | "BACKEND"
  | "TOOLS"
  | "OTHER";

export type TechStatus =
  | "verified"
  | "project-used"
  | "showcase"
  | "learning"
  | "explored";

export type TechLevel = "Foundational" | "Working" | "Learning" | "Explored";

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  status: TechStatus;
  level: TechLevel;
  verified: boolean;
  description: string;
  usage: string[];
  relatedTechnologyIds: string[];
}

export const TECH_CATEGORIES: Array<{ id: "ALL" | TechCategory; label: string }> = [
  { id: "ALL", label: "ALL" },
  { id: "LANGUAGES", label: "LANGUAGES" },
  { id: "WEB", label: "WEB" },
  { id: "FRAMEWORKS", label: "FRAMEWORKS" },
  { id: "RUNTIME", label: "RUNTIME" },
  { id: "DATABASE", label: "DATABASE" },
  { id: "BACKEND", label: "BACKEND" },
  { id: "TOOLS", label: "TOOLS" },
  { id: "OTHER", label: "OTHER" },
];

export const technologies: Technology[] = [
  // ─── LANGUAGES ────────────────────────────────────────────────────────────
  {
    id: "c",
    name: "C",
    category: "LANGUAGES",
    status: "verified",
    level: "Foundational",
    verified: true,
    description:
      "A verified programming language — the foundation for understanding memory, pointers and low-level logic.",
    usage: ["Programming fundamentals coursework"],
    relatedTechnologyIds: ["cpp"],
  },
  {
    id: "cpp",
    name: "C++",
    category: "LANGUAGES",
    status: "verified",
    level: "Foundational",
    verified: true,
    description:
      "A verified programming language, used for object-oriented programming and algorithmic problem solving.",
    usage: ["Competitive programming practice on Codeforces"],
    relatedTechnologyIds: ["c"],
  },
  {
    id: "java",
    name: "Java",
    category: "LANGUAGES",
    status: "verified",
    level: "Working",
    verified: true,
    description:
      "A verified programming language used for object-oriented development and application coursework.",
    usage: ["Online Shop project"],
    relatedTechnologyIds: ["mysql", "phpmyadmin"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    category: "LANGUAGES",
    status: "verified",
    level: "Working",
    verified: true,
    description:
      "A verified programming language and the primary language across every supplied project.",
    usage: [
      "ClassRep",
      "Turf Management",
      "Online Shop",
      "Blood Donation App",
      "Smart Notes",
    ],
    relatedTechnologyIds: ["html", "css", "nextjs"],
  },
  {
    id: "csharp",
    name: "C#",
    category: "LANGUAGES",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description:
      "Used in the Turf Management project. Present as a project-used technology, not labeled verified.",
    usage: ["Turf Management"],
    relatedTechnologyIds: ["aspnet-core", "dotnet", "sqlserver"],
  },
  {
    id: "python",
    name: "Python",
    category: "LANGUAGES",
    status: "learning",
    level: "Learning",
    verified: false,
    description: "A showcase/learning technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "php",
    name: "PHP",
    category: "LANGUAGES",
    status: "learning",
    level: "Learning",
    verified: false,
    description: "A showcase/learning technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "LANGUAGES",
    status: "learning",
    level: "Learning",
    verified: false,
    description: "A showcase/learning technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: ["javascript"],
  },
  {
    id: "go",
    name: "Go",
    category: "LANGUAGES",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A showcase/explored technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "rust",
    name: "Rust",
    category: "LANGUAGES",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A showcase/explored technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "kotlin",
    name: "Kotlin",
    category: "LANGUAGES",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A showcase/explored technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "dart",
    name: "Dart",
    category: "LANGUAGES",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A showcase/explored technology, not presented as a verified skill.",
    usage: [],
    relatedTechnologyIds: [],
  },

  // ─── WEB (HTML/CSS are web technologies, NOT programming languages) ───────
  {
    id: "html",
    name: "HTML",
    category: "WEB",
    status: "project-used",
    level: "Working",
    verified: false,
    description:
      "Markup used in every supplied project — the structural layer of each interface.",
    usage: [
      "ClassRep",
      "Turf Management",
      "Online Shop",
      "Blood Donation App",
      "Smart Notes",
    ],
    relatedTechnologyIds: ["css", "javascript"],
  },
  {
    id: "css",
    name: "CSS",
    category: "WEB",
    status: "project-used",
    level: "Working",
    verified: false,
    description:
      "Styling used in every supplied project — layout, visual design and responsiveness.",
    usage: [
      "ClassRep",
      "Turf Management",
      "Online Shop",
      "Blood Donation App",
      "Smart Notes",
    ],
    relatedTechnologyIds: ["html", "javascript"],
  },
  {
    id: "tailwindcss",
    name: "Tailwind CSS",
    category: "WEB",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "A utility-first styling framework in the owner's web/styling stack.",
    usage: [],
    relatedTechnologyIds: ["css"],
  },
  {
    id: "sass",
    name: "Sass/SCSS",
    category: "WEB",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "A CSS preprocessor in the owner's web/styling stack.",
    usage: [],
    relatedTechnologyIds: ["css"],
  },
  {
    id: "bootstrap",
    name: "Bootstrap",
    category: "WEB",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "A CSS framework in the owner's web/styling stack (not duplicated into other categories).",
    usage: [],
    relatedTechnologyIds: ["css"],
  },

  // ─── FRAMEWORKS ───────────────────────────────────────────────────────────
  {
    id: "nextjs",
    name: "Next.js",
    category: "FRAMEWORKS",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "React framework used in the ClassRep project.",
    usage: ["ClassRep"],
    relatedTechnologyIds: ["react", "javascript", "appwrite"],
  },
  {
    id: "react",
    name: "React",
    category: "FRAMEWORKS",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "A UI library in the owner's framework stack.",
    usage: [],
    relatedTechnologyIds: ["nextjs"],
  },
  {
    id: "aspnet-core",
    name: "ASP.NET Core",
    category: "FRAMEWORKS",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "Web framework used in the Turf Management project (a framework, not a runtime).",
    usage: ["Turf Management"],
    relatedTechnologyIds: ["dotnet", "csharp", "sqlserver"],
  },
  {
    id: "expressjs",
    name: "Express.js",
    category: "FRAMEWORKS",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "A Node.js web framework in the owner's framework stack.",
    usage: [],
    relatedTechnologyIds: ["nodejs"],
  },
  {
    id: "django",
    name: "Django",
    category: "FRAMEWORKS",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "A Python web framework in the owner's framework stack.",
    usage: [],
    relatedTechnologyIds: ["python"],
  },
  {
    id: "flask",
    name: "Flask",
    category: "FRAMEWORKS",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "A lightweight Python web framework in the owner's framework stack.",
    usage: [],
    relatedTechnologyIds: ["python"],
  },

  // ─── RUNTIME / PLATFORM ───────────────────────────────────────────────────
  {
    id: "nodejs",
    name: "Node.js",
    category: "RUNTIME",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "A JavaScript runtime in the owner's runtime/platform stack.",
    usage: [],
    relatedTechnologyIds: ["javascript", "expressjs"],
  },
  {
    id: "dotnet",
    name: ".NET",
    category: "RUNTIME",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "Runtime/platform used in the Turf Management project.",
    usage: ["Turf Management"],
    relatedTechnologyIds: ["aspnet-core", "csharp"],
  },

  // ─── DATABASE ─────────────────────────────────────────────────────────────
  {
    id: "sqlserver",
    name: "SQL Server",
    category: "DATABASE",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "Relational database used in the Turf Management project.",
    usage: ["Turf Management"],
    relatedTechnologyIds: ["aspnet-core", "dotnet", "csharp"],
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "DATABASE",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "Relational database used in the Online Shop project.",
    usage: ["Online Shop"],
    relatedTechnologyIds: ["phpmyadmin", "java"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "DATABASE",
    status: "learning",
    level: "Learning",
    verified: false,
    description: "A relational database in the owner's database stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "mongodb",
    name: "MongoDB",
    category: "DATABASE",
    status: "learning",
    level: "Learning",
    verified: false,
    description: "A document database in the owner's database stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "sqlite",
    name: "SQLite",
    category: "DATABASE",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "An embedded relational database in the owner's database stack.",
    usage: [],
    relatedTechnologyIds: [],
  },

  // ─── BACKEND / BaaS ───────────────────────────────────────────────────────
  {
    id: "appwrite",
    name: "Appwrite",
    category: "BACKEND",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description: "Backend/BaaS platform used in the ClassRep project.",
    usage: ["ClassRep"],
    relatedTechnologyIds: ["nextjs", "javascript"],
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "BACKEND",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A backend/BaaS platform in the owner's stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "BACKEND",
    status: "explored",
    level: "Explored",
    verified: false,
    description: "A backend/BaaS platform in the owner's stack.",
    usage: [],
    relatedTechnologyIds: [],
  },

  // ─── TOOLS ────────────────────────────────────────────────────────────────
  {
    id: "phpmyadmin",
    name: "phpMyAdmin",
    category: "TOOLS",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description:
      "Database administration tool used in the Online Shop project (a tool, not a database).",
    usage: ["Online Shop"],
    relatedTechnologyIds: ["mysql"],
  },
  {
    id: "git",
    name: "Git",
    category: "TOOLS",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "Version control tool in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: ["github"],
  },
  {
    id: "github",
    name: "GitHub",
    category: "TOOLS",
    status: "showcase",
    level: "Working",
    verified: false,
    description: "Code hosting platform in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: ["git"],
  },
  {
    id: "vscode",
    name: "VS Code",
    category: "TOOLS",
    status: "showcase",
    level: "Working",
    verified: false,
    description: "Code editor in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "visual-studio",
    name: "Visual Studio",
    category: "TOOLS",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "IDE in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: ["dotnet"],
  },
  {
    id: "figma",
    name: "Figma",
    category: "TOOLS",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "Design tool in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "postman",
    name: "Postman",
    category: "TOOLS",
    status: "showcase",
    level: "Learning",
    verified: false,
    description: "API testing tool in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: [],
  },
  {
    id: "antigravity",
    name: "Antigravity",
    category: "TOOLS",
    status: "showcase",
    level: "Explored",
    verified: false,
    description: "Development tool listed in the owner's tool stack.",
    usage: [],
    relatedTechnologyIds: [],
  },

  // ─── OTHER (browser/platform storage — NOT a traditional database) ───────
  {
    id: "localstorage",
    name: "LocalStorage",
    category: "OTHER",
    status: "project-used",
    level: "Foundational",
    verified: false,
    description:
      "Browser/platform storage technology used by the Smart Notes project for persistent data. Not a traditional database.",
    usage: ["Smart Notes"],
    relatedTechnologyIds: ["javascript"],
  },
];

export function technologyById(id: string): Technology | undefined {
  return technologies.find((t) => t.id === id);
}

/**
 * Deterministic shared-project rule: two technologies are related when they
 * appear together in at least one project's technology array.
 */
export function relatedFromSharedProjects(techId: string): Technology[] {
  const tech = technologyById(techId);
  if (!tech) return [];
  const ids = new Set<string>();
  for (const project of projects) {
    if (!project.technologies.includes(techId)) continue;
    for (const other of project.technologies) {
      if (other !== techId) ids.add(other);
    }
  }
  for (const extra of tech.relatedTechnologyIds) ids.add(extra);
  return [...ids]
    .map((id) => technologyById(id))
    .filter((t): t is Technology => Boolean(t));
}

export const databaseTechnologies = technologies.filter(
  (t) => t.category === "DATABASE"
);
