import React from "react";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import Tilt3D from "./Tilt3D";
import { projects } from "../lib/data";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-20">
        {projects.map((p, i) => (
          <div key={i} className="grid lg:grid-cols-2 gap-8 items-start">
            {/* LEFT: card + description (glassy like About) */}
            <div className="space-y-6">
              <ProjectCard title={p.name} subtitle={p.period} tags={p.tags} href={p.link} />
              <DescriptionCard
                title="Overview"
                text={
                  p.description ||
                  "Overview coming soon. This card matches the About page’s glass + 3D polish."
                }
                bullets={p.points}
              />
            </div>

            {/* RIGHT: live preview (iframe/video/image) */}
            <LivePreview3D src={p.preview || p.link} label={`${p.name} — Live Preview`} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ----- helpers (same look/feel as About) ----- */
function DescriptionCard({ title, text, bullets = [] }) {
  return (
    <Tilt3D>
      <div className="relative card-neo rounded-[24px] p-6 overflow-hidden">
        <div className="shine" />
        <h4 className="text-lg font-semibold text-[var(--text)] mb-2">{title}</h4>
        {text && <p className="text-[var(--text-muted)] leading-relaxed">{text}</p>}
        {!!bullets?.length && (
          <ul className="mt-3 space-y-1 list-disc list-inside text-sm text-[var(--text-muted)]">
            {bullets.map((b, idx) => <li key={idx}>{b}</li>)}
          </ul>
        )}
      </div>
    </Tilt3D>
  );
}

function LivePreview3D({ src, label }) {
  const isVideo = typeof src === "string" && src.match(/\.(mp4|webm|ogg)$/i);
  const isImage = typeof src === "string" && src.match(/\.(png|jpe?g|gif|webp|avif)$/i);

  return (
    <Tilt3D className="w-full">
      <div className="relative card-neo rounded-[24px] overflow-hidden">
        <div className="shine" />
        {isVideo ? (
          <video src={src} className="w-full h-[420px] object-cover" autoPlay muted loop playsInline />
        ) : isImage ? (
          <img src={src} alt="preview" className="w-full h-[420px] object-cover" />
        ) : (
          <iframe
            src={src}
            title={label}
            loading="lazy"
            className="w-full h-[420px] bg-white"
            referrerPolicy="no-referrer"
            allow="clipboard-write; fullscreen; autoplay"
          />
        )}
      </div>
      <p className="mt-3 text-xs text-center text-white/60">{label}</p>
    </Tilt3D>
  );
}
