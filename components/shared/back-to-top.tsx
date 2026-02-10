// =============================================================================
// Back to Top Button
// Scroll to top button that appears after scrolling down
// =============================================================================

"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackToTop() {
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        const toggleVisible = () => {
            const scrolled = document.documentElement.scrollTop;
            setVisible(scrolled > 300);
        };

        window.addEventListener("scroll", toggleVisible);
        return () => window.removeEventListener("scroll", toggleVisible);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    if (!visible) return null;

    return (
        <Button
            onClick={scrollToTop}
            size="icon"
            className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg transition-opacity hover:shadow-xl"
            aria-label="Back to top"
        >
            <ArrowUp className="h-5 w-5" />
        </Button>
    );
}
