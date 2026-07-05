import ProjectCard from "./ProjectCard"
import { projects } from "@/data/projects"

export default function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects
        .filter((p) => p.featured)
        .map((project) => (
          <div
            key={project.slug}
            className="project-grid-item"
            style={{
              gridColumn: `var(--grid-span-${project.aspectRatio.replace(":", "-")})`,
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
    </div>
  )
}
