"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Target, Zap, Heart, BarChart3, Settings, Download } from "lucide-react"
import { triggerPWAInstall } from "@/components/pwa-install"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function AppNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/learn", icon: BookOpen, label: "Learn" },
    { href: "/quiz", icon: Target, label: "Quiz" },
    { href: "/daily", icon: Zap, label: "Daily 5" },
    { href: "/favorites", icon: Heart, label: "Favorites" },
    { href: "/stats", icon: BarChart3, label: "Stats" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="border-b border-white/10 backdrop-blur-xl bg-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center py-3 hover:opacity-80 transition-opacity">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%20copy.PNG-BZPdZaiPbepHGgWNg0Y9TTykizMosA.png"
              alt="Rahul Sir Classes"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          {/* PWA Install Button */}
          <button
            onClick={triggerPWAInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 text-violet-300 hover:text-white text-xs font-bold transition"
            title="Install App"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Install</span>
            <span className="text-[10px] bg-emerald-500/30 px-1 rounded">APK</span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                    isActive
                      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

