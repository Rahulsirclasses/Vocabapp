import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export const dynamic = 'force-dynamic'

/**
 * GET /api/auth/user-data?email=xxx
 * Fetch user data for JWT enrichment
 * Called from auth.ts jwt callback
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get("email")

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            )
        }

        await dbConnect()

        const user = await User.findOne({ email }).lean()

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            id: user._id.toString(),
            role: user.role,
            isActive: user.isActive,
            isApproved: user.isApproved,
        })
    } catch (error) {
        console.error("Error fetching user data:", error)
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 500 }
        )
    }
}
