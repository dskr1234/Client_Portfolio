import React from "react"
import Section from "./Section"
import { profile } from "../lib/data"
import { motion, useSpring } from "framer-motion"
import { GaugeCircle, Layers, Cloud, ShieldCheck, Rocket, TrendingUp, Workflow, Cpu } from "lucide-react"

function Tilt3D({ children, max = 12, intensity = 8, className = "" }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })
  const tz = useSpring(0, { stiffness: 200, damping: 18 })
  function onMove(e){ const el=e.currentTarget, r=el.getBoundingClientRect()
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height
    ry.set((px-.5)*-2*max); rx.set((py-.5)*2*max)
    tx.set((px-.5)*intensity); ty.set((py-.5)*intensity); tz.set(8)
    el.style.setProperty("--mx",`${px*100}%`); el.style.setProperty("--my",`${py*100}%`)
  }
  function onLeave(){ rx.set(0); ry.set(0); tx.set(0); ty.set(0); tz.set(0) }
  return (
    <motion.div className={`perspective-1200 ${className}`}>
      <motion.div className="preserve-3d will-change-transform relative" style={{ rotateX:rx, rotateY:ry, x:tx, y:ty, translateZ:tz }} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="shine" />
        {children}
      </motion.div>
    </motion.div>
  )
}
const Bullet = ({ icon:Icon, title, text }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-[var(--bg-3)] text-[var(--text)]/70 border border-[var(--border)] shrink-0"><Icon size={16}/></div>
    <div><div className="font-semibold text-[var(--text)]">{title}</div><div className="text-[var(--text-muted)] text-sm">{text}</div></div>
  </div>
)

export default function About(){
  return (
    <Section id="about" title="About">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-5">
          <Tilt3D>
            <motion.div initial={{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-12%"}} transition={{duration:.55}} className="card-neo rounded-[24px] p-6 md:p-8 space-y-4">
              <div className="text-lg leading-relaxed text-[var(--text)]">
                I’m an M.S. CS student at the <strong>University of Dayton</strong>, specializing in <strong>Python development</strong> and <strong>Data Structures & Algorithms</strong>. Previously at <strong>Accenture</strong>, I shipped production features ahead of schedule and fixed performance bottlenecks end-to-end.
              </div>
              <div className="text-[var(--text-muted)] leading-relaxed">
                On the front-end, I craft **React/TypeScript** experiences with motion and design-system discipline. On the back-end, I build **Node/Express** and **Python (Flask/Django)** services with clean contracts, caching, and observability. I balance **cloud pragmatism** (AWS + CI/CD) for the US market with **reliability & cost-efficiency** important in India.
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <Bullet icon={GaugeCircle} title="Performance first" text="Cut API p95 from 800ms → 500ms with query tuning & caching; shipped UI micro-perf wins."/>
                <Bullet icon={Layers} title="Sound architecture" text="Typed APIs, modular front-ends, clean data boundaries, safe rollouts."/>
                <Bullet icon={Cloud} title="Cloud practical" text="AWS ECS/Lambda, S3/CloudFront, RDS, CloudWatch; cost-aware configs."/>
                <Bullet icon={ShieldCheck} title="Quality that scales" text="Tests where ROI is real, CI checks, observability & alert hygiene."/>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/80">Python · Flask/Django</span>
                <span className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/80">DSA & Problem-Solving</span>
                <span className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/80">MERN + TypeScript</span>
                <span className="pill-neo px-2.5 py-1 rounded-full text-xs text-[var(--text)]/80">System Design Basics</span>
              </div>
            </motion.div>
          </Tilt3D>

          <div className="grid sm:grid-cols-2 gap-6">
            <Tilt3D>
              <div className="card-neo rounded-[20px] p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><Rocket size={16}/> What I’m great at</div>
                <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                  <li>React + motion for premium UX</li>
                  <li>Node/Python APIs with crisp contracts & caching</li>
                  <li>Data modeling & SQL performance basics</li>
                  <li>Feature flags, CI/CD, and dev-speed tooling</li>
                </ul>
              </div>
            </Tilt3D>

            <Tilt3D>
              <div className="card-neo rounded-[20px] p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-[var(--text)]"><TrendingUp size={16}/> What I’m investing in next</div>
                <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                  <li>Production-grade TypeScript across the stack</li>
                  <li>Queue-backed workflows (BullMQ/SQS) & retries</li>
                  <li>Edge/perf: HTTP/2, compression, prefetch, images</li>
                  <li>LLM-adjacent features (summaries, assist, RAG-lite)</li>
                </ul>
              </div>
            </Tilt3D>
          </div>
        </div>

        <Tilt3D>
          <div className="card-neo rounded-[24px] p-5 md:p-6 space-y-4 h-full">
            <div className="space-y-2 text-[var(--text)]">
              <div><span className="text-[var(--text-muted)]">Based:</span> <span className="font-semibold">{profile.location}</span></div>
              <div><span className="text-[var(--text-muted)]">Email:</span> <a className="underline" href={`mailto:${profile.links.email}`}>{profile.links.email}</a></div>
              <div><span className="text-[var(--text-muted)]">Open to:</span> SDE-1 · Full-stack · Backend</div>
            </div>
            <div className="border-t border-[var(--border)] pt-4 space-y-2 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-2"><Workflow size={14}/> Built & shipped features used by 200+ users</div>
              <div className="flex items-center gap-2"><Cpu size={14}/> Improved p95 latency by ~30%</div>
            </div>
          </div>
        </Tilt3D>
      </div>
    </Section>
  )
}
