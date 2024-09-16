"use server"
import prisma from "@/lib/prisma";
import Mailjet from "node-mailjet";
import { v4 as uuidv4 } from "uuid";
import { PasswordResetToken, VerificationToken } from "@prisma/client";
import { hash } from "bcryptjs";
import { newPasswordSchema, NewPasswordSchema, resetPasswordSchema, ResetPasswordSchema } from "@/lib/formSchemas";


export async function generateVerificationToken(email: string): Promise<ServerResponse<VerificationToken>> {

    const token = uuidv4();

    const expires = new Date(new Date().getTime() + 3600 * 1000);
    try {
        const existingToken = await prisma.verificationToken.findUnique({
            where: { email },
        });

        if (existingToken) {
            await prisma.verificationToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }
        const verificationToken = await prisma.verificationToken.create({
            data: {
                email,
                token,
                expires,
            },
        });
        return {
            status: "Success",
            successMessage: "Verification token generated successfully.",
            statusCode: 200,
            data: verificationToken,
        };
    }

    catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        }
    }
};

const mailjet = Mailjet.apiConnect(
    `${process.env.MAILJET_API_KEY}`,
    `${process.env.MAILJET_SECRET_KEY}`,
)
const domain = process.env.APP_URL;

export async function sendVerificationToken(email: string, firstName: string): Promise<ServerResponse<null>> {
    const verificationToken = await generateVerificationToken(email);
    if (verificationToken.status === "Error") {
        return {
            status: "Error",
            errorMessage: "Could not generate verification token",
            statusCode: 500,
        }
    }
    const confirmLink = `${domain}/verify-email?token=${verificationToken.data.token}`;
    try {
        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: `attendancetracking@mail.com`,
                            Name: "Attendance Tracking",
                        },
                        To: [
                            {
                                Email: email,
                                Name: firstName
                            }
                        ],
                        TemplateID: 6230522,
                        TemplateLanguage: true,
                        Subject: "Confirm your email",
                        Variables: {
                            first_name: firstName,
                            token: confirmLink
                        }
                    },
                ]
            })
        const res = await JSON.parse(JSON.stringify(request.body))
        if (res.Messages[0].Status !== "success") {
            return {
                statusCode: 502,
                status: "Error",
                errorMessage: "Internal Server Error with sending the confirmation email",
            }
        }
        return {
            status: "Success",
            successMessage: "Verification token sent to your email. Please check your inbox or spam folder.",
            statusCode: 200,
            data: null
        }
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong with verification email!",
            statusCode: 500,
        }
    }
}

export async function verifyEmail(token: string, email: string): Promise<ServerResponse<null>> {
    const verificationToken = await prisma.verificationToken.findUnique({
        where: { token },
    });

    if (!verificationToken) {
        return {
            status: "Error",
            errorMessage: "Invalid token",
            statusCode: 400,
        };
    }

    if (new Date() > verificationToken.expires) {
        return {
            status: "Error",
            errorMessage: "Token expired",
            statusCode: 400,
        };
    }

    try {
        await prisma.user.update({
            where: {
                email
            },
            data: {
                emailVerified: new Date()
            }
        })
        return {
            status: "Success",
            successMessage: "Email verified successfully.",
            statusCode: 200,
            data: null,
        };
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        };
    }
}


export async function generatePasswordResetToken(email: string): Promise<ServerResponse<PasswordResetToken>> {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);
    try {
        const existingToken = await prisma.passwordResetToken.findFirst({
            where: { email },
        });
        if (existingToken) {
            await prisma.passwordResetToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }
        const passwordResetToken = await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires,
            },
        });
        return {
            status: "Success",
            successMessage: "Password reset token generated successfully.",
            statusCode: 200,
            data: passwordResetToken,
        };
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        }
    }
}

export async function sendPasswordResetToken(email: string): Promise<ServerResponse<null>> {
    const passwordResetToken = await generatePasswordResetToken(email);
    if (passwordResetToken.status === "Error") {
        return {
            status: "Error",
            errorMessage: "Could not generate password reset token",
            statusCode: 500,
        }
    }
    const resetLink = `${domain}/new-password?token=${passwordResetToken.data.token}`;
    try {
        const request = await mailjet
            .post("send", { version: "v3.1" })
            .request({
                Messages: [
                    {
                        From: {
                            Email: `attendancetracking@mail.com`,
                            Name: "Attendance Tracking",
                        },
                        To: [{
                            Email: email,
                        }
                        ],
                        TemplateID: 6235137,
                        TemplateLanguage: true,
                        Subject: "Reset your password",
                        Variables: {
                            reset_password_token: resetLink
                        }
                    },
                ]
            })
        const res = await JSON.parse(JSON.stringify(request.body))
        if (res.Messages[0].Status !== "success") {
            return {
                statusCode: 502,
                status: "Error",
                errorMessage: "Internal Server Error with sending the password reset email",
            }
        }
        return {
            status: "Success",
            successMessage: "Password reset sent successfully.",
            statusCode: 200,
            data: null
        }
    }
    catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        }
    }
}

export async function resetPasswordEmail(values: ResetPasswordSchema): Promise<ServerResponse<null>> {
    try {
        const result = await resetPasswordSchema.safeParseAsync(values)

        if (!result.success) {
            return {
                status: "Error",
                errorMessage: "Something wrong with entered data!",
                statusCode: 401,
            }
        }
        const { email } = result.data
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            return {
                status: "Error",
                errorMessage: "Email not found",
                statusCode: 404,
            };
        }

        const passwordResetToken = await generatePasswordResetToken(email);
        if (passwordResetToken.status === "Error") {
            return {
                status: "Error",
                errorMessage: "Could not generate password reset token",
                statusCode: 500,
            }
        }
        await sendPasswordResetToken(
            passwordResetToken.data.email,
        );
        return {
            status: "Success",
            successMessage: "Password reset token sent to your email. Please check your inbox or spam folder.",
            statusCode: 200,
            data: null,
        };
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        };
    }
}

export async function newPassword(values: NewPasswordSchema, token: string): Promise<ServerResponse<null>> {
    try {
        const existingToken = await prisma.passwordResetToken.findUnique({
            where: {
                token
            }
        })
        if (!existingToken) {
            return {
                status: "Error",
                errorMessage: "Invalid token",
                statusCode: 400,
            }
        }
        if (new Date() > existingToken.expires) {
            return {
                status: "Error",
                errorMessage: "Token expired",
                statusCode: 400,
            }
        }
        const result = await newPasswordSchema.safeParseAsync(values)

        if (!result.success) {
            return {
                status: "Error",
                errorMessage: "Something wrong with entered data!",
                statusCode: 401,
            }
        }
        const { confirmPassword } = result.data

        const existingUser = await prisma.user.findUnique({
            where: {
                email: existingToken.email
            },
        });
        if (!existingUser) {
            return {
                status: "Error",
                errorMessage: "Email not found",
                statusCode: 400,
            };
        }

        const hashedPassword = await hash(confirmPassword, 10);

        await prisma.user.update({
            where: {
                email: existingToken.email,
            },
            data: {
                password: hashedPassword,
            }
        })

        await prisma.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })

        return {
            status: "Success",
            successMessage: "Password reset successfully.",
            statusCode: 200,
            data: null,
        };
    } catch (error) {
        return {
            status: "Error",
            errorMessage: "Something went wrong!",
            statusCode: 500,
        };
    }
}