"use client";

import * as React from "react";

export function LanguageSwitcher() {
    const [language, setLanguage] = React.useState("en");

    return (
        <label className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <span className="sr-only">Select language</span>
            <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2 text-xs font-semibold text-foreground outline-none transition-colors hover:border-accent focus:border-accent"
                aria-label="Select language"
            >
                <option value="en">English</option>
                <option value="ne">नेपाली</option>
            </select>
        </label>
    );
}
