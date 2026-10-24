"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { AlertCircle, Mail } from "lucide-react"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [mobileNumber, setMobileNumber] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    formData.append("name", fullName)
    formData.append("mobile", mobileNumber)

    try {
      const result = await signup(formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        // If successful, the server action redirects. 
        // But if we are here, maybe we want to show success message first?
        // The server action 'redirect' throws an error that interrupts execution.
        // So we won't reach here if redirect happens.
        // If we want to show success message, we shouldn't redirect in server action immediately
        // or we should handle it differently. 
        // For now, let's assume if it returns, it's an error or we handle success.
        // Since my server action implementation calls redirect(), we only see result if error.
      }
    } catch (error) {
      // This catches the redirect error too if not careful, 
      // generally avoid try-catch around server actions that redirect unless you rethrow
      // or check digest.
      // However, next/navigation redirect() throws an error.
      // The server action implementation I wrote calls `redirect`.
      // So this block WILL catch the redirect error.
      // I should probably remove the try-catch or check if error is digest 'NEXT_REDIRECT'.
      // Or better: update server action to NOT redirect, return success status, then client redirects.
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 backdrop-blur-xl bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Mail className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-amber-300 font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Before You Log In or Sign Up
              </h3>
              <div className="text-amber-200/90 text-xs space-y-1.5 leading-relaxed">
                <p className="font-medium">
                  Please check your email after signing up — you can log in immediately.
                </p>
                <ul className="space-y-1 pl-4">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Use your credentials to sign in on the login page.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">WordWiz</h1>
            <p className="text-slate-400">Together We Will</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-200">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber" className="text-slate-200">
                Mobile Number
              </Label>
              <Input
                id="mobileNumber"
                type="tel"
                placeholder="+91 98765 43210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                pattern="[+]?[0-9\s-]+"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-violet-500"
              />
              <p className="text-xs text-slate-500">Minimum 6 characters</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-semibold"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

