// =============================================================================
// Mobile Navigation
// Slide-in drawer navigation for mobile devices
// =============================================================================

"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SITE_NAME } from "@/lib/constants";

interface MobileNavProps {
    categories?: Array<{ name: string; slug: string }>;
}

export function MobileNav({ categories = [] }: MobileNavProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] text-center">
                <SheetHeader>
                    <SheetTitle>{SITE_NAME}</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col space-y-4">
                    <Link prefetch={false}
                        href="/"
                        onClick={() => setOpen(false)}
                        className="text-lg font-medium transition-colors hover:text-primary"
                    >
                        Home
                    </Link>

                    {categories.length > 0 && (
                        <>
                            <div className="pt-4">
                                <p className="mb-2 text-sm font-semibold text-muted-foreground">
                                    Categories
                                </p>
                                <div className="flex flex-col space-y-3 pl-4">
                                    {categories.map((category) => (
                                        <Link prefetch={false}
                                            key={category.slug}
                                            href={`/category/${category.slug}`}
                                            onClick={() => setOpen(false)}
                                            className="font-medium transition-colors hover:text-primary"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
