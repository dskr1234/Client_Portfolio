import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import LeftRail from "./components/LeftRail";
import BlogAdmin from "./components/BlogAdmin";
import BlogView from "./components/BlogView";

const Projects = lazy(() => import("./components/Projects"));
const Contact  = lazy(() => import("./components/Contact"));

const Fallback = ({ h = 240 }) => (
  <div className="card-neo rounded-[28px] animate-pulse" style={{ height: h }} />
);

export default function App() {
  return (
    <BrowserRouter>
      <div className="soft min-h-screen pt-[calc(88px+24px)] md:pt-[calc(88px+28px)]">
        <Navbar />
        <LeftRail />
        <Sidebar />

        <div className="lg:ml-[340px] max-w-5xl mx-auto py-6 px-4">
          <ErrorBoundary>
            <main className="space-y-20">
              <Routes>
                {/* Home: Blogs page */}
                <Route
                  path="/"
                  element={
                    <>
                      <section id="blogs">
                        <BlogAdmin />
                      </section>
                      {/* Contact is common */}
                      <Suspense fallback={<Fallback h={240} />}>
                        <section id="contact">
                          <Contact />
                        </section>
                      </Suspense>
                    </>
                  }
                />

                {/* Projects page (plus contact) */}
                <Route
                  path="/projects"
                  element={
                    <>
                      <Suspense fallback={<Fallback />}>
                        <section id="projects">
                          <Projects />
                        </section>
                      </Suspense>
                      <Suspense fallback={<Fallback h={240} />}>
                        <section id="contact">
                          <Contact />
                        </section>
                      </Suspense>
                    </>
                  }
                />

                {/* Public single blog view */}
                <Route path="/blog/:id" element={<BlogView />} />
              </Routes>

              <Footer />
            </main>
          </ErrorBoundary>
        </div>
      </div>
    </BrowserRouter>
  );
}
