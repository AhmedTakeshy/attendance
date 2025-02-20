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
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash, compare } from "bcryptjs";
import { User } from "@prisma/client";
import { auth, signIn, } from "@/lib/auth";
import { createPublicId, returnPublicId } from "@/lib/utils";
import Mailjet from "node-mailjet";

const mailjet = Mailjet.apiConnect(
    `${process.env.MAILJET_API_KEY}`,
    `${process.env.MAILJET_SECRET_KEY}`,
)

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
        const { firstName, lastName, email, message, phone } = result.data
        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: "attendancetracking@mail.com",
                            Name: "Attendance"
                        },
                        To: [
                            {
                                Email: email,
                                Name: `${firstName} ${lastName}`
                            },
                        ],
                        Subject: "Contact Form",
                        TemplateID: 6236181,
                        TemplateLanguage: true,
                        Variables: {
                            first_name: firstName,
                        }
                    },
                    {
                        From: {
                            Email: "attendancetracking@mail.com",
                            Name: "Attendance"
                        },
                        To: [
                            {
                                Email: "ahmedtakeshy7@gmail.com",
                                Name: "Takeshy"
                            },
                        ],
                        subject: `New Inquiry from attendance website`,
                        textPart: `Email from: attendance website contact form`,
                        htmlPart: `
                        <h3>From: ${firstName} ${lastName}</h3>
                        <h3>Email: ${email}</h3>
                        <h3>Phone: ${phone}</h3>
                        <p>Message: ${message}</p>
                        `,
                    },
                ]
            })

        const res = await JSON.parse(JSON.stringify(request.body))
        if (res.Messages[0].Status !== "success") {
            return {
                statusCode: 502,
                status: "Error",
                errorMessage: "Internal Server Error with sending contact form",
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
        const session = await auth()
        const isOwner = email === session?.user.email
        if (!isOwner) {
            return {
                statusCode: 403,
                errorMessage: "You are not authorized to delete this table",
                status: "Error",
            }
        }
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
        const session = await auth()
        const isOwner = email === session?.user.email
        if (!isOwner) {
            return {
                statusCode: 403,
                errorMessage: "You are not authorized to delete this table",
                status: "Error",
            }
        }
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

export async function deleteUser(studentId: number): Promise<ServerResponse<null>> {
    const session = await auth()
    const isOwner = studentId === returnPublicId(session?.user.id as string)
    if (!isOwner) {
        return {
            statusCode: 403,
            errorMessage: "You are not authorized to delete this table",
            status: "Error",
        }
    }
    try {
        await prisma.user.delete({
            where: {
                id: studentId
            }
        })
        return {
            status: "Success",
            successMessage: "User has been deleted successfully.",
            statusCode: 200,
            data: null
        }
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        }
    }
}