import ProjectCard from "./ProjectCard"
import { projects, getColSpan } from "@/data/projects"

export default function ProjectGrid() {
  return (
    <div
      className="grid gap-6 md:gap-8"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoFlow: "dense",
        alignItems: "start",
      }}
    >
      {projects
        .filter((p) => p.featured)
        .map((project) => (
          <div
            key={project.slug}
            className="w-full"
            style={{
              gridColumn: `span ${getColSpan(project.aspectRatio)}`,
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
    </div>
  )
}
