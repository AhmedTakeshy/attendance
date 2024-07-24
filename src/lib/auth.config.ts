import { prisma } from "./prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";

export default {
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@email.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize({ password, email }) {
                if (!email || !password) return null;

                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: email.toString().toLowerCase(),
                    }
                })
                if (!existingUser) return null;

                const isPasswordValid = await bcrypt.compare(password.toString(), existingUser.password)
                if (!isPasswordValid) return null;
                return {
                    id: existingUser.publicId.slice(0, 11) + existingUser.id.toString() + existingUser.publicId.slice(11),
                    name: existingUser.firstName + " " + existingUser.lastName,
                    email: existingUser.email,
                    role: existingUser.role ?? "USER",
                }
            }
        }),
    ],
} satisfies NextAuthConfig