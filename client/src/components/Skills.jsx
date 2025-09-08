import React from "react"
import Section from "./Section"
import { skills } from "../lib/data"
import { motion, useSpring } from "framer-motion"

// Icons
import {
  FaJs, FaPython, FaHtml5, FaCss3Alt, FaReact, FaNodeJs,
  FaGitAlt, FaGithub, FaDatabase, FaAws
} from "react-icons/fa"
import {
  SiMongodb, SiExpress, SiDjango, SiBootstrap, SiNumpy, SiPandas,
  SiMysql, SiPostgresql, SiJira
} from "react-icons/si"
import { TbApi } from "react-icons/tb"

/* map skill → icon */
const ICONS = {
  "JavaScript (ES6+)": FaJs,
  "Python": FaPython,
  "HTML": FaHtml5,
  "CSS": FaCss3Alt,
  "SQL": FaDatabase,
  "MongoDB": SiMongodb,

  "React": FaReact,
  "Node": FaNodeJs,
  "Express": SiExpress,
  "Django": SiDjango,
  "Bootstrap": SiBootstrap,
  "NumPy": SiNumpy,
  "Pandas": SiPandas,

  "Git": FaGitAlt,
  "GitHub": FaGithub,
  "MySQL": SiMysql,
  "PostgreSQL": SiPostgresql,
  "REST APIs": TbApi,
  "AWS": FaAws,
  "Agile/Scrum": SiJira,
}

/* assign category → gradient color */
const COLORS = {
  languages: "from-yellow-400/90 to-orange-500/90 text-black",
  frameworks: "from-indigo-400/90 to-violet-500/90 text-white",
  tools: "from-cyan-400/90 to-blue-500/90 text-white",
}

/* 3D tilt wrapper */
function Tilt3D({ children, max = 10, intensity = 6, className = "" }) {
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
    <motion.div className={`perspective-1200 ${className}`}>
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

/* Animated pill with gradient */
function SkillPill({ label, i, color }) {
  const Icon = ICONS[label] || TbApi
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: .95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: .35, delay: i * 0.03 }}
      whileHover={{ scale: 1.1, rotate: [-1, 1, 0] }}
    >
      <div
        className={`px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-medium shadow-lg 
          bg-gradient-to-r ${color} transition-all duration-300`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </div>
    </motion.div>
  )
}

/* Card wrapper */
function Card({ title, items, colorKey }) {
  return (
    <Tilt3D>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: .5 }}
        className="card-neo rounded-[22px] p-5 md:p-6 space-y-3"
      >
        <h3 className="font-semibold text-[var(--text)]">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((s, i) => <SkillPill key={s} label={s} i={i} color={COLORS[colorKey]} />)}
        </div>
      </motion.div>
    </Tilt3D>
  )
}

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Languages & Databases" items={skills.languages} colorKey="languages" />
        <Card title="Frameworks & Libraries" items={skills.frameworks} colorKey="frameworks" />
        <Card title="Tools & Platforms" items={skills.tools} colorKey="tools" />
      </div>
    </Section>
  )
}
