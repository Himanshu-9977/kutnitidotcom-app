import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Next.js middleware — must be named middleware.ts with export function middleware.
// This replaces the incorrectly named proxy.ts / export function proxy convention.
// For now, pass all requests through. Auth checks are done per-page in server components.
export function middleware(request: NextRequest) {
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
