// =============================================================================
// Article Header Component
// Large article page header with title, metadata, and cover image
// =============================================================================

import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";

interface ArticleHeaderProps {
    article: ArticleMeta;
    authorAvatarUrl?: string | null;
}

export function ArticleHeader({ article, authorAvatarUrl }: ArticleHeaderProps) {
    return (
        <header className="space-y-6">
            {/* Category and Reading Time */}
            <div className="flex flex-wrap items-center gap-3">
                <Link prefetch={false} href={`/category/${article.categorySlug}`}>
                    <Badge variant="default" className="hover:bg-primary/90">
                        {article.categoryName}
                    </Badge>
                </Link>
                {article.readingTime && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTime} min read</span>
                    </div>
                )}
            </div>

            {/* Title */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-serif">
                {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-pretty text-xl leading-relaxed text-muted-foreground">
                {article.excerpt}
            </p>

            {/* Author and Date */}
            <div className="flex items-center gap-4">
                <Link prefetch={false}
                    href={`/authors/${article.authorSlug}`}
                    className="flex items-center gap-3 group"
                >
                    <Avatar className="h-12 w-12">
                        {authorAvatarUrl && (
                            <AvatarImage
                                src={authorAvatarUrl}
                                alt={article.authorName}
                            />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {article.authorName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                            {article.authorName}
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <time dateTime={article.publishedAt}>
                                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </time>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                        <Link prefetch={false} key={tag.slug} href={`/tag/${tag.slug}`}>
                            <Badge variant="secondary" className="hover:bg-secondary/80">
                                #{tag.name}
                            </Badge>
                        </Link>
                    ))}
                </div>
            )}

            {/* Cover Image */}
            {article.coverUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl">
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
