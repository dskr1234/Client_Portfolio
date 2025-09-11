import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { experience, education } from "../lib/data";
import { CalendarClock, MapPin, BookOpen } from "lucide-react";
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

/**
 * Always-on auto-scrolling container with slim, visible scrollbar.
 * - Reverses direction at edges.
 * - Keeps scrolling without hover.
 */
function AutoScrollBox({ children, className = "", speed = 0.6 }) {
  const boxRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const dirRef = React.useRef(1); // 1 => down, -1 => up

  const step = React.useCallback(() => {
    const el = boxRef.current;
    if (!el) return;

    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    if (max <= 0) {
      rafRef.current = requestAnimationFrame(step);
      return;
    }

    let next = el.scrollTop + dirRef.current * speed;
    if (next <= 0) {
      next = 0;
      dirRef.current = 1;
    } else if (next >= max) {
      next = max;
      dirRef.current = -1;
    }
    el.scrollTop = next;
    rafRef.current = requestAnimationFrame(step);
  }, [speed]);

  React.useEffect(() => {
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [step]);

  return (
    <div
      ref={boxRef}
      className={`course-scroll overflow-y-auto pr-2 border border-[var(--border)] rounded-xl bg-[var(--bg-2)] ${className}`}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        overscrollBehavior: "contain",
        scrollbarGutter: "stable both-edges",
      }}
      role="region"
    >
      {children}
    </div>
  );
}

/** Reusable experience card (employment list) with auto-scrolling bullets */
function ExperienceCard({ item, dotClass = "timeline-dot timeline-dot--exp" }) {
  return (
    <Tilt3D>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.55 }}
        className="relative card-neo rounded-[24px] p-6 md:p-8 space-y-4"
      >
        <div className="shine" />
        <span className={dotClass} />

        <div className="flex items-start gap-3 relative z-[1]">
          <LogoBubble src={item.logo} name={item.company} />
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-[var(--text)] truncate">{item.company}</h4>
            <p className="text-[var(--text-muted)]">{item.role}</p>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
              {item.period && (
                <span className="inline-flex items-center gap-1">
                  <CalendarClock size={14} /> {item.period}
                </span>
              )}
              {item.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={14} /> {item.location}
                </span>
              )}
              {item.type && <span>{item.type}</span>}
            </div>
          </div>
        </div>

        {!!item.bullets?.length && (
          <AutoScrollBox className="h-40 md:h-44">
            <ul className="list-disc pl-6 pr-2 py-3 space-y-2 text-[var(--text-muted)] relative z-[1]">
              {item.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </AutoScrollBox>
        )}

        {!!item.stack?.length && (
          <div className="flex flex-wrap gap-2 relative z-[1]">
            {item.stack.map((t) => (
              <span key={t} className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/85">
                {t}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </Tilt3D>
  );
}

/** Coursework auto-scroll box */
function CourseScroll({ items, heightClass = "h-40 md:h-44" }) {
  return (
    <AutoScrollBox className={heightClass}>
      <ul className="text-sm text-[var(--text-muted)] list-disc list-inside p-3 space-y-1">
        {items.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </AutoScrollBox>
  );
}

export default function ExperienceEducation() {
  return (
    <Section id="experience" title="Experience & Education">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: Experience timeline (merged; no separate freelance) */}
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-3">
              Experience
            </h3>
            <div className="relative pl-7 space-y-6">
              <div className="timeline-rail timeline-rail--exp" />
              {experience.map((e, i) => (
                <ExperienceCard key={i} item={e} dotClass="timeline-dot timeline-dot--exp" />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Education */}
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-3">
            Education
          </h3>

          <div className="relative pl-7 space-y-6">
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
                  <span className="timeline-dot timeline-dot--edu" />

                  {/* header */}
                  <div className="flex items-start gap-3 relative z-[1]">
                    <LogoBubble src={e.logo} name={e.school} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-[var(--text)] truncate">{e.school}</h4>
                      <div className="text-sm text-[var(--text-muted)] mt-1">
                        {(e.start || e.end) && (
                          <span>
                            {e.start || ""}
                            {e.start && e.end ? " – " : ""}
                            {e.end || ""}
                          </span>
                        )}
                        {e.gpaText && <span> &nbsp;→&nbsp; {e.gpaText}</span>}
                      </div>
                    </div>
                  </div>

                  {e.info && <p className="text-sm text-[var(--text-muted)] relative z-[1]">{e.info}</p>}

                  {/* Coursework — auto-scroll box (always on) */}
                  {Array.isArray(e.coursework) && e.coursework.length > 0 && (
                    <div className="relative z-[1]">
                      <div className="flex items-center gap-2 text-sm text-[var(--text)] font-semibold mb-1">
                        <BookOpen size={16} /> Coursework
                      </div>
                      <CourseScroll items={e.coursework} />
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
