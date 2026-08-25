import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bo Bo Yan Zaw — Full-Stack Web Developer",
    short_name: "BBYz",
    description:
      "Portfolio of Bo Bo Yan Zaw — full-stack web developer (PHP · Laravel · React · MySQL).",
    start_url: "/",
    display: "standalone",
    background_color: "#06060b",
    theme_color: "#3b82f6",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
