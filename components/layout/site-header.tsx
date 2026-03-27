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
import { ChevronDown, LogIn } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "@/components/auth/user-menu";

export async function SiteHeader() {
    // Fetch categories for navigation
    const categoriesRes = await getCategories();
    const categories = categoriesRes.data.map((cat) => ({
        name: cat.name,
        slug: cat.slug,
    }));

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <MobileNav categories={categories} />
                    <Link href="/" className="text-xl font-bold font-serif tracking-tight text-foreground hover:text-primary transition-colors">
                        {SITE_NAME}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-6 md:flex">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Home
                    </Link>

                    {/* Categories Dropdown */}
                    {categories.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-auto p-0 text-sm font-medium text-muted-foreground hover:text-foreground">
                                    Categories
                                    <ChevronDown className="ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {categories.map((category) => (
                                    <DropdownMenuItem key={category.slug} asChild>
                                        <Link href={`/category/${category.slug}`} className="cursor-pointer">
                                            {category.name}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    <Search />
                    <ThemeToggle />
                    
                    {/* Auth Menu - Hydrates purely on the client */}
                    <AuthMenu />
                </nav>

                {/* Mobile Theme Toggle */}
                <div className="md:hidden">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
