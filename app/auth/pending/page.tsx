"use client"

import { Card } from "@/components/ui/card"
import { Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PendingApproval() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 p-8">
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-amber-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-white mb-3">Request Submitted</h1>

                    {/* Message */}
                    <div className="space-y-4 mb-8">
                        <p className="text-slate-300">
                            Your account has been created successfully.
                        </p>
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                            <p className="text-amber-200/90 text-sm">
                                The admin will review and approve your account. You will be able to log in only after approval.
                            </p>
                        </div>
                        <p className="text-slate-400 text-sm">
                            Please check back later or contact support if this takes longer than expected.
                        </p>
                    </div>

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
