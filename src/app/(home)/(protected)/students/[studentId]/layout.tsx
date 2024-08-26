import { prisma } from "@/lib/prisma"
import { createPublicId } from "@/lib/utils"

export async function generateStaticParams() {
    const students = await prisma.user.findMany({
        select: {
            id: true,
            publicId: true,
        }
    })
    return students.map((student) => ({
        studentId: createPublicId(student.publicId, student.id),
    }))
}


type Props = Readonly<{
    children: React.ReactNode
    params: {
        studentId: string
    }
}>

export default function StudentLayout({ children }: Props) {
    return (
        <>
            {children}
        </>
    )
}
