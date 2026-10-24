"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successUrl, setSuccessUrl] = useState<string | null>(null)

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate reset link")
      }

      setSuccessUrl(data.resetUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Reset Password</h1>
            <p className="text-slate-400">Enter your email to generate a reset link</p>
          </div>

          {successUrl ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-green-400">
                <p className="font-medium mb-1">Link generated!</p>
                <p className="text-sm text-green-300 mb-2">
                  Since email is disabled, please copy and paste this link manually to reset your password:
                </p>
                <div className="bg-black/20 p-2 rounded text-xs break-all text-white font-mono select-all">
                  {successUrl}
                </div>
              </div>
              <Link href="/auth/login">
                <Button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-200">
                  Email Address
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
                {loading ? "Generating..." : "Generate Reset Link"}
              </Button>

              <Link href="/auth/login">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                >
                  Back to Login
                </Button>
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
