import { auth } from "@/auth"
import { redirect } from "next/navigation"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import AdminPanel from "@/components/admin-panel"

export default async function AdminPage() {
  const session = await auth()

  // Server-side role check
  if (!session?.user || session.user.role !== "admin") {
    redirect("/unauthorized")
  }

  await dbConnect()

  // Fetch all users
  const users = await User.find({})
    .select("_id name email role isActive isApproved created_at")
    .sort({ created_at: -1 })
    .lean()

  // Format users for component
  const formattedUsers = users.map((user: any) => ({
    id: user._id.toString(),
    name: user.name || "No name",
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    isApproved: user.isApproved,
    createdAt: user.created_at.toISOString(),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <AdminPanel users={formattedUsers} adminEmail={session.user.email!} />
    </div>
  )
}
