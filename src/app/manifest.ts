import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Prumo",
    description: siteConfig.descriptor,
    start_url: "/",
    display: "browser",
    lang: "pt-BR",
    theme_color: "#1E3227",
    background_color: "#E9E6DF",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
