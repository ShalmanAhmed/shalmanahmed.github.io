/**
 * Experience, education, achievements and research.
 * NO employment dates, responsibilities, metrics, awards, certificates,
 * publication status or rankings are invented — anything not provided stays null.
 */

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  field: string;
  period: string | null;
  summary: string | null;
  responsibilities: string[];
}

export const experience: ExperienceItem[] = [
  {
    id: "ultimate-it-solution",
    role: "Web Developer Intern",
    company: "Ultimate IT Solution",
    field: "Web Development",
    period: null, // No dates were provided — none are created.
    summary: null,
    responsibilities: [],
  },
];

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  detail: string | null;
  resultLabel: string | null;
  result: string | null;
  year: string | null;
  current: boolean;
}

export const education: EducationItem[] = [
  {
    id: "bsc-cse-iiuc",
    degree: "BSc in Computer Science & Engineering",
    institution: "International Islamic University Chittagong",
    detail: "7th Semester",
    resultLabel: null,
    result: null,
    year: null,
    current: true,
    // Expected completion: July 2027
  },
  {
    id: "hsc-bepza",
    degree: "HSC",
    institution: "Bepza Public School & College",
    detail: null,
    resultLabel: "GPA",
    result: "4.83",
    year: "2021",
    current: false,
  },
  {
    id: "ssc-kolokakoly",
    degree: "SSC",
    institution: "Kolokakoly High School",
    detail: null,
    resultLabel: "GPA",
    result: "4.75",
    year: "2019",
    current: false,
  },
];

export const educationMeta = {
  bscExpectedCompletion: "July 2027",
};

export interface Achievement {
  id: string;
  title: string;
  source: string;
  url: string | null;
}

export const achievements: Achievement[] = [
  {
    id: "codeforces-200",
    title: "200+ Programming Problems Solved on Codeforces",
    source: "Codeforces",
    url: "https://codeforces.com/profile/WRONG321",
  },
];

export const research = {
  label: "Research Work",
  title:
    "Cross-Dataset Explainable Machine Learning for Reliable Phishing URL Detection",
  // Displayed ONLY as "Research Work" — no publication, DOI or citation claims.
};

/** Certificates: the directory exists but contains no real certificates → section hidden. */
export const certificates: never[] = [];

/** The scroll-driven motivation story, in exact order. */
export const motivationSteps: string[] = [
  "DISCIPLINE",
  "CONSISTENCY",
  "LEARNING",
  "PROBLEM SOLVING",
  "BUILD",
  "FAIL",
  "LEARN",
  "REPEAT",
  "KEEP MOVING FORWARD",
];
