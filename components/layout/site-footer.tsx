// =============================================================================
// Site Footer
// Global footer rendered in the root layout.
// =============================================================================

import Link from "next/link";
import { KutnitiLogo } from "@/components/brand/kutniti-logo";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getCategories } from "@/lib/strapi";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { mergeCategoryList } from "@/lib/category-groups";

const fallbackCategories = [
    { name: "Nepal", slug: "nepal" },
    { name: "International", slug: "international" },
    { name: "Economy", slug: "economy" },
    { name: "Technology", slug: "technology" },
    { name: "Sports", slug: "sports" },
    { name: "Opinion", slug: "opinion" },
];

export async function SiteFooter() {
    const currentYear = new Date().getFullYear();
    let categories: Array<{ name: string; slug: string }> = fallbackCategories;

    try {
        const categoriesRes = await getCategories();
        categories = mergeCategoryList(categoriesRes.data.map((category) => ({
            name: category.name,
            slug: category.slug,
        }))).slice(0, 6);
    } catch (error) {
        console.error("Failed to load footer categories", error);
    }

    return (
        <footer className="border-t border-border bg-primary text-primary-foreground">
            <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
                <div className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] lg:gap-12">
                    <div>
                        <Link prefetch={false} href="/" className="mb-4 inline-flex items-center gap-3">
                            <KutnitiLogo className="size-12" />
                            <span className="grid leading-none">
                                <span className="font-serif text-3xl font-bold">
                                    {SITE_NAME}
                                </span>
                                <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary-foreground/65">
                                    Strategic Intelligence
                                </span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-6 text-primary-foreground/70">
                            {SITE_DESCRIPTION}
                        </p>
                        <div className="mt-6 flex gap-3">
                            <Link prefetch={false} href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                                <Twitter className="h-5 w-5 text-primary-foreground/65 transition-colors hover:text-primary-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                                <Facebook className="h-5 w-5 text-primary-foreground/65 transition-colors hover:text-primary-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5 text-primary-foreground/65 transition-colors hover:text-primary-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <Instagram className="h-5 w-5 text-primary-foreground/65 transition-colors hover:text-primary-foreground" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
                            Desks
                        </h3>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        prefetch={false}
                                        href={`/category/${category.slug}`}
                                        className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
                            Trust
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link prefetch={false} href="/about" className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/contact" className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/privacy" className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/terms" className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/60">
                            Daily Brief
                        </h3>
                        <p className="mb-4 text-sm leading-6 text-primary-foreground/70">
                            Get KUTNITI&apos;s policy, economy and geopolitics updates in a concise morning brief.
                        </p>
                        <NewsletterForm className="[&_input]:border-primary-foreground/20 [&_input]:bg-primary-foreground/10 [&_input]:text-primary-foreground [&_input::placeholder]:text-primary-foreground/45 [&_button]:bg-primary-foreground [&_button]:text-primary [&_button:hover]:bg-primary-foreground/90 [&_p]:text-primary-foreground/55" />
                    </div>
                </div>

                <div className="border-t border-primary-foreground/15 py-6 text-sm text-primary-foreground/60 sm:flex sm:items-center sm:justify-between">
                    <p>
                        &copy; {currentYear} {SITE_NAME}. All rights reserved.
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-4 sm:mt-0">
                        <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Kathmandu, Nepal
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            newsroom@kutniti.com
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
