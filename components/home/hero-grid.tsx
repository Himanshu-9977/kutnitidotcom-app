
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";
import { cn } from "@/lib/utils";

interface HeroGridProps {
    mainArticle: ArticleMeta;
    sideArticles: ArticleMeta[];
}

export function HeroGrid({ mainArticle, sideArticles }: HeroGridProps) {
    return (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                {/* Main Hero Article (Span 8) */}
                <div className="group relative overflow-hidden rounded-2xl bg-muted lg:col-span-8 aspect-4/3 lg:aspect-auto lg:h-[500px]">
                    <Link href={`/${mainArticle.slug}`} className="block h-full w-full">
                        {/* Image Background */}
                        <div className="absolute inset-0">
                            {mainArticle.coverUrl ? (
                                <Image
                                    src={mainArticle.coverUrl}
                                    alt={mainArticle.coverAlt || mainArticle.title}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 66vw"
                                />
                            ) : (
                                <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800" />
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                            <div className="mb-3 flex flex-wrap items-center gap-2 text-white/90">
                                <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    {mainArticle.categoryName}
                                </Badge>
                                {mainArticle.readingTime && (
                                    <span className="flex items-center text-xs font-medium sm:text-sm">
                                        <Clock className="mr-1 h-3.5 w-3.5" />
                                        {mainArticle.readingTime} min read
                                    </span>
                                )}
                                <span className="text-xs font-medium sm:text-sm">
                                    • {new Date(mainArticle.publishedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h2 className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
                                {mainArticle.title}
                            </h2>

                            <p className="line-clamp-2 max-w-xl text-sm text-white/80 sm:text-base">
                                {mainArticle.excerpt}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Side Articles (Span 4) */}
                <div className="flex flex-col gap-6 lg:col-span-4 lg:h-[500px]">
                    {sideArticles.map((article) => (
                        <Link
                            key={article.id}
                            href={`/${article.slug}`}
                            className="group relative flex flex-1 flex-col justify-end overflow-hidden rounded-2xl bg-muted aspect-2/1 lg:aspect-auto"
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                {article.coverUrl ? (
                                    <Image
                                        src={article.coverUrl}
                                        alt={article.coverAlt || article.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800" />
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative p-5">
                                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-primary-foreground/90">
                                    <div className="bg-primary/80 px-2 py-0.5 rounded text-white text-[10px] uppercase font-bold tracking-wider">
                                        {article.categoryName}
                                    </div>
                                </div>
                                <h3 className="line-clamp-2 text-lg font-bold text-white group-hover:underline decoration-white/50 underline-offset-4">
                                    {article.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
