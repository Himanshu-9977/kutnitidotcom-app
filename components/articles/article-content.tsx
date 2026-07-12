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
            className={`prose prose-zinc mx-auto max-w-[720px] dark:prose-invert prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight prose-h2:mt-10 prose-h2:border-t prose-h2:border-border prose-h2:pt-6 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-[17px] prose-p:leading-8 sm:prose-p:text-lg prose-li:text-[17px] prose-li:leading-8 prose-strong:font-extrabold prose-strong:text-accent prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-secondary/45 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:not-italic prose-img:rounded-none prose-pre:border prose-pre:border-border prose-pre:bg-muted ${className}`}
        >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
    );
}
