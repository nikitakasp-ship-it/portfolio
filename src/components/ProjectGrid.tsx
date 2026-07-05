"use client"

import ProjectCard from "./ProjectCard"
import { projects } from "@/data/projects"

export default function ProjectGrid() {
  const featured = projects.filter((p) => p.featured)

  return (
    <div className="project-grid">
      {featured.map((project) => (
        <div
          key={project.slug}
          className={`project-grid-item${project.gridPosition ? ` project-grid-item--${project.gridPosition}` : ""}`}
        >
          <ProjectCard project={project} />
        </div>
      ))}
    </div>
  )
}
