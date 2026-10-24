"use client"

import { useState } from "react"
import type { VocabWord } from "@/lib/types/database"
import QuizModeSelector from "./quiz-mode-selector"
import QuizQuestion from "./quiz-question"
import QuizResults from "./quiz-results"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AppNavigation from "./app-navigation"
import { toast } from "sonner"

type QuizMode = "meaning" | "synonym" | "antonym" | "mixed"

interface QuizInterfaceProps {
  words: VocabWord[]
  userId: string
}

export default function QuizInterface({ words, userId }: QuizInterfaceProps) {
  const [quizMode, setQuizMode] = useState<QuizMode | null>(null)
  const [questions, setQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ question: number; correct: boolean }[]>([])
  const [showResults, setShowResults] = useState(false)

  const generateQuestions = (mode: QuizMode, count = 10) => {
    const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, count)
    const generatedQuestions: any[] = []

    shuffledWords.forEach((word) => {
      let questionType: "meaning" | "synonym" | "antonym"

      if (mode === "mixed") {
        const types: ("meaning" | "synonym" | "antonym")[] = ["meaning", "synonym", "antonym"]
        questionType = types[Math.floor(Math.random() * types.length)]
      } else {
        questionType = mode as "meaning" | "synonym" | "antonym"
      }

      let question: string
      let correctAnswer: string
      let options: string[]

      if (questionType === "meaning") {
        question = `What is the meaning of "${word.word}"?`
        correctAnswer = word.meaning

        // Get other meanings as wrong options
        const otherMeanings = words
          .filter((w) => w.id !== word.id)
          .map((w) => w.meaning)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        options = [correctAnswer, ...otherMeanings].sort(() => Math.random() - 0.5)
      } else if (questionType === "synonym") {
        if (word.synonyms.length === 0) return // Skip if no synonyms

        question = `Which word is a synonym of "${word.word}"?`
        correctAnswer = word.synonyms[0]

        // Get other words as wrong options
        const otherWords = words
          .filter((w) => w.id !== word.id)
          .map((w) => w.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        options = [correctAnswer, ...otherWords].sort(() => Math.random() - 0.5)
      } else {
        // antonym
        if (word.antonyms.length === 0) return // Skip if no antonyms

        question = `Which word is an antonym of "${word.word}"?`
        correctAnswer = word.antonyms[0]

        // Get other words as wrong options
        const otherWords = words
          .filter((w) => w.id !== word.id)
          .map((w) => w.word)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)

        options = [correctAnswer, ...otherWords].sort(() => Math.random() - 0.5)
      }

      generatedQuestions.push({
        word,
        question,
        correctAnswer,
        options,
        type: questionType,
      })
    })

    return generatedQuestions
  }

  const startQuiz = (mode: QuizMode) => {
    const newQuestions = generateQuestions(mode)

    if (newQuestions.length === 0) {
      toast.error(`No questions available for ${mode} mode. Try adding more words with ${mode}s!`)
      return
    }

    setQuizMode(mode)
    setQuestions(newQuestions)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setShowResults(false)
  }

  const handleAnswer = (isCorrect: boolean) => {
    setAnswers([...answers, { question: currentQuestionIndex, correct: isCorrect }])

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const resetQuiz = () => {
    setQuizMode(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setAnswers([])
    setShowResults(false)
  }

  if (!quizMode) {
    return (
      <>
        <AppNavigation />
        <QuizModeSelector onSelectMode={startQuiz} />
      </>
    )
  }

  if (showResults) {
    return (
      <>
        <AppNavigation />
        <QuizResults
          answers={answers}
          questions={questions}
          userId={userId}
          quizMode={quizMode}
          onRestart={resetQuiz}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppNavigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          {/* Quiz Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-400">
              Question <span className="text-white font-semibold">{currentQuestionIndex + 1}</span> / {questions.length}
            </div>
            <Button
              onClick={resetQuiz}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Quiz
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <QuizQuestion question={questions[currentQuestionIndex]} onAnswer={handleAnswer} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
