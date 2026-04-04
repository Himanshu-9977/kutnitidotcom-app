"use client";

import * as React from "react";
import { Search as SearchIcon, Loader2, FileText, User, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getGlobalSearchIndex, GlobalSearchIndex } from "@/app/actions/search";
import Link from "next/link";

export function Search() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [isPending, setIsPending] = React.useState(false);
    const [searchIndex, setSearchIndex] = React.useState<GlobalSearchIndex | null>(null);

    // Fetch the index once when the dialog is opened
    React.useEffect(() => {
        if (open && !searchIndex) {
            let isMounted = true;
            setIsPending(true);

            getGlobalSearchIndex().then((data) => {
                if (isMounted) {
                    setSearchIndex(data);
                    setIsPending(false);
                }
            }).catch((err) => {
                console.error("Failed to load search index", err);
                if (isMounted) {
                    setIsPending(false);
                }
            });

            return () => {
                isMounted = false;
            };
        }
    }, [open, searchIndex]);

    // Reset query when dialog closes, but keep the index in memory for next time
    React.useEffect(() => {
        if (!open) {
            setQuery("");
        }
    }, [open]);

    // Perform local filtering
    const cleanQuery = query.trim().toLowerCase();

    const filteredResults = React.useMemo(() => {
        if (!searchIndex || !cleanQuery) return null;

        return {
            articles: searchIndex.articles.filter(
                (a) => a.title.toLowerCase().includes(cleanQuery) ||
                    (a.category && a.category.name.toLowerCase().includes(cleanQuery))
            ).slice(0, 5), // Cap results to 5 per category

            categories: searchIndex.categories.filter(
                (c) => c.name.toLowerCase().includes(cleanQuery)
            ).slice(0, 5),

            authors: searchIndex.authors.filter(
                (a) => a.name.toLowerCase().includes(cleanQuery)
            ).slice(0, 5),
        };
    }, [searchIndex, cleanQuery]);

    const hasResults = filteredResults && (
        filteredResults.articles.length > 0 ||
        filteredResults.categories.length > 0 ||
        filteredResults.authors.length > 0
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Search"
                >
                    <SearchIcon className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] gap-0 p-0 overflow-hidden bg-background/95 backdrop-blur-md border-muted/30">
                <DialogHeader className="px-4 py-4 border-b">
                    <DialogTitle className="sr-only">Search</DialogTitle>
                    <DialogDescription className="sr-only">
                        Search for articles, categories, and authors.
                    </DialogDescription>
                    <div className="relative flex items-center">
                        <SearchIcon className="absolute left-0 h-5 w-5 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search articles, categories, authors..."
                            className="bg-transparent border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-8 text-base shadow-none h-auto py-1"
                            autoComplete="off"
                        />
                        {isPending && (
                            <Loader2 className="absolute right-0 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto px-2 py-4 shadow-inner">
                    {!cleanQuery && !isPending && (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            Start typing to search...
                        </div>
                    )}

                    {!cleanQuery && isPending && (
                        <div className="text-center py-10 text-sm text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading search engine...
                        </div>
                    )}

                    {cleanQuery && !isPending && !hasResults && (
                        <div className="text-center py-10 text-sm text-muted-foreground">
                            No results found for &quot;{query}&quot;
                        </div>
                    )}

                    {hasResults && filteredResults && (
                        <div className="space-y-6">
                            {/* Articles */}
                            {filteredResults.articles.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Articles
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {filteredResults.articles.map((article) => (
                                            <Link prefetch={false}
                                                key={`article-${article.documentId}`}
                                                href={`/${article.slug}`}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex bg-primary/10 p-2 rounded-md text-primary">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground line-clamp-1">{article.title}</span>
                                                    {article.category && (
                                                        <span className="text-xs text-muted-foreground">in {article.category.name}</span>
                                                    )}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            {filteredResults.categories.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Categories
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {filteredResults.categories.map((category) => (
                                            <Link prefetch={false}
                                                key={`category-${category.documentId}`}
                                                href={`/category/${category.slug}`}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex bg-blue-500/10 p-2 rounded-md text-blue-500">
                                                    <Folder className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-foreground">{category.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Authors */}
                            {filteredResults.authors.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className="px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                                        Authors
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {filteredResults.authors.map((author) => (
                                            <Link prefetch={false}
                                                key={`author-${author.documentId}`}
                                                href={`/authors/${author.slug}`}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex bg-rose-500/10 p-2 rounded-md text-rose-500">
                                                    <User className="h-4 w-4" />
                                                </div>
                                                <span className="font-medium text-foreground">{author.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
