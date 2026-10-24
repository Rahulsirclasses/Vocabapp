import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUserWord extends Document {
    user_id: string // Linking to NextAuth User ID (string or ObjectId)
    word_id: mongoose.Types.ObjectId
    is_favorite: boolean
    times_reviewed: number
    last_reviewed_at: Date | null
    mastery_level: number
    created_at: Date
}

const UserWordSchema = new Schema<IUserWord>(
    {
        user_id: { type: String, required: true, index: true },
        word_id: { type: Schema.Types.ObjectId, ref: "VocabWord", required: true },
        is_favorite: { type: Boolean, default: false },
        times_reviewed: { type: Number, default: 0 },
        last_reviewed_at: { type: Date, default: null },
        mastery_level: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } },
)

// Prevent OverwriteModelError
const UserWord: Model<IUserWord> =
    mongoose.models.UserWord || mongoose.model<IUserWord>("UserWord", UserWordSchema)

export default UserWord
