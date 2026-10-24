import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IVocabWord extends Document {
    word: string
    meaning: string
    synonyms: string[]
    antonyms: string[]
    example_sentence?: string
    difficulty_level: "easy" | "medium" | "hard"
    created_at: Date
}

const VocabWordSchema = new Schema<IVocabWord>(
    {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
        synonyms: { type: [String], default: [] },
        antonyms: { type: [String], default: [] },
        example_sentence: { type: String },
        difficulty_level: {
            type: String,
            enum: ["easy", "medium", "hard"],
            required: true,
        },
        created_at: { type: Date, default: Date.now },
    },
    { timestamps: { createdAt: "created_at", updatedAt: false } },
)

// Prevent OverwriteModelError
const VocabWord: Model<IVocabWord> =
    mongoose.models.VocabWord || mongoose.model<IVocabWord>("VocabWord", VocabWordSchema)

export default VocabWord
