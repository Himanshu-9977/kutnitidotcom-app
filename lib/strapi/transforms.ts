// =============================================================================
// Strapi Data Transforms
// Converts nested Strapi v4 response shapes into flat, frontend-friendly types.
// Components import these types — never raw Strapi shapes.
// =============================================================================

import type {
  StrapiEntity,
  StrapiMedia,
  Article,
  Author,
  Category,
  Tag,
  SeoComponent,
  SocialLinkComponent,
} from "@/lib/types/strapi";
import type { ArticleMeta, ArticleFull } from "@/lib/types/strapi";

// ---------------------------------------------------------------------------
// Media helpers
// ---------------------------------------------------------------------------

/** Safely extract URL from a Strapi media relation */
export function getMediaUrl(media: StrapiMedia | undefined | null): string {
  return media?.url ?? "";
}

/** Safely extract alt text from a Strapi media relation */
export function getMediaAlt(media: StrapiMedia | undefined | null): string {
  return media?.alternativeText ?? "";
}

/** Get the best format URL for responsive images (prefer medium, fallback to original) */
export function getResponsiveMediaUrl(
  media: StrapiMedia | undefined | null,
  preferredFormat: "thumbnail" | "small" | "medium" | "large" = "medium"
): string {
  const formats = media?.formats;
  return (
    formats?.[preferredFormat]?.url ??
    formats?.medium?.url ??
    media?.url ??
    ""
  );
}

// ---------------------------------------------------------------------------
// SEO transform
// ---------------------------------------------------------------------------

export function transformSeo(seo: SeoComponent | null | undefined) {
  if (!seo) return null;
  return {
    metaTitle: seo.metaTitle,
    metaDescription: seo.metaDescription,
    metaImageUrl: getMediaUrl(seo.metaImage),
    canonicalUrl: seo.canonicalUrl ?? null,
    noIndex: seo.noIndex,
    structuredData: seo.structuredData ?? null,
  };
}

// ---------------------------------------------------------------------------
// Article transforms
// ---------------------------------------------------------------------------

/** Transform a Strapi article entity into a lightweight card-friendly object */
export function toArticleMeta(entity: StrapiEntity<Article>): ArticleMeta {
  return {
    id: entity.id,
    title: entity.title,
    slug: entity.slug,
    excerpt: entity.excerpt,
    coverUrl: getMediaUrl(entity.cover),
    coverAlt: getMediaAlt(entity.cover),
    readingTime: entity.readingTime ?? null,
    featured: entity.featured,
    authorName: entity.author?.name ?? "Unknown",
    authorSlug: entity.author?.slug ?? "",
    categoryName: entity.category?.name ?? "Uncategorized",
    categorySlug: entity.category?.slug ?? "",
    tags: entity.tags?.map((t: StrapiEntity<Tag>) => ({
      name: t.name,
      slug: t.slug,
    })) ?? [],
    publishedAt: entity.publishedAt ?? entity.createdAt,
  };
}

/** Transform a Strapi article entity into a full article object with body + SEO */
export function toArticleFull(entity: StrapiEntity<Article>): ArticleFull {
  const meta = toArticleMeta(entity);
  return {
    ...meta,
    content: entity.content,
    authorBio: entity.author?.bio ?? null,
    authorAvatarUrl: getMediaUrl(entity.author?.avatar),
    seo: transformSeo(entity.seo),
  };
}

// ---------------------------------------------------------------------------
// Category transforms
// ---------------------------------------------------------------------------

export interface CategoryMeta {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  coverUrl: string;
  coverAlt: string;
  sortOrder: number;
}

export function toCategoryMeta(entity: StrapiEntity<Category>): CategoryMeta {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    description: entity.description ?? null,
    coverUrl: getMediaUrl(entity.cover),
    coverAlt: getMediaAlt(entity.cover),
    sortOrder: entity.sortOrder,
  };
}

// ---------------------------------------------------------------------------
// Author transforms
// ---------------------------------------------------------------------------

export interface AuthorProfile {
  id: number;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string;
  avatarAlt: string;
  website: string | null;
  socialLinks: { platform: string; url: string }[];
}

export function toAuthorProfile(entity: StrapiEntity<Author>): AuthorProfile {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    bio: entity.bio ?? null,
    avatarUrl: getMediaUrl(entity.avatar),
    avatarAlt: getMediaAlt(entity.avatar),
    website: entity.website ?? null,
    socialLinks:
      entity.socialLinks?.map((link: SocialLinkComponent) => ({
        platform: link.platform,
        url: link.url,
      })) ?? [],
  };
}

// ---------------------------------------------------------------------------
// Tag transforms
// ---------------------------------------------------------------------------

export interface TagMeta {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export function toTagMeta(entity: StrapiEntity<Tag>): TagMeta {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    description: entity.description ?? null,
  };
}
