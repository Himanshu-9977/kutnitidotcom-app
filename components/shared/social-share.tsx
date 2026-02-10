// =============================================================================
// Social Share Component
// Share buttons for articles (Twitter, Facebook, LinkedIn, Copy Link)
// =============================================================================

"use client";

import * as React from "react";
import { Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SocialShareProps {
    url: string;
    title: string;
    className?: string;
}

export function SocialShare({ url, title, className }: SocialShareProps) {
    const [copied, setCopied] = React.useState(false);

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className={className}>
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Share:</span>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        asChild
                    >
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Twitter"
                        >
                            <Twitter className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        asChild
                    >
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on Facebook"
                        >
                            <Facebook className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        asChild
                    >
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Share on LinkedIn"
                        >
                            <Linkedin className="h-4 w-4" />
                        </a>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleCopyLink}
                        aria-label="Copy link"
                    >
                        {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                        ) : (
                            <Link2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
