import React from "react";
import Tilt3D from "./Tilt3D";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section id="portfolio" className="scroll-mt-28">
      <Tilt3D>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden card-neo rounded-[24px] p-6 md:p-8"
        >
          {/* keep the glossy hotspot ONLY (same as About) */}
          <div className="shine" />

          <div className="relative z-[1]" style={{ transform: "translateZ(18px)" }}>
            <div className="flex items-center gap-2 text-sm text-[var(--text)]/85">
              <span className="p-2 rounded-lg bg-gradient-to-r from-violet-400/85 to-fuchsia-500/85 text-white shadow-md">
                <Sparkles size={14} />
              </span>
              <span className="font-medium">Portfolio</span>
            </div>

            <h1 className="mt-2 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-[var(--text)]">
              Check out my{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-200">
                featured
              </span>{" "}
              projects
            </h1>

            <p className="mt-4 text-[var(--text-muted)] max-w-2xl">
              Graduate student with strong full-stack MERN skills and industry experience.
              Passionate about performant UIs, reliable APIs, and clean architecture.
            </p>
          </div>
        </motion.div>
      </Tilt3D>
    </section>
  );
}
