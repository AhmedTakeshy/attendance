"use server"
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

type Props = {
    search?: string
    page: number
}

type Metadata = {
    students: User[]
    metadata: {
        hastNextPage: boolean;
        totalPages: number;
    }
}

export async function getStudents({ search, page = 1 }: Props): Promise<ServerResponse<Metadata>> {
    try {
        const students = await prisma.user.findMany({
            where: {
                role: "USER"
            },
            skip: (page - 1) * 9,
            take: 9,
        })

        const totalStudents = await prisma.user.count({
            where: {
                role: "USER"
            }
        })
        return {
            statusCode: 200,
            successMessage: "Students fetched successfully",
            status: "Success",
            data: {
                students,
                metadata: {
                    hastNextPage: totalStudents > page * 9,
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