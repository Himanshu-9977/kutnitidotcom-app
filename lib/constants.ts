// =============================================================================
// Site-wide constants
// Single source of truth for configuration used across the app.
// =============================================================================

export const SITE_NAME = "KUTNITI";
export const SITE_DESCRIPTION =
  "Your trusted source for news, analysis, and in-depth reporting.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://localhost:3000";

// Strapi CMS
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_URL ?? "http://localhost:1337";
export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN ?? "";

// Revalidation
export const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";

/** Default ISR revalidation interval in seconds (1 hour) */
export const DEFAULT_REVALIDATE = process.env.NODE_ENV === "development" ? 0 : 3600;

/** Short revalidation for frequently updated pages like the homepage (5 min) */
export const SHORT_REVALIDATE = process.env.NODE_ENV === "development" ? 0 : 300;

// Cloudinary
export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

// Pagination
export const ARTICLES_PER_PAGE = 12;

// Social
export const SOCIAL_LINKS = {
  twitter: "",
  instagram: "",
  facebook: "",
  linkedin: "",
} as const;
