import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import ResetToken from "@/lib/models/ResetToken"
import crypto from "crypto"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        await dbConnect()

        const user = await User.findOne({ email }).lean()

        // Always return success to prevent email enumeration attacks
        if (!user) {
            return NextResponse.json({ success: true, message: "If an account exists, a reset link was generated." })
        }

        // Generate token
        const token = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        // Save token to DB via upsert
        await ResetToken.findOneAndUpdate(
            { email },
            {
                token: hashedToken,
                expiresAt: new Date(Date.now() + 3600000) // 1 hour 
            },
            { upsert: true }
        )

        // Construct reset URL
        const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`

        // Since Resend is removed, we return the URL directly in the response 
        // string so the frontend can display it to the user.
        return NextResponse.json({
            success: true,
            message: "Reset link generated.",
            resetUrl
        })
    } catch (error) {
        console.error("Forgot password API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
