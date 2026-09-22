import UnifiedBackground from "@/components/background/UnifiedBackground";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SignatureIntro from "@/components/layout/SignatureIntro";
import CustomCursor from "@/components/layout/CustomCursor";
import Hero from "@/components/hero/Hero";
import ScrollStory from "@/components/story/ScrollStory";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Skills from "@/components/sections/Skills";
import ProjectsShowroom from "@/components/projects/ProjectsShowroom";
import Codeforces from "@/components/sections/Codeforces";
import Experience from "@/components/sections/Experience";
import Education from "@/components/sections/Education";
import Achievements from "@/components/sections/Achievements";
import ResumeSection from "@/components/sections/ResumeSection";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      {/* One continuous interactive atmosphere behind the entire page */}
      <UnifiedBackground />

      <SignatureIntro />
      <CustomCursor />
      <Navbar />

      <main id="main" className="flex-1">
        {/* Hero — 3D developer workspace */}
        <Hero />

        {/* Motivation / scroll story — DISCIPLINE → KEEP MOVING FORWARD */}
        <ScrollStory />

        {/* 01 — ABOUT */}
        <About />

        {/* SERVICES */}
        <Services />

        {/* 02 — SKILLS: Technology Explorer + Database Explorer */}
        <Skills />

        {/* 03 — SELECTED WORK */}
        <ProjectsShowroom />

        {/* Competitive programming */}
        <Codeforces />

        {/* 04 — EXPERIENCE + Research Work */}
        <Experience />

        {/* 05 — EDUCATION */}
        <Education />

        {/* ACHIEVEMENTS */}
        <Achievements />

        {/* RESUME / CV */}
        <ResumeSection />

        {/* 06 — CONTACT */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
