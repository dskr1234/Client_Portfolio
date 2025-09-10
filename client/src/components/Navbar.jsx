import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useScroll, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export const NAV_H = 88;

const links = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Experience", "#experience"],
  ["Skills", "#skills"],
  ["LeetCode Dashboard", "#leetcode"],
  ["Contact", "#contact"],
];

/* ---------- tiny 3D tilt wrapper ---------- */
function Tilt3D({ children, max = 8, intensity = 6, pop = 10, className = "" }) {
  const rx = useSpring(0, { stiffness: 220, damping: 18 });
  const ry = useSpring(0, { stiffness: 220, damping: 18 });
  const tx = useSpring(0, { stiffness: 250, damping: 22 });
  const ty = useSpring(0, { stiffness: 250, damping: 22 });
  const tz = useSpring(0, { stiffness: 200, damping: 18 });
  const ref = useRef(null);

  function onMove(e) {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * -2 * max);
    rx.set((py - 0.5) *  2 * max);
    tx.set((px - 0.5) * intensity);
    ty.set((py - 0.5) * intensity);
    tz.set(pop);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  }
  function onLeave(){ rx.set(0); ry.set(0); tx.set(0); ty.set(0); tz.set(0); }

  return (
    <motion.div className={`perspective-1200 ${className}`}>
      <motion.div
        ref={ref}
        className="preserve-3d will-change-transform relative"
        style={{ rotateX: rx, rotateY: ry, x: tx, y: ty, translateZ: tz }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="shine rounded-[10px]" />
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  /* Track active section */
  useEffect(() => {
    const secs = document.querySelectorAll("section[id]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.55 }
    );
    secs.forEach((s) => io.observe(s));
    return () => secs.forEach((s) => io.unobserve(s));
  }, []);

  /* Scroll progress line */
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 18, restDelta: 0.001 });

  /* Smooth scroll handler */
  const smoothNav = (e, href) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  /* Chip link */
  const NavLink = ({ label, href }) => {
    const on = active === href.slice(1);
    return (
      <li>
        <motion.a
          href={href}
          onClick={(e) => smoothNav(e, href)}
          whileHover={{ y: -1, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={[
            "relative inline-flex items-center rounded-full",
            "px-5 py-2 text-sm font-medium select-none transition-all",
            "backdrop-blur-md border",
            on
              ? "text-theme bg-[color-mix(in_oklab,var(--text)_8%,transparent)] " +
                "border-[color-mix(in_oklab,var(--text)_18%,transparent)] " +
                "shadow-[0_10px_28px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.08)]"
              : "text-[color-mix(in_oklab,var(--text)_80%,transparent)] hover:text-theme " +
                "border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--text)_6%,transparent)]",
          ].join(" ")}
          style={{ transform: "translateZ(16px)" }}
          aria-current={on ? "page" : undefined}
        >
          {on && (
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-[6px] rounded-full opacity-60 blur-[12px]"
              style={{
                background:
                  "radial-gradient(80% 80% at 50% 50%, rgba(139,92,246,.25), transparent 70%)",
              }}
            />
          )}
          <span className="relative z-[1]">{label}</span>
        </motion.a>
      </li>
    );
  };

  return (
    <>
      {/* progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-[0%_50%]"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, rgba(167,139,250,.9), rgba(236,72,153,.9), rgba(34,211,238,.9))",
        }}
      />

      <header className="fixed inset-x-0 top-0 z-50 h-[88px]">
        {/* glass header */}
        <div
          className="h-full w-full border-b border-[var(--border)] backdrop-blur-xl
                     bg-[color-mix(in_oklab,var(--bg)_70%,transparent)]"
          style={{ boxShadow: "0 10px 30px rgba(0,0,0,.45)" }}
        >
          <nav className="w-full h-full px-3 sm:px-4 md:px-6">
            <div className="w-full h-full flex items-center gap-4">
              {/* brand */}
              <a href="#home" onClick={(e)=>smoothNav(e,"#home")} className="relative inline-flex items-center gap-2">
                <span className="relative grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -inset-px rounded-xl p-[1px] opacity-45
                               bg-[conic-gradient(from_0deg,rgba(167,139,250,.55),rgba(236,72,153,.55),rgba(34,211,238,.50),rgba(167,139,250,.55))]
                               [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
                               [mask-composite:exclude]"
                  />
                  <span className="text-theme font-bold text-sm" style={{ transform: "translateZ(14px)" }}>
                    UD
                  </span>
                </span>
              </a>

              <div className="hidden md:block flex-1" />

              {/* ===== DESKTOP: Chip dock container ===== */}
              <div className="hidden md:block">
                <Tilt3D className="inline-block">
                  <div
                    className={[
                      "relative rounded-[10px]",        // requested 10px
                      "px-3 py-2",                       // extra inner padding
                      "border border-[var(--border)]",
                      "backdrop-blur-xl",
                      "bg-[color-mix(in_oklab,var(--text)_5%,transparent)]", // subtle glass
                      "shadow-[0_18px_40px_rgba(0,0,0,.28),inset_0_1px_0_rgba(255,255,255,.06)]",
                    ].join(" ")}
                  >
                    <ul className="flex items-center gap-4 md:gap-5 lg:gap-6">
                      {links.map(([label, href]) => (
                        <NavLink key={href} label={label} href={href} />
                      ))}
                    </ul>
                  </div>
                </Tilt3D>
              </div>

              {/* mobile hamburger */}
              <button
                onClick={() => setOpen(true)}
                className="md:hidden ml-auto inline-flex flex-col gap-1.5 px-2 py-1 rounded-lg hover:bg-[color-mix(in_oklab,var(--text)_6%,transparent)] text-theme/80 dark:text-white/80"
                aria-label="Open menu"
              >
                <span className="block w-5 h-[2px] bg-current rounded" />
                <span className="block w-5 h-[2px] bg-current rounded" />
                <span className="block w-5 h-[2px] bg-current rounded" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ===== MOBILE drawer ===== */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed top-0 right-0 z-[60] h-full w-[86%] max-w-[380px] p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="relative card-neo soft-2 rounded-[18px] h-full p-5 flex flex-col gap-5">
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 pill-neo px-2 py-1"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>

                <div className="font-extrabold tracking-tight text-xl text-theme">
                  Upendra<span className="text-violet-300">.</span>
                </div>

                <ul className="flex flex-col gap-2 mt-2">
                  {links.map(([label, href]) => {
                    const on = active === href.slice(1);
                    return (
                      <li key={href}>
                        <a
                          href={href}
                          onClick={(e) => smoothNav(e, href)}
                          className={[
                            "block w-full rounded-full px-5 py-2 text-sm font-medium transition-all border backdrop-blur-md",
                            on
                              ? "text-theme bg-[color-mix(in_oklab,var(--text)_8%,transparent)] border-[color-mix(in_oklab,var(--text)_18%,transparent)]"
                              : "text-[color-mix(in_oklab,var(--text)_80%,transparent)] hover:text-theme border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--text)_6%,transparent)]",
                          ].join(" ")}
                        >
                          {label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
