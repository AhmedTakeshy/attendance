import "server-only";
import {
    ContactSchema,
    PasswordSchema,
    SignUpFormSchema,
    UserUpdateSchema,
    contactSchema,
    passwordSchema,
    signUpFormSchema,
    userUpdateSchema
} from "@/lib/formSchemas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt, { hash } from "bcryptjs";
import { User } from "@prisma/client";
import { signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";


export async function contactFormAction(values: ContactSchema): Promise<ServerResponse<null>> {

    try {
        const result = await contactSchema.safeParseAsync(values)
        if (!result.success) {
            return {
                statusCode: 400,
                status: "Error",
                errorMessage: result.error.errors[0].message,
            }
        }
        return {
            statusCode: 200,
            status: "Success",
            successMessage: "Contact form submitted successfully",
            data: null,
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: "Error",
            errorMessage: "Internal Server Error",
        }
    }
}

export async function signUpAction(values: SignUpFormSchema) {
    try {
        const result = await signUpFormSchema.safeParseAsync(values)
        if (!result.success) {
            return { error: true, message: "Something wrong with entered data.", status: 401 }
        }
        const { firstName, lastName, email, password } = result.data
        const existedUserEmail = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (existedUserEmail) {
            return { error: true, message: "There is a user already with this email!", status: 409 }
        }
        const hashedPassword = await hash(password, 10)
        if (!existedUserEmail) {
            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email: email.toLowerCase(),
                    password: hashedPassword,
                }
            })

            await signIn("credentials", {
                email,
                password,
                redirectTo: DEFAULT_LOGIN_REDIRECT
            })

            return { error: false, message: `User has been created successfully with this email ${email}`, status: 201 }
        }
    } catch (error) {
        return { error: true, message: "Something went wrong!", status: 401 }
    }
}


export async function updateUser(values: UserUpdateSchema) {
    try {
        const result = await userUpdateSchema.safeParseAsync(values)
        if (!result.success) {
            return { error: true, message: "Something wrong with entered data!", status: 401 }
        }
        const { firstName, lastName, email, newEmail } = result.data

        if (newEmail) {
            const existedUserEmail = await prisma.user.findUnique({
                where: {
                    email: newEmail,
                }
            })
            if (existedUserEmail) {
                return { error: true, message: "There is a user already with this email!", status: 409 }
            }
        }
        const res = await prisma.user.update({
            where: {
                email,
            },
            data: {
                firstName,
                lastName,
                email: newEmail,
            }
        })
        revalidatePath("/profile")
        return { error: false, message: `User has been updated successfully.`, status: 200 }
    } catch (error) {
        return { error: true, message: "Something went wrong!", status: 401 }
    }
}

export async function updatePassword(values: PasswordSchema) {
    try {
        const result = await passwordSchema.safeParseAsync(values)
        if (!result.success) {
            return { error: true, message: "Something wrong with entered data!", status: 401 }
        }
        const { currentPassword, newPassword, email } = result.data
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        const isMatch = await bcrypt.compare(currentPassword, user?.password!)
        if (!isMatch) {
            return { error: true, message: "Current password is not correct!", status: 401 }
        }
        const hashedPassword = await hash(newPassword, 10)
        await prisma.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            }
        })
        revalidatePath("/profile")
        return { error: false, message: "Password has been updated successfully.", status: 200 }
    } catch (error) {
        return { error: true, message: "Something went wrong!", status: 401 }
    }
}

export async function getUserByEmail(email: string): Promise<ServerResponse<User | null>> {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        return {
            statusCode: 200,
            status: "Success",
            successMessage: "User found",
            data: user,
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: "Error",
            errorMessage: "Internal Server Error",
        }
    }
}