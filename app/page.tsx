// =============================================================================
// Homepage — ISR with short revalidation
// Fetches featured + latest articles server-side. Fully static at the edge.
// =============================================================================

import { getHomepageArticles, getFeaturedArticles, toArticleMeta } from "@/lib/strapi";
import { ArticleList, AdBanner } from "@/components/shared";
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

  // 2. sideArticles are now ALL remaining featured articles for the carousel
  const sideArticles = remainingFeatured;

  // 3. Deduplication
  const uniqueLatest = latest;

  return (
    <main>
      {/* Hero Grid Section */}
      {heroArticle && (
        <HeroGrid mainArticle={heroArticle} sideArticles={sideArticles} />
      )}

      {/* Primary Ad Space */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdBanner type="horizontal" />
      </div>

      <Separator className="mx-auto my-8 max-w-7xl" />

      {/* Latest Articles with Sidebar Ads */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main Content: Latest News */}
          <div className="lg:col-span-8">
            <ArticleList articles={uniqueLatest} title="Latest News" />
          </div>

          {/* Sidebar: Ads */}
          <aside className="space-y-8 py-12 lg:col-span-4 lg:block">
            <div className="sticky top-24">
              <AdBanner type="vertical" label="Sponsored Content" />
              <div className="mt-8 border-t pt-8">
                <AdBanner type="square" label="Space Available" className="bg-muted/10" />
              </div>
            </div>
          </aside>
        </div>
      </div>

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
