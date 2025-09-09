// src/components/Tilt3D.jsx
import React, { useRef } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

/**
 * Tilt3D
 * Wrap any card to add 3D tilt + subtle parallax.
 *
 * Props:
 * - max        : number  (max tilt deg)          default 12
 * - intensity  : number  (x/y parallax px)       default 8
 * - pop        : number  (translateZ on hover)   default 8
 * - className  : string  (extra classes on outer wrapper)
 * - disabled   : boolean (force-disable effects) default false
 *
 * NOTE: This wrapper only handles motion/tilt.
 * If you want the glossy cursor hotspot, put a <div className="shine" /> INSIDE your card.
 */
export default function Tilt3D({
  children,
  max = 12,
  intensity = 8,
  pop = 8,
  className = "",
  disabled = false,
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);

  const rx = useSpring(0, { stiffness: 220, damping: 18 });
  const ry = useSpring(0, { stiffness: 220, damping: 18 });
  const tx = useSpring(0, { stiffness: 250, damping: 22 });
  const ty = useSpring(0, { stiffness: 250, damping: 22 });
  const tz = useSpring(0, { stiffness: 200, damping: 18 });

  const isDisabled = disabled || prefersReduced;

  function onMove(e) {
    if (isDisabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    // tilt
    ry.set((px - 0.5) * -2 * max);
    rx.set((py - 0.5) * 2 * max);

    // parallax
    tx.set((px - 0.5) * intensity);
    ty.set((py - 0.5) * intensity);

    // slight pop
    tz.set(pop);

    // for .shine hotspot
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  }

  function onLeave() {
    if (isDisabled) return;
    rx.set(0);
    ry.set(0);
    tx.set(0);
    ty.set(0);
    tz.set(0);
  }

  if (isDisabled) {
    // graceful fallback – no motion, just render children
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={`perspective-1200 ${className}`}>
      <motion.div
        ref={ref}
        className="preserve-3d will-change-transform relative"
        style={{ rotateX: rx, rotateY: ry, x: tx, y: ty, translateZ: tz }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
