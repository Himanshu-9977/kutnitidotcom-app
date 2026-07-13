import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Globe2,
  Landmark,
  Scale,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

import { SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about KUTNITI's mission, coverage, editorial standards and approach to source-backed journalism.",
  alternates: { canonical: `${SITE_URL}/about` },
};

const coverage = [
  {
    icon: Landmark,
    title: "Nepal",
    text: "Politics, public policy, institutions and the decisions that shape daily life.",
  },
  {
    icon: Scale,
    title: "Economy",
    text: "Markets, business, public finance and the forces moving Nepal's economy.",
  },
  {
    icon: Globe2,
    title: "Regional & global affairs",
    text: "South Asia and world events, explained through their relevance to Nepal.",
  },
  {
    icon: Eye,
    title: "Ideas & change",
    text: "Technology, society, sport and the people influencing what comes next.",
  },
];

const standards = [
  "We identify the source of important claims and distinguish reporting from analysis.",
  "We seek context, not just speed, and update developing stories when facts change.",
  "We correct material errors clearly and welcome specific, evidence-based feedback.",
  "Editorial decisions are made for readers, independent of commercial interests.",
];

export default function AboutPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/65">
            About KUTNITI
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)] lg:items-end">
            <h1 className="max-w-5xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              News that tells you what happened—and why it matters.
            </h1>
            <p className="max-w-xl text-base leading-8 text-primary-foreground/75 sm:text-lg">
              {SITE_DESCRIPTION} We connect the day&apos;s facts with the institutions,
              interests and choices behind them.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Our purpose</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            A clearer view of a changing Nepal.
          </h2>
        </div>
        <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
          <p>
            KUTNITI is an independent digital news and analysis platform based in Kathmandu.
            We serve readers who want the news without losing the background, evidence and
            regional perspective needed to understand it.
          </p>
          <p>
            Our name reflects our focus: the choices, relationships and strategies that shape
            public life. We report on power and policy, but we also follow the economy,
            technology, society and sport because they are part of the same national story.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">What we cover</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              One newsroom, connected beats.
            </h2>
          </div>
          <div className="mt-9 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {coverage.map((item) => (
              <article key={item.title} className="bg-card p-6 lg:min-h-64">
                <span className="grid size-11 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-6 font-serif text-2xl font-bold tracking-tight">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Editorial standards
          </p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Accuracy before assumption.
          </h2>
          <p className="mt-4 max-w-lg leading-7 text-muted-foreground">
            Trust is earned story by story. These principles guide how we publish, label and
            improve our journalism.
          </p>
        </div>
        <div className="grid gap-4">
          {standards.map((standard) => (
            <div key={standard} className="flex gap-4 rounded-lg border border-border bg-card p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <p className="leading-7 text-foreground/85">{standard}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Work with us</p>
              <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight sm:text-5xl">
                Have a news tip, correction or story idea?
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                Send the newsroom a clear note, relevant links and any supporting documents you
                are able to share.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Contact the newsroom
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-5 border-t border-border pt-6 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <SearchCheck className="h-4 w-4 text-accent" /> Source-aware reporting
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" /> Clear corrections
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
