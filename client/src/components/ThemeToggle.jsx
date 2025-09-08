import React, { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true // default dark on first load
    const stored = localStorage.getItem("theme")
    if (stored) return stored === "dark"
    return true
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [dark])

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark(d => !d)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-black/5 dark:border-white/10 hover:scale-[1.02] transition text-[var(--text)]/80"
    >
      {dark ? <Sun size={16}/> : <Moon size={16} />}
      <span className="text-sm">{dark ? "Light" : "Dark"}</span>
    </button>
  )
}
