// =============================================================================
// Empty State Component
// Display for empty results or no content scenarios
// =============================================================================

import { Button } from "@/components/ui/button";
import { FileQuestion, Search, Inbox } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
    icon?: "search" | "inbox" | "notfound";
    title: string;
    description?: string;
    actionLabel?: string;
    actionHref?: string;
}

export function EmptyState({
    icon = "inbox",
    title,
    description,
    actionLabel,
    actionHref,
}: EmptyStateProps) {
    const Icon = icon === "search" ? Search : icon === "notfound" ? FileQuestion : Inbox;

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>

            <h3 className="mb-2 text-xl font-semibold text-foreground">
                {title}
            </h3>

            {description && (
                <p className="mb-6 max-w-sm text-muted-foreground">
                    {description}
                </p>
            )}

            {actionLabel && actionHref && (
                <Button asChild>
                    <Link href={actionHref}>
                        {actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}
