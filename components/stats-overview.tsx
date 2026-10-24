"use client"

import type { UserStats } from "@/lib/types/database"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Trophy, Flame, Target, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import AppNavigation from "./app-navigation"

interface StatsOverviewProps {
  userStats: UserStats | null
  userWords: any[]
  totalWords: number
}

export default function StatsOverview({ userStats, userWords, totalWords }: StatsOverviewProps) {
  const reviewedWords = userWords.filter((uw) => uw.times_reviewed > 0).length
  const favoriteWords = userWords.filter((uw) => uw.is_favorite).length
  const averageMastery =
    userWords.length > 0
      ? Math.round(userWords.reduce((sum, uw) => sum + (uw.mastery_level || 0), 0) / userWords.length)
      : 0

  // Prepare quiz performance data
  const quizData =
    userStats?.quiz_scores?.slice(-10).map((score, index) => ({
      quiz: index + 1,
      percentage: Math.round((score.score / score.total) * 100),
    })) || []

  const stats = [
    {
      label: "Current Streak",
      value: userStats?.current_streak || 0,
      icon: Flame,
      color: "from-orange-500/20 to-red-500/20 border-orange-500/30",
      iconColor: "text-orange-400",
      suffix: "days",
      // User requested black text for this specific card
      valueColor: "text-black",
      labelColor: "text-zinc-900",
      suffixColor: "text-zinc-800",
    },
    {
      label: "Words Reviewed",
      value: reviewedWords,
      icon: BookOpen,
      color: "from-violet-500/20 to-indigo-500/20 border-violet-500/30",
      iconColor: "text-violet-400",
      suffix: `/ ${totalWords}`,
      valueColor: "text-black",
      labelColor: "text-zinc-900",
      suffixColor: "text-zinc-800",
    },
    {
      label: "Longest Streak",
      value: userStats?.longest_streak || 0,
      icon: Trophy,
      color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/30",
      iconColor: "text-yellow-400",
      suffix: "days",
      valueColor: "text-black",
      labelColor: "text-zinc-900",
      suffixColor: "text-zinc-800",
    },
    {
      label: "Favorites",
      value: favoriteWords,
      icon: Target,
      color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
      iconColor: "text-pink-400",
      suffix: "words",
      valueColor: "text-black",
      labelColor: "text-zinc-900",
      suffixColor: "text-zinc-800",
    },
  ]

  // Get max percentage for scaling
  const maxPercentage = Math.max(...quizData.map(d => d.percentage), 100)

  return (
    <div className="min-h-screen">
      <AppNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Your Progress</h1>
            <p className="text-slate-400 text-lg">Track your vocabulary learning journey</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat: any, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`backdrop-blur-xl bg-gradient-to-br ${stat.color} border p-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <div className={`text-4xl font-bold mb-1 ${stat.valueColor || "text-white"}`}>
                      {stat.value}
                      {stat.suffix && <span className={`text-xl ml-1 ${stat.suffixColor || "text-slate-400"}`}>{stat.suffix}</span>}
                    </div>
                    <div className={`text-sm ${stat.labelColor || "text-slate-400"}`}>{stat.label}</div>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {/* Quiz Performance Chart */}
          {quizData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Quiz Performance</h2>
                </div>

                {/* Custom Bar Chart */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-64 gap-2">
                    {quizData.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end justify-center h-full">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(data.percentage / maxPercentage) * 100}%` }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            className="w-full bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg relative group cursor-pointer hover:from-violet-500 hover:to-indigo-400 transition-colors"
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {data.percentage}%
                            </div>
                          </motion.div>
                        </div>
                        <div className="text-xs text-slate-400">Q{data.quiz}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
                    <span>Quiz Number</span>
                    <span>Score %</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Words</h2>

              {userWords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 mb-4">You haven't started learning yet!</p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                  >
                    <Link href="/learn">Start Learning</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userWords
                    .sort(
                      (a, b) =>
                        new Date(b.last_reviewed_at || 0).getTime() - new Date(a.last_reviewed_at || 0).getTime(),
                    )
                    .slice(0, 10)
                    .map((userWord) => (
                      <div
                        key={userWord.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-white">{userWord.vocab_words?.word}</h3>
                          <p className="text-sm text-slate-400">Reviewed {userWord.times_reviewed} times</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {userWord.is_favorite && <span className="text-red-400 text-sm">★ Favorite</span>}
                          <div className="text-sm text-slate-400">Mastery: {userWord.mastery_level}/5</div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
