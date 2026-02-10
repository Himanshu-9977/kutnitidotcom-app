// =============================================================================
// Newsletter Form Component
// Email subscription form with validation and loading states
// =============================================================================

"use client";

import * as React from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface NewsletterFormProps {
    className?: string;
}

export function NewsletterForm({ className }: NewsletterFormProps) {
    const [email, setEmail] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Thanks for subscribing! Check your email to confirm.");
            setEmail("");
        }, 1500);
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                        required
                    />
                </div>
                <Button type="submit" disabled={loading} className="shrink-0">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subscribing...
                        </>
                    ) : (
                        "Subscribe"
                    )}
                </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
                Get the latest articles delivered to your inbox. Unsubscribe anytime.
            </p>
        </form>
    );
}
