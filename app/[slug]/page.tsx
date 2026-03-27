// =============================================================================
// Article detail page — /[slug]
// ISR with on-demand revalidation via webhook.
// generateStaticParams pre-builds known slugs at deploy time.
//
// IMPORTANT: We deliberately do NOT call getLikeStatus or getComments here.
// Both functions call auth() which forces Next.js into dynamic (SSR) rendering,
// destroying ISR and hitting Strapi on every visitor request.
// LikeButton and CommentSection are client components that self-hydrate on mount.
// =============================================================================

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs, toArticleFull, getRecommendedArticles, toArticleMeta } from "@/lib/strapi";
import { getArticleMetadata, getArticleJsonLd } from "@/lib/seo";
import { ArticleHeader } from "@/components/articles/article-header";
import { ArticleContent } from "@/components/articles/article-content";
import { AuthorBio } from "@/components/articles/author-bio";
import { RelatedArticles } from "@/components/articles/related-articles";
import { SocialShare } from "@/components/shared/social-share";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CommentSection } from "@/components/comments/comment-section";
import { LikeButton } from "@/components/likes/like-button";

// ISR: revalidate at most once per hour. All visitors within that window
// receive the same static HTML — zero extra edge requests per visitor.
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = await getAllArticleSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    // React.cache deduplicates this with the call below — single Strapi fetch.
    const res = await getArticleBySlug(slug);
    if (!res.data.length) return {};
    const article = toArticleFull(res.data[0]);
    return getArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps) {
    const { slug } = await params;
    // Deduplicated by React.cache — no extra Strapi round-trip vs generateMetadata.
    const res = await getArticleBySlug(slug);

    if (!res.data.length) {
        notFound();
    }

    const article = toArticleFull(res.data[0]);
    const jsonLd = getArticleJsonLd(article);

    // Fetch related articles (same category, excluding current)
    const relatedRes = await getRecommendedArticles(slug, article.categorySlug);
    const relatedArticles = relatedRes.data.map(toArticleMeta);

    const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://kutnitidotcom.vercel.app"}/${article.slug}`;

    // NOTE: Like status and comments are intentionally NOT fetched here.
    // getLikeStatus() / getComments() call auth() which reads cookies, forcing
    // Next.js into dynamic (SSR) rendering and costing 1 edge request per visitor.
    // Both <LikeButton> and <CommentSection> are "use client" components whose
    // useEffect hooks self-hydrate the real data after the static shell loads.

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

                <Separator className="my-12" />

                {/* Like Button — hydrates client-side via useEffect */}
                <div className="flex justify-center">
                    <LikeButton
                        articleId={article.documentId}
                        showCount={true}
                        initialLikes={0}
                        initialLiked={false}
                    />
                </div>

                <Separator className="my-12" />

                {/* Comments — hydrates client-side via useEffect */}
                <CommentSection articleId={article.documentId} />
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
