// =============================================================================
// Article Card
// Reusable card component used in grids and lists across the site.
// Accepts the flattened ArticleMeta type, never raw Strapi data.
// =============================================================================

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import type { ArticleMeta } from "@/lib/types/strapi";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
    article: ArticleMeta;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(new Date(value));
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-accent/45 hover:bg-secondary/35">
            <Link href={`/${article.slug}`} prefetch={false} className="relative aspect-[16/10] overflow-hidden bg-muted">
                {article.coverUrl ? (
                    <Image
                        src={article.coverUrl}
                        alt={article.coverAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                            KUTNITI
                        </span>
                    </div>
                )}
                <Badge className="absolute left-3 top-3 rounded-md bg-primary text-primary-foreground">
                    {article.categoryName}
                </Badge>
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
                    <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                    {article.readingTime && (
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readingTime} min
                        </span>
                    )}
                </div>
                <Link href={`/${article.slug}`} prefetch={false}>
                    <h3 className="line-clamp-3 font-serif text-xl font-bold leading-tight tracking-tight text-card-foreground transition-colors group-hover:text-accent">
                        {article.title}
                    </h3>
                </Link>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {article.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <Link
                        href={`/authors/${article.authorSlug}`}
                        prefetch={false}
                        className="text-xs font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:text-accent"
                    >
                        {article.authorName}
                    </Link>
                    {article.tags.length > 0 && (
                        <Link
                            href={`/tag/${article.tags[0].slug}`}
                            prefetch={false}
                            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                        >
                            #{article.tags[0].name}
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
