// =============================================================================
// Pagination Component
// Reusable pagination controls for article lists
// =============================================================================

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string; // e.g., "/category/tech" or "/authors/john"
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i > 1 && pages[pages.length - 1] !== i - 1) {
            pages.push("...");
        }
        pages.push(i);
    }

    // Always show last page
    if (totalPages > 1) {
        if (pages[pages.length - 1] !== totalPages - 1) {
            pages.push("...");
        }
        pages.push(totalPages);
    }

    const getPageUrl = (page: number) => {
        return page === 1 ? baseUrl : `${baseUrl}?page=${page}`;
    };

    return (
        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
            {/* Previous Button */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                asChild={currentPage > 1}
            >
                {currentPage > 1 ? (
                    <Link prefetch={false} href={getPageUrl(currentPage - 1)} aria-label="Previous page">
                        <ChevronLeft className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronLeft className="h-4 w-4" />
                    </span>
                )}
            </Button>

            {/* Page Numbers */}
            <div className="flex gap-1">
                {pages.map((page, index) => {
                    if (page === "...") {
                        return (
                            <span key={`ellipsis-${index}`} className="flex h-9 w-9 items-center justify-center">
                                ...
                            </span>
                        );
                    }

                    const pageNum = page as number;
                    const isCurrentPage = pageNum === currentPage;

                    return (
                        <Button
                            key={pageNum}
                            variant={isCurrentPage ? "default" : "outline"}
                            size="icon"
                            asChild={!isCurrentPage}
                            disabled={isCurrentPage}
                            className="h-9 w-9"
                        >
                            {isCurrentPage ? (
                                <span>{pageNum}</span>
                            ) : (
                                <Link prefetch={false} href={getPageUrl(pageNum)} aria-label={`Go to page ${pageNum}`}>
                                    {pageNum}
                                </Link>
                            )}
                        </Button>
                    );
                })}
            </div>

            {/* Next Button */}
            <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                asChild={currentPage < totalPages}
            >
                {currentPage < totalPages ? (
                    <Link prefetch={false} href={getPageUrl(currentPage + 1)} aria-label="Next page">
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                ) : (
                    <span>
                        <ChevronRight className="h-4 w-4" />
                    </span>
                )}
            </Button>
        </nav>
    );
}
