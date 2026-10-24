import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DailyChallenge from "@/components/daily-challenge"
import dbConnect from "@/lib/db"
import VocabWord from "@/lib/models/VocabWord"
import UserWord from "@/lib/models/UserWord"
import UserStats from "@/lib/models/UserStats"

export default async function DailyPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch user stats to check last activity
  const userStats = await UserStats.findOne({ user_id: session.user.id }).lean()

  // Fetch 5 random words for today's challenge
  // Using aggregation to get random documents
  const dailyWords = await VocabWord.aggregate([
    { $sample: { size: 5 } }
  ])

  // Fetch user progress for these words
  const wordIds = dailyWords.map(w => w._id)
  const userProgress = await UserWord.find({
    user_id: session.user.id,
    word_id: { $in: wordIds }
  }).lean()

  // Combine words with progress
  const wordsWithProgress = dailyWords.map((word) => {
    const progress = userProgress.find((up) => up.word_id.toString() === word._id.toString())

    return {
      id: word._id.toString(),
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
      <DailyChallenge
        words={wordsWithProgress}
        userId={session.user.id}
        currentStreak={userStats?.current_streak || 0}
        lastActivityDate={userStats?.last_activity_date}
      />
    </div>
  )
}
