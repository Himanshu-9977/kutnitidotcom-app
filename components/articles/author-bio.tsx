// =============================================================================
// Author Bio Component
// Author information card for article pages
// ============================================================================

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface AuthorBioProps {
    name: string;
    slug: string;
    bio: string | null;
    avatarUrl: string | null;
}

export function AuthorBio({ name, slug, bio, avatarUrl }: AuthorBioProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col gap-6 sm:flex-row">
                    <Link prefetch={false} href={`/authors/${slug}`} className="shrink-0">
                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                            {avatarUrl && (
                                <AvatarImage src={avatarUrl} alt={name} />
                            )}
                            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                {name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Written by</p>
                            <Link prefetch={false} href={`/authors/${slug}`} className="group">
                                <h3 className="text-2xl font-bold text-foreground transition-colors group-hover:text-primary">
                                    {name}
                                </h3>
                            </Link>
                        </div>

                        {bio && (
                            <p className="text-muted-foreground leading-relaxed">
                                {bio}
                            </p>
                        )}

                        <Button variant="outline" size="sm" asChild>
                            <Link prefetch={false} href={`/authors/${slug}`} className="group">
                                View all articles
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
