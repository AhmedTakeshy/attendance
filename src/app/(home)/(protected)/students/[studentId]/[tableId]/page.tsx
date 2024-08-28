import { getTableById } from "@/_actions/tableActions"
import SimpleAttendanceTable from "@/app/(home)/_components/simpleAttendanceTable"
import { returnPublicId } from "@/lib/utils"

type TableIdProps = {
    params: {
        studentId: string,
        tableId: string,
    },
}

export default async function TableId({ params }: TableIdProps) {
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
