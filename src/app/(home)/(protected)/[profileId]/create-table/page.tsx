import { auth } from "@/lib/auth"
import AttendanceTableForm from "../_components/attendanceTableForm"

export default async function CreateTable() {
    const session = await auth()
    return (
        <AttendanceTableForm studentId={session?.user?.id as string} />
    )
}
