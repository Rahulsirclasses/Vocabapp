import mongoose, { Schema, type Document, type Model } from "mongoose"

interface QuizScore {
    date: Date
    score: number
    total: number
    mode: "meaning" | "synonym" | "antonym" | "mixed"
}

export interface IUserStats extends Document {
    user_id: string
    total_words_learned: number
    current_streak: number
    longest_streak: number
    last_activity_date: Date | null
    quiz_scores: QuizScore[]
    created_at: Date
    updated_at: Date
}

const QuizScoreSchema = new Schema<QuizScore>({
    date: { type: Date, default: Date.now },
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    mode: {
        type: String,
        enum: ["meaning", "synonym", "antonym", "mixed"],
        required: true,
    },
})

const UserStatsSchema = new Schema<IUserStats>(
    {
        user_id: { type: String, required: true, unique: true },
        total_words_learned: { type: Number, default: 0 },
        current_streak: { type: Number, default: 0 },
        longest_streak: { type: Number, default: 0 },
        last_activity_date: { type: Date, default: null },
        quiz_scores: [QuizScoreSchema],
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
)

// Prevent OverwriteModelError
const UserStats: Model<IUserStats> =
    mongoose.models.UserStats || mongoose.model<IUserStats>("UserStats", UserStatsSchema)

export default UserStats
