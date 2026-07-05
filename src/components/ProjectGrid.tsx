import ProjectCard from "./ProjectCard"
import { projects, colSpan, videoAspectColSpan } from "@/data/projects"

function getColSpan(project: { layout: string; videoAspect?: string }): string {
  if (project.videoAspect && videoAspectColSpan[project.videoAspect]) {
    return videoAspectColSpan[project.videoAspect]
  }
  return colSpan[project.layout as keyof typeof colSpan] || "span 1"
}

export default function ProjectGrid() {
  return (
    <div
      className="grid gap-6 md:gap-8"
      style={{
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoFlow: "dense",
      }}
    >
      {projects
        .filter((p) => p.featured)
        .map((project) => (
          <div
            key={project.slug}
            className="w-full"
            style={{
              gridColumn: getColSpan(project),
            }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
    </div>
  )
}
