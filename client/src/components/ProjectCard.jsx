import React from "react";
import Tilt3D from "./Tilt3D";

export default function ProjectCard({ title, subtitle, tags = [], href = "#" }) {
  return (
    <Tilt3D>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="
          relative block overflow-hidden
          card-neo rounded-[24px] p-6
          transition-transform duration-300 hover:-translate-y-[2px]
          group
        "
      >
        <div className="shine" />
        <div className="flex items-start gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-violet-400 mt-2 shadow-[0_0_12px_rgba(167,139,250,.9)]" />
          <h3 className="text-xl font-semibold text-[var(--text)] tracking-tight">{title}</h3>
        </div>
        {subtitle && <p className="text-[var(--text-muted)] text-sm mt-1">{subtitle}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="pill-neo px-3 py-1 rounded-full text-xs text-[var(--text)]/85">
              {t}
            </span>
          ))}
        </div>
      </a>
    </Tilt3D>
  );
}
