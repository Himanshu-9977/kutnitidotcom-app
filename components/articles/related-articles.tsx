// =============================================================================
// Related Articles Component
// Display related articles by category or tags
// =============================================================================

import { ArticleCard } from "./article-card";
import type { ArticleMeta } from "@/lib/types/strapi";

interface RelatedArticlesProps {
    articles: ArticleMeta[];
    title?: string;
}

export function RelatedArticles({
    articles,
    title = "Related Articles"
}: RelatedArticlesProps) {
    if (articles.length === 0) return null;

    return (
        <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {title}
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articles.slice(0, 3).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
}
