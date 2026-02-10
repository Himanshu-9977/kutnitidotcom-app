// =============================================================================
// Strapi API Client
// Server-only typed fetch wrapper. Never imported from client components.
// Handles auth headers, error handling, and Next.js cache configuration.
// =============================================================================

import { STRAPI_URL, STRAPI_API_TOKEN, DEFAULT_REVALIDATE } from "@/lib/constants";
import type { StrapiResponse, StrapiSingleResponse } from "@/lib/types/strapi";

interface FetchOptions {
  /** Strapi REST API query string (without leading ?) */
  query?: string;
  /** Next.js revalidation interval in seconds. Defaults to DEFAULT_REVALIDATE. */
  revalidate?: number;
  /** Next.js cache tags for on-demand revalidation */
  tags?: string[];
}

/**
 * Low-level fetch wrapper for Strapi REST API.
 * All data fetching flows through this single function.
 */
async function fetchStrapi<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { query, revalidate = DEFAULT_REVALIDATE, tags } = options;

  const url = `${STRAPI_URL}/api${endpoint}${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${STRAPI_API_TOKEN}`,
    },
    next: {
      revalidate,
      tags,
    },
  });

  if (!res.ok) {
    throw new Error(
      `Strapi fetch failed: ${res.status} ${res.statusText} — ${url}`
    );
  }

  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Public helpers — used by lib/strapi/queries.ts
// ---------------------------------------------------------------------------

/** Fetch a collection (list) from Strapi */
export async function fetchCollection<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<StrapiResponse<T>> {
  return fetchStrapi<StrapiResponse<T>>(endpoint, options);
}

/** Fetch a single entity from Strapi */
export async function fetchSingle<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<StrapiSingleResponse<T>> {
  return fetchStrapi<StrapiSingleResponse<T>>(endpoint, options);
}
