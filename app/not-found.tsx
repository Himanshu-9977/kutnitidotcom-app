// =============================================================================
// Not Found Page — 404
// Custom 404 error page with helpful links
// =============================================================================

import Link from "next/link";
import { GoBackButton } from "@/components/shared/go-back-button";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="space-y-6 max-w-md">
        <h1 className="text-9xl font-bold tracking-tighter text-primary/20">404</h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link prefetch={false} href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <GoBackButton />
        </div>
      </div>
    </div>
  );
}
