"use server";

import { getSearchIndexArticles, getSearchIndexCategories, getSearchIndexAuthors } from "@/lib/strapi/queries";

export interface SearchIndexArticle {
    documentId: string;
    title: string;
    slug: string;
    category?: { name: string };
}

export interface SearchIndexCategory {
    documentId: string;
    name: string;
    slug: string;
}

export interface SearchIndexAuthor {
    documentId: string;
    name: string;
    slug: string;
}

export interface GlobalSearchIndex {
    articles: SearchIndexArticle[];
    categories: SearchIndexCategory[];
    authors: SearchIndexAuthor[];
}

export async function getGlobalSearchIndex(): Promise<GlobalSearchIndex> {
    try {
        const [articlesRes, categoriesRes, authorsRes] = await Promise.all([
            getSearchIndexArticles(),
            getSearchIndexCategories(),
            getSearchIndexAuthors(),
        ]);

        return {
            // We manually map to ensure typescript gets the minimal subset we want, 
            // even if Strapi returned slightly more
            articles: articlesRes.data.map((a) => ({
                documentId: a.documentId,
                title: a.title,
                slug: a.slug,
                category: a.category ? { name: a.category.name } : undefined,
            })),
            categories: categoriesRes.data.map((c) => ({
                documentId: c.documentId,
                name: c.name,
                slug: c.slug,
            })),
            authors: authorsRes.data.map((a) => ({
                documentId: a.documentId,
                name: a.name,
                slug: a.slug,
            })),
        };
    } catch (error) {
        console.error("Global search index fetch error:", error);
        // Return empty index on error rather than crashing the UI
        return { articles: [], categories: [], authors: [] };
    }
}
