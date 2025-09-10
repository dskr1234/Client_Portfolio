import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { experience, education, freelance } from "../lib/data";
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

/** Reusable experience card (freelance + employment) */
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
          <ul className="list-disc pl-6 space-y-2 text-[var(--text-muted)] relative z-[1]">
            {item.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
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

/** Smooth auto-scroll box for coursework; starts when hovered/focused */
function CourseScroll({ items, heightClass = "h-40 md:h-44" }) {
  const boxRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const dirRef = React.useRef(1);          // 1 => down, -1 => up
  const hoveringRef = React.useRef(false);

  const step = React.useCallback(() => {
    const el = boxRef.current;
    if (!el || !hoveringRef.current) return;

    const max = Math.max(0, el.scrollHeight - el.clientHeight);
    const speed = 0.6; // px per frame (~36px/s @60fps)
    let next = el.scrollTop + dirRef.current * speed;

    if (next <= 0) { next = 0; dirRef.current = 1; }
    if (next >= max) { next = max; dirRef.current = -1; }

    el.scrollTop = next;
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const start = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    hoveringRef.current = true;
    rafRef.current = requestAnimationFrame(step);
  }, [step]);

  const stop = React.useCallback(() => {
    hoveringRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  return (
    <div
      ref={boxRef}
      className={`course-scroll ${heightClass} overflow-y-auto pr-2 border border-[var(--border)] rounded-xl bg-[var(--bg-2)]`}
      style={{
        WebkitOverflowScrolling: "touch",
        scrollBehavior: "smooth",
        overscrollBehavior: "contain",
        scrollbarGutter: "stable both-edges",
      }}
      role="region"
      tabIndex={0}
      aria-label="Coursework (auto-scrolls on hover)"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <ul className="text-sm text-[var(--text-muted)] list-disc list-inside p-3 space-y-1">
        {items.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceEducation() {
  return (
    <Section id="experience" title="Experience & Education">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* LEFT: separate timelines */}
        <div className="space-y-10">
          {/* Freelance */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] mb-3">
              Freelance Experience
            </h3>
            <div className="relative pl-7 space-y-6">
              <div className="timeline-rail timeline-rail--freelance" />
              <ExperienceCard item={freelance} dotClass="timeline-dot timeline-dot--freelance" />
            </div>
          </div>

          {/* Employment */}
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
                            {e.start || ""}{e.start && e.end ? " – " : ""}{e.end || ""}
                          </span>
                        )}
                        {e.gpaText && <span> &nbsp;→&nbsp; {e.gpaText}</span>}
                      </div>
                    </div>
                  </div>

                  {e.info && (
                    <p className="text-sm text-[var(--text-muted)] relative z-[1]">{e.info}</p>
                  )}

                  {/* Coursework — auto-scroll box */}
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
