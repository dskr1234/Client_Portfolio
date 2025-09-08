import React, { useEffect, useState } from "react"

export default function ProgressBar(){
  const [w, setW] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight)
      setW(scrolled * 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div className="h-full" style={{ width: `${w}%` }}>
        <div className="h-full bg-gradient-to-r from-blue-500 via-mint to-accent animate-[shimmer_6s_linear_infinite]"></div>
      </div>
    </div>
  )
}
