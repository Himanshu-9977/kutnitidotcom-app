import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware in Next.js runs in Edge Runtime and cannot use Node.js modules
// Auth protection is now handled at the page level using server components
export async function middleware(request: NextRequest) {
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
