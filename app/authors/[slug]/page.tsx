// =============================================================================
// Author profile page — /authors/[slug]
// Shows author info + their paginated articles.
// =============================================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    getAuthorBySlug,
    getAllAuthorSlugs,
    getArticlesByAuthor,
    toAuthorProfile,
    toArticleMeta,
} from "@/lib/strapi";
import { getAuthorJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";
import { AuthorHeader } from "@/components/shared/author-header";
import { ArticleList } from "@/components/shared/article-list";
import { Pagination } from "@/components/shared/pagination";

// ISR: revalidate author pages once per hour.
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    try {
        const slugs = await getAllAuthorSlugs();
        return slugs.map((slug) => ({ slug }));
    } catch (error) {
        console.error("Failed to generate author static params", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const res = await getAuthorBySlug(slug);
    if (!res.data.length) return {};
    const author = res.data[0];
    return {
        title: author.seo?.metaTitle ?? author.name,
        description: author.seo?.metaDescription ?? author.bio ?? `Articles by ${author.name} on ${SITE_NAME}`,
    };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    const [authorRes, articlesRes] = await Promise.all([
        getAuthorBySlug(slug),
        getArticlesByAuthor(slug, currentPage),
    ]);

    if (!authorRes.data.length) {
        notFound();
    }

    const author = toAuthorProfile(authorRes.data[0]);
    const articles = articlesRes.data.map(toArticleMeta);
    const pagination = articlesRes.meta.pagination;
    const jsonLd = getAuthorJsonLd(author.name, author.slug, author.bio);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main>
                <AuthorHeader
                    name={author.name}
                    bio={author.bio}
                    avatarUrl={author.avatarUrl}
                    articleCount={pagination.total}
                    socialLinks={author.socialLinks}
                />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <ArticleList
                        articles={articles}
                        title={`Articles by ${author.name}`}
                    />

                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pageCount}
                            baseUrl={`/authors/${slug}`}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
