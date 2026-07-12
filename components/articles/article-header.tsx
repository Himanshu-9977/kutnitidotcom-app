// =============================================================================
// Article Header Component
// Large article page header with title, metadata, and cover image
// =============================================================================

import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";

interface ArticleHeaderProps {
    article: ArticleMeta;
    authorAvatarUrl?: string | null;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
    return (
        <header className="border-b border-border pb-8 sm:pb-10">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Link prefetch={false} href={`/category/${article.categorySlug}`}>
                    <Badge variant="outline" className="rounded-sm border-accent/35 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
                        {article.categoryName}
                    </Badge>
                </Link>
                <span aria-hidden="true">•</span>
                <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </time>
                {article.readingTime && (
                    <div className="flex items-center gap-1.5">
                        <span aria-hidden="true">•</span>
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTime} min read</span>
                    </div>
                )}
            </div>

            <h1 className="mt-5 text-balance font-serif text-4xl font-black leading-[1.04] tracking-[-0.035em] text-foreground sm:text-6xl lg:text-7xl">
                {article.title}
            </h1>

            <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
                {article.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border pt-4 text-sm">
                <Link prefetch={false}
                    href={`/authors/${article.authorSlug}`}
                    className="font-bold text-foreground transition-colors hover:text-accent"
                >
                    By {article.authorName}
                </Link>
                {article.tags.length > 0 && <div className="flex flex-wrap gap-3">
                    {article.tags.map((tag) => (
                        <Link prefetch={false} key={tag.slug} href={`/tag/${tag.slug}`} className="text-muted-foreground hover:text-foreground">
                            #{tag.name}
                        </Link>
                    ))}
                </div>}
            </div>

            {article.coverUrl && (
                <div className="relative mt-8 aspect-video w-full overflow-hidden border border-border bg-muted">
                    <Image

                        src={article.coverUrl}
                        alt={article.coverAlt || article.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        className="object-cover"
                    />
                </div>
            )}
        </header>
    );
}
