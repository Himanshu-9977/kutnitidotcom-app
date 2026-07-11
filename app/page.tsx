// =============================================================================
// Homepage
// Dynamic editorial front page backed by Strapi ISR data.
// =============================================================================

import Link from "next/link";
import { ArrowRight, BarChart3, Globe2, Newspaper, ShieldCheck } from "lucide-react";

import {
  getCategories,
  getFeaturedArticles,
  getHomepageArticles,
  toArticleMeta,
} from "@/lib/strapi";
import { ArticleCard } from "@/components/articles/article-card";
import { BriefingDesk } from "@/components/home/briefing-desk";
import { HeroGrid } from "@/components/home/hero-grid";
import { AdBanner, ArticleList, NewsletterForm } from "@/components/shared";
import type { ArticleMeta } from "@/lib/types/strapi";

export const revalidate = 120;

type HomeCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

function dedupeArticles(articles: ArticleMeta[]) {
  const seen = new Set<string>();
  return articles.filter((article) => {
    const key = article.documentId || article.slug;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function getHomeData() {
  const [featuredResult, latestResult, categoryResult] = await Promise.allSettled([
    getFeaturedArticles(),
    getHomepageArticles(),
    getCategories(),
  ]);

  if (featuredResult.status === "rejected") {
    console.error("Failed to load featured articles", featuredResult.reason);
  }

  if (latestResult.status === "rejected") {
    console.error("Failed to load homepage articles", latestResult.reason);
  }

  if (categoryResult.status === "rejected") {
    console.error("Failed to load homepage categories", categoryResult.reason);
  }

  const featured =
    featuredResult.status === "fulfilled"
      ? featuredResult.value.data.map(toArticleMeta)
      : [];

  const latest =
    latestResult.status === "fulfilled"
      ? latestResult.value.data.map(toArticleMeta)
      : [];

  const categories: HomeCategory[] =
    categoryResult.status === "fulfilled"
      ? categoryResult.value.data.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
        }))
      : [];

  return { featured, latest, categories };
}

export default async function HomePage() {
  const { featured, latest, categories } = await getHomeData();
  const allArticles = dedupeArticles([...featured, ...latest]);
  const heroArticle = featured[0] ?? latest[0];

  if (!heroArticle) {
    return (
      <div className="bg-background">
        <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">KUTNITI</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            The newsroom is ready.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Publish articles in Strapi and the homepage will populate automatically.
          </p>
        </section>
      </div>
    );
  }

  const sideArticles = dedupeArticles([
    ...featured.slice(1),
    ...latest.filter((article) => article.documentId !== heroArticle.documentId),
  ]).slice(0, 5);

  const latestArticles = dedupeArticles(latest)
    .filter((article) => article.documentId !== heroArticle.documentId)
    .slice(0, 8);

  const featuredCards = dedupeArticles([
    ...sideArticles,
    ...latestArticles,
  ]).slice(0, 6);

  const categoryNames = categories.map((category) => category.name);

  return (
    <div className="bg-background">
      <HeroGrid mainArticle={heroArticle} sideArticles={sideArticles} />

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-[1800px] grid-cols-2 gap-0 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { label: "Coverage desks", value: categories.length || "Live", icon: Newspaper },
            { label: "Latest stories", value: latest.length || allArticles.length, icon: BarChart3 },
            { label: "Featured analysis", value: featured.length || "Curated", icon: ShieldCheck },
            { label: "Regional lens", value: "NPT", icon: Globe2 },
          ].map((item) => (
            <div key={item.label} className="border-r border-border px-4 py-5 last:border-r-0">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-accent" />
                <div>
                  <div className="text-2xl font-bold text-foreground">{item.value}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {item.label}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BriefingDesk articles={allArticles.slice(0, 12)} categories={categoryNames} />

      <section id="latest" className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <ArticleList
            contained={false}
            articles={latestArticles.length > 0 ? latestArticles : allArticles.slice(1, 8)}
            title="Latest Intelligence"
            description="Fresh reporting and analysis from the KUTNITI newsroom, arranged for readers who want context before noise."
          />

          <aside className="space-y-6 lg:pt-20">
            <div className="rounded-lg border border-border bg-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Editor&apos;s Map</p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight tracking-tight">
                Follow the desks shaping the agenda.
              </h2>
              <div className="mt-5 grid gap-2">
                {categories.slice(0, 7).map((category, index) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    prefetch={false}
                    className="group flex items-center justify-between rounded-md border border-border bg-background px-3 py-3 transition-colors hover:border-accent/45 hover:bg-secondary/60"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xs font-bold text-accent">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-foreground">{category.name}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </Link>
                ))}
              </div>
            </div>

            <AdBanner type="square" label="Partner Space" className="rounded-lg border border-border bg-card" />

            <div className="rounded-lg border border-border bg-primary p-5 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">Signal Watch</p>
              <ul className="mt-4 space-y-4 text-sm leading-6 text-primary-foreground/78">
                <li>Track policy announcements against implementation timelines.</li>
                <li>Read market stories with risk and institutional context.</li>
                <li>Follow Nepal&apos;s regional choices through India, China and global shifts.</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>

      {featuredCards.length > 0 && (
        <section className="border-y border-border bg-secondary/45 py-12">
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="mb-7 flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Analysis Shelf</p>
                <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Context-rich reads
                </h2>
              </div>
              <Link
                href="/#latest"
                className="inline-flex items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-foreground"
              >
                Browse latest
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCards.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
            <div className="mb-7 border-b border-border pb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Topic Hubs</p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Build depth by desk
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Each hub collects articles, explainers and analysis from the CMS, so the site grows as the newsroom publishes.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.slice(0, 8).map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  prefetch={false}
                  className="group min-h-48 rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent/45 hover:bg-secondary/45"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight text-foreground group-hover:text-accent">
                    {category.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {category.description || "Follow updates, background and analysis from this KUTNITI coverage desk."}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
                    Open hub
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-card py-12">
        <div className="mx-auto grid max-w-[1800px] gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Daily Brief</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Get the KUTNITI morning brief.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              A concise scan of policy, economy, technology and regional affairs, built for decision makers and serious readers.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/45 p-5">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
