import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/article/", "/diagram/", "/mindmap/"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: "2026-10-22",
    changeFrequency: "yearly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
