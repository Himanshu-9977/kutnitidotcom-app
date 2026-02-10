// =============================================================================
// Category Header Component
// Header for category and tag archive pages
// =============================================================================

import Image from "next/image";

import { Badge } from "@/components/ui/badge";

interface CategoryHeaderProps {
    name: string;
    description?: string | null;
    coverUrl?: string | null;
    articleCount?: number;
    type?: "category" | "tag";
}

export function CategoryHeader({
    name,
    description,
    coverUrl,
    articleCount,
    type = "category",
}: CategoryHeaderProps) {
    return (
        <div className="relative overflow-hidden bg-muted">
            {/* Background Image with Overlay */}
            {coverUrl && (
                <div className="absolute inset-0">
                    <Image

                        src={coverUrl}
                        alt={name}
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <Badge variant="secondary" className="mb-4">
                    {type === "category" ? "Category" : "Tag"}
                </Badge>

                <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    {name}
                </h1>

                {description && (
                    <p className="mx-auto mb-4 max-w-2xl text-lg text-muted-foreground">
                        {description}
                    </p>
                )}

                {articleCount !== undefined && (
                    <p className="text-sm text-muted-foreground">
                        {articleCount} {articleCount === 1 ? "article" : "articles"}
                    </p>
                )}
            </div>
        </div>
    );
}
