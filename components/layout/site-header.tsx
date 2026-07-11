// =============================================================================
// Site Header
// Global navigation rendered in the root layout.
// =============================================================================

import Link from "next/link";
import { ChevronDown, TrendingUp } from "lucide-react";

import { SITE_NAME } from "@/lib/constants";
import { getCategories } from "@/lib/strapi";
import { AuthMenu } from "@/components/auth/user-menu";
import { KutnitiLogo } from "@/components/brand/kutniti-logo";
import { Search } from "@/components/shared/search";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";

const editionLinks = [
    { label: "Nepal", href: "/category/nepal" },
    { label: "South Asia", href: "/category/south-asia" },
    { label: "International", href: "/category/international" },
];

const fallbackSections = [
    { name: "Nepal", slug: "nepal" },
    { name: "South Asia", slug: "south-asia" },
    { name: "International", slug: "international" },
    { name: "Politics", slug: "politics" },
    { name: "Economy", slug: "economy" },
    { name: "Business", slug: "business" },
    { name: "Technology", slug: "technology" },
    { name: "Opinion", slug: "opinion" },
    { name: "Video", slug: "video" },
];

export async function SiteHeader() {
    let categories: Array<{ name: string; slug: string }> = [];

    try {
        const categoriesRes = await getCategories();
        categories = categoriesRes.data.map((cat) => ({
            name: cat.name,
            slug: cat.slug,
        }));
    } catch (error) {
        console.error("Failed to load navigation categories", error);
    }

    const sections = [...fallbackSections, ...categories].filter((section, index, list) => {
        const key = section.name.toLowerCase();
        return list.findIndex((item) => item.name.toLowerCase() === key || item.slug === section.slug) === index;
    });
    const dateLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kathmandu",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <header className="relative z-50 w-full border-b border-border bg-background">
            <div className="border-b border-border bg-secondary/60">
                <div className="mx-auto flex h-28 max-w-[1500px] items-center justify-center px-4 sm:h-40 lg:h-64">
                    <div className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
                        Advertisement
                    </div>
                </div>
            </div>

            <div className="border-b border-border bg-background">
                <div className="mx-auto grid max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:px-8">
                    <div className="flex items-start justify-between gap-3 lg:block">
                        <div className="flex items-center gap-2">
                            <MobileNav categories={sections} />
                            <Search />
                        </div>
                        <div className="mt-3 hidden text-sm leading-7 lg:block">
                            <p className="font-semibold text-foreground">{dateLabel}</p>
                            <Link
                                href="/#latest"
                                prefetch={false}
                                className="text-foreground transition-colors hover:text-accent"
                            >
                                Today&apos;s Brief
                            </Link>
                        </div>
                        <div className="lg:hidden">
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="text-center">
                        <nav className="mb-3 flex items-center justify-center gap-5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary/75">
                            {editionLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    prefetch={false}
                                    className="transition-colors hover:text-accent"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <Link
                            prefetch={false}
                            href="/"
                            className="inline-flex flex-col items-center text-center text-primary transition-colors hover:text-accent"
                            aria-label="KUTNITI home"
                        >
                            <KutnitiLogo className="mb-3 size-14 drop-shadow-sm sm:size-20 lg:size-24" />
                            <span className="font-serif text-4xl font-black leading-none sm:text-6xl lg:text-7xl">
                                {SITE_NAME}
                            </span>
                            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                                Strategic Intelligence
                            </span>
                        </Link>
                    </div>

                    <div className="hidden justify-self-end lg:block">
                        <div className="flex items-center justify-end gap-3">
                            <Button asChild size="sm" className="rounded-md bg-primary px-4 text-xs font-bold uppercase tracking-[0.08em] hover:bg-accent hover:text-accent-foreground">
                                <Link href="/#briefing" prefetch={false}>
                                    Subscribe
                                </Link>
                            </Button>
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <AuthMenu />
                        </div>
                        <div className="mt-5 flex justify-end gap-5 text-sm">
                            <span className="text-foreground">Market</span>
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                                <TrendingUp className="h-4 w-4" />
                                +0.29%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-4 border-t border-border px-4 py-2 lg:hidden">
                    <LanguageSwitcher />
                    <AuthMenu />
                </div>
            </div>

            <div className="border-b-2 border-primary bg-background">
                <nav
                    className="mx-auto flex h-12 max-w-[1500px] items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:justify-center lg:px-8"
                    aria-label="Primary sections"
                >
                    <Link
                        prefetch={false}
                        href="/"
                        className="whitespace-nowrap bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                        Home
                    </Link>

                    {sections.slice(0, 10).map((category) => (
                        <Link
                            key={category.slug}
                            prefetch={false}
                            href={`/category/${category.slug}`}
                            className="inline-flex whitespace-nowrap px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                        >
                            {category.name}
                            <ChevronDown className="ml-1 mt-0.5 h-3.5 w-3.5 text-muted-foreground" />
                        </Link>
                    ))}

                    {sections.length > 10 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto whitespace-nowrap px-3 py-2 text-sm font-semibold hover:bg-transparent hover:text-accent">
                                    More
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                                {sections.slice(10).map((category) => (
                                    <DropdownMenuItem key={category.slug} asChild>
                                        <Link prefetch={false} href={`/category/${category.slug}`} className="cursor-pointer">
                                            {category.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </nav>
            </div>
        </header>
    );
}
