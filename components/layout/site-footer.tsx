// =============================================================================
// Site Footer
// Global footer rendered in the root layout.
// =============================================================================

import Link from "next/link";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { getCategories } from "@/lib/strapi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

export async function SiteFooter() {
    const currentYear = new Date().getFullYear();
    const categoriesRes = await getCategories();
    const categories = categoriesRes.data.slice(0, 5); // Show top 5 categories

    return (
        <footer className="border-t border-border bg-muted/30 pt-16 pb-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-4">
                    {/* Brand & Description */}
                    <div className="lg:col-span-1">
                        <Link prefetch={false} href="/" className="mb-4 inline-block text-2xl font-bold font-serif tracking-tight">
                            {SITE_NAME}
                        </Link>
                        <p className="mb-6 text-muted-foreground">
                            {SITE_DESCRIPTION}
                        </p>
                        <div className="flex gap-4">
                            <Link prefetch={false} href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                                <Twitter className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                                <Facebook className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                            </Link>
                            <Link prefetch={false} href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                                <Instagram className="h-5 w-5 text-muted-foreground transition-colors hover:text-foreground" />
                            </Link>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Categories</h3>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link prefetch={false}
                                        href={`/category/${category.slug}`}
                                        className="text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link prefetch={false} href="/about" className="text-muted-foreground transition-colors hover:text-primary">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/privacy" className="text-muted-foreground transition-colors hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link prefetch={false} href="/terms" className="text-muted-foreground transition-colors hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter (Simplified) */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Subscribe</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Get the latest updates and articles delivered to your inbox.
                        </p>
                        <form className="flex flex-col gap-2">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background"
                            />
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 border-t border-border pt-8 text-center sm:flex sm:justify-between sm:text-left">
                    <p className="text-sm text-muted-foreground">
                        &copy; {currentYear} {SITE_NAME}. All rights reserved.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground sm:mt-0">
                        Designed & Developed with ❤️
                    </p>
                </div>
            </div>
        </footer>
    );
}
