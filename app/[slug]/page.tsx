// =============================================================================
// Article detail page — /[slug]
// ISR with on-demand revalidation via webhook.
// generateStaticParams pre-builds known slugs at deploy time.
//
// Rendering strategy:
//   - Like COUNT and initial Comments are fetched server-side via Promise.all.
//     getLikeCount() has no auth() call \u2014 fully ISR-safe, cached 3600s.
//     getComments() has no auth() call \u2014 fully ISR-safe, cache-tagged per article.
//   - User-specific liked state (userHasLiked) is fetched client-side inside
//     LikeButton ONLY when a session exists \u2014 zero cost for guests.
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
import { getLikeCount } from "@/app/actions/likes";
import { getComments } from "@/app/actions/comments";

// ISR: revalidate at most once per hour. All visitors within that window
// receive the same static HTML — zero extra edge requests per visitor.
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    try {
        const slugs = await getAllArticleSlugs();
        return slugs.map((slug) => ({ slug }));
    } catch (error) {
        console.error("Failed to generate article static params", error);
        return [];
    }
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

    // Fetch related articles, like count, and initial comments in parallel.
    // All three are ISR-cached \u2014 zero edge requests per visitor within the window.
    const [relatedRes, initialLikes, commentsRes] = await Promise.all([
        getRecommendedArticles(slug, article.categorySlug),
        getLikeCount(article.documentId),
        getComments(article.documentId),
    ]);
    const relatedArticles = relatedRes.data.map(toArticleMeta);
    const initialComments = commentsRes.data ?? [];

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

                <Separator className="my-12" />

                {/* Like Button — count pre-fetched server-side (ISR). */}
                {/* User-specific liked state fetched client-side only when session exists. */}
                <div className="flex justify-center">
                    <LikeButton
                        articleId={article.documentId}
                        showCount={true}
                        initialLikes={initialLikes}
                        initialLiked={false}
                    />
                </div>

                <Separator className="my-12" />

                {/* Comments — initial list pre-fetched server-side (ISR). */}
                {/* Re-fetched from client only after user posts/edits/deletes a comment. */}
                <CommentSection articleId={article.documentId} initialComments={initialComments} />
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
