"use client"

import { useState } from "react"
import { Badge } from "./ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { motion } from "framer-motion"

interface QuizQuestionProps {
  question: {
    word: {
      word: string
      difficulty_level: "easy" | "medium" | "hard"
    }
    question: string
    correctAnswer: string
    options: string[]
    type: "meaning" | "synonym" | "antonym"
  }
  onAnswer: (isCorrect: boolean) => void
}

export default function QuizQuestion({ question, onAnswer }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const handleSelectAnswer = (answer: string) => {
    if (showFeedback) return // Prevent changing answer after submission

    setSelectedAnswer(answer)
    setShowFeedback(true)

    const isCorrect = answer === question.correctAnswer

    // Wait for feedback animation, then move to next question
    setTimeout(() => {
      onAnswer(isCorrect)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }, 1500)
  }

  const difficultyColors = {
    easy: "bg-green-500/20 text-green-400 border-green-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    hard: "bg-red-500/20 text-red-400 border-red-500/30",
  }

  const typeColors = {
    meaning: "text-violet-400",
    synonym: "text-indigo-400",
    antonym: "text-purple-400",
  }

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-8">
        <Badge variant="outline" className={`${difficultyColors[question.word.difficulty_level]} border`}>
          {question.word.difficulty_level}
        </Badge>
        <Badge variant="outline" className="bg-white/5 text-slate-300 border-white/20">
          {question.type}
        </Badge>
      </div>

      {/* Question Text */}
      <h2 className={`text-3xl font-bold mb-12 text-balance ${typeColors[question.type]}`}>{question.question}</h2>

      {/* Answer Options */}
      <div className="space-y-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = option === question.correctAnswer
          const showCorrect = showFeedback && isCorrect
          const showIncorrect = showFeedback && isSelected && !isCorrect

          return (
            <motion.button
              key={index}
              onClick={() => handleSelectAnswer(option)}
              disabled={showFeedback}
              className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                showCorrect
                  ? "bg-green-500/20 border-green-500 text-green-300"
                  : showIncorrect
                    ? "bg-red-500/20 border-red-500 text-red-300"
                    : isSelected
                      ? "bg-white/10 border-white/40 text-white"
                      : "bg-white/5 border-white/20 text-slate-200 hover:bg-white/10 hover:border-white/40"
              } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              whileTap={!showFeedback ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg leading-relaxed pr-4">{option}</span>
                {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />}
                {showIncorrect && <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />}
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-xl ${
            selectedAnswer === question.correctAnswer
              ? "bg-green-500/10 border border-green-500/30 text-green-300"
              : "bg-red-500/10 border border-red-500/30 text-red-300"
          }`}
        >
          {selectedAnswer === question.correctAnswer ? (
            <p className="font-medium">Correct! Well done!</p>
          ) : (
            <p className="font-medium">
              Incorrect. The correct answer is: <span className="font-bold">{question.correctAnswer}</span>
            </p>
          )}
        </motion.div>
      )}
    </div>
  )
}
