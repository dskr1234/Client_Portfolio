import React from "react"
import Section from "./Section"
import { education } from "../lib/data"
import { GraduationCap, BookOpen } from "lucide-react"
import { motion, useSpring } from "framer-motion"

function Tilt3D({ children, max = 8, intensity = 5 }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })
  function onMove(e){ 
    const el = e.currentTarget, r = el.getBoundingClientRect()
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

export default function Education(){
  return (
    <Section id="education" title="Education">
      <div className="space-y-6">
        {education.map((e, i) => (
          <Tilt3D key={i}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{ duration: .5 }}
              className="card-neo rounded-[24px] p-6 md:p-8 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-violet-400/80 to-purple-500/80 text-white shadow-md">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--text)]">{e.school}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{e.degree}</p>
                </div>
              </div>

              {e.info && <p className="text-sm text-[var(--text-muted)] pl-[52px]">{e.info}</p>}

              {e.coursework?.length > 0 && (
                <div className="pl-[52px]">
                  <div className="flex items-center gap-2 text-sm text-[var(--text)] font-semibold mb-1">
                    <BookOpen size={16} /> Coursework
                  </div>
                  <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                    {e.coursework.map((c, j) => <li key={j}>{c}</li>)}
                  </ul>
                </div>
              )}
            </motion.div>
          </Tilt3D>
        ))}
      </div>
    </Section>
  )
}
