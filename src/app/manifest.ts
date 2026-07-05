import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nikita Kasperovich — Motion Designer",
    short_name: "NK Portfolio",
    description:
      "Motion Design, 3D Animation, Product Visualization, and AI-assisted production.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  }
}
