"use server"
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { TableWithSubjectsNumber } from "./tableActions";

type Props = {
    search?: string
    page: number
    studentId: number
    isPublic?: boolean
}

export type UserWithTables = Omit<User, "password" | "createdAt" | "updatedAt"> & { tables: TableWithSubjectsNumber[] }
export type UserWithTableCount = Omit<User, "password" | "createdAt" | "updatedAt"> & { tableCount: number }

export async function getStudents({ search, page = 1, studentId }: Props): Promise<ServerResponse<Metadata<{ students: UserWithTableCount[] }>>> {
    try {
        const students = await prisma.user.findMany({
            where: {
                // role: "USER",
                id: { not: studentId },
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            },
            select: {
                id: true,
                name: true,
                publicId: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
                _count: {
                    select: {
                        tables: {
                            where: {
                                isPublic: true
                            }
                        }
                    }
                }
            },
            skip: (page - 1) * 9,
            take: 9,
        })

        const totalStudents = await prisma.user.count({
            where: {
                // role: "USER",
                id: { not: studentId },
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } }
                ]
            }
        })
        return {
            statusCode: 200,
            successMessage: "Students fetched successfully",
            status: "Success",
            data: {
                students: students.map((student) => ({
                    ...student,
                    tableCount: student._count.tables
                })),
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

export async function getStudentTables({ page = 1, studentId, isPublic, search }: Props): Promise<ServerResponse<Metadata<{ student: UserWithTables }>>> {
    try {
        const student = await prisma.user.findUnique({
            where: {
                id: studentId,
            },
            select: {
                id: true,
                publicId: true,
                firstName: true,
                lastName: true,
                name: true,
                email: true,
                role: true,
                image: true,
                emailVerified: true,
                isTwoFactorEnabled: true,
                tables: {
                    where: {
                        isPublic,
                        OR: [
                            { name: { contains: search, mode: "insensitive" } },
                        ],
                    },
                    include: {
                        days: {
                            include: {
                                _count: {
                                    select: {
                                        subjects: true
                                    }
                                },
                            }
                        }
                    },
                    skip: (page - 1) * 9,
                    take: 9,
                },
            }
        })

        if (!student) {
            return {
                statusCode: 404,
                status: "Error",
                errorMessage: "Student not found"
            }
        }

        const totalTables = await prisma.table.count({
            where: {
                userId: studentId,
                isPublic,
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                ]
            }
        })

        return {
            statusCode: 200,
            successMessage: "Tables fetched successfully",
            status: "Success",
            data: {
                student: {
                    ...student,
                    tables: student.tables.map((table) => ({
                        ...table,
                        days: table.days.map((day) => ({
                            ...day,
                            subjects: day._count.subjects
                        }))
                    })),
                },
                metadata: {
                    hasNextPage: totalTables > page * 9,
                    totalPages: Math.ceil(totalTables / 9)
                }
            }
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to fetch tables",
            status: "Error",
        }
    }
}

// export async function getStudentById({ studentId }: Props): Promise<ServerResponse<{ student: UserWithTableCount }>> {
//     try {
//         const student = await prisma.user.findUnique({
//             where: {
//                 id: studentId
//             },
//             select: {
//                 id: true,
//                 publicId: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//                 role: true,
//                 image: true,
//                 emailVerified: true,
//                 isTwoFactorEnabled: true,
//                 _count: {
//                     select: {
//                         tables: true
//                     }
//                 }
//             }
//         })

//         if (!student) {
//             return {
//                 statusCode: 404,
//                 status: "Error",
//                 errorMessage: "Student not found"
//             }
//         }

//         return {
//             statusCode: 200,
//             successMessage: "Student fetched successfully",
//             status: "Success",
//             data: {
//                 student: {
//                     ...student,
//                     tableCount: student._count.tables
//                 }
//             }
//         }
//     } catch (error) {
//         return {
//             statusCode: 500,
//             status: "Error",
//             errorMessage: "Internal Server Error"
//         }
//     }
// }