import React, { useEffect, useRef } from "react"

export default function Spotlight(){
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const onMove = (e) => {
      const x = e.clientX, y = e.clientY
      el.style.background = `radial-gradient(600px 300px at ${x}px ${y}px, rgba(255,255,255,.10), transparent 60%)`
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 mix-blend-soft-light"></div>
}
