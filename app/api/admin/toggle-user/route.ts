import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/toggle-user
 * Toggle user's isActive status (admin only)
 */
export async function POST(req: NextRequest) {
    try {
        const session = await auth()

        // Check if user is admin
        if (!session?.user || session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Unauthorized - Admin access required" },
                { status: 403 }
            )
        }

        const { userId, isActive, isApproved } = await req.json()

        // Validate input: userId is always required.
        // isActive and isApproved are optional, but if provided, must be booleans.
        if (!userId ||
            (isActive !== undefined && typeof isActive !== "boolean") ||
            (isApproved !== undefined && typeof isApproved !== "boolean")
        ) {
            return NextResponse.json(
                { error: "Invalid request - userId is required, isActive and isApproved must be booleans if provided" },
                { status: 400 }
            )
        }

        await dbConnect()

        // Prepare update object, only include fields that are explicitly provided
        const updateFields: { isActive?: boolean; isApproved?: boolean } = {};
        if (isActive !== undefined) {
            updateFields.isActive = isActive;
        }
        if (isApproved !== undefined) {
            updateFields.isApproved = isApproved;
        }

        // If no update fields are provided, return an error
        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json(
                { error: "No valid update fields provided (isActive or isApproved)" },
                { status: 400 }
            );
        }

        // Update user status
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            )
        }

        console.log(`✅ Admin ${session.user.email} ${isActive ? 'enabled' : 'disabled'} user ${updatedUser.email}`)

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                isActive: updatedUser.isActive,
                isApproved: updatedUser.isApproved,
            }
        })
    } catch (error) {
        console.error("Error toggling user status:", error)
        return NextResponse.json(
            { error: "Failed to update user status" },
            { status: 500 }
        )
    }
}
