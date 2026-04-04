// =============================================================================
// Featured Grid
// Grid display for 3-4 featured articles
// =============================================================================

import Link from "next/link";
import { ArticleCard } from "@/components/articles/article-card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleMeta } from "@/lib/types/strapi";

interface FeaturedGridProps {
    articles: ArticleMeta[];
    title?: string;
    showViewAll?: boolean;
}

export function FeaturedGrid({
    articles,
    title = "Featured Articles",
    showViewAll = false
}: FeaturedGridProps) {
    if (articles.length === 0) return null;

    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    {title}
                </h2>
                {showViewAll && (
                    <Button variant="ghost" asChild>
                        <Link prefetch={false} href="/articles" className="group">
                            View All
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}
