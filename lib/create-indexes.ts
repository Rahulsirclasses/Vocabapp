import mongoose from "mongoose"
import dbConnect from "./db"
import VocabWord from "./models/VocabWord"
import UserWord from "./models/UserWord"
import UserStats from "./models/UserStats"
import User from "./models/User"

/**
 * Create database indexes for faster queries
 * Run this once to optimize database performance
 */
export async function createIndexes() {
    try {
        await dbConnect()

        console.log("Creating database indexes...")

        // VocabWord indexes
        await VocabWord.collection.createIndex({ word: 1 })
        await VocabWord.collection.createIndex({ difficulty_level: 1 })
        await VocabWord.collection.createIndex({ created_at: -1 })

        // UserWord indexes
        await UserWord.collection.createIndex({ user_id: 1, word_id: 1 }, { unique: true })
        await UserWord.collection.createIndex({ user_id: 1, is_favorite: 1 })
        await UserWord.collection.createIndex({ user_id: 1, last_reviewed_at: -1 })

        // UserStats indexes
        await UserStats.collection.createIndex({ user_id: 1 }, { unique: true })

        // User indexes
        await User.collection.createIndex({ email: 1 }, { unique: true })

        console.log("✅ All indexes created successfully!")
        return true
    } catch (error) {
        console.error("❌ Error creating indexes:", error)
        return false
    }
}
