"use client"

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { ArticleMeta } from "@/lib/types/strapi";
import { cn } from "@/lib/utils";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

interface HeroGridProps {
    mainArticle: ArticleMeta;
    sideArticles: ArticleMeta[];
}

export function HeroGrid({ mainArticle, sideArticles }: HeroGridProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

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

                {/* Sidebar Carousel (Span 4) */}
                <div className="lg:col-span-4 lg:flex lg:flex-col">
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-2 lg:mb-6">
                        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                            </span>
                            Trending Now
                        </h2>
                        <div className="flex gap-1.5">
                            {sideArticles.map((_, index) => (
                                <button
                                    key={index}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300",
                                        index === current ? "w-4 bg-primary" : "w-1.5 bg-muted-foreground/30"
                                    )}
                                    onClick={() => api?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="relative flex-1 rounded-2xl bg-muted/20 p-2 lg:p-0 lg:bg-transparent">
                        <Carousel
                            setApi={setApi}
                            plugins={[plugin.current]}
                            className="h-full w-full"
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                        >
                            <CarouselContent className="h-full">
                                {sideArticles.map((article) => (
                                    <CarouselItem key={article.id} className="h-full">
                                        <Link
                                            href={`/${article.slug}`}
                                            className="group block h-full overflow-hidden rounded-2xl bg-background/50 transition-colors hover:bg-background lg:bg-muted/40 lg:hover:bg-muted/60"
                                        >
                                            {/* Image at Top */}
                                            <div className="relative aspect-video w-full overflow-hidden">
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
                                                <div className="absolute top-3 left-3">
                                                    <Badge variant="secondary" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                        {article.categoryName}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Content Below */}
                                            <div className="p-4 sm:p-5 lg:p-6">
                                                <div className="mb-1 flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs">
                                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                                <h3 className="line-clamp-2 text-base font-bold text-foreground transition-colors group-hover:text-primary sm:text-lg lg:text-xl">
                                                    {article.title}
                                                </h3>
                                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                                                    {article.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}
