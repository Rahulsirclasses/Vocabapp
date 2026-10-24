import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { compare } from "bcryptjs"

export const dynamic = 'force-dynamic'

import rateLimit from "@/lib/rate-limit"

const limiter = rateLimit({
    interval: 60 * 1000, // 60 seconds
    uniqueTokenPerInterval: 500, // Max 500 users per second
})

export async function POST(req: NextRequest) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
        try {
            await limiter.check(5, ip) // 5 requests per minute per IP
        } catch {
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            )
        }

        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        await dbConnect()

        const user = await User.findOne({ email })

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 401 }
            )
        }

        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid password" },
                { status: 401 }
            )
        }

        // Return user data (without password)
        return NextResponse.json({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            isActive: user.isActive,
            isApproved: user.isApproved,
        })
    } catch (error) {
        console.error("Auth validation error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
