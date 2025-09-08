import React, { useEffect, useState } from "react"
import ThemeToggle from "./ThemeToggle"
import { motion, useSpring, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const links = [
  ["Home", "#home"],
  ["Portfolio", "#projects"],
  ["About Me", "#about"],
  ["Resume", "#education"],
  ["Contact", "#contact"],
]

function Tilt3D({ children, max = 6, intensity = 4 }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 })
  const ry = useSpring(0, { stiffness: 220, damping: 18 })
  const tx = useSpring(0, { stiffness: 250, damping: 22 })
  const ty = useSpring(0, { stiffness: 250, damping: 22 })
  function onMove(e){ const el=e.currentTarget, r=el.getBoundingClientRect()
    const px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height
    ry.set((px-.5)*-2*max); rx.set((py-.5)*2*max)
    tx.set((px-.5)*intensity); ty.set((py-.5)*intensity)
    el.style.setProperty("--mx", `${px*100}%`); el.style.setProperty("--my", `${py*100}%`)
  }
  function onLeave(){ rx.set(0); ry.set(0); tx.set(0); ty.set(0) }
  return (
    <motion.div className="perspective-1200" style={{ rotateX:rx, rotateY:ry, x:tx, y:ty }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="shine" />{children}
    </motion.div>
  )
}

export default function Navbar(){
  const [active, setActive] = useState("home")
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    const secs = document.querySelectorAll("section[id]")
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>e.isIntersecting && setActive(e.target.id))
    },{threshold:.55})
    secs.forEach(s=>io.observe(s))
    return ()=>secs.forEach(s=>io.unobserve(s))
  },[])

  const NavLink = ({label, href, onClick}) => {
    const id = href.slice(1)
    const on = active === id
    return (
      <a
        href={href}
        onClick={onClick}
        className={`pill transition-all ${
          on
            ? "bg-violet-500/20 text-violet-200 shadow-[0_0_15px_rgba(139,92,246,0.35)]"
            : "text-[color-mix(in_oklab,var(--text)_75%,transparent)] hover:bg-black/5"
        }`}
      >
        {label}
      </a>
    )
  }

  return (
    <header className="sticky top-0 z-50">
      <nav className="container-px max-w-7xl mx-auto py-4">
        <Tilt3D>
          <div className="soft-2 card-neo rounded-[20px] px-4 md:px-5 py-3 flex items-center justify-between gap-3">
            {/* hamburger */}
            <button
              onClick={()=>setOpen(true)}
              className="md:hidden inline-flex flex-col gap-1.5 px-2 py-1 rounded-lg hover:bg-black/5 text-[var(--text)]/80"
              aria-label="Open menu"
            >
              <span className="block w-5 h-[2px] bg-[var(--text)]/80 rounded" />
              <span className="block w-5 h-[2px] bg-[var(--text)]/80 rounded" />
              <span className="block w-5 h-[2px] bg-[var(--text)]/80 rounded" />
            </button>

            <div className="font-extrabold tracking-tight text-xl text-[var(--text)]">
              Upendra<span className="text-violet-300">.</span>
            </div>

            <ul className="hidden md:flex items-center gap-3">
              {links.map(([label, href])=>(
                <li key={href}><NavLink label={label} href={href}/></li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <a href="#contact" className="pill bg-pink-400/20 text-pink-300 hover:bg-pink-400/30">Let’s Talk 💬</a>
            </div>
          </div>
        </Tilt3D>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setOpen(false)} />
            <motion.aside
              className="fixed top-0 right-0 h-full w-[86%] max-w-[380px] p-4"
              initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }}
              transition={{ type:"spring", stiffness:260, damping:26 }}
            >
              <div className="card-neo soft-2 rounded-[18px] h-full p-5 flex flex-col gap-5 relative">
                <button onClick={()=>setOpen(false)} className="absolute top-3 right-3 pill" aria-label="Close"><X size={16}/></button>
                <div className="font-extrabold tracking-tight text-xl text-[var(--text)]">
                  Upendra<span className="text-violet-300">.</span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  {links.map(([label, href])=>(
                    <NavLink key={href} label={label} href={href} onClick={()=>setOpen(false)} />
                  ))}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <ThemeToggle />
                  <a href="#contact" className="pill bg-pink-400/20 text-pink-300">Let’s Talk 💬</a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
