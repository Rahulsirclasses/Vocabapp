"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-yellow-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Unauthorized Access
                    </h1>

                    {/* Message */}
                    <p className="text-slate-400 mb-6">
                        You don't have permission to access this page. Admin privileges are required.
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
                        >
                            <Link href="/learn">Go to Learning</Link>
                        </Button>

                        <Button
                            asChild
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
