import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, TrendingUp, Zap, Heart, BarChart3, Award, Users, Clock } from "lucide-react"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-5xl mx-auto">
          <div className="flex justify-center mb-12 animate-fade-in">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%20copy.PNG-BZPdZaiPbepHGgWNg0Y9TTykizMosA.png"
              alt="Rahul Sir Classes"
              width={350}
              height={105}
              className="h-24 w-auto"
              priority
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl -z-10"></div>
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-white">
              WordWiz
            </h1>
          </div>

          <p className="text-3xl md:text-4xl text-violet-400 font-bold mb-6 tracking-wide">Together We Will</p>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Master vocabulary for CAT & OMETs with interactive flashcards, daily challenges, and intelligent progress
            tracking designed by experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-lg px-10 py-6 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
            >
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 bg-white/5 backdrop-blur-sm hover:border-white/50 transition-all"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-violet-400 mb-2">5000+</div>
              <div className="text-slate-400 text-sm">Active Students</div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-indigo-400 mb-2">10K+</div>
              <div className="text-slate-400 text-sm">Words Mastered</div>
            </div>
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="text-4xl font-bold text-purple-400 mb-2">98%</div>
              <div className="text-slate-400 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Everything You Need to Excel</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Comprehensive tools designed to accelerate your vocabulary learning journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          <div className="backdrop-blur-xl bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20 rounded-2xl p-8 hover:from-violet-500/15 hover:to-violet-500/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/20">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Interactive Flashcards</h3>
            <p className="text-slate-300 leading-relaxed">
              Flip through beautifully designed cards with meanings, synonyms, antonyms, and real-world examples.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-2xl p-8 hover:from-indigo-500/15 hover:to-indigo-500/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Smart Quizzes</h3>
            <p className="text-slate-300 leading-relaxed">
              Test yourself with adaptive quizzes covering meanings, synonyms, antonyms, and mixed challenges.
            </p>
          </div>

          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-2xl p-8 hover:from-purple-500/15 hover:to-purple-500/10 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Progress Tracking</h3>
            <p className="text-slate-300 leading-relaxed">
              Monitor your streak, mastery levels, and quiz performance with detailed analytics and insights.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Daily 5 Challenge</h3>
                <p className="text-slate-400">
                  Build consistency with 5 expertly curated words every day, designed for exam success.
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Favorites Collection</h3>
                <p className="text-slate-400">
                  Save important words for quick review and create personalized practice sessions.
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Detailed Analytics</h3>
                <p className="text-slate-400">
                  Visualize your learning journey with comprehensive charts and performance insights.
                </p>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Difficulty Levels</h3>
                <p className="text-slate-400">
                  Filter words by difficulty and focus on areas that need the most attention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block backdrop-blur-xl bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 mb-6">
                  <p className="text-violet-300 font-semibold text-sm">EXPERT GUIDANCE</p>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Learn from the Best in the Industry
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                  With over a decade of experience coaching CAT and OMET aspirants, our proven methodology has
                  transformed thousands of students into top performers. Master vocabulary the smart way with
                  personalized guidance and expert-curated content.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="backdrop-blur-xl bg-violet-500/10 border border-violet-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-violet-400" />
                      <p className="text-2xl font-bold text-white">10+</p>
                    </div>
                    <p className="text-violet-300 text-sm">Years Experience</p>
                  </div>
                  <div className="backdrop-blur-xl bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <p className="text-2xl font-bold text-white">5000+</p>
                    </div>
                    <p className="text-indigo-300 text-sm">Students Taught</p>
                  </div>
                  <div className="backdrop-blur-xl bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-purple-400" />
                      <p className="text-2xl font-bold text-white">98%</p>
                    </div>
                    <p className="text-purple-300 text-sm">Student Success Rate</p>
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 via-indigo-500/30 to-purple-500/30 rounded-3xl blur-3xl"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled-1-CHSGMxZbzWlv0kgnytqNmlkZc9OuKa.png"
                    alt="Rahul Sir - Expert CAT & OMET Instructor"
                    width={450}
                    height={450}
                    className="relative rounded-3xl border-2 border-white/20 shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative backdrop-blur-xl bg-gradient-to-br from-violet-500/10 via-indigo-500/10 to-purple-500/10 border border-white/20 rounded-3xl p-12 md:p-16 shadow-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Transform Your Vocabulary?
              </h2>
              <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of successful aspirants who are building their vocabulary with WordWiz. Start your
                journey to exam success today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold text-lg px-10 py-6 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
                >
                  <Link href="/auth/signup">Start Learning Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 text-lg px-10 py-6 bg-white/5 backdrop-blur-sm hover:border-white/50 transition-all"
                >
                  <Link href="/auth/login">Sign In to Continue</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
