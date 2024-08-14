import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPublicId, returnPublicId } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Profile from '../_components/profile'
import { getStudentTables } from '@/_actions/studentActions'

export async function generateStaticParams() {
    const students = await prisma.user.findMany({
        select: {
            id: true,
            publicId: true,
        }
    })
    return students.map((student) => ({
        profileId: createPublicId(student.publicId, student.id),
    }))
}

type Props = {
    params: {
        profileId: string
    },
    searchParams: {
        [key: string]: string | undefined
    }
}

export default async function page({ params, searchParams }: Props) {
    const { profileId } = params
    const session = await auth()
    if (session?.user.id !== profileId) {
        notFound()
    }
    const response = await getStudentTables({
        studentId: returnPublicId(profileId),
        page: parseInt(searchParams.tablesPage ?? "1"),
        search: searchParams.search ?? "",
    })

    return (
        response.status === "Success" ? (
            <Profile data={response.data} />
        ) : (
            <p className="text-lg font-semibold text-red-600">Student not found</p>
        )
    )
}
