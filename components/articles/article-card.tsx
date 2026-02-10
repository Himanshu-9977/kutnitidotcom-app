// =============================================================================
// Article Card
// Reusable card component used in grids and lists across the site.
// Accepts the flattened ArticleMeta type — never raw Strapi data.
// =============================================================================

import Link from "next/link";
import Image from "next/image";

import type { ArticleMeta } from "@/lib/types/strapi";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
    article: ArticleMeta;
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
            <Link href={`/${article.slug}`} className="relative aspect-video overflow-hidden">
                {article.coverUrl ? (
                    <Image

                        src={article.coverUrl || "/placeholder.svg"}
                        alt={article.coverAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">No image</span>
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Link
                        href={`/category/${article.categorySlug}`}
                        className="text-xs font-medium text-primary hover:underline"
                    >
                        {article.categoryName}
                    </Link>
                    {article.readingTime && (
                        <span className="text-xs text-muted-foreground">
                            {`${article.readingTime} min read`}
                        </span>
                    )}
                </div>
                <Link href={`/${article.slug}`}>
                    <h3 className="line-clamp-2 text-balance text-lg font-semibold leading-snug text-card-foreground transition-colors group-hover:text-primary">
                        {article.title}
                    </h3>
                </Link>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {article.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                    <Link
                        href={`/authors/${article.authorSlug}`}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                        {article.authorName}
                    </Link>
                    {article.tags.length > 0 && (
                        <div className="flex gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag.slug} variant="secondary" className="text-xs">
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
