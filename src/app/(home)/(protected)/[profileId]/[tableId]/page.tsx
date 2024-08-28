import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { returnPublicId } from "@/lib/utils"


type ProfileTableIdProps = {
    params: {
        profileId: string,
        tableId: string,
    },
}

export default async function ProfileTableId({ params }: ProfileTableIdProps) {
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
