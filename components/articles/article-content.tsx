// =============================================================================
// Article Content Component
// Formatted article body with typography styling
// =============================================================================

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleContentProps {
    content: string;
    className?: string;
}

export function ArticleContent({ content, className = "" }: ArticleContentProps) {
    return (
        <article
            className={`prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted prose-pre:border prose-pre:border-border ${className}`}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
    );
}
