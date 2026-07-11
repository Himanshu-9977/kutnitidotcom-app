// =============================================================================
// Site Header
// Global navigation rendered in the root layout.
// Server component — categories fetched at ISR time.
// =============================================================================

import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { getCategories } from "@/lib/strapi";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Search } from "@/components/shared/search";
import { CalendarDays, ChevronDown, Globe2, Radio, ShieldCheck } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth/user-menu";

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

    const dateLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kathmandu",
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
            <div className="hidden border-b border-border bg-primary text-primary-foreground lg:block">
                <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-xs font-medium">
                    <div className="flex items-center gap-5">
                        <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {dateLabel}
                        </span>
                        <span className="inline-flex items-center gap-2 text-primary-foreground/80">
                            <Globe2 className="h-3.5 w-3.5" />
                            Kathmandu edition
                        </span>
                    </div>
                    <div className="flex items-center gap-5 text-primary-foreground/80">
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Source-backed reporting
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Radio className="h-3.5 w-3.5" />
                            Policy, economy, geopolitics
                        </span>
                    </div>
                </div>
            </div>

            <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3">
                <div className="flex items-center gap-3">
                    <MobileNav categories={categories} />
                    <Link
                        prefetch={false}
                        href="/"
                        className="group inline-flex items-center gap-3 text-foreground transition-colors hover:text-accent"
                    >
                        <span className="grid size-10 place-items-center rounded-md bg-primary font-serif text-lg font-bold text-primary-foreground transition-colors group-hover:bg-accent">
                            K
                        </span>
                        <span className="grid leading-none">
                            <span className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                                {SITE_NAME}
                            </span>
                            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                                Strategic Intelligence
                            </span>
                        </span>
                    </Link>
                </div>

                <nav className="hidden items-center gap-5 lg:flex">
                    <Link
                        prefetch={false}
                        href="/"
                        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>

                    {categories.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-0 text-sm font-semibold text-muted-foreground hover:bg-transparent hover:text-foreground">
                                    Categories
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.slug} asChild>
                                        <Link prefetch={false} href={`/category/${category.slug}`} className="cursor-pointer">
                                            {category.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Link
                        prefetch={false}
                        href="/#latest"
                        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Latest
                    </Link>
                    <Link
                        prefetch={false}
                        href="/#briefing"
                        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Briefing
                    </Link>
                    <Search />
                    <ThemeToggle />
                    <AuthMenu />
                </nav>

                <div className="lg:hidden">
                    <ThemeToggle />
                </div>
            </div>

            {categories.length > 0 && (
                <div className="hidden border-t border-border bg-secondary/50 lg:block">
                    <nav className="mx-auto flex h-10 max-w-7xl items-center gap-1 overflow-x-auto px-4" aria-label="Section navigation">
                        {categories.slice(0, 8).map((category) => (
                            <Link
                                key={category.slug}
                                prefetch={false}
                                href={`/category/${category.slug}`}
                                className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-background hover:text-accent"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
