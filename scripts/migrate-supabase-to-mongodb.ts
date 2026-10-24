import { createClient } from "@supabase/supabase-js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({ path: '.env.local' })

// Mongoose Models - only need VocabWord for app data
import VocabWord from "../lib/models/VocabWord"

const MONGODB_URI = process.env.MONGODB_URI!
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!MONGODB_URI || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error("Missing environment variables. Check .env.local")
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
})

// Helper: fetch ALL rows from a Supabase table using pagination
async function fetchAllRows(tableName: string) {
    const PAGE_SIZE = 1000
    let allRows: any[] = []
    let offset = 0
    let hasMore = true

    while (hasMore) {
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .range(offset, offset + PAGE_SIZE - 1)

        if (error) throw error
        if (!data || data.length === 0) {
            hasMore = false
        } else {
            allRows = allRows.concat(data)
            console.log(`  Fetched ${allRows.length} rows so far from "${tableName}"...`)
            offset += PAGE_SIZE
            if (data.length < PAGE_SIZE) hasMore = false
        }
    }

    return allRows
}

async function migrateData() {
    let mongoConnection: typeof mongoose | null = null
    try {
        console.log("Connecting to MongoDB...")
        mongoConnection = await mongoose.connect(MONGODB_URI)
        console.log("Connected to MongoDB successfully.\n")

        // ── Migrate Vocab Words (with pagination) ──
        console.log("--- Migrating Vocab Words ---")
        const vocabWords = await fetchAllRows('vocab_words')
        console.log(`Total vocab words in Supabase: ${vocabWords.length}`)

        let wordsMigrated = 0
        let wordsSkipped = 0
        for (const word of vocabWords) {
            const result = await VocabWord.findOneAndUpdate(
                { word: word.word },
                {
                    $setOnInsert: {
                        meaning: word.meaning,
                        synonyms: word.synonyms || [],
                        antonyms: word.antonyms || [],
                        example_sentence: word.example_sentence,
                        difficulty_level: word.difficulty_level || 'medium',
                        created_at: word.created_at ? new Date(word.created_at) : new Date()
                    }
                },
                { upsert: true, new: true }
            ).lean()

            if (result) wordsMigrated++
            else wordsSkipped++
        }

        console.log(`\n✅ Done! ${wordsMigrated} vocab words now in MongoDB (${wordsSkipped} skipped).`)

    } catch (error) {
        console.error("\n❌ Migration failed:")
        console.error(error)
    } finally {
        if (mongoConnection) {
            await mongoose.disconnect()
            console.log("Disconnected from MongoDB.")
        }
        process.exit(0)
    }
}

migrateData()
