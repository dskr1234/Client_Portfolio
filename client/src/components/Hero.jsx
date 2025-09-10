import React, { useEffect, useMemo, useRef, useState } from "react";
import Tilt3D from "./Tilt3D";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";

/* ---- Word-by-word typewriter with blinking caret ---- */
const TypeWords = ({
  text,
  startDelay = 150,   // when to start after entering view
  wordDelay = 180,    // gap between words
  cursor = true,
  className = "",
}) => {
  const words = useMemo(() => text.split(" "), [text]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = [];
    let t = startDelay;
    for (let i = 0; i < words.length; i++) {
      timers.push(setTimeout(() => setN(i + 1), t));
      t += wordDelay;
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, words.length, startDelay, wordDelay]);

  return (
    <span ref={ref} className={className}>
      {words.slice(0, n).join(" ")}
      {cursor && inView && n < words.length ? (
        <span
          className="inline-block w-[2px] h-[1em] bg-current align-[-0.15em] ml-1 animate-pulse"
          aria-hidden
        />
      ) : null}
    </span>
  );
};

export default function Hero() {
  const plans = [
    "Scaling RecruiteMee with AI advancements 🚀",
    "Creating impactful Full-Stack Projects 💻",
    "Exploring High-Level System Design 🏗️",
    "Diving into LLMs & Machine Learning 🤖",
  ];

  return (
    <section id="home" className="scroll-mt-28">
      <Tilt3D>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden card-neo rounded-[24px] p-6 md:p-8"
        >
          <div className="shine" />

          <div className="relative z-[1]" style={{ transform: "translateZ(18px)" }}>
            <div className="flex items-center gap-2 text-sm text-[var(--text)]/85">
              <span className="p-2 rounded-lg bg-gradient-to-r from-violet-400/85 to-fuchsia-500/85 text-white shadow-md">
                <Sparkles size={14} />
              </span>
              <span className="font-medium">Future Plans</span>
            </div>

            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-[var(--text)]">
              <TypeWords
                text="Shaping Tomorrow with What I Learn Today"
                startDelay={200}
                wordDelay={160}
              />
            </h1>

            <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-[var(--text)]">
              {plans.map((line, i) => (
                <li key={i} className="pill-neo px-3 py-2 rounded-xl text-sm text-[var(--text)]/90">
                  <TypeWords
                    text={line}
                    startDelay={800 + i * 800}   // stagger each row
                    wordDelay={120}
                  />
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Tilt3D>
    </section>
  );
}
