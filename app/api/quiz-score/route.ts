import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import UserStats from "@/lib/models/UserStats"

export const dynamic = 'force-dynamic'

// POST - Save quiz score
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { score, total, mode } = body

        if (typeof score !== 'number' || typeof total !== 'number' || !mode) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 })
        }

        await dbConnect()

        const newScore = {
            date: new Date(),
            score,
            total,
            mode
        }

        // Upsert user stats and add quiz score
        const updatedStats = await UserStats.findOneAndUpdate(
            { user_id: session.user.id },
            {
                $push: { quiz_scores: newScore },
                $setOnInsert: {
                    user_id: session.user.id,
                    total_words_learned: 0,
                    current_streak: 0,
                    longest_streak: 0,
                    last_activity_date: null,
                }
            },
            { upsert: true, new: true }
        ).lean()

        return NextResponse.json({ success: true, stats: updatedStats })
    } catch (error) {
        console.error("Error saving quiz score:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// GET - Fetch user stats
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await dbConnect()

        const stats = await UserStats.findOne({ user_id: session.user.id }).lean()

        return NextResponse.json(stats || null)
    } catch (error) {
        console.error("Error fetching stats:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
