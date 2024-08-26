import { verifyEmail } from "@/_actions/verificationActions"
import { Card, CardHeader, CardTitle, CardContent } from "@/_components/ui/card"
import { auth } from "@/lib/auth"
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { ImSpinner9 } from "react-icons/im";

type Props = {
    searchParams: { [key: string]: string | string | undefined }
}

export default async function page({ searchParams }: Readonly<Props>) {
    const session = await auth()
    const { token } = searchParams
    const response = await verifyEmail(token as string, session?.user.email as string)
    return (
        <Card className="w-96 dark:bg-navy-800">
            {response.status !== "Success" && response.status !== "Error" && (
                <CardHeader className="justify-center items-center">
                    <CardTitle className="text-lg font-bold">
                        Verifying Email
                    </CardTitle>
                    <ImSpinner9 size={25} className="animate-spin rounded-full fill-navy-400" />
                </CardHeader>
            )}
            {response.status === "Success" ? (
                <CardContent className="bg-green-400/30 p-2 flex items-center w-full rounded-lg">
                    <FaCircleCheck size={20} className="text-green-600" />
                    <p className="text-sm ml-2 text-green-700">
                        {response.successMessage}
                    </p>
                </CardContent>
            ) : (
                <CardContent className="bg-red-400/30 p-2 flex items-center w-full rounded-lg">
                    <FaCircleExclamation size={20} className="text-red-600" />
                    <p className="text-sm ml-2 text-red-700">
                        Something went wrong. Please try again.
                    </p>
                </CardContent>
            )}
        </Card>
    )
}
