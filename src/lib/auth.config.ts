import prisma from "./prisma"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth";
import { User } from "next-auth"
import { createPublicId } from "./utils";
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Twitter from "next-auth/providers/twitter"
import Instagram from "next-auth/providers/instagram"

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

                const isPasswordValid = await bcrypt.compare(password.toString(), existingUser?.password as string)
                if (!isPasswordValid) return null;
                return {
                    id: createPublicId(existingUser.publicId, existingUser.id),
                    firstName: existingUser.firstName,
                    lastName: existingUser.lastName,
                    name: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                    role: existingUser.role ?? "USER",
                } as User
            },
        },
        ),
        Google({
            allowDangerousEmailAccountLinking: true,
        }),
        Facebook({
            allowDangerousEmailAccountLinking: true,
        }),
        Twitter({
            allowDangerousEmailAccountLinking: true,
        }),
        Instagram({
            allowDangerousEmailAccountLinking: true,
        }),
    ],
} satisfies NextAuthConfig