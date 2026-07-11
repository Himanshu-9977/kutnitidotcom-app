// =============================================================================
// Strapi Query Functions
// Reusable, typed data-fetching functions consumed by route segments.
// Each function maps to a specific page or component data need.
// =============================================================================

import { cache } from "react";
import { fetchCollection, fetchSingle } from "./client";
import { SHORT_REVALIDATE, DEFAULT_REVALIDATE, ARTICLES_PER_PAGE } from "@/lib/constants";
import type {
  Article,
  Author,
  Category,
  Tag,
  StrapiResponse,
  StrapiSingleResponse,
} from "@/lib/types/strapi";
import qs from "qs";

// ---------------------------------------------------------------------------
// Query string builder (avoids manual string concatenation)
// Uses qs library — add to package.json: "qs": "^6.12.0"
// ---------------------------------------------------------------------------

function buildQuery(params: Record<string, unknown>): string {
  return qs.stringify(params, { encodeValuesOnly: true });
}

// ---------------------------------------------------------------------------
// Article queries
// ---------------------------------------------------------------------------

const ARTICLE_POPULATE = {
  cover: { fields: ["url", "alternativeText", "width", "height", "formats"] },
  author: { fields: ["name", "slug"], populate: { avatar: { fields: ["url", "alternativeText"] } } },
  category: { populate: true },
  tags: { populate: true },
  seo: { populate: { metaImage: { fields: ["url", "width", "height"] } } },
};

/** Homepage: featured + latest articles */
export async function getHomepageArticles(): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { pageSize: ARTICLES_PER_PAGE },
    filters: { publishedAt: { $notNull: true } },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: SHORT_REVALIDATE,
    tags: ["articles"],
  });
}

/** Featured articles only */
export async function getFeaturedArticles(): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    filters: {
      featured: { $eq: true },
      publishedAt: { $notNull: true },
    },
    pagination: { pageSize: 10 },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: SHORT_REVALIDATE,
    tags: ["articles", "featured"],
  });
}

/** Paginated article listing */
export async function getArticles(
  page: number = 1,
  pageSize: number = ARTICLES_PER_PAGE
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    filters: { publishedAt: { $notNull: true } },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles"],
  });
}

/** Single article by slug — wrapped with React.cache to deduplicate the
 *  generateMetadata() + page body calls that both fire within one render. */
export const getArticleBySlug = cache(async function getArticleBySlug(
  slug: string
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    filters: { slug: { $eq: slug } },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles", `article-${slug}`],
  });
});

/** All article slugs — used by generateStaticParams */
export async function getAllArticleSlugs(): Promise<string[]> {
  const query = buildQuery({
    fields: ["slug"],
    filters: { publishedAt: { $notNull: true } },
    pagination: { pageSize: 1000 },
  });

  const res = await fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles"],
  });

  return res.data.map((item) => item.slug);
}

// ---------------------------------------------------------------------------
// Articles by relation (category, author, tag)
// ---------------------------------------------------------------------------

/** Articles filtered by category slug */
export async function getArticlesByCategory(
  categorySlug: string,
  page: number = 1
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize: ARTICLES_PER_PAGE },
    filters: {
      category: { slug: { $eq: categorySlug } },
      publishedAt: { $notNull: true },
    },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles", `category-${categorySlug}`],
  });
}

/** Recommended articles (same category, excluding current) */
export async function getRecommendedArticles(
  currentSlug: string,
  categorySlug: string
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 3 },
    filters: {
      slug: { $ne: currentSlug },
      category: { slug: { $eq: categorySlug } },
      publishedAt: { $notNull: true },
    },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles", `category-${categorySlug}`],
  });
}

/** Articles filtered by author slug */
export async function getArticlesByAuthor(
  authorSlug: string,
  page: number = 1
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize: ARTICLES_PER_PAGE },
    filters: {
      author: { slug: { $eq: authorSlug } },
      publishedAt: { $notNull: true },
    },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles", `author-${authorSlug}`],
  });
}

/** Articles filtered by tag slug */
export async function getArticlesByTag(
  tagSlug: string,
  page: number = 1
): Promise<StrapiResponse<Article>> {
  const query = buildQuery({
    populate: ARTICLE_POPULATE,
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize: ARTICLES_PER_PAGE },
    filters: {
      tags: { slug: { $eq: tagSlug } },
      publishedAt: { $notNull: true },
    },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles", `tag-${tagSlug}`],
  });
}

// ---------------------------------------------------------------------------
// Category queries
// ---------------------------------------------------------------------------

/** All categories sorted by sortOrder */
export async function getCategories(): Promise<StrapiResponse<Category>> {
  const query = buildQuery({
    populate: {
      cover: { fields: ["url", "alternativeText", "width", "height"] },
      seo: { populate: { metaImage: { fields: ["url"] } } },
    },
    sort: ["sortOrder:asc"],
    filters: {
      name: { $notContainsi: "test" },
      slug: { $notContainsi: "test" },
    },
    pagination: { pageSize: 100 },
  });

  return fetchCollection<Category>("/categories", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["categories"],
  });
}

/** Single category by slug — wrapped with React.cache to deduplicate the
 *  generateMetadata() + page body calls that both fire within one render. */
export const getCategoryBySlug = cache(async function getCategoryBySlug(
  slug: string
): Promise<StrapiResponse<Category>> {
  const query = buildQuery({
    populate: {
      cover: { fields: ["url", "alternativeText", "width", "height"] },
      seo: { populate: { metaImage: { fields: ["url"] } } },
    },
    filters: { slug: { $eq: slug } },
  });

  return fetchCollection<Category>("/categories", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["categories", `category-${slug}`],
  });
});

/** All category slugs — used by generateStaticParams */
export async function getAllCategorySlugs(): Promise<string[]> {
  const query = buildQuery({
    fields: ["slug"],
    pagination: { pageSize: 100 },
  });

  const res = await fetchCollection<Category>("/categories", { query, tags: ["categories"] });
  return res.data.map((item) => item.slug);
}

// ---------------------------------------------------------------------------
// Author queries
// ---------------------------------------------------------------------------

/** Single author by slug — wrapped with React.cache to deduplicate the
 *  generateMetadata() + page body calls that both fire within one render. */
export const getAuthorBySlug = cache(async function getAuthorBySlug(
  slug: string
): Promise<StrapiResponse<Author>> {
  const query = buildQuery({
    populate: {
      avatar: { fields: ["url", "alternativeText", "width", "height"] },
      socialLinks: true,
      seo: { populate: { metaImage: { fields: ["url"] } } },
    },
    filters: { slug: { $eq: slug } },
  });

  return fetchCollection<Author>("/authors", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["authors", `author-${slug}`],
  });
});

/** All author slugs — used by generateStaticParams */
export async function getAllAuthorSlugs(): Promise<string[]> {
  const query = buildQuery({
    fields: ["slug"],
    pagination: { pageSize: 200 },
  });

  const res = await fetchCollection<Author>("/authors", { query, tags: ["authors"] });
  return res.data.map((item) => item.slug);
}

// ---------------------------------------------------------------------------
// Tag queries
// ---------------------------------------------------------------------------

/** Single tag by slug — wrapped with React.cache to deduplicate the
 *  generateMetadata() + page body calls that both fire within one render. */
export const getTagBySlug = cache(async function getTagBySlug(
  slug: string
): Promise<StrapiResponse<Tag>> {
  const query = buildQuery({
    filters: { slug: { $eq: slug } },
  });

  return fetchCollection<Tag>("/tags", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["tags", `tag-${slug}`],
  });
});

/** All tag slugs — used by generateStaticParams */
export async function getAllTagSlugs(): Promise<string[]> {
  const query = buildQuery({
    fields: ["slug"],
    pagination: { pageSize: 500 },
  });

  const res = await fetchCollection<Tag>("/tags", { query, tags: ["tags"] });
  return res.data.map((item) => item.slug);
}

// ---------------------------------------------------------------------------
// Search Index queries (Client-side filtering)
// ---------------------------------------------------------------------------

/** Global search index for articles */
export async function getSearchIndexArticles() {
  const query = buildQuery({
    fields: ["title", "slug"],
    populate: {
      category: { fields: ["name"] },
    },
    sort: ["publishedAt:desc"],
    pagination: { pageSize: 1000 },
    filters: {
      publishedAt: { $notNull: true },
    },
  });

  return fetchCollection<Article>("/articles", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["articles"],
  });
}

/** Global search index for categories */
export async function getSearchIndexCategories() {
  const query = buildQuery({
    fields: ["name", "slug"],
    sort: ["name:asc"],
    pagination: { pageSize: 500 },
  });

  return fetchCollection<Category>("/categories", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["categories"],
  });
}

/** Global search index for authors */
export async function getSearchIndexAuthors() {
  const query = buildQuery({
    fields: ["name", "slug"],
    sort: ["name:asc"],
    pagination: { pageSize: 500 },
  });

  return fetchCollection<Author>("/authors", {
    query,
    revalidate: DEFAULT_REVALIDATE,
    tags: ["authors"],
  });
}
