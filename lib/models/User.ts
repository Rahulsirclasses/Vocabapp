
import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
    name?: string
    email: string
    password?: string // For credentials auth
    image?: string

    // Authorization fields
    role: "user" | "admin"
    isActive: boolean // Admin can toggle access on/off
    isApproved: boolean // Requires admin approval to login

    created_at: Date
    updated_at: Date
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String },
        image: { type: String },

        // Authorization fields
        role: { type: String, enum: ["user", "admin"], default: "user" },
        isActive: { type: Boolean, default: true }, // Active by default, but blocked by isApproved
        isApproved: { type: Boolean, default: false }, // Default false, requires admin approval
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
)

// Prevent OverwriteModelError
const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
