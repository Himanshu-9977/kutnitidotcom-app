"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, CalendarDays, Clock, Radio, TrendingUp } from "lucide-react";

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
        <section className="border-b border-border bg-background">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)] lg:px-8 lg:py-10">
                <article className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,0.62fr)]">
                    <Link
                        href={`/${mainArticle.slug}`}
                        prefetch={false}
                        className="group relative min-h-[360px] overflow-hidden rounded-lg bg-muted sm:min-h-[460px] lg:min-h-[560px]"
                    >
                        {mainArticle.coverUrl ? (
                            <Image
                                src={mainArticle.coverUrl}
                                alt={mainArticle.coverAlt || mainArticle.title}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 1024px) 100vw, 58vw"
                            />
                        ) : (
                            <div className="h-full w-full bg-secondary" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-5 text-primary-foreground sm:p-8">
                            <div className="mb-4 flex flex-wrap items-center gap-2">
                                <Badge className="rounded-md bg-accent text-accent-foreground hover:bg-accent">
                                    Lead Analysis
                                </Badge>
                                <Badge variant="secondary" className="rounded-md bg-primary-foreground/90 text-primary">
                                    {mainArticle.categoryName}
                                </Badge>
                            </div>
                            <h1 className="max-w-3xl text-balance font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                                {mainArticle.title}
                            </h1>
                            <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-7 text-primary-foreground/82 sm:text-lg">
                                {mainArticle.excerpt}
                            </p>
                        </div>
                    </Link>

                    <div className="flex flex-col justify-between gap-6 border-y border-border py-6 lg:border-y-0 lg:border-l lg:py-0 lg:pl-6">
                        <div>
                            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                                <Radio className="h-4 w-4" />
                                Front Page
                            </div>
                            <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                                Policy, economy and power in Nepal and South Asia.
                            </h2>
                            <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                                KUTNITI connects reported facts, institutional context and regional signals so readers can see what matters next.
                            </p>
                        </div>

                        <div className="grid gap-3 border-y border-border py-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4 text-accent" />
                                Published {formatDate(mainArticle.publishedAt)}
                            </div>
                            {mainArticle.readingTime && (
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4 text-accent" />
                                    {mainArticle.readingTime} minute read
                                </div>
                            )}
                            <Link
                                href={`/authors/${mainArticle.authorSlug}`}
                                prefetch={false}
                                className="text-sm font-semibold text-foreground transition-colors hover:text-accent"
                            >
                                By {mainArticle.authorName}
                            </Link>
                        </div>

                        <Button asChild className="w-fit rounded-md bg-primary hover:bg-accent">
                            <Link href={`/${mainArticle.slug}`} prefetch={false}>
                                Read the lead story
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </article>

                <aside className="grid gap-5">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                        <h2 className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-foreground">
                            <TrendingUp className="h-4 w-4 text-accent" />
                            Trending Now
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
                                        className="group grid overflow-hidden rounded-lg border border-border bg-card"
                                    >
                                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                            {article.coverUrl ? (
                                                <Image
                                                    src={article.coverUrl}
                                                    alt={article.coverAlt || article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                    sizes="(max-width: 1024px) 100vw, 28vw"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-secondary" />
                                            )}
                                            <Badge className="absolute left-4 top-4 rounded-md bg-primary text-primary-foreground">
                                                {article.categoryName}
                                            </Badge>
                                        </div>
                                        <div className="p-5">
                                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                                {formatDate(article.publishedAt)}
                                            </p>
                                            <h3 className="mt-2 line-clamp-3 font-serif text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-accent">
                                                {article.title}
                                            </h3>
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                                                {article.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>

                    <div className="grid grid-cols-3 border border-border bg-secondary/45 text-center">
                        {[
                            ["Newsroom", "Live"],
                            ["Briefing", "Daily"],
                            ["Analysis", "Deep"],
                        ].map(([label, value]) => (
                            <div key={label} className="border-r border-border p-3 last:border-r-0">
                                <div className="text-lg font-bold text-foreground">{value}</div>
                                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </div>
        </section>
    );
}
