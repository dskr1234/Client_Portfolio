import React, { lazy, Suspense } from "react"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import ErrorBoundary from "./components/ErrorBoundary"

// Lazy sections
const Hero = lazy(() => import("./components/Hero"))
const About = lazy(() => import("./components/About"))
const Experience = lazy(() => import("./components/Experience"))
const Projects = lazy(() => import("./components/Projects"))
const Skills = lazy(() => import("./components/Skills"))
const Education = lazy(() => import("./components/Education"))
const Resume = lazy(() => import("./components/Resume"))
const Contact = lazy(() => import("./components/Contact"))

const Fallback = ({ h = 240 }) => (
  <div className="soft-2 rounded-[28px] neo animate-pulse" style={{ height: h }} />
)

export default function App() {
  return (
    <div className="soft min-h-screen">
      <Navbar />

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content shifted right */}
      <div className="lg:ml-[340px] max-w-5xl mx-auto py-6 px-4">
        <ErrorBoundary>
          <main className="space-y-20">
            <section id="home" className="soft-2 rounded-[28px] neo p-8 pastel">
              <Suspense fallback={<Fallback h={260} />}>
                <Hero />
              </Suspense>
            </section>

            <Suspense fallback={<Fallback />}>
              <Projects />
            </Suspense>

            <Suspense fallback={<Fallback />}>
              <About />
            </Suspense>

            <Suspense fallback={<Fallback />}>
              <Experience />
            </Suspense>

            <Suspense fallback={<Fallback />}>
              <Skills />
            </Suspense>

            <Suspense fallback={<Fallback h={320} />}>
              <Resume />
            </Suspense>

            <Suspense fallback={<Fallback />}>
              <Education />
            </Suspense>

            <Suspense fallback={<Fallback h={240} />}>
              <Contact />
            </Suspense>

            <Footer />
          </main>
        </ErrorBoundary>
      </div>
    </div>
  )
}
