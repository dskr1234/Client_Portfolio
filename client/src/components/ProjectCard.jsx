import React from "react"

export default function ProjectCard({ title, subtitle, tags = [], image, href = "#" }){
  return (
    <a href={href} target="_blank" rel="noreferrer" className="tile p-5 block card-neo">
      {/* image removed per your request — keeping frame for symmetry */}
      <h3 className="text-xl font-semibold text-[var(--text)]">{title}</h3>
      {subtitle && <p className="text-[var(--text-muted)] text-sm mt-1">{subtitle}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map(t => (
          <span className="px-3 py-1 rounded-full text-xs border border-[var(--border)] bg-[var(--bg-3)] text-[var(--text-muted)]" key={t}>
            {t}
          </span>
        ))}
      </div>
    </a>
  )
}
