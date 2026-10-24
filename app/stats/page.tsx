import { auth } from "@/auth"
import { redirect } from "next/navigation"
import StatsOverview from "@/components/stats-overview"
import dbConnect from "@/lib/db"
import UserStats from "@/lib/models/UserStats"
import UserWord from "@/lib/models/UserWord"
import VocabWord from "@/lib/models/VocabWord"

export default async function StatsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch user stats
  const userStats = await UserStats.findOne({ user_id: session.user.id }).lean()

  // Fetch user word progress with populated vocab words
  const userWords = await UserWord.find({ user_id: session.user.id })
    .populate('word_id')
    .lean()
    .exec()

  // Fetch total vocab words count
  const totalWords = await VocabWord.countDocuments()

  // Format data for component
  const formattedUserWords = userWords.map((uw: any) => ({
    id: uw._id.toString(),
    user_id: uw.user_id,
    word_id: uw.word_id._id.toString(),
    is_favorite: uw.is_favorite,
    times_reviewed: uw.times_reviewed,
    last_reviewed_at: uw.last_reviewed_at,
    mastery_level: uw.mastery_level,
    created_at: uw.created_at,
    vocab_words: {
      id: uw.word_id._id.toString(),
      word: uw.word_id.word,
      meaning: uw.word_id.meaning,
      difficulty_level: uw.word_id.difficulty_level,
    }
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <StatsOverview
        userStats={userStats ? {
          id: userStats._id.toString(),
          user_id: userStats.user_id,
          total_words_learned: userStats.total_words_learned,
          current_streak: userStats.current_streak,
          longest_streak: userStats.longest_streak,
          last_activity_date: userStats.last_activity_date ? userStats.last_activity_date.toISOString() : null,
          quiz_scores: (userStats.quiz_scores || []).map((qs: any) => ({
            date: qs.date instanceof Date ? qs.date.toISOString() : qs.date,
            score: qs.score,
            total: qs.total,
            mode: qs.mode,
          })),
          created_at: userStats.created_at.toISOString(),
          updated_at: userStats.updated_at.toISOString(),
        } : null}
        userWords={formattedUserWords}
        totalWords={totalWords}
      />
    </div>
  )
}
