import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role: "user" | "admin"
            isActive: boolean
            isApproved: boolean
        } & DefaultSession["user"]
    }

    interface User {
        role: "user" | "admin"
        isActive: boolean
        isApproved: boolean
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        role: "user" | "admin"
        isActive: boolean
        isApproved: boolean
    }
}
