import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import UserStats from "@/lib/models/UserStats"

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { current_streak, last_activity_date, words_learned_today } = body

        await dbConnect()

        // Upsert user stats
        const updatedStats = await UserStats.findOneAndUpdate(
            { user_id: session.user.id },
            {
                $set: {
                    current_streak,
                    last_activity_date: last_activity_date ? new Date(last_activity_date) : new Date(),
                },
                $max: { longest_streak: current_streak },
                $inc: { total_words_learned: words_learned_today || 0 }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean()

        return NextResponse.json(updatedStats)
    } catch (error) {
        console.error("Error updating user streak:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
