"use client"

import { useEffect } from "react"
import { Button } from "./ui/button"
import { Trophy, RotateCcw, Home, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface QuizResultsProps {
  answers: { question: number; correct: boolean }[]
  questions: any[]
  userId: string
  quizMode: "meaning" | "synonym" | "antonym" | "mixed"
  onRestart: () => void
}

export default function QuizResults({ answers, questions, userId, quizMode, onRestart }: QuizResultsProps) {
  const correctCount = answers.filter((a) => a.correct).length
  const totalQuestions = questions.length
  const percentage = Math.round((correctCount / totalQuestions) * 100)

  useEffect(() => {
    // Save quiz score to MongoDB via API
    const saveScore = async () => {
      try {
        const response = await fetch("/api/quiz-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score: correctCount,
            total: totalQuestions,
            mode: quizMode,
          }),
        })

        if (!response.ok) {
          console.error("Failed to save quiz score")
        } else {
          console.log("Quiz score saved successfully!")
        }
      } catch (error) {
        console.error("Error saving quiz score:", error)
      }
    }

    saveScore()
  }, [correctCount, totalQuestions, quizMode])

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: "Outstanding!", color: "text-green-400" }
    if (percentage >= 70) return { text: "Great Job!", color: "text-blue-400" }
    if (percentage >= 50) return { text: "Good Effort!", color: "text-yellow-400" }
    return { text: "Keep Practicing!", color: "text-orange-400" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl text-center">
          {/* Trophy Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center"
          >
            <Trophy className="w-12 h-12 text-violet-400" />
          </motion.div>

          {/* Results */}
          <h1 className={`text-5xl font-bold mb-4 ${performance.color}`}>{performance.text}</h1>

          <div className="mb-8">
            <div className="text-7xl font-bold text-white mb-2">{percentage}%</div>
            <p className="text-slate-400 text-xl">
              {correctCount} out of {totalQuestions} correct
            </p>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="backdrop-blur-xl bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400 mb-1">{correctCount}</div>
              <div className="text-sm text-green-300">Correct</div>
            </div>
            <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-red-400 mb-1">{totalQuestions - correctCount}</div>
              <div className="text-sm text-red-300">Incorrect</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRestart}
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/stats">
                <TrendingUp className="w-5 h-5 mr-2" />
                View Stats
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="/learn">
                <Home className="w-5 h-5 mr-2" />
                Back to Learning
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
