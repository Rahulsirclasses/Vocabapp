import { auth } from "@/auth"
import { redirect } from "next/navigation"
import FavoritesView from "@/components/favorites-view"
import dbConnect from "@/lib/db"
import UserWord from "@/lib/models/UserWord"

export default async function FavoritesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch favorite words with populated vocab words
  const favoriteWords = await UserWord.find({
    user_id: session.user.id,
    is_favorite: true
  })
    .populate('word_id')
    .sort({ created_at: -1 })
    .lean()
    .exec()

  // Format data for component
  const formattedFavorites = favoriteWords.map((fw: any) => ({
    id: fw._id.toString(),
    user_id: fw.user_id,
    word_id: fw.word_id._id.toString(),
    is_favorite: fw.is_favorite,
    times_reviewed: fw.times_reviewed,
    last_reviewed_at: fw.last_reviewed_at,
    mastery_level: fw.mastery_level,
    created_at: fw.created_at,
    vocab_words: {
      id: fw.word_id._id.toString(),
      word: fw.word_id.word,
      meaning: fw.word_id.meaning,
      synonyms: fw.word_id.synonyms,
      antonyms: fw.word_id.antonyms,
      example_sentence: fw.word_id.example_sentence,
      difficulty_level: fw.word_id.difficulty_level,
    }
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <FavoritesView favoriteWords={formattedFavorites} userId={session.user.id} />
    </div>
  )
}
