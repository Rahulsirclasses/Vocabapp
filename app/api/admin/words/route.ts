import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import VocabWord from "@/lib/models/VocabWord"

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/words
 * Fetch paginated words
 */
export async function GET(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        await dbConnect()

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "50")
        const search = searchParams.get("search") || ""

        const skip = (page - 1) * limit

        const query: any = {}
        if (search) {
            query.word = { $regex: search, $options: "i" }
        }

        const sortBy = searchParams.get("sortBy") || "createdAt"
        const order = searchParams.get("order") === "asc" ? 1 : -1

        const sortOptions: any = {}
        if (sortBy === "word") sortOptions.word = order
        else sortOptions.created_at = order

        const words = await VocabWord.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await VocabWord.countDocuments(query)

        return NextResponse.json({
            words: words.map((w: any) => ({
                id: w._id.toString(),
                word: w.word,
                meaning: w.meaning,
                difficulty: w.difficulty_level,
                createdAt: w.created_at,
            })),
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        })

    } catch (error) {
        console.error("Error fetching words:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

/**
 * POST /api/admin/words
 * Create single or bulk words
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const body = await req.json()
        await dbConnect()

        // Handle Bulk Insert
        if (Array.isArray(body)) {
            console.log(`📥 Received bulk import request with ${body.length} items`)

            // Normalize and validate
            const normalizedWords = body.map((item: any, index: number) => {
                if (!item.word || !item.meaning) {
                    throw new Error(`Item at index ${index} is missing 'word' or 'meaning'`)
                }

                // Allow 'difficulty' alias for 'difficulty_level'
                let diff = item.difficulty_level || item.difficulty || "medium"

                // Normalize difficulty
                if (diff.toLowerCase().includes("easy")) diff = "easy"
                else if (diff.toLowerCase().includes("hard")) diff = "hard"
                else diff = "medium"

                return {
                    word: item.word,
                    meaning: item.meaning,
                    difficulty_level: diff,
                    synonyms: item.synonyms || [],
                    antonyms: item.antonyms || [],
                    example_sentence: item.example_sentence,
                    created_at: new Date()
                }
            })

            // Filter out existing words to prevent duplicates
            const wordsToInsert = []
            let duplicatesCount = 0

            for (const wordObj of normalizedWords) {
                const existing = await VocabWord.findOne({ word: { $regex: new RegExp(`^${wordObj.word}$`, "i") } })
                if (!existing) {
                    wordsToInsert.push(wordObj)
                } else {
                    duplicatesCount++
                }
            }

            let words = []
            if (wordsToInsert.length > 0) {
                words = await VocabWord.insertMany(wordsToInsert)
            }

            console.log(`✅ Bulk: Added ${words.length}, Skipped ${duplicatesCount} duplicates`)

            return NextResponse.json({
                success: true,
                count: words.length,
                duplicates: duplicatesCount,
                message: `Added ${words.length} words, skipped ${duplicatesCount} duplicates`
            })
        }

        // Handle Single Insert
        const { word, meaning, synonyms, antonyms, example_sentence, difficulty_level } = body

        // Check for duplicate
        const existing = await VocabWord.findOne({ word: { $regex: new RegExp(`^${word}$`, "i") } })
        if (existing) {
            return NextResponse.json({ error: "Word already exists" }, { status: 409 })
        }

        const newWord = await VocabWord.create({
            word,
            meaning,
            synonyms: synonyms || [],
            antonyms: antonyms || [],
            example_sentence,
            difficulty_level,
            created_at: new Date()
        })

        return NextResponse.json({
            success: true,
            word: {
                id: newWord._id.toString(),
                word: newWord.word
            },
            message: "Word added successfully"
        })

    } catch (error: any) {
        console.error("❌ Error creating word(s):", error)
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: error.errors // Mongoose validation errors
        }, { status: 500 })
    }
}
