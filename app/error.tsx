// =============================================================================
// Global Error Boundary
// Catches runtime errors in the application
// =============================================================================

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="space-y-6 max-w-md">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                    <AlertTriangle className="h-10 w-10 text-destructive" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We apologize for the inconvenience. An unexpected error occurred while processing your request.
                    </p>
                </div>

                <div className="flex justify-center">
                    <Button onClick={reset} size="lg" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </Button>
                </div>

                {process.env.NODE_ENV === "development" && (
                    <div className="mt-8 overflow-auto rounded-md bg-muted p-4 text-left text-xs font-mono">
                        <p className="font-bold text-destructive">Error Details:</p>
                        <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
                        {error.digest && <p className="mt-2 text-muted-foreground">Digest: {error.digest}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
