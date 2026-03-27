// =============================================================================
// Tag listing page — /tag/[slug]
// Shows articles tagged with a specific tag.
// =============================================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    getTagBySlug,
    getAllTagSlugs,
    getArticlesByTag,
    toTagMeta,
    toArticleMeta,
} from "@/lib/strapi";
import { SITE_NAME } from "@/lib/constants";
import { CategoryHeader } from "@/components/shared/category-header";
import { ArticleList } from "@/components/shared/article-list";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

// ISR: revalidate tag pages once per hour.
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    const slugs = await getAllTagSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const res = await getTagBySlug(slug);
    if (!res.data.length) return {};
    const tag = res.data[0];
    return {
        title: `${tag.name} Articles`,
        description: tag.description ?? `Articles tagged with ${tag.name} on ${SITE_NAME}`,
    };
}

export default async function TagPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    const [tagRes, articlesRes] = await Promise.all([
        getTagBySlug(slug),
        getArticlesByTag(slug, currentPage),
    ]);

    if (!tagRes.data.length) {
        notFound();
    }

    const tag = toTagMeta(tagRes.data[0]);
    const articles = articlesRes.data.map(toArticleMeta);
    const pagination = articlesRes.meta.pagination;

    return (
        <main>
            <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[{ label: `Tag: ${tag.name}` }]}
                    className="mb-8"
                />
            </div>
            <CategoryHeader
                name={tag.name}
                description={tag.description}
                articleCount={pagination.total}
                type="tag"
            />

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <ArticleList
                    articles={articles}
                    title={`Articles tagged "${tag.name}"`}
                />

                <div className="mt-8 flex justify-center">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pageCount}
                        baseUrl={`/tag/${slug}`}
                    />
                </div>
            </div>
        </main>
    );
}
