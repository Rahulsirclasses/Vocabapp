const mongoose = require("mongoose")
const { Schema } = mongoose

// Define schema inline to avoid import issues in standalone script
const VocabWordSchema = new Schema(
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

const VocabWord = mongoose.models.VocabWord || mongoose.model("VocabWord", VocabWordSchema)

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable")
    process.exit(1)
}

const initialWords = [
    {
        word: "Ephemeral",
        meaning: "Lasting for a very short time.",
        synonyms: ["Transitory", "Fleeting", "Short-lived"],
        antonyms: ["Permanent", "Enduring", "Eternal"],
        example_sentence: "The beauty of the sunset was ephemeral, disappearing as quickly as it had arrived.",
        difficulty_level: "medium",
    },
    {
        word: "Serendipity",
        meaning: "The occurrence and development of events by chance in a happy or beneficial way.",
        synonyms: ["Chance", "Luck", "Providence"],
        antonyms: ["Misfortune", "Bad luck"],
        example_sentence: "It was pure serendipity that we met properly at the coffee shop.",
        difficulty_level: "hard",
    },
    {
        word: "Resilient",
        meaning: "Able to withstand or recover quickly from difficult conditions.",
        synonyms: ["Strong", "Tough", "Hardy"],
        antonyms: ["Fragile", "Weak", "Vulnerable"],
        example_sentence: "She is a resilient girl who never gives up.",
        difficulty_level: "easy",
    },
]

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("Connected to MongoDB")

        await VocabWord.deleteMany({}) // Clear existing
        console.log("Cleared existing words")

        await VocabWord.insertMany(initialWords)
        console.log(`Seeded ${initialWords.length} words`)

        process.exit(0)
    } catch (error) {
        console.error("Error seeding database:", error)
        process.exit(1)
    }
}

seed()
