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
                        className="group flex flex-col gap-6 overflow-hidden py-6 transition-colors hover:bg-muted/30 sm:flex-row sm:gap-8 border-b border-border last:border-0"
                    >
                        {/* Thumbnail */}
                        <Link
                            href={`/${article.slug}`}
                            className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-64 lg:w-72"
                        >
                            {article.coverUrl ? (
                                <Image
                                    src={article.coverUrl}
                                    alt={article.coverAlt || article.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 300px"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <span className="text-xs text-muted-foreground">No image</span>
                                </div>
                            )}
                        </Link>

                        {/* Content */}
                        <div className="flex flex-1 flex-col justify-start">
                            <div className="mb-3 flex items-center gap-3">
                                <Badge variant="outline" className="rounded-md border-primary/20 text-primary">
                                    {article.categoryName}
                                </Badge>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                    {article.readingTime && (
                                        <>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {article.readingTime} min
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Link href={`/${article.slug}`} className="mb-3 block">
                                <h3 className="line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                                    {article.title}
                                </h3>
                            </Link>

                            <p className="mb-4 line-clamp-2 max-w-2xl text-base text-muted-foreground">
                                {article.excerpt}
                            </p>

                            <div className="mt-auto flex items-center gap-2">
                                <Link
                                    href={`/authors/${article.authorSlug}`}
                                    className="text-sm font-medium text-foreground hover:underline"
                                >
                                    By {article.authorName}
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
