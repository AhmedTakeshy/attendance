"use server"
import { prisma } from "@/lib/prisma";
import Mailjet from "node-mailjet";
import { v4 as uuidv4 } from "uuid";
import { VerificationToken } from "@prisma/client";


export async function generateVerificationToken(email: string): Promise<ServerResponse<VerificationToken>> {

    const token = uuidv4();

    const expires = new Date(new Date().getTime() + 3600 * 1000);
    try {
        const existingToken = await prisma.verificationToken.findUnique({ // after updating the schema you need to change to findUnique
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
            errorMessage: "Something went wrong!",
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