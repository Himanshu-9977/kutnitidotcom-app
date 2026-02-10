// =============================================================================
// Content Pagination
// Server-component-friendly pagination using search params (not client state).
// Works with Strapi's pagination metadata.
// =============================================================================

import Link from "next/link";

interface ContentPaginationProps {
    currentPage: number;
    pageCount: number;
    /** Base path without query string, e.g. "/category/tech" */
    basePath: string;
}

export function ContentPagination({
    currentPage,
    pageCount,
    basePath,
}: ContentPaginationProps) {
    if (pageCount <= 1) return null;

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-8">
            {currentPage > 1 && (
                <Link
                    href={`${basePath}?page=${currentPage - 1}`}
                    className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Previous
                </Link>
            )}
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
                <Link
                    key={page}
                    href={`${basePath}?page=${page}`}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${page === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "border border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                >
                    {page}
                </Link>
            ))}
            {currentPage < pageCount && (
                <Link
                    href={`${basePath}?page=${currentPage + 1}`}
                    className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                    Next
                </Link>
            )}
        </nav>
    );
}
