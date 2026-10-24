"use server"

import { hash } from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/lib/models/User"
import { redirect } from "next/navigation"


export async function signup(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    if (!email || !password) {
        return { error: "Email and password are required" }
    }

    await dbConnect()

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        return { error: "User already exists" }
    }

    const hashedPassword = await hash(password, 12)

    const newUser = await User.create({
        email,
        password: hashedPassword,
        name,
        role: "user",
        isActive: true,
        isApproved: false, // Default false, requires admin approval
        created_at: new Date(),
    })

    console.log("✅ New user created (Pending Approval):", email)

    redirect("/auth/pending")
}
