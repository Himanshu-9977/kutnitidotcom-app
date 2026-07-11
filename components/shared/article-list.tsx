// =============================================================================
// Article List
// Vertical list of articles with optional pagination
// =============================================================================

import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { ArticleMeta } from "@/lib/types/strapi";
import { cn } from "@/lib/utils";

interface ArticleListProps {
    articles: ArticleMeta[];
    title?: string;
    description?: string;
    className?: string;
    contained?: boolean;
    id?: string;
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function ArticleList({
    articles,
    title = "Latest Articles",
    description,
    className,
    contained = false,
    id,
}: ArticleListProps) {
    const wrapperClassName = cn(
        contained && "mx-auto max-w-[1500px] px-4 py-12 sm:px-6 lg:px-8",
        className
    );

    if (articles.length === 0) {
        return (
            <section id={id} className={wrapperClassName}>
                <div className="border-b border-border pb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Latest</p>
                    <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground">
                        {title}
                    </h2>
                    {description && <p className="mt-2 text-muted-foreground">{description}</p>}
                </div>
                <div className="mt-8 flex min-h-[260px] items-center justify-center rounded-lg border border-dashed border-border bg-card">
                    <p className="text-muted-foreground">No articles found</p>
                </div>
            </section>
        );
    }

    return (
        <section id={id} className={wrapperClassName}>
            <div className="mb-6 border-b border-border pb-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Latest</p>
                <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                    </p>
                )}
            </div>

            <div className="divide-y divide-border border-y border-border">
                {articles.map((article) => (
                    <article
                        key={article.id}
                        className="group grid gap-5 py-5 transition-colors hover:bg-secondary/45 sm:grid-cols-[220px_minmax(0,1fr)] lg:grid-cols-[260px_minmax(0,1fr)]"
                    >
                        <Link
                            href={`/${article.slug}`}
                            prefetch={false}
                            className="relative aspect-[16/10] overflow-hidden rounded-md bg-muted sm:ml-4"
                        >
                            {article.coverUrl ? (
                                <Image
                                    src={article.coverUrl}
                                    alt={article.coverAlt || article.title}
                                    fill
                                    sizes="(max-width: 640px) 100vw, 280px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center bg-secondary">
                                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                        KUTNITI
                                    </span>
                                </div>
                            )}
                        </Link>

                        <div className="flex min-w-0 flex-col px-0 sm:pr-4">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="rounded-md border-accent/30 text-accent">
                                    {article.categoryName}
                                </Badge>
                                <time dateTime={article.publishedAt} className="text-xs font-medium text-muted-foreground">
                                    {formatDate(article.publishedAt)}
                                </time>
                                {article.readingTime && (
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {article.readingTime} min
                                    </span>
                                )}
                            </div>

                            <Link href={`/${article.slug}`} prefetch={false} className="block">
                                <h3 className="line-clamp-2 font-serif text-2xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl">
                                    {article.title}
                                </h3>
                            </Link>

                            <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                                {article.excerpt}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                                <Link
                                    href={`/authors/${article.authorSlug}`}
                                    prefetch={false}
                                    className="font-semibold text-foreground transition-colors hover:text-accent"
                                >
                                    By {article.authorName}
                                </Link>
                                {article.tags.slice(0, 2).map((tag) => (
                                    <Link
                                        key={tag.slug}
                                        href={`/tag/${tag.slug}`}
                                        prefetch={false}
                                        className="text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
