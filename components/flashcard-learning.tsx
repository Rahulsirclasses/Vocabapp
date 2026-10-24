"use client"

import type React from "react"
import { useState, useMemo } from "react"
import type { VocabWordWithProgress } from "@/lib/types/database"
import Flashcard from "./flashcard"
import { Button } from "./ui/button"
import { ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AppNavigation from "./app-navigation"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface FlashcardLearningProps {
  words: VocabWordWithProgress[]
  userId: string
}

export default function FlashcardLearning({ words, userId }: FlashcardLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const [masteryFilter, setMasteryFilter] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const filteredWords = useMemo(() => {
    console.log("[v0] Total words before filtering:", words.length)
    console.log("[v0] Filters - search:", searchQuery, "difficulty:", difficultyFilter, "mastery:", masteryFilter)

    const filtered = words.filter((word) => {
      // Search filter - check word name
      if (searchQuery.trim() !== "") {
        const matches = word.word.toLowerCase().includes(searchQuery.toLowerCase().trim())
        if (!matches) return false
      }

      // Difficulty filter
      if (difficultyFilter !== "all") {
        if (word.difficulty_level !== difficultyFilter) return false
      }

      // Mastery filter
      if (masteryFilter !== "all") {
        const mastery = word.user_progress?.mastery_level ?? 0

        if (masteryFilter === "0" && mastery !== 0) return false
        if (masteryFilter === "1-2" && (mastery < 1 || mastery > 2)) return false
        if (masteryFilter === "3-4" && (mastery < 3 || mastery > 4)) return false
        if (masteryFilter === "5" && mastery !== 5) return false
      }

      return true
    })

    console.log("[v0] Filtered words count:", filtered.length)
    return filtered
  }, [words, searchQuery, difficultyFilter, masteryFilter])

  const currentWord = filteredWords[currentIndex]

  const handleNext = () => {
    if (currentIndex < filteredWords.length - 1) {
      setDirection(1)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext()
    if (e.key === "ArrowLeft") handlePrevious()
  }

  const handleFilterChange = () => {
    setCurrentIndex(0)
  }

  if (!words || words.length === 0) {
    return (
      <>
        <AppNavigation />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-4">No vocabulary words available yet.</p>
          </div>
        </div>
      </>
    )
  }

  if (filteredWords.length === 0) {
    return (
      <>
        <AppNavigation />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-slate-400 text-lg mb-4">No words match your filters.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setDifficultyFilter("all")
                setMasteryFilter("all")
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" onKeyDown={handleKeyPress} tabIndex={0}>
      <AppNavigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search words..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleFilterChange()
                  }}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-3 p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm text-slate-400 mb-2 block">Difficulty</label>
                  <Select
                    value={difficultyFilter}
                    onValueChange={(value) => {
                      setDifficultyFilter(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm text-slate-400 mb-2 block">Mastery Level</label>
                  <Select
                    value={masteryFilter}
                    onValueChange={(value) => {
                      setMasteryFilter(value)
                      handleFilterChange()
                    }}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="all">All Mastery</SelectItem>
                      <SelectItem value="0">Not Started (0)</SelectItem>
                      <SelectItem value="1-2">Beginner (1-2)</SelectItem>
                      <SelectItem value="3-4">Intermediate (3-4)</SelectItem>
                      <SelectItem value="5">Mastered (5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setDifficultyFilter("all")
                    setMasteryFilter("all")
                    handleFilterChange()
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white self-end"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </motion.div>
            )}

            <div className="text-sm text-slate-400 mt-2">
              Showing {filteredWords.length} of {words.length} words
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Progress</span>
              <span className="text-sm text-white font-semibold">
                {currentIndex + 1} / {filteredWords.length}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / filteredWords.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Flashcard Container */}
          <div className="relative min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 300 : -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -300 : 300 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full"
              >
                <Flashcard word={currentWord} userId={userId} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {filteredWords.slice(0, 10).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-violet-500 w-8" : "bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to word ${index + 1}`}
                />
              ))}
              {filteredWords.length > 10 && (
                <span className="text-slate-500 text-xs self-center ml-1">+{filteredWords.length - 10}</span>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex === filteredWords.length - 1}
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 disabled:opacity-30 bg-transparent"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Keyboard Hints */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Use <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">←</kbd> and{" "}
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs">→</kbd> to navigate
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
