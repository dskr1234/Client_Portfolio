import React from "react"
import Section from "./Section"
import { experience } from "../lib/data"
import { Briefcase, CalendarClock, MapPin } from "lucide-react"
import { motion, useSpring } from "framer-motion"

/* 3D tilt wrapper */
function Tilt3D({ children, max = 8, intensity = 5 }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })
  function onMove(e){ const el=e.currentTarget, r=el.getBoundingClientRect()
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height
    ry.set((px-.5)*-2*max); rx.set((py-.5)*2*max)
    tx.set((px-.5)*intensity); ty.set((py-.5)*intensity)
    el.style.setProperty("--mx",`${px*100}%`); el.style.setProperty("--my",`${py*100}%`)
  }
  function onLeave(){ rx.set(0); ry.set(0); tx.set(0); ty.set(0) }
  return (
    <motion.div className="perspective-1200">
      <motion.div
        className="preserve-3d will-change-transform relative"
        style={{ rotateX: rx, rotateY: ry, x: tx, y: ty }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="shine" />
        {children}
      </motion.div>
    </motion.div>
  )
}

/* Small logo bubble (use /public/logos/accenture.svg) */
function CompanyLogo({ name }) {
  const slug = name?.toLowerCase().replace(/\s+/g, "-")
  const src = `/Exp_Com_Logo.png`   // e.g., /logos/accenture.svg
  return (
    <div className="w-10 h-10 rounded-xl bg-[var(--bg-3)] border border-[var(--border)] grid place-items-center overflow-hidden">
      <img
        src={src}
        alt={`${name} logo`}
        className="w-7 h-7 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none"
          e.currentTarget.parentElement.textContent = name?.[0] || "•"
        }}
      />
    </div>
  )
}

export default function Experience(){
  return (
    <Section id="experience" title="Experience">
      <div className="space-y-6">
        {experience.map((e, i) => (
          <Tilt3D key={i}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: .5 }}
              className="card-neo rounded-[22px] p-6"
            >
              {/* header */}
              <div className="flex items-center gap-4">
                <CompanyLogo name={e.company} />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    {e.role} · {e.company}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)] mt-1">
                    <span className="inline-flex items-center gap-1"><CalendarClock size={14}/>{e.period}</span>
                    {e.location && <span className="inline-flex items-center gap-1"><MapPin size={14}/>{e.location}</span>}
                    <span className="inline-flex items-center gap-1"><Briefcase size={14}/>{e.type || "Full-time"}</span>
                  </div>
                </div>
              </div>

              {/* bullets */}
              {e.bullets?.length > 0 && (
                <ul className="mt-4 list-disc pl-6 space-y-2 text-[var(--text-muted)]">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              )}

              {/* tech stack */}
              {e.stack?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.stack.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-3)] text-[var(--text-muted)]">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </Tilt3D>
        ))}
      </div>
    </Section>
  )
}
