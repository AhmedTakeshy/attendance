import { prisma } from "@/lib/prisma"
import { createPublicId } from "@/lib/utils"

export async function generateStaticParams() {
    const profiles = await prisma.user.findMany({
        select: {
            id: true,
            publicId: true,
        }
    })
    return profiles.map((profile) => ({
        profileId: createPublicId(profile.publicId, profile.id),
    }))
}


type Props = Readonly<{
    children: React.ReactNode
    params: {
        profileId: string
    }
}>

export default function ProfileLayout({ children }: Props) {
    return (
        <>
            {children}
        </>
    )
}
