// =============================================================================
// Hero Section
// Large hero banner featuring the top featured article
// =============================================================================

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";

interface HeroSectionProps {
    article: ArticleMeta;
}

export function HeroSection({ article }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-secondary/5">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-3">
                            <Badge variant="default" className="text-xs font-semibold">
                                Featured
                            </Badge>
                            <Link
                                href={`/category/${article.categorySlug}`}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                {article.categoryName}
                            </Link>
                            {article.readingTime && (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{article.readingTime} min read</span>
                                </div>
                            )}
                        </div>

                        <Link href={`/${article.slug}`} className="group">
                            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-5xl lg:text-6xl">
                                {article.title}
                            </h1>
                        </Link>

                        <p className="text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                            {article.excerpt}
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                href={`/authors/${article.authorSlug}`}
                                className="text-sm font-medium text-foreground hover:text-primary"
                            >
                                By {article.authorName}
                            </Link>
                            <span className="text-sm text-muted-foreground">
                                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </span>
                        </div>

                        <div className="pt-4">
                            <Button asChild size="lg" className="group">
                                <Link href={`/${article.slug}`}>
                                    Read Article
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Image */}
                    <Link
                        href={`/${article.slug}`}
                        className="group relative aspect-4/3 overflow-hidden rounded-2xl bg-muted shadow-xl lg:aspect-auto lg:min-h-[500px]"
                    >
                        {article.coverUrl ? (
                            <Image

                                src={article.coverUrl}
                                alt={article.coverAlt || article.title}
                                fill
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <span className="text-muted-foreground">No image</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
