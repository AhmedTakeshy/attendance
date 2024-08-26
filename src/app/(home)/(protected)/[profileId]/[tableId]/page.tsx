import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { prisma } from "@/lib/prisma"
import { createPublicId, returnPublicId } from "@/lib/utils"

export async function generateStaticParams({ params: { profileId } }: { params: { profileId: string } }) {
    const profileTables = await prisma.table.findMany({
        where: {
            userId: returnPublicId(profileId)
        },
        select: {
            id: true,
            publicId: true,
        }
    })
    return profileTables.map((table) => ({
        tableId: createPublicId(table.publicId, table.id),
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
