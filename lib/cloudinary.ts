// =============================================================================
// Cloudinary Image Loader for next/image
// Custom loader that transforms Cloudinary URLs with on-the-fly optimization.
// Avoids Vercel Image Optimization billing entirely.
// =============================================================================

import { CLOUDINARY_CLOUD_NAME } from "@/lib/constants";

interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * next/image loader for Cloudinary.
 *
 * Usage:
 * ```tsx
 * <Image loader={cloudinaryLoader} src={coverUrl} width={800} height={450} alt="" />
 * ```
 *
 * If the src is already a full Cloudinary URL (from Strapi), it inserts transforms.
 * If it's a public ID, it constructs the full URL.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality = 80,
}: CloudinaryLoaderParams): string {
  // 1. Cloudinary URL (already full) — inject transforms
  if (src.includes("res.cloudinary.com")) {
    return src.replace(
      "/upload/",
      `/upload/w_${width},q_${quality},f_auto/`
    );
  }

  // 2. Relative path (from Strapi local upload) => Prepend Strapi URL
  if (src.startsWith("/")) {
    // Determine base URL (client-side fallback to localhost if env missing)
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";
    return `${baseUrl}${src}`;
  }

  // 3. Absolute URL (external) => Return as is
  if (src.startsWith("http")) {
    return src;
  }

  // 4. Cloudinary Public ID => Construct full URL
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},q_${quality},f_auto/${src}`;
}

/**
 * Build a raw Cloudinary URL with transforms (for og:image, structured data, etc.)
 */
export function cloudinaryUrl(
  src: string,
  transforms: string = "w_1200,q_80,f_auto"
): string {
  if (src.includes("res.cloudinary.com")) {
    return src.replace("/upload/", `/upload/${transforms}/`);
  }
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transforms}/${src}`;
}
