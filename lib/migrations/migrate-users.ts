import mongoose from "mongoose"

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/word-wiz"

async function migrateUsers() {
    try {
        console.log("🔄 Starting user migration...")
        console.log("📡 Connecting to MongoDB:", MONGODB_URI)

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI)
        console.log("✅ Connected to MongoDB")

        // Get the User collection
        const db = mongoose.connection.db
        if (!db) {
            throw new Error("Database connection not established")
        }

        const usersCollection = db.collection("users")

        // Count existing users
        const userCount = await usersCollection.countDocuments()
        console.log(`📊 Found ${userCount} users in database`)

        if (userCount === 0) {
            console.log("ℹ️  No users to migrate")
            await mongoose.connection.close()
            process.exit(0)
        }

        // Update all users to add new fields
        const result = await usersCollection.updateMany(
            {},
            [
                {
                    $set: {
                        role: { $ifNull: ["$role", "user"] },
                        isActive: { $ifNull: ["$isActive", true] },
                        isEmailVerified: { $ifNull: ["$isEmailVerified", false] },
                    },
                },
            ]
        )

        console.log(`✅ Migration complete!`)
        console.log(`   - Matched: ${result.matchedCount} users`)
        console.log(`   - Modified: ${result.modifiedCount} users`)
        console.log(`   - All users now have: role, isActive, isEmailVerified fields`)
        console.log(`   - Note: isEmailVerified is set to FALSE for existing users`)

        // Close connection
        await mongoose.connection.close()
        console.log("✅ Database connection closed")
        process.exit(0)
    } catch (error) {
        console.error("❌ Migration failed:", error)
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close()
        }
        process.exit(1)
    }
}

// Run migration
migrateUsers()
