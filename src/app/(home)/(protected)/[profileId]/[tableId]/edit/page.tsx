import { getTableById } from "@/_actions/tableActions"
import { returnPublicId } from "@/lib/utils"
import AttendanceTableForm from "../../_components/attendanceTableForm"

type EditTableProps = {
    params: {
        profileId: string,
        tableId: string,
    },
}

export default async function EditTable({ params }: EditTableProps) {
    const { tableId, profileId } = params
    const response = await getTableById({ tableId: returnPublicId(tableId), studentId: returnPublicId(profileId) })
    return (
        response.status === "Success" ? (
            <AttendanceTableForm studentId={profileId} table={response.data.table} />
        ) : (
            <p className="text-lg font-semibold text-red-600">Table not found</p>
        )
    )
}
