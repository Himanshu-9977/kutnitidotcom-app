// =============================================================================
// Author Header Component
// Profile header for author pages
// =============================================================================

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Twitter, Facebook, Linkedin, Globe, MapPin } from "lucide-react";

interface AuthorHeaderProps {
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    articleCount?: number;
    socialLinks?: Array<{ platform: string; url: string }>;
    location?: string;
    website?: string;
}

export function AuthorHeader({
    name,
    bio,
    avatarUrl,
    articleCount,
    socialLinks = [],
    location,
    website,
}: AuthorHeaderProps) {
    const getSocialIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case "twitter":
            case "x":
                return <Twitter className="h-4 w-4" />;
            case "facebook":
                return <Facebook className="h-4 w-4" />;
            case "linkedin":
                return <Linkedin className="h-4 w-4" />;
            default:
                return <Globe className="h-4 w-4" />;
        }
    };

    return (
        <div className="bg-muted/30 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-8">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg mb-6 sm:mb-0">
                        {avatarUrl && (
                            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
                        )}
                        <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                            {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                {name}
                            </h1>
                            {articleCount !== undefined && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {articleCount} {articleCount === 1 ? "article" : "articles"} published
                                </p>
                            )}
                        </div>

                        {bio && (
                            <p className="max-w-xl text-lg text-muted-foreground">
                                {bio}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                            {location && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="mr-1.5 h-4 w-4" />
                                    {location}
                                </div>
                            )}

                            {website && (
                                <Link prefetch={false}
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-sm font-medium text-primary hover:underline"
                                >
                                    <Globe className="mr-1.5 h-4 w-4" />
                                    Website
                                </Link>
                            )}

                            {socialLinks.length > 0 && (
                                <div className="flex gap-2">
                                    {socialLinks.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                            asChild
                                        >
                                            <a
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`Follow ${name} on ${link.platform}`}
                                            >
                                                {getSocialIcon(link.platform)}
                                            </a>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
