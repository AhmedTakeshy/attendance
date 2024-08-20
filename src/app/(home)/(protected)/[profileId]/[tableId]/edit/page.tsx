import { getTableById } from "@/_actions/tableActions"
import { returnPublicId } from "@/lib/utils"

type Props = {
    params: {
        profileId: string,
        tableId: string,
    },
}

export default async function page({ params }: Props) {
    const { tableId, profileId } = params
    const response = await getTableById({ tableId: returnPublicId(tableId), studentId: returnPublicId(profileId) })
    return (
        <div>edit page</div>
    )
}
