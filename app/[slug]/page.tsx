// =============================================================================
// Article detail page — /[slug]
// ISR with on-demand revalidation via webhook.
// generateStaticParams pre-builds known slugs at deploy time.
// =============================================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs, toArticleFull, getArticlesByCategory } from "@/lib/strapi";
import { getArticleMetadata, getArticleJsonLd } from "@/lib/seo";
import { ArticleHeader } from "@/components/articles/article-header";
import { ArticleContent } from "@/components/articles/article-content";
import { AuthorBio } from "@/components/articles/author-bio";
import { RelatedArticles } from "@/components/articles/related-articles";
import { SocialShare } from "@/components/shared/social-share";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const res = await getArticleBySlug(slug);
    if (!res.data.length) return {};
    const article = toArticleFull(res.data[0]);
    return getArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const res = await getArticleBySlug(slug);

    if (!res.data.length) {
        notFound();
    }

    const article = toArticleFull(res.data[0]);
    const jsonLd = getArticleJsonLd(article);

    // Fetch related articles from same category
    const relatedRes = await getArticlesByCategory(article.categorySlug, 1);
    const relatedArticles = relatedRes.data
        .map((a) => ({
            id: a.id,
            title: a.title,
            slug: a.slug,
            excerpt: a.excerpt,
            coverUrl: a.cover?.url || "",
            coverAlt: a.cover?.alternativeText || "",
            readingTime: a.readingTime,
            featured: a.featured,
            authorName: a.author?.name || "Unknown",
            authorSlug: a.author?.slug || "",
            categoryName: a.category?.name || "Uncategorized",
            categorySlug: a.category?.slug || "",
            tags: a.tags.map((t) => ({ name: t.name, slug: t.slug })),
            publishedAt: a.publishedAt || "",
        }))
        .filter((a) => a.slug !== slug); // Exclude current article

    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://kutnitidotcom.vercel.app"}/${article.slug}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <Breadcrumbs
                    items={[
                        { label: article.categoryName, href: `/category/${article.categorySlug}` },
                        { label: article.title },
                    ]}
                    className="mb-8"
                />

                {/* Article Header */}
                <ArticleHeader
                    article={article}
                    authorAvatarUrl={article.authorAvatarUrl}
                />

                <Separator className="my-12" />

                {/* Social Share (Desktop - Sticky) */}
                <div className="hidden lg:block">
                    <div className="fixed left-8 top-1/2 -translate-y-1/2">
                        <SocialShare
                            url={articleUrl}
                            title={article.title}
                            className="flex flex-col gap-4"
                        />
                    </div>
                </div>

                {/* Article Content */}
                <ArticleContent content={article.content} />

                {/* Social Share (Mobile/Tablet) */}
                <div className="mt-8 lg:hidden">
                    <SocialShare
                        url={articleUrl}
                        title={article.title}
                    />
                </div>

                <Separator className="my-12" />

                {/* Author Bio */}
                <AuthorBio
                    name={article.authorName}
                    slug={article.authorSlug}
                    bio={article.authorBio}
                    avatarUrl={article.authorAvatarUrl}
                />
            </article>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="border-t border-border bg-muted/20 py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <RelatedArticles articles={relatedArticles} />
                    </div>
                </div>
            )}
        </>
    );
}
