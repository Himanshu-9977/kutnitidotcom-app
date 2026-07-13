export const TECHNOLOGY_CATEGORY_SLUGS = [
  "technology",
  "ai",
  "artificial-intelligence",
  "internet",
  "ai-internet",
  "ai-and-internet",
] as const;

const technologyAliases = new Set<string>(TECHNOLOGY_CATEGORY_SLUGS);

export function normalizeCategory(name: string, slug: string) {
  const normalizedSlug = slug.trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();
  const belongsToTechnology =
    technologyAliases.has(normalizedSlug) ||
    normalizedName === "ai" ||
    normalizedName === "internet" ||
    normalizedName === "artificial intelligence" ||
    normalizedName === "ai and internet" ||
    normalizedName === "ai & internet";

  return belongsToTechnology
    ? { name: "Technology", slug: "technology" }
    : { name, slug };
}

export function isTechnologyAlias(slug: string) {
  return technologyAliases.has(slug.trim().toLowerCase()) && slug.trim().toLowerCase() !== "technology";
}

export function getCategoryQuerySlugs(slug: string): string[] {
  return slug.trim().toLowerCase() === "technology"
    ? [...TECHNOLOGY_CATEGORY_SLUGS]
    : [slug];
}

export function mergeCategoryList<T extends { name: string; slug: string }>(categories: T[]): T[] {
  const seen = new Set<string>();

  return categories.reduce<T[]>((result, category) => {
    const normalized = normalizeCategory(category.name, category.slug);
    if (seen.has(normalized.slug)) return result;
    seen.add(normalized.slug);
    result.push({ ...category, ...normalized });
    return result;
  }, []);
}
