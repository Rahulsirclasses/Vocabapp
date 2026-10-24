"use client"

import { Button } from "./ui/button"
import { BookOpen, Shuffle, ArrowLeftRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

type QuizMode = "meaning" | "synonym" | "antonym" | "mixed"

interface QuizModeSelectorProps {
  onSelectMode: (mode: QuizMode) => void
}

export default function QuizModeSelector({ onSelectMode }: QuizModeSelectorProps) {
  const modes = [
    {
      id: "meaning" as QuizMode,
      title: "Meaning Match",
      description: "Match words with their definitions",
      icon: BookOpen,
      color: "from-violet-500/20 to-violet-600/20 border-violet-500/30",
      iconColor: "text-violet-400",
    },
    {
      id: "synonym" as QuizMode,
      title: "Synonym Challenge",
      description: "Find words with similar meanings",
      icon: Shuffle,
      color: "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30",
      iconColor: "text-indigo-400",
    },
    {
      id: "antonym" as QuizMode,
      title: "Antonym Quest",
      description: "Identify words with opposite meanings",
      icon: ArrowLeftRight,
      color: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      id: "mixed" as QuizMode,
      title: "Mixed Mode",
      description: "Random mix of all question types",
      icon: Sparkles,
      color: "from-pink-500/20 to-pink-600/20 border-pink-500/30",
      iconColor: "text-pink-400",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Quiz Mode</h1>
          <p className="text-slate-400 text-lg">Test your vocabulary knowledge with different challenge types</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {modes.map((mode, index) => {
            const Icon = mode.icon
            return (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelectMode(mode.id)}
                className={`backdrop-blur-xl bg-gradient-to-br ${mode.color} border rounded-2xl p-8 text-left hover:scale-105 transition-transform`}
              >
                <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 ${mode.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{mode.title}</h3>
                <p className="text-slate-300">{mode.description}</p>
              </motion.button>
            )
          })}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="/learn">Back to Learning</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
