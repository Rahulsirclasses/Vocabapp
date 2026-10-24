import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    session: { strategy: "jwt" },
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/signup",
    },
    callbacks: {
        async signIn({ user, account }) {
            // For Google OAuth, handle user creation via API route
            if (account?.provider === "google") {
                try {
                    // Call API route to handle user creation/lookup
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/google-signin`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }),
                    })

                    if (!response.ok) {
                        console.error("❌ Error in Google OAuth sign-in")
                        return false
                    }

                    const dbUser = await response.json()
                    user.id = dbUser.id

                    // Check if user is approved
                    if (!dbUser.isApproved) {
                        return "/auth/pending"
                    }

                    return true
                } catch (error) {
                    console.error("❌ Error in Google OAuth sign-in:", error)
                    return false
                }
            }

            // For credentials login, user object already has isApproved from authorize callback (via validate API)
            if (account?.provider === "credentials") {
                // Check if user is approved. Treats false and undefined as unapproved.
                if (!user.isApproved) {
                    return "/auth/pending"
                }
            }

            return true
        },
        async jwt({ token, user }) {
            // On initial sign-in, add user data to token
            if (user) {
                token.id = user.id
            }

            // Fetch fresh user data from API to enrich token
            if (token.email) {
                try {
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/user-data?email=${encodeURIComponent(token.email as string)}`)

                    if (response.ok) {
                        const userData = await response.json()
                        token.id = userData.id
                        token.role = userData.role
                        token.isActive = userData.isActive
                        token.isApproved = userData.isApproved
                    }
                } catch (error) {
                    console.error("❌ Error enriching JWT:", error)
                }
            }

            return token
        },
        async session({ session, token }) {
            // Mirror JWT data in session
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as "user" | "admin"
                session.user.isActive = token.isActive as boolean
                session.user.isApproved = token.isApproved as boolean
            }
            return session
        },
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // Call our API route to validate credentials
                    // This keeps Mongoose out of the Edge Runtime
                    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/validate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: credentials?.email,
                            password: credentials?.password,
                        }),
                    })

                    if (!res.ok) {
                        return null
                    }

                    const user = await res.json()
                    return user
                } catch (error) {
                    console.error("Authorization error:", error)
                    return null
                }
            },
        }),
    ],
})
