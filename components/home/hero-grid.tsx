"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, CalendarDays, Clock, Play, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import type { ArticleMeta } from "@/lib/types/strapi";
import { cn } from "@/lib/utils";

interface HeroGridProps {
    mainArticle: ArticleMeta;
    sideArticles: ArticleMeta[];
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export function HeroGrid({ mainArticle, sideArticles }: HeroGridProps) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);
    const carouselArticles = sideArticles.length > 0 ? sideArticles : [mainArticle];
    const smallArticles = sideArticles.slice(1, 4);

    const plugin = React.useRef(
        Autoplay({ delay: 4500, stopOnInteraction: false })
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <section className="bg-background">
            <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="border-y-2 border-foreground py-5 text-center">
                    <p className="text-base text-foreground sm:text-lg">
                        These top stories are <strong>free to read.</strong>
                    </p>
                    <span className="mx-auto mt-3 block h-0.5 w-24 bg-accent" />
                </div>

                <div className="grid gap-5 border-b border-border py-6 lg:grid-cols-[minmax(0,1fr)_430px]">
                    <article className="grid gap-5 border border-border bg-card p-5 lg:grid-cols-[0.78fr_1.22fr]">
                        <div className="flex flex-col justify-between gap-5">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <Badge className="rounded-md bg-accent text-accent-foreground hover:bg-accent">
                                        Lead Analysis
                                    </Badge>
                                    <Badge variant="outline" className="rounded-md border-border">
                                        {mainArticle.categoryName}
                                    </Badge>
                                </div>
                                <Link href={`/${mainArticle.slug}`} prefetch={false} className="group">
                                    <h1 className="text-balance font-serif text-3xl font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-4xl xl:text-5xl">
                                        {mainArticle.title}
                                    </h1>
                                </Link>
                                <p className="mt-4 line-clamp-4 text-base leading-7 text-muted-foreground sm:text-lg">
                                    {mainArticle.excerpt}
                                </p>
                            </div>

                            <div className="space-y-4 border-t border-border pt-4">
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="inline-flex items-center gap-2">
                                        <CalendarDays className="h-4 w-4 text-accent" />
                                        {formatDate(mainArticle.publishedAt)}
                                    </span>
                                    {mainArticle.readingTime && (
                                        <span className="inline-flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-accent" />
                                            {mainArticle.readingTime} min read
                                        </span>
                                    )}
                                </div>
                                <Link
                                    href={`/authors/${mainArticle.authorSlug}`}
                                    prefetch={false}
                                    className="block text-sm font-semibold text-foreground transition-colors hover:text-accent"
                                >
                                    By {mainArticle.authorName}
                                </Link>
                                <Button asChild className="rounded-md bg-primary hover:bg-accent">
                                    <Link href={`/${mainArticle.slug}`} prefetch={false}>
                                        Read full story
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <Link
                            href={`/${mainArticle.slug}`}
                            prefetch={false}
                            className="group relative min-h-[260px] overflow-hidden bg-muted sm:min-h-[380px] lg:min-h-[430px]"
                        >
                            {mainArticle.coverUrl ? (
                                <Image
                                    src={mainArticle.coverUrl}
                                    alt={mainArticle.coverAlt || mainArticle.title}
                                    fill
                                    priority
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 48vw"
                                />
                            ) : (
                                <div className="grid h-full place-items-center bg-secondary">
                                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                                        KUTNITI
                                    </span>
                                </div>
                            )}
                        </Link>
                    </article>

                    <aside className="grid gap-5 border-l-0 border-border lg:border-l lg:pl-5">
                        <div className="flex items-center justify-between border-b border-border pb-3">
                            <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground">
                                <TrendingUp className="h-4 w-4 text-accent" />
                                Trending
                            </h2>
                            {carouselArticles.length > 1 && (
                                <div className="flex gap-1.5">
                                    {carouselArticles.map((_, index) => (
                                        <button
                                            key={index}
                                            className={cn(
                                                "h-1.5 rounded-full transition-all duration-300",
                                                index === current ? "w-5 bg-accent" : "w-1.5 bg-muted-foreground/30"
                                            )}
                                            onClick={() => api?.scrollTo(index)}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <Carousel
                            setApi={setApi}
                            plugins={[plugin.current]}
                            className="w-full"
                            opts={{ align: "start", loop: carouselArticles.length > 1 }}
                        >
                            <CarouselContent>
                                {carouselArticles.map((article) => (
                                    <CarouselItem key={article.id}>
                                        <Link
                                            href={`/${article.slug}`}
                                            prefetch={false}
                                            className="group grid overflow-hidden bg-card"
                                        >
                                            <div className="relative aspect-video overflow-hidden bg-muted">
                                                {article.coverUrl ? (
                                                    <Image
                                                        src={article.coverUrl}
                                                        alt={article.coverAlt || article.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                        sizes="(max-width: 1024px) 100vw, 420px"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-secondary" />
                                                )}
                                                <span className="absolute inset-0 grid place-items-center bg-black/10">
                                                    <span className="grid size-14 place-items-center rounded-full bg-black/60 text-white">
                                                        <Play className="ml-1 h-6 w-6 fill-white" />
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="border-x border-b border-border p-4">
                                                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                                                    {article.categoryName}
                                                </p>
                                                <h3 className="mt-2 line-clamp-3 font-serif text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-accent">
                                                    {article.title}
                                                </h3>
                                            </div>
                                        </Link>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>

                        {smallArticles.length > 0 && (
                            <div className="divide-y divide-border border-y border-border">
                                {smallArticles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/${article.slug}`}
                                        prefetch={false}
                                        className="group grid gap-3 py-4 sm:grid-cols-[96px_minmax(0,1fr)]"
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            {article.coverUrl ? (
                                                <Image
                                                    src={article.coverUrl}
                                                    alt={article.coverAlt || article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="96px"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-secondary" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                                                {article.categoryName}
                                            </p>
                                            <h3 className="mt-1 line-clamp-2 font-serif text-lg font-bold leading-tight transition-colors group-hover:text-accent">
                                                {article.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </section>
    );
}
