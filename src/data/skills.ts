/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LANGUAGE PROFICIENCY — central, fixed, owner-editable values.
 * ─────────────────────────────────────────────────────────────────────────────
 * Percentages exist ONLY for the four VERIFIED languages (C, C++, Java,
 * JavaScript — see technologies.ts). These are fixed self-assessment values,
 * never randomly generated; edit them here and the UI follows.
 *
 * Non-verified languages are NOT given percentages anywhere — the UI derives
 * them from technologies.ts and renders truthful status labels
 * (PROJECT USED / LEARNING / SHOWCASE) instead.
 */

export interface VerifiedLanguageSkill {
  /** Must match a verified technology id in technologies.ts. */
  techId: "javascript" | "cpp" | "java" | "c";
  /** Fixed proficiency percentage (0–100) — owner-editable. */
  level: number;
}

export const languageProficiency: { verified: VerifiedLanguageSkill[] } = {
  verified: [
    { techId: "javascript", level: 85 },
    { techId: "cpp", level: 78 },
    { techId: "java", level: 72 },
    { techId: "c", level: 68 },
  ],
};
