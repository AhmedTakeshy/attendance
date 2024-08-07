"use server"
import { prisma } from "@/lib/prisma";
import { Table, User } from "@prisma/client";

type Props = {
    search?: string
    page: number
    studentId: number
}

type UserWithTables = Omit<User, "password" | "createdAt" | "updatedAt"> & { tables: Table[] }

export async function getStudents({ search, page = 1, studentId }: Props): Promise<ServerResponse<Metadata<UserWithTables[]>>> {
    try {
        const students = await prisma.user.findMany({
            where: {
                role: "USER",
                id: { not: studentId },
                OR: [
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                publicId: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
                tables: {
                    where: {
                        isPublic: true
                    }
                }
            },
            skip: (page - 1) * 9,
            take: 9,
        })

        const totalStudents = await prisma.user.count({
            where: {
                role: "USER",
                id: { not: studentId },
                OR: [
                    { firstName: { contains: search, mode: "insensitive" } },
                    { lastName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            }
        })
        return {
            statusCode: 200,
            successMessage: "Students fetched successfully",
            status: "Success",
            data: {
                students,
                metadata: {
                    hasNextPage: totalStudents > page * 9,
                    totalPages: Math.ceil(totalStudents / 9)
                }
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: "Error",
            errorMessage: "Internal Server Error"
        }
    }
}

export async function getStudentById({ page = 1, studentId }: Props): Promise<ServerResponse<{ student: UserWithTables }>> {
    try {
        const student = await prisma.user.findUnique({
            where: {
                id: studentId
            },
            include: {
                tables: {
                    where: {
                        isPublic: true
                    }
                }
            }
        })

        if (!student) {
            return {
                statusCode: 404,
                status: "Error",
                errorMessage: "Student not found"
            }
        }

        return {
            statusCode: 200,
            successMessage: "Student fetched successfully",
            status: "Success",
            data: { student }
        }
    } catch (error) {
        return {
            statusCode: 500,
            status: "Error",
            errorMessage: "Internal Server Error"
        }
    }
}