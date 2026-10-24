import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthSessionProvider } from "@/components/providers/session-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WordWiz - Master CAT & OMETS Vocabulary",
  description:
    "Learn and master vocabulary for CAT & OMETS exams with interactive flashcards, quizzes, and daily challenges. Together We Will succeed!",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthSessionProvider>
          {children}
        </AuthSessionProvider>
        <Analytics />
      </body>
    </html>
  )
}
