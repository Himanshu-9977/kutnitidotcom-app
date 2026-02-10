// =============================================================================
// Article Skeleton Loading Component
// Skeleton loader matching ArticleCard layout
// =============================================================================

import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
            {/* Image Skeleton */}
            <Skeleton className="aspect-video w-full" />

            {/* Content Skeleton */}
            <div className="flex flex-1 flex-col gap-2 p-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                </div>

                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />

                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                <div className="mt-auto flex items-center justify-between pt-3">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-1">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function ArticleListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <ArticleSkeleton key={i} />
            ))}
        </div>
    );
}
