import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = [
        "/auth/login",
        "/auth/signup",
        "/auth/forgot-password",
        "/auth/reset-password",
        "/verify-email",
        "/access-disabled",
        "/unauthorized",
        "/auth/pending",
    ]

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

    if (isPublicRoute) {
        return NextResponse.next()
    }

    // Protected routes - require authentication
    const session = await auth()

    // No session → redirect to login
    if (!session?.user) {
        const loginUrl = new URL("/auth/login", request.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Check isActive - disabled users are blocked
    if (session.user.isActive === false) {
        if (pathname !== "/access-disabled") {
            return NextResponse.redirect(new URL("/access-disabled", request.url))
        }
        return NextResponse.next()
    }



    // Check admin routes - only admins can access /admin/*
    if (pathname.startsWith("/admin")) {
        if (session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
    }

    // All checks passed
    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (except /api/admin/*)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        "/((?!api(?!/admin)|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
