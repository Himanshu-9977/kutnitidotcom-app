// =============================================================================
// Breadcrumbs Component
// Navigation aid showing current page hierarchy
// =============================================================================

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground sm:gap-2.5">
                <li className="inline-flex items-center">
                    <Link href="/" className="inline-flex items-center hover:text-foreground">
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Link>
                </li>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <Fragment key={index}>
                            <li aria-hidden="true">
                                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            </li>
                            <li>
                                {isLast || !item.href ? (
                                    <span className="font-medium text-foreground" aria-current="page">
                                        {item.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
