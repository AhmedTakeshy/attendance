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
        id?: string
        role: string;
    }
}

export const {
    handlers: {
        GET,
        POST
    },
    signIn,
    signOut,
    auth } = NextAuth({
        pages: {
            signIn: '/signin',
        },
        adapter: PrismaAdapter(prisma),
        session: {
            maxAge: 30 * 24 * 60 * 60,
        },
        ...authConfig,

        callbacks: {
            async session({ session, user, token }) {
                if (session.user) {
                    session.user.id = user?.id ?? session.user.id
                    session.user.role = user?.role ?? "USER"
                }
                return session
            },

        }
    })