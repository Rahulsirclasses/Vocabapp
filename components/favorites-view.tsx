"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Heart, BookOpen, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "./ui/badge"
import AppNavigation from "./app-navigation"

interface FavoritesViewProps {
  favoriteWords: any[]
  userId: string
}

export default function FavoritesView({ favoriteWords: initialFavorites, userId }: FavoritesViewProps) {
  const [favoriteWords, setFavoriteWords] = useState(initialFavorites)

  const removeFavorite = async (userWordId: string) => {
    try {
      // Find the specific word ID to pass to the API
      const wordToRemove = favoriteWords.find(fw => fw.id === userWordId);

      if (wordToRemove) {
        await fetch('/api/user-progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            word_id: wordToRemove.word_id,
            is_favorite: false
          }),
        })
      }

      setFavoriteWords(favoriteWords.filter((fw) => fw.id !== userWordId))
    } catch (error) {
      console.error("[v0] Error removing favorite:", error)
    }
  }

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="min-h-screen">
      <AppNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-pink-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Favorite Words</h1>
            <p className="text-slate-400 text-lg">
              {favoriteWords.length} {favoriteWords.length === 1 ? "word" : "words"} saved for quick review
            </p>
          </div>

          {/* Favorites List */}
          {favoriteWords.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
              <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">No favorites yet</h2>
              <p className="text-slate-400 mb-6">Start adding words to your favorites while learning</p>
              <Button
                asChild
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              >
                <Link href="/learn">Start Learning</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-4">
              {favoriteWords.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-white">{favorite.vocab_words?.word}</h3>
                          <Badge
                            variant="outline"
                            className={`${difficultyColors[favorite.vocab_words?.difficulty_level]} border`}
                          >
                            {favorite.vocab_words?.difficulty_level}
                          </Badge>
                        </div>

                        <p className="text-slate-300 mb-4 leading-relaxed">{favorite.vocab_words?.meaning}</p>

                        {favorite.vocab_words?.example_sentence && (
                          <p className="text-slate-400 italic text-sm mb-4">
                            "{favorite.vocab_words.example_sentence}"
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm">
                          {favorite.vocab_words?.synonyms?.length > 0 && (
                            <div>
                              <span className="text-green-400 font-medium">Synonyms: </span>
                              <span className="text-slate-400">
                                {favorite.vocab_words.synonyms.slice(0, 3).join(", ")}
                              </span>
                            </div>
                          )}
                          {favorite.vocab_words?.antonyms?.length > 0 && (
                            <div>
                              <span className="text-red-400 font-medium">Antonyms: </span>
                              <span className="text-slate-400">
                                {favorite.vocab_words.antonyms.slice(0, 3).join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                          <span>Reviewed {favorite.times_reviewed} times</span>
                          <span>•</span>
                          <span>Mastery: {favorite.mastery_level}/5</span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
