import React, { useState } from "react";
import { motion, useSpring, useScroll, AnimatePresence } from "framer-motion";
import { NavLink, Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

export const NAV_H = 88;

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  // Show both Blogs + Projects always
  const links = [
    { label: "Blogs", to: "/", type: "route" },
    { label: "Projects", to: "/projects", type: "route" },
    { label: "Contact", to: "#contact", type: "hash" },
  ];

  // Smooth scroll handler for contact section
  const handleHashClick = (e, hash) => {
    e.preventDefault();
    const el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 18 });

  // Individual nav item
  const Item = ({ item }) => {
    const isActive =
      (item.to === "/" && pathname === "/") ||
      (item.to === "/projects" && pathname.startsWith("/projects"));

    const cls = `
      px-5 py-2 rounded-full text-sm font-medium border backdrop-blur-md transition-all
      ${
        isActive
          ? "text-theme bg-[color-mix(in_oklab,var(--text)_8%,transparent)] border-[color-mix(in_oklab,var(--text)_18%,transparent)]"
          : "text-[color-mix(in_oklab,var(--text)_80%,transparent)] hover:text-theme border-[var(--border)] hover:bg-[color-mix(in_oklab,var(--text)_6%,transparent)]"
      }
    `;

    if (item.type === "route") {
      return (
        <li>
          <NavLink to={item.to} className={cls} onClick={() => setOpen(false)}>
            {item.label}
          </NavLink>
        </li>
      );
    }
    return (
      <li>
        <a href={item.to} className={cls} onClick={(e) => handleHashClick(e, item.to)}>
          {item.label}
        </a>
      </li>
    );
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-[60]"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, rgba(167,139,250,.9), rgba(236,72,153,.9), rgba(34,211,238,.9))",
        }}
      />

      {/* Navbar */}
      <header className="fixed inset-x-0 top-0 z-50 h-[88px]">
        <div className="h-full w-full border-b border-[var(--border)] backdrop-blur-xl bg-[color-mix(in_oklab,var(--bg)_70%,transparent)]">
          <nav className="w-full h-full px-4 md:px-6 flex items-center">
            {/* Logo → Blogs */}
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-white/5 border border-white/10">
                <span className="text-theme font-bold text-sm">UD</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-4 ml-auto">
              {links.map((item) => (
                <Item key={item.label} item={item} />
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button className="md:hidden ml-auto p-2" onClick={() => setOpen(true)}>
              <div className="w-6 h-[2px] bg-current mb-1"></div>
              <div className="w-6 h-[2px] bg-current mb-1"></div>
              <div className="w-6 h-[2px] bg-current"></div>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[40] bg-black/50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed top-0 right-0 z-[50] h-full w-[80%] max-w-[300px] bg-white/10 backdrop-blur-lg p-4"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
                <X />
              </button>
              <ul className="mt-12 flex flex-col gap-3">
                {links.map((item) =>
                  item.type === "route" ? (
                    <li key={item.label}>
                      <NavLink
                        to={item.to}
                        className="block px-5 py-2 rounded-full border border-[var(--border)]"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.to}
                        className="block px-5 py-2 rounded-full border border-[var(--border)]"
                        onClick={(e) => handleHashClick(e, item.to)}
                      >
                        {item.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
