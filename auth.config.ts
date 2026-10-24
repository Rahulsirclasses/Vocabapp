export const authConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/signup",
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                session.user.id = token.id as string
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
}
