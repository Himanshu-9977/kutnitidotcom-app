// =============================================================================
// Search Component (UI Only)
// Search trigger and dialog for future functionality
// =============================================================================

"use client";

import * as React from "react";
import { Search as SearchIcon } from "lucide-react";
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

export function Search() {
    const [open, setOpen] = React.useState(false);

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Search</DialogTitle>
                    <DialogDescription>
                        Search for articles, categories, and authors.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Type to search..."
                            className="pl-10"
                        />
                    </div>
                    <div className="flex h-20 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                        Search functionality coming soon
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
