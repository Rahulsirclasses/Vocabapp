"use client"

import { useState } from "react"
import type { VocabWordWithProgress } from "@/lib/types/database"
import { motion } from "framer-motion"
import { Heart, BookOpen, ArrowLeftRight, CheckCircle2 } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

interface FlashcardProps {
  word: VocabWordWithProgress
  userId: string
}

export default function Flashcard({ word, userId }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorite, setIsFavorite] = useState(word.user_progress?.is_favorite || false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)

    // Track review when flipping to see the meaning
    if (!isFlipped) {
      trackReview()
    }
  }

  const trackReview = async () => {
    try {
      const currentReviews = word.user_progress?.times_reviewed || 0

      await fetch("/api/user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word_id: word.id,
          times_reviewed: currentReviews + 1,
        }),
      })
    } catch (error) {
      console.error("Error tracking review:", error)
    }
  }

  const toggleFavorite = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch("/api/user-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word_id: word.id,
          is_favorite: !isFavorite,
        }),
      })

      if (response.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  return (
    <div className="perspective-1000">
      <motion.div
        className="relative w-full h-[500px] cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <Badge variant="outline" className={`${difficultyColors[word.difficulty_level]} border`}>
                {word.difficulty_level}
              </Badge>

              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite()
                }}
                disabled={isUpdating}
                className="hover:bg-white/10"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                />
              </Button>
            </div>

            {/* Word */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-violet-400 mx-auto mb-6" />
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">{word.word}</h2>
                <p className="text-slate-400 text-lg">Click to reveal meaning</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
              <ArrowLeftRight className="w-4 h-4" />
              <span>Tap to flip</span>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-white/20 rounded-3xl p-8 shadow-2xl overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <h3 className="text-3xl font-bold text-white">{word.word}</h3>
              <Badge variant="outline" className={`${difficultyColors[word.difficulty_level]} border`}>
                {word.difficulty_level}
              </Badge>
            </div>

            {/* Meaning */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-violet-400 uppercase tracking-wide mb-2">Meaning</h4>
              <p className="text-slate-200 text-lg leading-relaxed">{word.meaning}</p>
            </div>

            {/* Example */}
            {word.example_sentence && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide mb-2">Example</h4>
                <p className="text-slate-300 italic leading-relaxed">"{word.example_sentence}"</p>
              </div>
            )}

            {/* Synonyms */}
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">Synonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.synonyms.map((synonym, index) => (
                    <Badge key={index} variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30">
                      {synonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Antonyms */}
            {word.antonyms && word.antonyms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">Antonyms</h4>
                <div className="flex flex-wrap gap-2">
                  {word.antonyms.map((antonym, index) => (
                    <Badge key={index} variant="outline" className="bg-red-500/10 text-red-300 border-red-500/30">
                      {antonym}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Review Stats */}
            {word.user_progress && word.user_progress.times_reviewed > 0 && (
              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reviewed {word.user_progress.times_reviewed} times</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
