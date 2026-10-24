import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export const dynamic = 'force-dynamic'

/**
 * POST /api/auth/google-signin
 * Handle Google OAuth user creation/lookup
 * Called from auth.ts signIn callback
 */
import rateLimit from "@/lib/rate-limit"

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
        try {
            await limiter.check(10, ip) // 10 requests per minute per IP (slightly higher for OAuth)
        } catch {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            )
        }

        const { email, name, image } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        await dbConnect()

        // Check if user exists
        let user = await User.findOne({ email })

        if (!user) {
            // Create new user
            user = await User.create({
                name,
                email,
                image,
                role: "user",
                isActive: true,
                isApproved: false, // Default false, requires admin approval
            })
            console.log("✅ Created new user via Google OAuth (Pending Approval):", email)
        } else {
            console.log("✅ Existing user logged in via Google OAuth:", email)
        }

        return NextResponse.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            isActive: user.isActive,
            isApproved: user.isApproved,
        })
    } catch (error) {
        console.error("Error in Google OAuth sign-in:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
