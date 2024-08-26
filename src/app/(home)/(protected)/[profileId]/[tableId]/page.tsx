import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { prisma } from "@/lib/prisma"
import { createPublicId, returnPublicId } from "@/lib/utils"

export async function generateStaticParams() {
    const usersWithTables = await prisma.user.findMany({ // there is a problem with this function
        select: {
            id: true,
            publicId: true,
            tables: {
                select: {
                    id: true,
                    publicId: true,
                    userId: true,
                },
            },
        },
    })
    return usersWithTables.map((userWithTable, i) => ({
        profileId: createPublicId(userWithTable.publicId, userWithTable.id),
        tableId: createPublicId(userWithTable.tables[i].publicId, userWithTable.tables[i].id),
    }))
}

type Props = {
    params: {
        profileId: string,
        tableId: string,
    },
}

export default async function page({ params }: Props) {
    const { tableId, profileId } = params
    const response = await getTableById({ tableId: returnPublicId(tableId), studentId: returnPublicId(profileId) })

    return (
        response.status === "Success" ? (
            <SimpleAttendanceTable table={response.data.table} />
        ) : (
            <p className="text-lg font-semibold text-red-600">Table not found</p>
        )
    )
}
