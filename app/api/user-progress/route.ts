import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import UserWord from "@/lib/models/UserWord"

export const dynamic = 'force-dynamic'

// GET user progress for a specific word or all words
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const wordId = searchParams.get("wordId")

        await dbConnect()

        if (wordId) {
            // Get progress for specific word
            const progress = await UserWord.findOne({
                user_id: session.user.id,
                word_id: wordId
            }).lean()

            return NextResponse.json(progress)
        } else {
            // Get all user progress
            const allProgress = await UserWord.find({
                user_id: session.user.id
            }).lean()

            return NextResponse.json(allProgress)
        }
    } catch (error) {
        console.error("Error fetching user progress:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

// POST/UPDATE user progress
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const { word_id, is_favorite, times_reviewed, mastery_level } = body

        await dbConnect()

        // Upsert user word progress
        const updatedProgress = await UserWord.findOneAndUpdate(
            { user_id: session.user.id, word_id },
            {
                $set: {
                    ...(is_favorite !== undefined && { is_favorite }),
                    ...(times_reviewed !== undefined && { times_reviewed }),
                    ...(mastery_level !== undefined && { mastery_level }),
                    last_reviewed_at: new Date(),
                },
                $setOnInsert: {
                    user_id: session.user.id,
                    word_id,
                }
            },
            { upsert: true, new: true }
        ).lean()

        return NextResponse.json(updatedProgress)
    } catch (error) {
        console.error("Error updating user progress:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
