import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { prisma } from "@/lib/prisma"
import { createPublicId, returnPublicId } from "@/lib/utils"

export async function generateStaticParams({ params: { studentId } }: { params: { studentId: string } }) {
    const studentTables = await prisma.table.findMany({
        where: {
            userId: returnPublicId(studentId)
        },
        select: {
            id: true,
            publicId: true,
        }
    })
    return studentTables.map((table) => ({
        tableId: createPublicId(table.publicId, table.id),
    }))
}

type Props = {
    params: {
        studentId: string,
        tableId: string,
    },
}

export default async function page({ params }: Props) {
    const { tableId, studentId } = params
    const response = await getTableById({ tableId: returnPublicId(tableId), studentId: returnPublicId(studentId) })

    return (
        response.status === "Success" ? (
            <SimpleAttendanceTable table={response.data.table} />
        ) : (
            <p className="text-lg font-semibold text-red-600">Table not found</p>
        )
    )
}
