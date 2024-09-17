"use server"
import { createAttendanceTableSchema, CreateAttendanceTableSchema } from "@/lib/formSchemas";
import prisma from "@/lib/prisma";
import { createPublicId, returnPublicId } from "@/lib/utils";
import { Day, DayName, Subject, Table } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"

type Props = {
    tableId?: number
    studentId?: number
}

export type TableWithSubjectsNumber = Table & {
    days: (Day & { subjects: number })[];
};

export type TableObj = (Table & { days: (Day & { subjects: Subject[] })[] });

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
                name: subject.name,
                teacher: subject.teacher,
                startTime: subject.startTime,
                endTime: subject.endTime,
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
        if (isPublic) {
            const existingLibrary = await prisma.library.findFirst({
                where: {
                    tables: { some: { id: table.id } }
                }
            });

            if (!existingLibrary) {
                await prisma.library.create({
                    data: {
                        tables: {
                            connect: { id: table.id }
                        }
                    }
                });
            }
        }
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

type GetTablesProps = {
    page: number
    search?: {
        name?: string,
        id?: string
    }
}
export async function getLibraryTables({ page, search }: GetTablesProps): Promise<ServerResponse<Metadata<{ tables: TableWithSubjectsNumber[] }>>> {
    const searchId = search?.id ? returnPublicId(search.id) : undefined

    try {
        const library = await prisma.library.findMany({
            where: {
                tables: {
                    every: {
                        name: { contains: search?.name, mode: "insensitive" },
                        id: searchId,
                    }
                }
            },
            include: {
                tables: {
                    include: {
                        days: {
                            include: {
                                _count: {
                                    select: {
                                        subjects: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            skip: (page - 1) * 10,
            take: 10
        })

        const totalTables = await prisma.library.count({
            where: {
                tables: {
                    every: {
                        name: { contains: search?.name, mode: "insensitive" },
                        id: searchId,
                    }
                }
            },
        })
        const libraryTables = library.map(({ tables }) => tables.map(table => ({
            ...table,
            days: table.days.map(day => ({ ...day, subjects: day._count.subjects }))
        }))).flat()
        return {
            statusCode: 200,
            successMessage: "Tables fetched successfully",
            status: "Success",
            data: {
                tables: libraryTables,
                metadata: {
                    hasNextPage: totalTables > page * 10,
                    totalPages: Math.ceil(totalTables / 10)
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

export async function getLastAttendanceTable({ studentId }: Props): Promise<ServerResponse<{ table: TableObj }>> {
    try {
        const table = await prisma.table.findFirst({
            where: {
                userId: studentId as number,
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

export async function getTableById({ tableId }: Props): Promise<ServerResponse<{ table: TableObj }>> {
    try {
        const table = await prisma.table.findUnique({
            where: {
                id: tableId as number,
            },
            include: {
                days: {
                    include: {
                        subjects: {
                            orderBy: {
                                id: "asc"
                            }
                        },
                    },
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

export async function copyTable({ tableId, studentId }: Props): Promise<ServerResponse<null>> {
    try {
        const userTable = await prisma.table.findUnique({
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
        if (!userTable) {
            return {
                statusCode: 404,
                errorMessage: "Table not found",
                status: "Error",
            }
        }
        const daysArray = userTable.days.map(day => ({
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
                name: userTable.name,
                userId: studentId as number,
                days: {
                    create: daysArray.map(day => ({
                        name: day.name,
                        subjects: {
                            create: day.subjects
                        }
                    }))
                },
                isPublic: userTable.isPublic
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
        await prisma.table.update({
            where: {
                id: tableId
            },
            data: {
                tableViews: {
                    increment: 1
                }
            }
        })
        revalidatePath(`/${createPublicId(user?.publicId as string, studentId as number)}`)
        return {
            statusCode: 200,
            successMessage: "Table copied successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to copy table",
            status: "Error",
        }
    }
}

export async function deleteTable({ tableId, studentId }: Props): Promise<ServerResponse<null>> {
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

export async function updateTable(data: CreateAttendanceTableSchema, { tableId, studentId }: Props): Promise<ServerResponse<null>> {
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
        const result = await createAttendanceTableSchema.safeParseAsync(data)
        if (!result.success) {
            return {
                statusCode: 400,
                errorMessage: "Invalid data",
                status: "Error",
            }
        }
        const { tableName, days, isPublic, } = data

        const daysArray = Object.entries(days).map(([key, value]) => ({
            name: key.toUpperCase() as DayName,
            subjects: value.subjects ? value.subjects.map(subject => ({
                name: subject.name,
                teacher: subject.teacher,
                startTime: subject.startTime,
                endTime: subject.endTime,
                attendance: subject.attendance,
            })) : [],
        })
        );

        await prisma.table.update({
            where: {
                id: tableId,
                userId: studentId
            },
            data: {
                name: tableName,
                days: {
                    deleteMany: {
                        name: {
                            notIn: daysArray.map(day => day.name)
                        }
                    },
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
            successMessage: "Table updated successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to update table",
            status: "Error",
        }
    }
}

type AbsenceProps = { tableId: number, studentId: number, dayName: DayName, subjectId: number }
export async function addAbsence({ tableId, studentId, dayName, subjectId }: AbsenceProps): Promise<ServerResponse<null>> {
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
        const table = await prisma.table.findUnique({
            where: {
                id: tableId,
                userId: studentId
            },
            include: {
                days: {
                    where: {
                        name: dayName
                    },
                    include: {
                        subjects: {
                            where: {
                                id: subjectId
                            }
                        }
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
        const day = table.days.find(day => day.name === dayName)
        const subject = day?.subjects.find(subject => subject.id === subjectId)
        if (!subject) {
            return {
                statusCode: 404,
                errorMessage: "Subject not found",
                status: "Error",
            }
        }
        await prisma.subject.update({
            where: {
                id: subject.id
            },
            data: {
                absence: {
                    increment: 1
                }
            }
        })
        revalidatePath(`/${studentId}/${tableId}`)
        return {
            statusCode: 200,
            successMessage: "Absence added successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to add absence",
            status: "Error",
        }
    }
}

export async function removeAbsence({ tableId, studentId, dayName, subjectId }: AbsenceProps): Promise<ServerResponse<null>> {
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
        const table = await prisma.table.findUnique({
            where: {
                id: tableId,
                userId: studentId
            },
            include: {
                days: {
                    where: {
                        name: dayName
                    },
                    include: {
                        subjects: {
                            where: {
                                id: subjectId
                            }
                        }
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
        const day = table.days.find(day => day.name === dayName)
        const subject = day?.subjects.find(subject => subject.id === subjectId)
        if (!subject) {
            return {
                statusCode: 404,
                errorMessage: "Subject not found",
                status: "Error",
            }
        }
        if (subject.absence === 0) {
            return {
                statusCode: 400,
                errorMessage: "Absence already at 0",
                status: "Error",
            }
        }
        await prisma.subject.update({
            where: {
                id: subject.id
            },
            data: {
                absence: {
                    decrement: 1,
                },
            }
        })
        revalidatePath(`/${studentId}/${tableId}`)
        return {
            statusCode: 200,
            successMessage: "Absence removed successfully",
            status: "Success",
            data: null
        }
    } catch (error) {
        return {
            statusCode: 500,
            errorMessage: "Failed to remove absence",
            status: "Error",
        }
    }
}