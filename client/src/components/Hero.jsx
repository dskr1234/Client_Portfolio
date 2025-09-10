import React, { useEffect, useMemo, useRef, useState } from "react";
import Tilt3D from "./Tilt3D";
import { motion, useInView } from "framer-motion";
import { Sparkles } from "lucide-react";

/* ===== Helpers: smooth word rendering ===== */
const SmoothWords = ({ words, shown, cursor, showCursorWhenDone }) => {
  const isTyping = shown < words.length;
  return (
    <span className="inline">
      {words.map((w, i) => (
        <span
          key={i}
          className={
            "inline-block mr-1 transition-all duration-300 " +
            "ease-[cubic-bezier(.2,.8,.2,1)] " +
            (i < shown ? "opacity-100 translate-y-0 blur-0"
                       : "opacity-0 translate-y-1 blur-[2px]")
          }
        >
          {w}
        </span>
      ))}
      {(cursor && (isTyping || showCursorWhenDone)) ? (
        <span
          aria-hidden
          className="inline-block w-[2px] h-[1em] bg-current align-[-0.15em] ml-1 animate-pulse"
        />
      ) : null}
    </span>
  );
};

/* --- One-shot word-by-word typewriter (for the heading) --- */
const TypeWordsOnce = ({
  text, startDelay = 150, wordDelay = 160, cursor = true, className = ""
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
      <SmoothWords words={words} shown={n} cursor={cursor} showCursorWhenDone={false} />
    </span>
  );
};

/* --- LOOPING word-by-word typewriter (for the 4 plan lines) --- */
const TypeWordsLoop = ({
  text,
  startDelay = 0,
  wordDelay = 120,
  holdMs = 1200,      // stay full for a moment before restarting
  cursor = true,
  className = "",
}) => {
  const words = useMemo(() => text.split(" "), [text]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let timeoutId;

    const animate = () => {
      let i = 0;
      const tick = () => {
        if (i < words.length) {
          setN(i + 1);            // reveals next word -> SmoothWords handles fade/slide/blur
          i += 1;
          timeoutId = setTimeout(tick, wordDelay);
        } else {
          timeoutId = setTimeout(() => {
            // smooth hide (let CSS transition do the fade)
            setN(0);
            i = 0;
            timeoutId = setTimeout(tick, wordDelay);
          }, holdMs);
        }
      };
      timeoutId = setTimeout(tick, startDelay);
    };

    animate();
    return () => clearTimeout(timeoutId);
  }, [inView, words.length, startDelay, wordDelay, holdMs]);

  return (
    <span ref={ref} className={className}>
      <SmoothWords words={words} shown={n} cursor={cursor} showCursorWhenDone />
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
              <TypeWordsOnce
                text="Shaping Tomorrow with What I Learn Today"
                startDelay={200}
                wordDelay={150}
              />
            </h1>

            {/* 4 rows that continuously auto-type, staggered so they don't sync */}
            <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-[var(--text)]">
              {plans.map((line, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
                  className="pill-neo px-3 py-2 rounded-xl text-sm text-[var(--text)]/90"
                >
                  <TypeWordsLoop
                    text={line}
                    startDelay={500 + i * 400}
                    wordDelay={110}
                    holdMs={1400}
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Tilt3D>
    </section>
  );
}
