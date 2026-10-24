import { createIndexes } from "../lib/create-indexes"

/**
 * Run this script to create database indexes
 * This will significantly improve query performance
 * 
 * Usage: npx tsx scripts/setup-indexes.ts
 */

async function main() {
    console.log("🚀 Setting up database indexes...")
    await createIndexes()
    console.log("✅ Done!")
    process.exit(0)
}

main().catch((error) => {
    console.error("❌ Error:", error)
    process.exit(1)
})
