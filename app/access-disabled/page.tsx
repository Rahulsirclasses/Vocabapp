"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AccessDisabledPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-3">
                        Access Disabled
                    </h1>

                    {/* Message */}
                    <p className="text-slate-400 mb-6">
                        Your account has been disabled by an administrator. You cannot access WordWiz at this time.
                    </p>

                    <p className="text-slate-500 text-sm mb-6">
                        If you believe this is a mistake, please contact support for assistance.
                    </p>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Button
                            asChild
                            variant="outline"
                            className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
