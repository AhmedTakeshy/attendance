import { auth } from "@/lib/auth"
import AttendanceTableForm from "../_components/attendanceTableForm"

export default async function page() {
    const session = await auth()
    return (
        <AttendanceTableForm studentId={session?.user?.id as string} />
    )
}
