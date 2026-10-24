"use client"

import { useState, useEffect } from "react"
import type { VocabWordWithProgress } from "@/lib/types/database"
import Flashcard from "./flashcard"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Flame, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import AppNavigation from "./app-navigation"

interface DailyChallengeProps {
  words: VocabWordWithProgress[]
  userId: string
  currentStreak: number
  lastActivityDate: string | null
}

export default function DailyChallenge({ words, userId, currentStreak, lastActivityDate }: DailyChallengeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set())
  const [streak, setStreak] = useState(currentStreak)
  const [showCompletion, setShowCompletion] = useState(false)

  const isCompleted = completedWords.size === words.length

  useEffect(() => {
    // Check if user completed today's challenge
    const today = new Date().toISOString().split("T")[0]
    const lastActivity = lastActivityDate ? new Date(lastActivityDate).toISOString().split("T")[0] : null

    if (lastActivity === today) {
      // Already completed today
      setShowCompletion(true)
    }
  }, [lastActivityDate])

  const handleMarkComplete = async () => {
    const currentWord = words[currentIndex]
    setCompletedWords(new Set([...completedWords, currentWord.id]))

    // Track the word as reviewed via our MongoDB API
    try {
      await fetch('/api/user-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word_id: currentWord.id,
          times_reviewed: (currentWord.user_progress?.times_reviewed || 0) + 1,
          mastery_level: Math.min((currentWord.user_progress?.mastery_level || 0) + 1, 5),
        }),
      })

      // If this is the last word, update streak
      if (completedWords.size + 1 === words.length) {
        await updateStreak()
        setShowCompletion(true)
      } else {
        // Move to next word
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (error) {
      console.error("[v0] Error marking word complete:", error)
    }
  }

  const updateStreak = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
      const lastActivity = lastActivityDate ? new Date(lastActivityDate).toISOString().split("T")[0] : null

      let newStreak = 1

      if (lastActivity === yesterday) {
        // Continuing streak
        newStreak = currentStreak + 1
      } else if (lastActivity === today) {
        // Already completed today
        newStreak = currentStreak
      }

      await fetch('/api/user-progress/streak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_streak: newStreak,
          last_activity_date: today,
          words_learned_today: words.length
        }),
      })

      setStreak(newStreak)
    } catch (error) {
      console.error("[v0] Error updating streak:", error)
    }
  }

  if (showCompletion) {
    return (
      <>
        <AppNavigation />
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center"
              >
                <Flame className="w-12 h-12 text-orange-400" />
              </motion.div>

              <h1 className="text-5xl font-bold text-white mb-4">Challenge Complete!</h1>
              <p className="text-xl text-slate-300 mb-8">You've completed today's Daily 5 challenge</p>

              <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-8 mb-8">
                <div className="text-6xl font-bold text-orange-400 mb-2">{streak}</div>
                <div className="text-slate-300 text-lg">Day Streak</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                >
                  <Link href="/learn">Continue Learning</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/stats">View Stats</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />

      <main className="flex-1 flex flex-col p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2">Daily 5 Challenge</h1>
            <p className="text-slate-400 text-lg">Learn 5 new words every day</p>
            <div className="flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 inline-flex">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-white font-semibold">{streak} day streak</span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Progress</span>
              <span className="text-white font-semibold">
                {completedWords.size} / {words.length}
              </span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedWords.size / words.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-8">
            {words.map((word, index) => (
              <div
                key={word.id}
                className={`h-2 rounded-full transition-colors ${completedWords.has(word.id)
                  ? "bg-green-500"
                  : index === currentIndex
                    ? "bg-violet-500"
                    : "bg-white/10"
                  }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Flashcard word={words[currentIndex]} userId={userId} />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 text-center">
            <Button
              onClick={handleMarkComplete}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Mark as Learned
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
