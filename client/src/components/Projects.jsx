import React from "react"
import Section from "./Section"
import ProjectCard from "./ProjectCard"
import { projects } from "../lib/data"

export default function Projects(){
  return (
    <Section id="projects" title="Projects">
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p,i)=>(
          <ProjectCard
            key={i}
            title={p.name}
            subtitle={p.period}
            tags={p.tags}
            href={p.link}
          />
        ))}
      </div>
    </Section>
  )
}
