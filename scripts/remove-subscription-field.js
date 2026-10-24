/**
 * Database Cleanup Script: Remove Subscription Field
 * 
 * This script removes the 'subscription' field from all user documents in MongoDB.
 * Run this after removing Razorpay integration to clean up existing data.
 * 
 * Usage:
 *   node scripts/remove-subscription-field.js
 */

const mongoose = require('mongoose')

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/word-wiz'

async function removeSubscriptionField() {
    try {
        console.log('🔌 Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        const db = mongoose.connection.db
        const usersCollection = db.collection('users')

        // Count users with subscription field
        const usersWithSubscription = await usersCollection.countDocuments({
            subscription: { $exists: true }
        })

        console.log(`📊 Found ${usersWithSubscription} users with subscription field`)

        if (usersWithSubscription === 0) {
            console.log('✅ No users have subscription field. Nothing to clean up.')
            await mongoose.connection.close()
            return
        }

        // Remove subscription field from all users
        const result = await usersCollection.updateMany(
            { subscription: { $exists: true } },
            { $unset: { subscription: "" } }
        )

        console.log(`✅ Successfully removed subscription field from ${result.modifiedCount} users`)

        // Verify cleanup
        const remainingUsers = await usersCollection.countDocuments({
            subscription: { $exists: true }
        })

        if (remainingUsers === 0) {
            console.log('✅ Cleanup verified - no users have subscription field')
        } else {
            console.warn(`⚠️ Warning: ${remainingUsers} users still have subscription field`)
        }

        await mongoose.connection.close()
        console.log('🔌 Disconnected from MongoDB')
    } catch (error) {
        console.error('❌ Error during cleanup:', error)
        process.exit(1)
    }
}

// Run the cleanup
removeSubscriptionField()
