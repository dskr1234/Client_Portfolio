import React, { lazy, Suspense } from "react";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LeftRail from "./components/LeftRail";
import LeetCodeSection from "./components/LeetCodeSection";
import ExperienceEducation from "./components/ExperienceEducation";
import FuturePlans from "./components/FuturePlans"; // <-- NEW

const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Projects = lazy(() => import("./components/Projects"));
const Skills = lazy(() => import("./components/Skills"));
const Contact = lazy(() => import("./components/Contact"));

const Fallback = ({ h = 240 }) => (
  <div className="card-neo rounded-[28px] animate-pulse" style={{ height: h }} />
);

export default function App() {
  return (
    <div className="soft min-h-screen pt-[calc(88px+24px)] md:pt-[calc(88px+28px)]">
      <Navbar />
      <LeftRail />
      <Sidebar />

      <div className="lg:ml-[340px] max-w-5xl mx-auto py-6 px-4">
        <ErrorBoundary>
          <main className="space-y-20">
            <section id="home">
              <Suspense fallback={<Fallback h={260} />}>
                <Hero />
              </Suspense>
            </section>

            <Suspense fallback={<Fallback />}>
              <About />
            </Suspense>

            {/* NEW: Future Plans sits above portfolio/projects */}
            <FuturePlans />

            <Suspense fallback={<Fallback />}>
              <Projects />
            </Suspense>

            <ExperienceEducation />

            <Suspense fallback={<Fallback />}>
              <Skills />
            </Suspense>

            <LeetCodeSection />

            <Suspense fallback={<Fallback h={240} />}>
              <Contact />
            </Suspense>

            <Footer />
          </main>
        </ErrorBoundary>
      </div>
    </div>
  );
}
