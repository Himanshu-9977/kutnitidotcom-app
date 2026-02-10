// =============================================================================
// Homepage — ISR with short revalidation
// Fetches featured + latest articles server-side. Fully static at the edge.
// =============================================================================

import { getHomepageArticles, getFeaturedArticles, toArticleMeta } from "@/lib/strapi";
import { HeroSection, FeaturedGrid, ArticleList } from "@/components/shared";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Separator } from "@/components/ui/separator";

export default async function HomePage() {
  const [featuredRes, latestRes] = await Promise.all([
    getFeaturedArticles(),
    getHomepageArticles(),
  ]);

  const featured = featuredRes.data.map(toArticleMeta);
  const latest = latestRes.data.map(toArticleMeta);

  // Separate hero article from featured grid
  const [heroArticle, ...featuredGridArticles] = featured;

  return (
    <main>
      {/* Hero Section */}
      {heroArticle && <HeroSection article={heroArticle} />}

      {/* Featured Articles Grid */}
      {featuredGridArticles.length > 0 && (
        <FeaturedGrid
          articles={featuredGridArticles.slice(0, 3)}
          title="Featured Articles"
          showViewAll={false}
        />
      )}

      <Separator className="mx-auto my-8 max-w-7xl" />

      {/* Latest Articles */}
      <ArticleList articles={latest} title="Latest Articles" />

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
