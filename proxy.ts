import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Proxy in Next.js 16 replaces the deprecated middleware convention
// It runs in Edge Runtime and is intended for routing, redirects, and header manipulation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function proxy(request: NextRequest) {
  // For now, just pass through all requests
  // Auth checks are performed in individual pages via server components
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\..*|public).*)",
  ],
}
