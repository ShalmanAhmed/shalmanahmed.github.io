/**
 * Central portfolio profile data.
 * Every value here is explicitly provided by the portfolio owner.
 * Nothing is invented. Missing values are `null` and must stay hidden in the UI.
 */

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export const profile = {
  name: "Shalman Ahmed Nizum",
  displayName: "Shalman Ahmed",
  alias: "BLACK HOLE",

  hero: {
    label: "COMPUTER SCIENCE & ENGINEERING",
    title: "Hi, I\u2019m Shalman Ahmed.",
    subtitle: "Building modern and interactive web experiences.",
    support:
      "I\u2019m a Computer Science & Engineering student focused on front-end and web development, building practical and interactive digital experiences while continuously improving my technical and problem-solving skills.",
    primaryCta: { label: "EXPLORE MY WORK", targetSection: "projects" },
    secondaryCta: {
      label: "DOWNLOAD RESUME",
      href: "/assets/cv/Shalman-Ahmed-CV.pdf",
      downloadName: "Shalman-Ahmed-CV.pdf",
      available: true,
    },
  },

  about: {
    text: "I\u2019m Shalman Ahmed, a Computer Science & Engineering student at International Islamic University Chittagong, focused on front-end and web development. I enjoy turning ideas into practical, interactive and user-friendly digital experiences while continuously improving my technical and problem-solving skills.",
    focusAreas: [
      "CSE Student",
      "Web Developer Intern",
      "Front-End Development",
      "Web Development",
      "Software Development",
      "Competitive Programming",
      "200+ Codeforces Problems Solved",
    ],
    facts: [
      { label: "Name", value: "Shalman Ahmed Nizum" },
      { label: "Display Name", value: "Shalman Ahmed" },
      { label: "Alias", value: "BLACK HOLE" },
      { label: "Age", value: "23" },
      { label: "Height", value: "171 CM" },
      { label: "Location", value: "Agrabad, Chittagong, Bangladesh" },
      { label: "Favorite Game", value: "Efootball" },
      { label: "Favorite Course", value: "Mathematics" },
      { label: "Favorite Color", value: "Brown / Cream" },
    ],
  },

  profileImage: "/assets/profile/profile.jpg",

  contact: {
    heading: "Let\u2019s build something meaningful.",
    email: "shalman.ahmed.j@gmail.com",
    phone: "01877993889",
    location: "Agrabad, Chittagong, Bangladesh",
  },

  codeforces: {
    headline: "200+ Programming Problems Solved",
    profileUrl: "https://codeforces.com/profile/WRONG321",
    handle: "WRONG321",
    points: [
      "Algorithmic practice",
      "Logical thinking",
      "Implementation",
      "Programming fundamentals",
      "Consistency",
    ],
  },

  socials: [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/ShalmanAhmed",
    },
    {
      id: "codeforces",
      label: "Codeforces",
      url: "https://codeforces.com/profile/WRONG321",
    },
    {
      id: "facebook",
      label: "Facebook",
      url: "https://www.facebook.com/salman.ahmedc",
    },
    {
      id: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/salman.ahmedc",
    },
    {
      id: "tiktok",
      label: "TikTok",
      url: "https://www.tiktok.com/@idk707829",
    },
    // LinkedIn intentionally omitted — no real URL was provided.
  ] as SocialLink[],

  resume: {
    file: "/assets/cv/Shalman-Ahmed-CV.pdf",
    downloadName: "Shalman-Ahmed-CV.pdf",
    available: true,
  },
};
