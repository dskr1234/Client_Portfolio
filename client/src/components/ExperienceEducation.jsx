// src/components/ExperienceEducation.jsx
import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { experience, education } from "../lib/data";
import {
  Briefcase,
  CalendarClock,
  MapPin,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";

/** Small square logo bubble (SVG/PNG/JPG). Falls back to initial if missing/broken. */
function LogoBubble({ src, name, size = 56 }) {
  const letter = (name?.trim?.()[0] || "•").toUpperCase();
  const dim = `${size}px`;
  return (
    <div
      className="rounded-2xl bg-[var(--bg-3)] border border-[var(--border)] grid place-items-center overflow-hidden shrink-0"
      style={{ width: dim, height: dim }}
      aria-label={`${name} logo`}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          // ~80% of the bubble so it looks balanced
          style={{ width: size * 0.8, height: size * 0.8 }}
          className="object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.textContent = letter;
          }}
        />
      ) : (
        <span className="text-[var(--text-muted)] text-base md:text-lg">{letter}</span>
      )}
    </div>
  );
}


export default function ExperienceEducation() {
  return (
    <Section id="experience" title="Experience & Education">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* ------------------ EXPERIENCE ------------------ */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-3">
            Experience
          </h3>

          <div className="relative pl-7 space-y-6">
            {/* timeline rail */}
            <div className="timeline-rail timeline-rail--exp" />

            {experience.map((e, i) => (
              <Tilt3D key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.55 }}
                  className="relative card-neo rounded-[24px] p-6 md:p-8 space-y-4"
                >
                  {/* hotspot shine like About */}
                  <div className="shine" />
                  {/* timeline dot */}
                  <span className="timeline-dot timeline-dot--exp" />

                  {/* header — gradient icon chip + text + logo on the right */}
                  <div className="flex items-start gap-3 relative z-[1]">
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-violet-400/85 to-fuchsia-500/85 text-white shadow-md">
                      <Briefcase size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-[var(--text)] truncate">
                        {e.role} · {e.company}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
                        <span className="inline-flex items-center gap-1">
                          <CalendarClock size={14} /> {e.period}
                        </span>
                        {e.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={14} /> {e.location}
                          </span>
                        )}
                        {e.type && <span>{e.type}</span>}
                      </div>
                    </div>

                    {/* logo bubble */}
                    <LogoBubble src={e.logo} name={e.company} />
                  </div>

                  {/* bullets — same text treatment as About */}
                  {!!e.bullets?.length && (
                    <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)] relative z-[1]">
                      {e.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}

                  {/* stack — pill-neo like About */}
                  {!!e.stack?.length && (
                    <div className="flex flex-wrap gap-2 relative z-[1]">
                      {e.stack.map((t) => (
                        <span
                          key={t}
                          className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/85"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </Tilt3D>
            ))}
          </div>
        </div>

        {/* ------------------ EDUCATION ------------------ */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-3">
            Education
          </h3>

          <div className="relative pl-7 space-y-6">
            {/* timeline rail */}
            <div className="timeline-rail timeline-rail--edu" />

            {education.map((e, i) => (
              <Tilt3D key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.55 }}
                  className="relative card-neo rounded-[24px] p-6 md:p-8 space-y-4"
                >
                  <div className="shine" />
                  {/* timeline dot */}
                  <span className="timeline-dot timeline-dot--edu" />

                  {/* header — gradient icon + text + logo on the right */}
                  <div className="flex items-start gap-3 relative z-[1]">
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-400/85 to-sky-500/85 text-white shadow-md">
                      <GraduationCap size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-[var(--text)] truncate">
                        {e.school}
                      </h4>
                      <p className="text-sm text-[var(--text-muted)]">{e.degree}</p>
                    </div>

                    {/* school logo */}
                    <LogoBubble src={e.logo} name={e.school} />
                  </div>

                  {/* info */}
                  {e.info && (
                    <p className="text-sm text-[var(--text-muted)] relative z-[1]">
                      {e.info}
                    </p>
                  )}

                  {/* coursework — same typography */}
                  {!!e.coursework?.length && (
                    <div className="relative z-[1]">
                      <div className="flex items-center gap-2 text-sm text-[var(--text)] font-semibold mb-1">
                        <BookOpen size={16} /> Coursework
                      </div>
                      <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                        {e.coursework.map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              </Tilt3D>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
