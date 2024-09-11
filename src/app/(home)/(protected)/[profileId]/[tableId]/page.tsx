import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { returnPublicId } from "@/lib/utils"


type ProfileTableIdProps = {
    params: {
        tableId: string,
    },
}

export default async function ProfileTableId({ params }: ProfileTableIdProps) {
    const { tableId } = params
    const response = await getTableById({ tableId: returnPublicId(tableId) })

    return (
        response.status === "Success" ? (
            <SimpleAttendanceTable table={response.data.table} />
        ) : (
            <p className="text-lg font-semibold text-red-600">Table not found</p>
        )
    )
}
