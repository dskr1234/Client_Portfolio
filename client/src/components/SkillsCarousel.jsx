import React, { useCallback, useMemo, useRef, useState } from "react"
import { motion, AnimatePresence, useMotionValue } from "framer-motion"

// Re-usable mobile slide shell (we pass in your existing Card content)
export default function SkillsCarousel({ slides }) {
  const [index, setIndex] = useState(0)
  const x = useMotionValue(0)
  const ref = useRef(null)

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max))
  const slideCount = slides.length

  const go = useCallback((dir) => {
    setIndex((i) => clamp(i + dir, 0, slideCount - 1))
  }, [slideCount])

  // Paging on drag end (velocity + offset)
  const onDragEnd = (_, info) => {
    const swipe = Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 500
    if (!swipe) {
      // snap back to center
      x.set(0)
      return
    }
    go(info.offset.x > 0 ? -1 : 1)
    x.set(0)
  }

  // For dots
  const Dot = ({ i }) => (
    <button
      aria-label={`Go to slide ${i+1}`}
      onClick={() => setIndex(i)}
      className={`h-2 w-2 rounded-full transition-all ${
        i === index ? "w-6 bg-violet-400" : "bg-white/30 hover:bg-white/60"
      }`}
    />
  )

  return (
    <div className="relative">
      {/* edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#0f1116] to-transparent rounded-l-2xl" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#0f1116] to-transparent rounded-r-2xl" />

      {/* viewport */}
      <div className="perspective-1200 overflow-hidden no-scrollbar">
        <div className="relative">
          <AnimatePresence initial={false} mode="popLayout">
            {slides.map((SlideContent, i) => {
              const offset = i - index // -1,0,1,...
              const isCenter = offset === 0
              return (
                <motion.div
                  key={i}
                  drag="x"
                  dragElastic={0.08}
                  onDragEnd={onDragEnd}
                  style={{ x }}
                  dragConstraints={{ left: 0, right: 0 }}
                  className="touch-pan-x"
                  initial={{ opacity: 0, scale: 0.96, rotateY: -6 }}
                  animate={{
                    opacity: isCenter ? 1 : 0.7,
                    scale: isCenter ? 1 : 0.94,
                    rotateY: isCenter ? 0 : (offset < 0 ? 6 : -6),
                    zIndex: isCenter ? 10 : 5,
                  }}
                  transition={{ type: "spring", stiffness: 180, damping: 24 }}
                >
                  <div
                    ref={isCenter ? ref : null}
                    className="min-w-[88vw] xs:min-w-[84vw] sm:min-w-[80vw] mx-auto"
                    // parallax offset for side slides
                    style={{ transform: `translateX(${offset * -12}px)` }}
                  >
                    <SlideContent />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* arrows */}
      <div className="absolute inset-x-0 -bottom-10 flex items-center justify-between px-2">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="pill bg-white/10 text-white/80 disabled:opacity-40"
        >
          ‹ Prev
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: slideCount }).map((_, i) => <Dot key={i} i={i} />)}
        </div>
        <button
          onClick={() => go(1)}
          disabled={index === slideCount - 1}
          className="pill bg-white/10 text-white/80 disabled:opacity-40"
        >
          Next ›
        </button>
      </div>
    </div>
  )
}
