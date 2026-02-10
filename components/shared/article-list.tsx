// =============================================================================
// Article List
// Vertical list of articles with optional pagination
// =============================================================================

import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";

interface ArticleListProps {
    articles: ArticleMeta[];
    title?: string;
}

export function ArticleList({
    articles,
    title = "Latest Articles"
}: ArticleListProps) {
    if (articles.length === 0) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground">No articles found</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h2>

            <div className="space-y-6">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="group flex flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md sm:flex-row sm:gap-6"
                    >
                        {/* Thumbnail */}
                        <Link
                            href={`/${article.slug}`}
                            className="relative aspect-video w-full shrink-0 overflow-hidden rounded-md sm:w-48"
                        >
                            {article.coverUrl ? (
                                <Image

                                    src={article.coverUrl}
                                    alt={article.coverAlt || article.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 192px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-muted">
                                    <span className="text-xs text-muted-foreground">No image</span>
                                </div>
                            )}
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={`/category/${article.categorySlug}`}
                                    className="text-xs font-medium text-primary hover:underline"
                                >
                                    {article.categoryName}
                                </Link>
                                {article.readingTime && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{article.readingTime} min</span>
                                    </div>
                                )}
                            </div>

                            <Link href={`/${article.slug}`}>
                                <h3 className="line-clamp-2 text-xl font-semibold leading-tight text-card-foreground transition-colors group-hover:text-primary">
                                    {article.title}
                                </h3>
                            </Link>

                            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                {article.excerpt}
                            </p>

                            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
                                <Link
                                    href={`/authors/${article.authorSlug}`}
                                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                                >
                                    {article.authorName}
                                </Link>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
