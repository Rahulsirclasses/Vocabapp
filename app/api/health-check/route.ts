
import { NextResponse } from "next/server"
import mongoose from "mongoose"

export const dynamic = 'force-dynamic'

export async function GET() {
    const uri = process.env.MONGODB_URI
    const url = process.env.NEXTAUTH_URL
    const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

    // Test DB Connection
    let dbStatus = "Not Connected"
    let dbError = null

    if (uri) {
        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
            dbStatus = "Connected! ✅"
        } catch (e: any) {
            dbStatus = "Connection Failed ❌"
            dbError = e.message
        }
    }

    return NextResponse.json({
        status: "alive",
        env: {
            has_mongo_uri: !!uri,
            mongo_uri_preview: uri ? uri.substring(0, 20) + "..." : "missing",
            nextauth_url: url || "missing",
            has_secret: !!secret,
        },
        database: {
            status: dbStatus,
            error: dbError
        }
    })
}
