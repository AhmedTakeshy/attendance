"use server"
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
import { hash, compare } from "bcryptjs";
import { User } from "@prisma/client";
import { signIn, } from "@/lib/auth";
import { createPublicId } from "@/lib/utils";


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

export async function signUpAction(values: SignUpFormSchema): Promise<ServerResponse<null>> {
    try {
        const result = await signUpFormSchema.safeParseAsync(values)
        if (!result.success) {
            return { status: "Error", errorMessage: "Something wrong with entered data.", statusCode: 401 }
        }
        const { firstName, lastName, email, password } = result.data
        const existedUserEmail = await prisma.user.findUnique({
            where: {
                email,
            }
        })
        if (existedUserEmail) {
            return {
                status: "Error",
                errorMessage: "There is a user already with this email!",
                statusCode: 409
            }
        }
        const hashedPassword = await hash(password, 10)


        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword,
            }
        })

        return {
            status: "Success",
            successMessage: `User has been created successfully with this email:
                ${email}`,
            statusCode: 201,
            data: null
        }
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 401
        }
    }
}


export async function updateUser(values: UserUpdateSchema): Promise<ServerResponse<User>> {
    try {
        const result = await userUpdateSchema.safeParseAsync(values)
        if (!result.success) {
            return {
                status: "Error",
                errorMessage: "Something wrong with entered data!",
                statusCode: 401
            }
        }
        const { firstName, lastName, email, newEmail } = result.data

        if (newEmail) {
            const existedUserEmail = await prisma.user.findUnique({
                where: {
                    email: newEmail,
                }
            })
            if (existedUserEmail) {
                return {
                    status: "Error",
                    errorMessage: "There is a user already with this email!",
                    statusCode: 409
                }
            }
        }
        const user = await prisma.user.update({
            where: {
                email,
            },
            data: {
                firstName,
                lastName,
                email: newEmail,
            }
        })
        revalidatePath(`/${createPublicId(user.publicId, user.id)}`)
        return { status: "Success", successMessage: `User has been updated successfully.`, statusCode: 200, data: user }
    } catch (error) {
        return { status: "Error", errorMessage: "Something went wrong!", statusCode: 401 }
    }
}

export async function updatePassword(values: PasswordSchema): Promise<ServerResponse<User>> {
    try {
        const result = await passwordSchema.safeParseAsync(values)
        if (!result.success) {
            return { status: "Error", errorMessage: "Something wrong with entered data!", statusCode: 401 }
        }
        const { currentPassword, newPassword, email } = result.data
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        const isMatch = await compare(currentPassword, user?.password!)
        if (!isMatch) {
            return { status: "Error", errorMessage: "Current password is not correct!", statusCode: 401 }
        }
        const hashedPassword = await hash(newPassword, 10)
        const res = await prisma.user.update({
            where: {
                email
            },
            data: {
                password: hashedPassword
            }
        })
        revalidatePath(`/${createPublicId(res.publicId, res.id)}`)
        return { status: "Success", successMessage: "Password has been updated successfully.", statusCode: 200, data: res }
    } catch (error) {
        return { status: "Error", errorMessage: "Something went wrong!", statusCode: 401 }
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


export async function login({ email, password }: { email: string, password: string }): Promise<ServerResponse<null>> {
    try {

        await signIn("credentials", {
            redirect: false,
            email: email.toLowerCase(),
            password: password,
        })
        return {
            status: "Success",
            successMessage: `Welcome back, ${email}`,
            statusCode: 200,
            data: null
        }
    } catch (error) {
        return { status: "Error", errorMessage: "Something went wrong!", statusCode: 401 }
    }
}

export async function deleteUser(StudentId: number): Promise<ServerResponse<null>> {
    try {
        await prisma.user.delete({
            where: {
                id: StudentId
            }
        })
        return {
            status: "Success",
            successMessage: "User has been deleted successfully.",
            statusCode: 200,
            data: null
        }
    } catch (error) {
        console.log("🚀 ~ deleteUser ~ error:", error)
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        }
    }
}