// =============================================================================
// SEO Utilities
// Helpers for generating Next.js Metadata objects and JSON-LD structured data.
// Called inside generateMetadata() in each route segment.
// =============================================================================

import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";
import { cloudinaryUrl } from "@/lib/cloudinary";
import type { ArticleFull } from "@/lib/types/strapi";

// ---------------------------------------------------------------------------
// Default metadata (used by root layout)
// ---------------------------------------------------------------------------

export function getDefaultMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

// ---------------------------------------------------------------------------
// Article metadata
// ---------------------------------------------------------------------------

export function getArticleMetadata(article: ArticleFull): Metadata {
  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const imageUrl = article.seo?.metaImageUrl || article.coverUrl;
  const ogImage = imageUrl ? cloudinaryUrl(imageUrl, "w_1200,h_630,c_fill,q_80,f_auto") : undefined;
  const canonical = article.seo?.canonicalUrl || `${SITE_URL}/${article.slug}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      publishedTime: article.publishedAt,
      authors: [article.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    robots: article.seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: {
      canonical,
    },
  };
}

// ---------------------------------------------------------------------------
// JSON-LD structured data
// ---------------------------------------------------------------------------

export function getArticleJsonLd(article: ArticleFull) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.coverUrl
      ? cloudinaryUrl(article.coverUrl, "w_1200,h_630,c_fill,q_80,f_auto")
      : undefined,
    datePublished: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
      url: `${SITE_URL}/authors/${article.authorSlug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${article.slug}`,
    },
  };
}

export function getCategoryJsonLd(name: string, slug: string, description?: string | null) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description: description ?? `Articles in the ${name} category`,
    url: `${SITE_URL}/category/${slug}`,
  };
}

export function getAuthorJsonLd(
  name: string,
  slug: string,
  bio?: string | null
) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    description: bio ?? undefined,
    url: `${SITE_URL}/authors/${slug}`,
  };
}
