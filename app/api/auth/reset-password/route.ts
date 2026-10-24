import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import ResetToken from "@/lib/models/ResetToken"
import crypto from "crypto"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const { email, token, password } = await req.json()

        if (!email || !token || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        await dbConnect()

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        // Verify token
        const resetRecord = await ResetToken.findOne({
            email,
            token: hashedToken,
            expiresAt: { $gt: new Date() } // Must not be expired
        })

        if (!resetRecord) {
            return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Update user
        await User.findOneAndUpdate(
            { email },
            { password: hashedPassword }
        )

        // Delete used token
        await resetRecord.deleteOne()

        return NextResponse.json({ success: true, message: "Password updated successfully" })
    } catch (error) {
        console.error("Reset password API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
