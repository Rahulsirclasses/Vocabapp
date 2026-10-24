"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { LogOut, User, Mail, Shield, Trash2, BookOpen, Zap, Heart, BarChart3, Target } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import AppNavigation from "./app-navigation"

interface SettingsViewProps {
  user: {
    id: string
    email?: string
    created_at?: string
  }
}

export default function SettingsView({ user }: SettingsViewProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ callbackUrl: "/auth/login" })
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      // Note: In production, you'd want to call a server action or API route
      // that properly handles account deletion including all user data
      await signOut({ callbackUrl: "/auth/login" })
    } catch (error) {
      console.error("Error deleting account:", error)
      setIsDeleting(false)
    }
  }

  const accountAge = user.created_at
    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="min-h-screen">
      {/* Header */}
      <AppNavigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center">
              <User className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Settings</h1>
            <p className="text-slate-400 text-lg">Manage your account and preferences</p>
          </div>

          {/* Account Information */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Account Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Email</div>
                  <div className="text-white font-medium">{user.email}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-sm text-slate-400">Account Age</div>
                  <div className="text-white font-medium">{accountAge} days</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>

            <div className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/learn">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Learning Dashboard
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/quiz">
                  <Target className="w-5 h-5 mr-3" />
                  Quiz Mode
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/daily">
                  <Zap className="w-5 h-5 mr-3" />
                  Daily 5 Challenge
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/favorites">
                  <Heart className="w-5 h-5 mr-3" />
                  Favorite Words
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/stats">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Progress Stats
                </Link>
              </Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="backdrop-blur-xl bg-red-500/5 border border-red-500/20 p-8">
            <h2 className="text-2xl font-bold text-red-400 mb-6">Danger Zone</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <div className="text-white font-medium mb-1">Sign Out</div>
                  <div className="text-sm text-slate-400">Sign out of your account</div>
                </div>
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoggingOut ? "Signing out..." : "Sign Out"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <div className="text-white font-medium mb-1">Delete Account</div>
                  <div className="text-sm text-slate-400">Permanently delete your account and all data</div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-red-500/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        This action cannot be undone. This will permanently delete your account and remove all your data
                        including progress, favorites, and quiz scores.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
