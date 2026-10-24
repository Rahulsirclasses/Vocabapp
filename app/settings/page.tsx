import { auth } from "@/auth"
import { redirect } from "next/navigation"
import SettingsView from "@/components/settings-view"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/login")
  }

  await dbConnect()

  // Fetch full user data from MongoDB
  const user = await User.findOne({ email: session.user.email }).lean()

  if (!user) {
    redirect("/auth/login")
  }

  const formattedUser = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SettingsView user={formattedUser} />
    </div>
  )
}
