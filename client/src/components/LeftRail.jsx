import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiLeetcode, SiGmail } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";
import { profile } from "../lib/data";
import { NAV_H } from "./Navbar";

const isCoarsePointer =
  typeof window !== "undefined" &&
  window.matchMedia?.("(pointer: coarse)").matches;

const Orb = ({
  href,
  title,
  children,
  className = "",
  gradient = "from-violet-500/40 via-fuchsia-500/30 to-cyan-400/30",
  size = 48,
}) => {
  const Comp = href ? motion.a : motion.div;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(0, { stiffness: 220, damping: 18 });
  const ry = useSpring(0, { stiffness: 220, damping: 18 });

  const onMove = (e) => {
    if (isCoarsePointer) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    x.set((px - 0.5) * 8);
    y.set((py - 0.5) * 8);
    ry.set((px - 0.5) * -18);
    rx.set((py - 0.5) * 18);
    e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--my", `${py * 100}%`);
  };
  const onLeave = () => { x.set(0); y.set(0); rx.set(0); ry.set(0); };

  const isExternal = href && /^https?:\/\//i.test(href);
  const isHash = href && href.startsWith("#");

  const linkProps = href
    ? isExternal
      ? { href, target: "_blank", rel: "noopener noreferrer" }
      : {
          href,
          onClick: (e) => {
            if (isHash) {
              e.preventDefault();
              const el = document.querySelector(href);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          },
        }
    : { role: "button", tabIndex: 0 };

  return (
    <Comp
      {...linkProps}
      title={title}
      aria-label={title}
      style={{ x, y, rotateX: rx, rotateY: ry, width: size, height: size }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={isCoarsePointer ? undefined : { scale: 1.08 }}
      whileTap={{ scale: 0.96 }}
      className={`group relative grid place-items-center rounded-full will-change-transform
                  /* stronger light-mode contrast */
                  bg-glass-soft border border-[var(--border)] text-[var(--text)]
                  dark:bg-white/10 dark:text-white/90
                  backdrop-blur-xl pointer-events-auto
                  shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_18px_40px_rgba(0,0,0,.20)]
                  transition-transform duration-300 ${className}`}
    >
      <span className={`pointer-events-none absolute -inset-2 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-tr ${gradient}`} />
      <span className="pointer-events-none absolute -inset-[2px] rounded-full
                        bg-[conic-gradient(from_0deg,rgba(139,92,246,.28),rgba(168,85,247,.20),rgba(34,211,238,.18),rgba(139,92,246,.28))]
                        dark:opacity-30 opacity-40
                        [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude] p-[2px]" />
      <span className="pointer-events-none absolute inset-0 rounded-full
                        bg-[radial-gradient(160px_120px_at_var(--mx,50%)_var(--my,40%),rgba(255,255,255,.22),rgba(255,255,255,0)_65%)]
                        mix-blend-screen" />
      <span className="relative z-[1] text-xl drop-shadow pointer-events-none">
        {children}
      </span>
    </Comp>
  );
};

export default function LeftRail() {
  return (
    <>
      {/* MOBILE/TABLET */}
      <div className="xl:hidden fixed z-40 right-2 sm:right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] flex items-center gap-2">
        <Orb href="#contact" title="Let’s Talk" size={44} gradient="from-amber-400/40 via-rose-400/30 to-fuchsia-400/30">💬</Orb>
        <Orb title="Theme" size={44}><div className="grid place-items-center pointer-events-auto"><ThemeToggle/></div></Orb>
        <Orb href={profile.links.linkedin} title="LinkedIn" size={44} gradient="from-sky-400/40 via-blue-500/30 to-indigo-500/30"><FaLinkedin/></Orb>
        <Orb href={profile.links.leetcode} title="LeetCode" size={44} gradient="from-yellow-400/40 via-orange-400/30 to-amber-500/30"><SiLeetcode/></Orb>
        <Orb href={profile.links.github} title="GitHub" size={44} gradient="from-zinc-300/40 via-slate-400/30 to-purple-500/30"><FaGithub/></Orb>
        <Orb href={`mailto:${profile.links.email}`} title="Email" size={44} gradient="from-emerald-400/40 via-teal-400/30 to-cyan-400/30"><SiGmail/></Orb>
      </div>

      {/* DESKTOP TOP-RIGHT */}
      <div
        className="hidden xl:flex fixed z-40 right-5 flex-col items-end gap-3"
        style={{ top: `calc(${NAV_H}px + 16px)` }}
      >
        <Orb title="Theme"><div className="grid place-items-center pointer-events-auto"><ThemeToggle/></div></Orb>
        <Orb href="#contact" title="Let’s Talk" gradient="from-amber-400/40 via-rose-400/30 to-fuchsia-400/30">💬</Orb>
      </div>

      {/* DESKTOP BOTTOM-RIGHT */}
      <div className="hidden xl:flex fixed z-40 right-5 bottom-[calc(16px+env(safe-area-inset-bottom))] flex-col items-end gap-3">
        <Orb href={profile.links.linkedin} title="LinkedIn" gradient="from-sky-400/40 via-blue-500/30 to-indigo-500/30"><FaLinkedin/></Orb>
        <Orb href={profile.links.leetcode} title="LeetCode" gradient="from-yellow-400/40 via-orange-400/30 to-amber-500/30"><SiLeetcode/></Orb>
        <Orb href={profile.links.github} title="GitHub" gradient="from-zinc-300/40 via-slate-400/30 to-purple-500/30"><FaGithub/></Orb>
        <Orb href={`mailto:${profile.links.email}`} title="Email" gradient="from-emerald-400/40 via-teal-400/30 to-cyan-400/30"><SiGmail/></Orb>
      </div>
    </>
  );
}
