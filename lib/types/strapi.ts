// =============================================================================
// Strapi API Response Types
// Maps directly to the schema.json definitions in /strapi-schemas
// =============================================================================

// ---------------------------------------------------------------------------
// Strapi base types
// ---------------------------------------------------------------------------

/** Wraps every Strapi v4 collection response */
export interface StrapiResponse<T> {
  data: StrapiEntity<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/** Wraps every Strapi v4 single-entity response */
export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
  meta: Record<string, never>;
}

export type StrapiEntity<T> = T & {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

// ---------------------------------------------------------------------------
// Media (Cloudinary)
// ---------------------------------------------------------------------------

export interface StrapiMedia {
  id?: number;
  documentId?: string;
  name?: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  url?: string; // Cloudinary URL
  provider?: "cloudinary";
  mime?: string;
}

export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number; // KB
}

// ---------------------------------------------------------------------------
// Components — shared.seo
// ---------------------------------------------------------------------------

export interface SeoComponent {
  id: number;
  metaTitle: string;
  metaDescription: string;
  metaImage: StrapiMedia;
  canonicalUrl: string | null;
  noIndex: boolean;
  structuredData: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Components — shared.social-link
// ---------------------------------------------------------------------------

export type SocialPlatform =
  | "twitter"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "website";

export interface SocialLinkComponent {
  id: number;
  platform: SocialPlatform;
  url: string;
}

// ---------------------------------------------------------------------------
// Article
// ---------------------------------------------------------------------------

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich text (Markdown or HTML depending on Strapi config)
  cover: StrapiMedia | null;
  readingTime: number | null;
  featured: boolean;
  author: StrapiEntity<Author> | null;
  category: StrapiEntity<Category> | null;
  tags: StrapiEntity<Tag>[];
  seo: SeoComponent | null;
}

// ---------------------------------------------------------------------------
// Author
// ---------------------------------------------------------------------------

export interface Author {
  name: string;
  slug: string;
  bio: string | null;
  avatar: StrapiMedia | null;
  // email is private — never exposed in API responses
  website: string | null;
  socialLinks: SocialLinkComponent[];
  articles: StrapiEntity<Article>[];
  seo: SeoComponent | null;
}

// ---------------------------------------------------------------------------
// Category
// ---------------------------------------------------------------------------

export interface Category {
  name: string;
  slug: string;
  description: string | null;
  cover: StrapiMedia | null;
  sortOrder: number;
  articles: StrapiEntity<Article>[];
  seo: SeoComponent | null;
}

// ---------------------------------------------------------------------------
// Tag
// ---------------------------------------------------------------------------

export interface Tag {
  name: string;
  slug: string;
  description: string | null;
  articles: StrapiEntity<Article>[];
}

// ---------------------------------------------------------------------------
// Flattened / Frontend-friendly types
// Used after transforming Strapi responses for component consumption
// ---------------------------------------------------------------------------

export interface ArticleMeta {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverUrl: string;
  coverAlt: string;
  readingTime: number | null;
  featured: boolean;
  authorName: string;
  authorSlug: string;
  categoryName: string;
  categorySlug: string;
  tags: { name: string; slug: string }[];
  publishedAt: string;
}

export interface ArticleFull extends ArticleMeta {
  content: string;
  authorBio: string | null;
  authorAvatarUrl: string | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaImageUrl: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    structuredData: Record<string, unknown> | null;
  } | null;
}
