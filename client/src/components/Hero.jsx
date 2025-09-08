import React from "react"
import { profile } from "../lib/data"
import { motion, useSpring } from "framer-motion"

/* tiny 3D wrapper for subtle tilt + shine */
function Tilt3D({ children, max = 8, intensity = 5 }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })

  function onMove(e){
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - .5) * -2 * max)
    rx.set((py - .5) *  2 * max)
    tx.set((px - .5) * intensity)
    ty.set((py - .5) * intensity)
    el.style.setProperty("--mx", `${px*100}%`)
    el.style.setProperty("--my", `${py*100}%`)
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

export default function Hero(){
  return (
    <div className="space-y-3">
      {/* small label (theme aware) */}
      <span className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full border"
            style={{ borderColor: 'var(--border)', color: 'color-mix(in oklab, var(--text) 70%, transparent)' }}>
        ✨ Portfolio
      </span>

      <Tilt3D>
        <div className="soft-2 card-neo rounded-[28px] p-6 md:p-8 pastel">
          <h1 className="display leading-tight text-[var(--text)]">
            Check out my{" "}
            <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg,#b39bff,#e6b6ff)' }}>
              featured
            </span>{" "}
            projects
          </h1>

          <p className="mt-4 max-w-2xl"
             style={{ color: 'color-mix(in oklab, var(--text) 80%, transparent)' }}>
            {profile.about}
          </p>
        </div>
      </Tilt3D>
    </div>
  )
}
