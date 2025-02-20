import { auth } from '@/lib/auth'
import { createPublicId, returnPublicId } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Profile from '../_components/profile'
import { getStudentTables } from '@/_actions/studentActions'
import prisma from '@/lib/prisma'


export async function generateStaticParams() {
    const profiles = await prisma.user.findMany({
        select: {
            id: true,
            publicId: true,
        },
    })
    return profiles.map((profile) => ({
        profileId: createPublicId(profile.publicId, profile.id),
    }))
}

type ProfileIdProps = {
    params: {
        profileId: string
    },
    searchParams: {
        [key: string]: string | undefined
    }
}

export default async function ProfileId({ params, searchParams }: ProfileIdProps) {
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
