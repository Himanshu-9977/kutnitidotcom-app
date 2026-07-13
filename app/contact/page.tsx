import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileCheck2,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquareText,
} from "lucide-react";

import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact the KUTNITI newsroom with news tips, corrections, story proposals and partnership enquiries.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

const contacts = [
  {
    icon: MessageSquareText,
    title: "News tips",
    text: "Share a lead, document or development you believe our newsroom should examine.",
    subject: "News tip for KUTNITI",
    action: "Send a news tip",
  },
  {
    icon: FileCheck2,
    title: "Corrections",
    text: "Point us to the article, identify the specific concern and include reliable evidence.",
    subject: "Correction request for KUTNITI",
    action: "Request a correction",
  },
  {
    icon: Lightbulb,
    title: "Contributors",
    text: "Pitch an original, relevant story or analysis with a short outline and author profile.",
    subject: "Contributor pitch for KUTNITI",
    action: "Pitch a story",
  },
  {
    icon: BriefcaseBusiness,
    title: "Partnerships",
    text: "Contact us about events, distribution, advertising or an institutional collaboration.",
    subject: "Partnership enquiry for KUTNITI",
    action: "Discuss a partnership",
  },
];

export default function ContactPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1500px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary-foreground/65">
            Contact KUTNITI
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-end">
            <h1 className="max-w-5xl font-serif text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Tell us what deserves a closer look.
            </h1>
            <p className="max-w-xl text-base leading-8 text-primary-foreground/75 sm:text-lg">
              Tips, corrections and thoughtful pitches strengthen our journalism. Choose the
              route below and your message will reach the KUTNITI newsroom.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {contacts.map((item) => (
            <article key={item.title} className="flex min-h-72 flex-col bg-card p-6 sm:p-8">
              <span className="grid size-11 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-6 font-serif text-2xl font-bold tracking-tight sm:text-3xl">
                {item.title}
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-muted-foreground">{item.text}</p>
              <a
                href={`mailto:newsroom@kutniti.com?subject=${encodeURIComponent(item.subject)}`}
                className="mt-auto inline-flex w-fit items-center gap-2 pt-7 text-sm font-bold text-accent transition-colors hover:text-primary"
              >
                {item.action}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-secondary/45">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Direct contact</p>
            <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              The newsroom inbox.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:newsroom@kutniti.com"
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent/50"
            >
              <Mail className="h-5 w-5 text-accent" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Email
              </p>
              <p className="mt-2 break-all font-serif text-xl font-bold group-hover:text-accent sm:text-2xl">
                newsroom@kutniti.com
              </p>
            </a>
            <div className="rounded-lg border border-border bg-card p-6">
              <MapPin className="h-5 w-5 text-accent" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Newsroom
              </p>
              <p className="mt-2 font-serif text-xl font-bold sm:text-2xl">Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1500px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Before you write</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
            Help us respond well.
          </h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {[
            ["01", "Use a clear subject line and include the relevant article link when applicable."],
            ["02", "Explain what you know, how you know it and which details still need verification."],
            ["03", "Attach or link to supporting material, while removing personal data that is not necessary."],
            ["04", "For sensitive tips, tell us how you would prefer the newsroom to follow up."],
          ].map(([number, text]) => (
            <div key={number} className="grid grid-cols-[42px_1fr] gap-4 py-5">
              <span className="text-sm font-bold text-accent">{number}</span>
              <p className="leading-7 text-foreground/85">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="font-serif text-2xl font-bold">Want to know how KUTNITI works?</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Read about our mission, coverage and editorial standards.
            </p>
          </div>
          <Link
            href="/about"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-accent transition-colors hover:text-primary"
          >
            About KUTNITI
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
