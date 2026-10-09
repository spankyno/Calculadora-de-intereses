import type { MetadataRoute } from "next";
import { SITE_URL, MODULE_ROUTES } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const moduleEntries: MetadataRoute.Sitemap = MODULE_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: route === "/depositos" ? 1 : 0.8,
  }));

  return [
    ...moduleEntries,
    {
      url: `${SITE_URL}/acerca-de`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
