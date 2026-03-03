// =============================================================================
// Homepage — ISR with short revalidation
// Fetches featured + latest articles server-side. Fully static at the edge.
// =============================================================================

import { getHomepageArticles, getFeaturedArticles, toArticleMeta } from "@/lib/strapi";
import { ArticleList } from "@/components/shared";
import { HeroGrid } from "@/components/home/hero-grid";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const [featuredRes, latestRes] = await Promise.all([
    getFeaturedArticles(),
    getHomepageArticles(),
  ]);

  const featured = featuredRes.data.map(toArticleMeta);
  const latest = latestRes.data.map(toArticleMeta);

  // 1. Separate hero article (first featured)
  const [heroArticle, ...remainingFeatured] = featured;

  // 2. Determine side articles for the grid (next 2 featured)
  const sideArticles = remainingFeatured.slice(0, 2);

  // 3. Deduplication (Removed per user request)
  // const shownIds = new Set([heroArticle?.id, ...sideArticles.map(a => a.id)].filter(Boolean));
  // const uniqueLatest = latest.filter((article) => !shownIds.has(article.id));
  const uniqueLatest = latest;

  // 4. Fallback for 'Featured Grid' if we have *more* than 3 featured articles
  // (Optional: show them, or just let them be in 'latest' if they are there.
  // For now, we'll just show the Hero Grid and then the Latest list.)

  return (
    <main>
      {/* Hero Grid Section */}
      {heroArticle && (
        <HeroGrid mainArticle={heroArticle} sideArticles={sideArticles} />
      )}

      <Separator className="mx-auto my-8 max-w-7xl" />

      {/* Latest Articles */}
      <ArticleList articles={uniqueLatest} title="Latest News" />

      {/* Newsletter Section */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground">
            Subscribe to our newsletter
          </h2>
          <p className="mb-6 text-muted-foreground">
            Get the latest articles and insights delivered directly to your inbox.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </main>
  );
}
