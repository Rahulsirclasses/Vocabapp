import { auth } from "@/auth"
import { redirect } from "next/navigation"
import QuizInterface from "@/components/quiz-interface"
import dbConnect from "@/lib/db"
import VocabWord, { type IVocabWord } from "@/lib/models/VocabWord"

export default async function QuizPage() {
  const session = await auth()

  if (!session || !session.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch all vocab words for quiz
  const vocabWordsDocs = await VocabWord.find({}).sort({ created_at: 1 }).lean()

  const vocabWords = vocabWordsDocs.map((word: any) => ({
    id: word._id.toString(),
    word: word.word,
    meaning: word.meaning,
    synonyms: word.synonyms,
    antonyms: word.antonyms,
    example_sentence: word.example_sentence || null,
    difficulty_level: word.difficulty_level,
    created_at: word.created_at.toISOString(),
  }))

  if (!vocabWords || vocabWords.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <p className="text-red-400">No questions available.</p>
          <p className="text-slate-400 text-sm mt-2">Database might be empty.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <QuizInterface words={vocabWords as any} userId={session.user.id!} />
    </div>
  )
}

