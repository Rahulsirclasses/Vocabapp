import { auth } from "@/auth"
import { redirect } from "next/navigation"
import FlashcardLearning from "@/components/flashcard-learning"
import dbConnect from "@/lib/db"
import VocabWord from "@/lib/models/VocabWord"
import UserWord from "@/lib/models/UserWord"

export default async function LearnPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch vocabulary words (limit to 100 for performance)
  const allVocabWords = await VocabWord.find()
    .sort({ created_at: 1 })
    .limit(100)
    .lean()
    .exec()

  console.log("[MongoDB] Total words fetched:", allVocabWords.length)

  if (allVocabWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-red-400">No vocabulary words found. Please add some words first.</p>
        </div>
      </div>
    )
  }

  // Fetch user progress
  const userProgress = await UserWord.find({ user_id: session.user.id })
    .lean()
    .exec()

  // Create a Map for O(1) lookup
  const userProgressMap = new Map(
    userProgress.map((up) => [up.word_id.toString(), up])
  )

  // Combine vocab words with user progress
  const wordsWithProgress = allVocabWords.map((word) => {
    const wordId = word._id.toString()
    const progress = userProgressMap.get(wordId)

    return {
      id: wordId,
      word: word.word,
      meaning: word.meaning,
      synonyms: word.synonyms,
      antonyms: word.antonyms,
      example_sentence: word.example_sentence,
      difficulty_level: word.difficulty_level,
      created_at: word.created_at,
      user_progress: progress ? {
        id: progress._id.toString(),
        user_id: progress.user_id,
        word_id: progress.word_id.toString(),
        is_favorite: progress.is_favorite,
        times_reviewed: progress.times_reviewed,
        last_reviewed_at: progress.last_reviewed_at,
        mastery_level: progress.mastery_level,
      } : null,
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FlashcardLearning words={wordsWithProgress} userId={session.user.id} />
    </div>
  )
}
