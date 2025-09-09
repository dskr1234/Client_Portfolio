import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const systemPrefersDark = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-color-scheme: dark)").matches;

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : systemPrefersDark();
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.setAttribute("data-theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const handleClick = (e) => {
    e.stopPropagation();
    setDark((d) => !d);
  };

  return (
    <button
      aria-label="Toggle theme"
      onClick={handleClick}
      className="grid place-items-center w-8 h-8 rounded-lg bg-glass-soft dark:bg-white/10 text-theme dark:text-white/90 hover:bg-[color-mix(in_oklab,var(--text)_10%,transparent)] transition"
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
