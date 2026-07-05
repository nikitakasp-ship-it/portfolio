"use client"

import ProjectCard from "./ProjectCard"
import { projects } from "@/data/projects"

export default function ProjectGrid() {
  const featured = projects.filter((p) => p.featured)

  return (
    <div className="project-grid">
      {featured.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  )
}
