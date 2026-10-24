import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IResetToken extends Document {
    email: string
    token: string
    expiresAt: Date
    createdAt: Date
}

const ResetTokenSchema = new Schema<IResetToken>({
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now, expires: 3600 } // Auto document destruction after 1 hour
})

const ResetToken: Model<IResetToken> = mongoose.models.ResetToken || mongoose.model<IResetToken>("ResetToken", ResetTokenSchema)

export default ResetToken
