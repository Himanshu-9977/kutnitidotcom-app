// =============================================================================
// Category listing page — /category/[slug]
// Shows category info + paginated articles in that category.
// =============================================================================

import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
    getCategoryBySlug,
    getAllCategorySlugs,
    getArticlesByCategory,
    toCategoryMeta,
    toArticleMeta,
} from "@/lib/strapi";
import { getCategoryJsonLd } from "@/lib/seo";
import { SITE_NAME } from "@/lib/constants";
import { CategoryHeader } from "@/components/shared/category-header";
import { ArticleList } from "@/components/shared/article-list";
import { Pagination } from "@/components/shared/pagination";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { getRssNewsByCategory } from "@/lib/rss-news";
import { isTechnologyAlias } from "@/lib/category-groups";

// ISR: revalidate category pages once per hour.
export const revalidate = 3600;
// The root layout reads the signed-in session. Category slugs that are not
// available during build (for example, when Strapi is temporarily offline)
// must therefore render dynamically instead of falling into a static render.
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
    try {
        const slugs = await getAllCategorySlugs();
        return slugs.map((slug) => ({ slug }));
    } catch (error) {
        console.error("Failed to generate category static params", error);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const localArticles = getRssNewsByCategory(slug);
    if (localArticles.length > 0) {
        const name = localArticles[0].categoryName;
        return { title: name, description: `Latest ${name} reporting and concise analysis from KUTNITI.` };
    }
    const res = await getCategoryBySlug(slug);
    if (!res.data.length) return {};
    const cat = res.data[0];
    return {
        title: cat.seo?.metaTitle ?? cat.name,
        description: cat.seo?.metaDescription ?? cat.description ?? `${cat.name} articles on ${SITE_NAME}`,
    };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    if (isTechnologyAlias(slug)) {
        redirect("/category/technology");
    }
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const rssArticles = getRssNewsByCategory(slug);

    if (rssArticles.length > 0) {
        const name = rssArticles[0].categoryName;
        return (
            <main>
                <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <Breadcrumbs items={[{ label: name }]} className="mb-8" />
                </div>
                <CategoryHeader name={name} description={`Latest ${name} reporting and concise analysis from KUTNITI.`} coverUrl="" articleCount={rssArticles.length} type="category" />
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <ArticleList articles={rssArticles} title={`Latest ${name} News`} />
                </div>
            </main>
        );
    }

    const [categoryRes, articlesRes] = await Promise.all([
        getCategoryBySlug(slug),
        getArticlesByCategory(slug, currentPage),
    ]);

    if (!categoryRes.data.length) {
        notFound();
    }

    const category = toCategoryMeta(categoryRes.data[0]);
    const articles = articlesRes.data.map(toArticleMeta);
    const pagination = articlesRes.meta.pagination;
    const jsonLd = getCategoryJsonLd(category.name, category.slug, category.description);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main>
                <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <Breadcrumbs
                        items={[{ label: category.name }]}
                        className="mb-8"
                    />
                </div>
                <CategoryHeader
                    name={category.name}
                    description={category.description}
                    coverUrl={category.coverUrl}
                    articleCount={pagination.total}
                    type="category"
                />

                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <ArticleList
                        articles={articles}
                        title={`Articles in ${category.name}`}
                    />

                    <div className="mt-8 flex justify-center">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.pageCount}
                            baseUrl={`/category/${slug}`}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
