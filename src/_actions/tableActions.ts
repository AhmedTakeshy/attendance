"use server"
import { createAttendanceTableSchema, CreateAttendanceTableSchema } from "@/lib/formSchemas";
import { prisma } from "@/lib/prisma";
import { DayName, Table } from "@prisma/client";

type Props = {
    tablesPage?: number
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
        const { tableName, userId, days, isPublic } = data

        const daysArray = Object.entries(days).map(([key, value]) => ({
            name: key.toUpperCase() as DayName,
            subjects: value.subjects ? value.subjects.map(subject => ({
                name: subject.subjectName,
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

export async function getLastAttendanceTable({ studentId }: Props): Promise<ServerResponse<Table>> {
    try {
        const table = await prisma.table.findFirst({
            where: {
                userId: studentId,
            },
            orderBy: {
                updatedAt: "desc"
            }
        })
        return {
            statusCode: 200,
            successMessage: "Table fetched successfully",
            status: "Success",
            data: table as Table
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to fetch table",
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