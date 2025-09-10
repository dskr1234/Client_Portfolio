import React from "react";
import Section from "./Section";
import Tilt3D from "./Tilt3D";
import { motion } from "framer-motion";
import {
  GaugeCircle, Layers, ShieldCheck, TrendingUp,
  Briefcase, Globe2, Zap, Users, Rocket, Lightbulb // <- added Lightbulb
} from "lucide-react";

/* Word-by-word reveal */
const WordByWord = ({ text, className = "" }) => {
  const words = text.split(" ");
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const child = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-12%" }}
      className={className}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={child} className="inline-block mr-1">
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
};

const Pillar = ({ icon: Icon, title, text }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-[var(--bg-3)] text-[var(--text)]/70 border border-[var(--border)] shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <div className="font-semibold text-[var(--text)]">{title}</div>
      <div className="text-[var(--text-muted)] text-sm">{text}</div>
    </div>
  </div>
);

const SmallCard = ({ icon: Icon, title, text }) => (
  <Tilt3D className="h-full">
    <div className="card-neo rounded-[20px] p-5 space-y-2 h-full">
      <div className="flex items-center gap-2 font-semibold text-[var(--text)]">
        <Icon size={16} /> {title}
      </div>
      <p className="text-sm text-[var(--text-muted)]">{text}</p>
    </div>
  </Tilt3D>
);

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-6">
        {/* === BIG COMBINED CARD: intro paragraphs + Four Pillars === */}
        <Tilt3D>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.55 }}
            className="card-neo rounded-[24px] p-6 md:p-8 space-y-6"
          >
            {/* Intro text */}
            <div className="space-y-4">
              <p className="text-lg leading-relaxed text-[var(--text)]">
                <WordByWord text="I’m an M.S. Computer Science student at the University of Dayton with a strong foundation in problem-solving and a passion for turning ideas into products. My journey has been a mix of industry exposure at Accenture, academic depth in algorithms and systems, and entrepreneurial drive through my startup project RecruiteMee." />
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                <WordByWord text="What excites me most is building things that scale — whether that’s shaving seconds off backend latency, crafting seamless user experiences, or exploring how AI and LLMs can power the next generation of applications. I enjoy bridging the gap between academic theory and real-world engineering, learning continuously while shipping projects that matter." />
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                <WordByWord text="I’m currently preparing for roles at product-based companies where I can grow as an engineer, contribute to large-scale systems, and learn from world-class teams." />
              </p>
            </div>

            {/* Four pillars inside the same container */}
            <div>
              <div className="flex items-center gap-2 font-semibold text-[var(--text)] mb-3">
                <Zap size={16} /> ⚡ Four Pillars I Believe In
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Pillar
                  icon={GaugeCircle}
                  title="Build for Performance"
                  text="Fast, efficient, and reliable code is the foundation of world-class software."
                />
                <Pillar
                  icon={Layers}
                  title="Think in Systems"
                  text="Every feature should fit into a bigger architecture that can grow and evolve."
                />
                <Pillar
                  icon={TrendingUp}
                  title="Engineer for Scale"
                  text="Design with millions of users in mind — leveraging cloud and modern practices."
                />
                <Pillar
                  icon={ShieldCheck}
                  title="Ship with Quality"
                  text="Test, monitor, and deliver products that earn trust with every release."
                />
              </div>
            </div>
          </motion.div>
        </Tilt3D>

        {/* === SIX SEPARATE CARDS BELOW — responsive grid === */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SmallCard
            icon={Briefcase}
            title="Open Roles"
            text="Excited for Software Engineer (SDE-1), Full-Stack, Backend, Cloud, or related roles in the USA."
          />
          <SmallCard
            icon={Globe2}
            title="Global Perspective"
            text="Proud international student — adaptive, growth-oriented, and bringing a diverse mindset to every challenge."
          />
          <SmallCard
            icon={Zap}
            title="My Mindset"
            text="Curiosity fuels me; learning drives me; building for scale keeps me moving forward."
          />
          <SmallCard
            icon={Users}
            title="Team Player"
            text="I celebrate teamwork — coordinate early, think ahead, and help teams achieve more together."
          />
          <SmallCard
            icon={Rocket}
            title="What I’ll Contribute"
            text="Energy, ownership, and a builder’s spirit — delivering impact from day one."
          />
          <SmallCard
            icon={Lightbulb}
            title="Learning > Ego"
            text="Stay curious, seek feedback early, and adapt fast — progress beats perfection."
          />
        </div>
      </div>
    </Section>
  );
}
