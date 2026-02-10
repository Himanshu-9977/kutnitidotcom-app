// =============================================================================
// On-demand ISR revalidation endpoint — POST /api/revalidate
// Called by Strapi webhooks when content is published/unpublished.
// Secured with a shared secret token.
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { REVALIDATE_SECRET } from "@/lib/constants";

interface StrapiWebhookPayload {
  event: string;
  model: string;
  entry: {
    id: number;
    slug?: string;
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  // Verify secret
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as StrapiWebhookPayload;
    const { model, entry } = body;

    // Revalidate based on which content type was changed
    switch (model) {
      case "article":
        revalidateTag("articles", "max");
        revalidateTag("featured", "max");
        if (entry.slug) {
          revalidateTag(`article-${entry.slug}`, "max");
        }
        break;
      case "category":
        revalidateTag("categories", "max");
        if (entry.slug) {
          revalidateTag(`category-${entry.slug}`, "max");
        }
        break;
      case "author":
        revalidateTag("authors", "max");
        if (entry.slug) {
          revalidateTag(`author-${entry.slug}`, "max");
        }
        break;
      case "tag":
        revalidateTag("tags", "max");
        if (entry.slug) {
          revalidateTag(`tag-${entry.slug}`, "max");
        }
        break;
      default:
        break;
    }

    return NextResponse.json({
      revalidated: true,
      model,
      slug: entry.slug ?? null,
      timestamp: Date.now(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
