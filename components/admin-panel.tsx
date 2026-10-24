"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldCheck, ShieldX, Mail, MailCheck, MailX, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  isActive: boolean
  isApproved: boolean
  createdAt: string
}

interface AdminPanelProps {
  users: User[]
  adminEmail: string
}

export default function AdminPanel({ users, adminEmail }: AdminPanelProps) {
  const [localUsers, setLocalUsers] = useState(users)
  const [togglingUserId, setTogglingUserId] = useState<string | null>(null)

  const handleUpdateUser = async (userId: string, updates: { isActive?: boolean; isApproved?: boolean }) => {
    setTogglingUserId(userId)

    try {
      const response = await fetch("/api/admin/toggle-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...updates,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update user")
      }

      // Update local state
      setLocalUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, ...updates } : user
        )
      )

      toast.success("User updated successfully")
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update user")
    } finally {
      setTogglingUserId(null)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
          <Shield className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      )
    }
    return (
      <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">
        <UserIcon className="w-3 h-3 mr-1" />
        User
      </Badge>
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    }
    return (
      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
        <ShieldX className="w-3 h-3 mr-1" />
        Disabled
      </Badge>
    )
  }

  const getApprovalBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
        <ShieldX className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const activeUsers = localUsers.filter((u) => u.isActive).length
  const pendingUsers = localUsers.filter((u) => !u.isApproved).length
  const adminUsers = localUsers.filter((u) => u.role === "admin").length

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
        <p className="text-slate-400">
          Logged in as: <span className="text-violet-400">{adminEmail}</span>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-1">Total Users</div>
          <div className="text-3xl font-bold text-white">{localUsers.length}</div>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-1">Active Users</div>
          <div className="text-3xl font-bold text-green-400">{activeUsers}</div>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-1">Pending Approval</div>
          <div className="text-3xl font-bold text-orange-400">{pendingUsers}</div>
        </Card>
        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 p-6">
          <div className="text-slate-400 text-sm mb-1">Admins</div>
          <div className="text-3xl font-bold text-violet-400">{adminUsers}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end mb-6">
        <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
          <Link href="/admin/words">
            Manage Words →
          </Link>
        </Button>
      </div>

      {/* Users Table */}
      <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  Approval Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-slate-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {localUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-slate-400">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4">{getApprovalBadge(user.isApproved)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {!user.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateUser(user.id, { isApproved: true })}
                        disabled={togglingUserId === user.id}
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                      >
                        {togglingUserId === user.id ? "..." : "Approve"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                      disabled={togglingUserId === user.id || user.email === adminEmail}
                      className={
                        user.isActive
                          ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                          : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                      }
                    >
                      {togglingUserId === user.id
                        ? "..."
                        : user.isActive
                          ? "Disable"
                          : "Enable"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info */}
      <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-300">Note:</strong> You cannot disable your own account.
          Disabled users will be blocked from accessing the application even if they have a valid session.
        </p>
      </div>
    </div>
  )
}
