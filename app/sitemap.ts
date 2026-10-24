import type { MetadataRoute } from "next";
import { site } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/projects", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
