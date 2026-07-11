// =============================================================================
// Dynamic sitemap — /sitemap.xml
// Auto-generates from all published content slugs.
// Crawled by search engines for indexing.
// =============================================================================

import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
  getAllArticleSlugs,
  getAllCategorySlugs,
  getAllAuthorSlugs,
  getAllTagSlugs,
} from "@/lib/strapi";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleResult, categoryResult, authorResult, tagResult] =
    await Promise.allSettled([
      getAllArticleSlugs(),
      getAllCategorySlugs(),
      getAllAuthorSlugs(),
      getAllTagSlugs(),
    ]);

  const articleSlugs = articleResult.status === "fulfilled" ? articleResult.value : [];
  const categorySlugs = categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const authorSlugs = authorResult.status === "fulfilled" ? authorResult.value : [];
  const tagSlugs = tagResult.status === "fulfilled" ? tagResult.value : [];

  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  const articles: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: `${SITE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const authors: MetadataRoute.Sitemap = authorSlugs.map((slug) => ({
    url: `${SITE_URL}/authors/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const tags: MetadataRoute.Sitemap = tagSlugs.map((slug) => ({
    url: `${SITE_URL}/tag/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...staticPages, ...articles, ...categories, ...authors, ...tags];
}
