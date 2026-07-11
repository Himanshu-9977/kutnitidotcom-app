"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ArticleMeta } from "@/lib/types/strapi";
import { cn } from "@/lib/utils";

interface BriefingDeskProps {
    articles: ArticleMeta[];
    categories: string[];
}

function normalize(value: string) {
    return value.toLowerCase().trim();
}

function buildBrief(articles: ArticleMeta[], query: string, activeCategory: string) {
    if (articles.length === 0) {
        return "No matching brief is available yet. Publish more stories in the CMS and this desk will update automatically.";
    }

    const lead = articles[0];
    const topic = query ? `"${query}"` : activeCategory === "All" ? "today's agenda" : activeCategory;
    const second = articles[1]?.title ?? "Watch how official decisions move from announcement to delivery.";
    const third = articles[2]?.title ?? "Track the evidence, institutions and market response before drawing a conclusion.";

    return `For ${topic}, start with "${lead.title}". The wider signal is connected to "${second}". A reader should also watch: ${third}`;
}

export function BriefingDesk({ articles, categories }: BriefingDeskProps) {
    const [activeCategory, setActiveCategory] = React.useState("All");
    const [query, setQuery] = React.useState("");
    const [submittedQuery, setSubmittedQuery] = React.useState("");

    const visibleCategories = ["All", ...categories.filter(Boolean).slice(0, 5)];

    const filteredArticles = React.useMemo(() => {
        const cleanQuery = normalize(submittedQuery);

        return articles
            .filter((article) => activeCategory === "All" || article.categoryName === activeCategory)
            .filter((article) => {
                if (!cleanQuery) return true;

                const haystack = normalize([
                    article.title,
                    article.excerpt,
                    article.categoryName,
                    article.authorName,
                    ...article.tags.map((tag) => tag.name),
                ].join(" "));

                return cleanQuery
                    .split(/\s+/)
                    .filter(Boolean)
                    .some((word) => haystack.includes(word));
            })
            .slice(0, 4);
    }, [activeCategory, articles, submittedQuery]);

    const brief = buildBrief(filteredArticles, submittedQuery, activeCategory);

    return (
        <section id="briefing" className="border-y border-border bg-secondary/45">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
                <div>
                    <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">
                        <Sparkles className="h-4 w-4" />
                        Briefing Desk
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
                        Ask the newsroom for fast context.
                    </h2>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Filter live CMS stories by desk or search a policy, economy, technology or geopolitics question.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        {visibleCategories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => setActiveCategory(category)}
                                className={cn(
                                    "rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition-colors",
                                    activeCategory === category
                                        ? "border-accent bg-accent text-accent-foreground"
                                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-5">
                    <form
                        className="flex flex-col gap-3 sm:flex-row"
                        onSubmit={(event) => {
                            event.preventDefault();
                            setSubmittedQuery(query);
                        }}
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Ask about budget, AI, banking, diplomacy..."
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" className="bg-primary hover:bg-accent">
                            Generate Brief
                        </Button>
                    </form>

                    <div className="mt-5 rounded-md border border-border bg-background p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                            Reader Brief
                        </p>
                        <p className="mt-3 text-sm leading-7 text-foreground sm:text-base">
                            {brief}
                        </p>
                    </div>

                    {filteredArticles.length > 0 && (
                        <div className="mt-5 grid gap-3">
                            {filteredArticles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/${article.slug}`}
                                    prefetch={false}
                                    className="group flex items-start justify-between gap-4 rounded-md border border-border bg-background p-3 transition-colors hover:border-accent/45 hover:bg-secondary/60"
                                >
                                    <span>
                                        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                                            {article.categoryName}
                                        </span>
                                        <span className="mt-1 line-clamp-2 block font-serif text-lg font-bold leading-tight text-foreground group-hover:text-accent">
                                            {article.title}
                                        </span>
                                    </span>
                                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
