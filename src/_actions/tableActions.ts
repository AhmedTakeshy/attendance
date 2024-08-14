"use server"
import { createAttendanceTableSchema, CreateAttendanceTableSchema } from "@/lib/formSchemas";
import { prisma } from "@/lib/prisma";
import { createPublicId } from "@/lib/utils";
import { Day, DayName, Subject, Table } from "@prisma/client";
import { revalidatePath } from "next/cache";

type Props = {
    // tableId: number
    studentId: number
}

export async function createAttendanceTable(data: CreateAttendanceTableSchema): Promise<ServerResponse<null>> {
    try {
        const result = await createAttendanceTableSchema.safeParseAsync(data)
        if (!result.success) {
            return {
                statusCode: 400,
                errorMessage: "Invalid data",
                status: "Error",
            }
        }
        const { tableName, userId, days, isPublic, } = data

        const daysArray = Object.entries(days).map(([key, value]) => ({
            name: key.toUpperCase() as DayName,
            subjects: value.subjects ? value.subjects.map(subject => ({
                name: subject.subjectName,
                teacher: subject.teacher,
                startTime: `${subject.startTime.hour}:${subject.startTime.minute} ${subject.startTime.period}`,
                endTime: `${subject.endTime.hour}:${subject.endTime.minute} ${subject.endTime.period}`,
                attendance: subject.attendance,
            })) : [],
        }));

        const table = await prisma.table.create({
            data: {
                name: tableName,
                userId,
                days: {
                    create: daysArray.map(day => ({
                        name: day.name,
                        subjects: {
                            create: day.subjects
                        }
                    }))
                },
                isPublic
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                publicId: true
            }
        })
        revalidatePath(`/${createPublicId(user?.publicId as string, userId)}`)
        return {
            statusCode: 200,
            successMessage: "Table created successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to create table",
            status: "Error",
        }
    }
}

type TableObj = (Table & { days: (Day & { subjects: Subject[] })[] }) | null;
export async function getLastAttendanceTable({ studentId }: Props): Promise<ServerResponse<{ table: TableObj }>> {
    try {
        const table = await prisma.table.findFirst({
            where: {
                userId: studentId,
            },
            include: {
                days: {
                    include: {
                        subjects: true
                    }
                },
            },
            orderBy: {
                updatedAt: "desc"
            }
        })

        if (!table) {
            return {
                statusCode: 404,
                errorMessage: "Table not found",
                status: "Error",
            }
        }

        return {
            statusCode: 200,
            successMessage: "Table fetched successfully",
            status: "Success",
            data: { table }
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to fetch table",
            status: "Error",
        }
    }
}

export async function copyTable(tableId: number, studentId: number): Promise<ServerResponse<null>> {
    try {
        const table = await prisma.table.findUnique({
            where: {
                id: tableId
            },
            include: {
                days: {
                    include: {
                        subjects: true
                    }
                }
            }
        })
        if (!table) {
            return {
                statusCode: 404,
                errorMessage: "Table not found",
                status: "Error",
            }
        }
        const daysArray = table.days.map(day => ({
            name: day.name,
            subjects: day.subjects.map(subject => ({
                name: subject.name,
                teacher: subject.teacher,
                startTime: subject.startTime,
                endTime: subject.endTime,
                attendance: subject.attendance
            }))
        }))
        await prisma.table.create({
            data: {
                name: table.name,
                userId: studentId,
                days: {
                    create: daysArray.map(day => ({
                        name: day.name,
                        subjects: {
                            create: day.subjects
                        }
                    }))
                },
                isPublic: table.isPublic
            }
        })
        const user = await prisma.user.findUnique({
            where: {
                id: studentId
            },
            select: {
                publicId: true
            }
        })
        revalidatePath(`/${createPublicId(user?.publicId as string, studentId)}`)
        return {
            statusCode: 200,
            successMessage: "Table copied successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        console.log("🚀 ~ copyTable ~ error:", error)
        return {
            statusCode: 500,
            errorMessage: "Failed to copy table",
            status: "Error",
        }
    }
}

export async function deleteTable(tableId: number, studentId: number): Promise<ServerResponse<null>> {
    try {
        const res = await prisma.table.delete({
            where: {
                id: tableId,
                userId: studentId
            }
        })
        revalidatePath(`/${studentId}`)
        return {
            statusCode: 200,
            successMessage: "Table deleted successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to delete table",
            status: "Error",
        }
    }
}