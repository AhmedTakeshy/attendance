import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import authConfig from "./auth.config";
declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's role. */
            id: string
            role: string
            /**
             * By default, TypeScript merges new interface properties and overwrites existing ones.
             * In this case, the default session user properties will be overwritten,
             * with the new ones defined above. To keep the default session user properties,
             * you need to add them back into the newly declared interface.
             */
        } & DefaultSession["user"]
    }

    interface User {
        id?: string;
        role: string;
    }
}

export const {
    handlers,
    signIn,
    signOut,
    auth } = NextAuth({
        pages: {
            signIn: '/login',
        },
        adapter: PrismaAdapter(prisma),
        session: {
            strategy: "jwt",
            maxAge: 432000,
        },
        ...authConfig,

        callbacks: {
            async jwt({ token, user, trigger, session }) {
                if (user) {
                    token.id = user.id
                    token.role = user.role
                }
                if (trigger === "update") {
                    if (session.user) {
                        token.email = session.user.email,
                            token.name = session.user.name
                    }
                }
                return token
            },
            async session({ session, user, token }) {
                if (session.user) {
                    session.user.id = token.id as string ?? session.user.id
                    session.user.role = token.role as string ?? "USER"
                }
                return session
            },
        }
    })