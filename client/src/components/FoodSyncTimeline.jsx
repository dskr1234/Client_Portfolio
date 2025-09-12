import React, { useMemo } from "react";
import Tilt3D from "./Tilt3D";

const phases = [
  {
    title: "Problem Statement Identified & Finalized",
    period: "Week 0",
    desc: "Clearly defined the core problem of food wastage and finalized the objective to connect surplus food sources with NGOs and volunteers.",
    active: false,
  },
  {
    title: "Requirement Analysis (SRS)",
    period: "Week 1 – Week 2",
    desc: "Gathered functional and non-functional requirements, defined scope, use-cases, and user stories.",
    active: true,
  },
  {
    title: "System Design (SDD)",
    period: "Week 3 – Week 4",
    desc: "Created architecture diagrams, database schema, API contracts, and UI wireframes.",
    active: false,
  },
  {
    title: "Implementation",
    period: "Week 5 – Week 7",
    desc: "Developed core modules (logging meals, nutrition APIs, reminders) with MERN stack.",
    active: false,
  },
  {
    title: "Testing",
    period: "Week 8 – Week 9",
    desc: "Unit testing, integration testing, and end-to-end validations ensuring quality.",
    active: false,
  },
  {
    title: "Deployment & Maintenance",
    period: "Week 10 – Ongoing",
    desc: "Deployed on Vercel + MongoDB Atlas, set up CI/CD, monitoring, and user feedback loops.",
    active: false,
  },
];

export default function FoodSyncTimeline() {
  const activeIndex = useMemo(
    () => Math.max(0, phases.findIndex((p) => p.active)),
    []
  );

  return (
    <Tilt3D>
      <div className="relative card-neo rounded-[24px] p-6 md:p-8 overflow-hidden">
        <div className="shine pointer-events-none" />

        {/* Heading */}
        <h3 className="text-2xl font-bold text-[var(--text)] mb-6 text-center">
          🛠 FoodSync — SDLC Progress
        </h3>

        {/* Unified Timeline Container */}
        <div className="relative pl-10 pr-4 py-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-black/20 dark:to-black/10 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md">
          {/* Vertical Rail */}
          <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-gradient-to-b from-violet-500/60 via-violet-400/25 to-transparent rounded-full" />

          {/* Phases */}
          <ul className="space-y-6 relative">
            {phases.map((p, i) => {
              const isActive = p.active;
              const isCompleted = i < activeIndex;

              return (
                <li key={i} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-6" style={{ top: "0.5rem" }}>
                    <span className="relative block w-4 h-4">
                      <span
                        className={[
                          "absolute inset-0 rounded-full border-2 transition-all duration-300",
                          isActive
                            ? "bg-violet-500 border-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)] scale-110"
                            : isCompleted
                            ? "bg-violet-500 border-violet-400"
                            : "bg-gray-400 border-gray-300 dark:bg-gray-600 dark:border-gray-500 opacity-60",
                        ].join(" ")}
                      />

                      {isActive && (
                        <>
                          <span className="absolute -inset-2 rounded-full bg-violet-400/15 blur-[2px] animate-pulse" />
                          <span className="absolute -inset-3 rounded-full border border-violet-400/30 animate-ping" />
                          <span className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-violet-300 animate-bounce" />
                        </>
                      )}
                    </span>
                  </span>

                  {/* Content */}
                  <div className="transition-all duration-300">
                    <h4
                      className={[
                        "font-semibold text-lg",
                        isActive || isCompleted
                          ? "text-violet-300"
                          : "text-gray-300 dark:text-gray-400",
                      ].join(" ")}
                    >
                      {p.title}
                    </h4>
                    <p
                      className={[
                        "text-xs",
                        isActive || isCompleted
                          ? "text-violet-400"
                          : "text-gray-400 dark:text-gray-500",
                      ].join(" ")}
                    >
                      {p.period}
                    </p>
                    <p
                      className={[
                        "text-sm mt-1 leading-relaxed",
                        isActive
                          ? "text-gray-100"
                          : isCompleted
                          ? "text-gray-300"
                          : "text-gray-400 dark:text-gray-500",
                      ].join(" ")}
                    >
                      {p.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Tilt3D>
  );
}
