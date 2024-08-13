import { getStudents } from "@/_actions/studentActions"
import PaginationControl from "@/_components/PaginationControl"
import { Avatar, AvatarFallback, AvatarImage } from "@/_components/ui/avatar"
import { Button } from "@/_components/ui/button"
import { auth } from "@/lib/auth"
import { createPublicId, returnPublicId } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"



type Props = {
    searchParams: {
        [key: string]: string | undefined
    }
}

export default async function page({ searchParams }: Props) {
    const session = await auth()
    const response = await getStudents({
        search: searchParams.search ?? "",
        page: parseInt(searchParams.page ?? "1"),
        studentId: returnPublicId(session?.user.id as string)
    })
    return (
        response.status === "Success" ? (
            <div className="flex flex-col justify-between">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {response.data.students.map((student) => {
                        const publicId = createPublicId(student.publicId, student.id)
                        return (
                            <div
                                key={publicId}
                                className="relative flex flex-col items-center rounded-2.5xl w-[400px] mx-auto p-4 bg-white bg-clip-border shadow-2xl shadow-shadow-500 dark:!bg-navy-800 dark:text-white dark:!shadow-none">
                                <div className="relative flex h-32 w-full justify-center rounded-xl bg-cover" >
                                    <Image
                                        width={368}
                                        height={128}
                                        src='https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/banner.ef572d78f29b0fee0a09.png'
                                        className="absolute flex h-32 w-full justify-center rounded-xl bg-cover"
                                        alt="banner-image"
                                    />
                                    <div className="absolute -bottom-12 flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full border-4 border-white bg-navy-700 dark:!border-navy-700">
                                        <Avatar className="w-[5.5rem] h-[5.5rem]">
                                            <AvatarImage
                                                src={student.image || ""}
                                                alt={`${student.firstName}-image`}
                                            />
                                            <AvatarFallback>
                                                {`${student.firstName[0]}${student.lastName[0]}`}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div className="mt-16 flex flex-col items-center">
                                    <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                                        {student.firstName} {student.lastName}
                                    </h4>
                                    <p className="text-base font-normal text-gray-600">Student</p>
                                </div>
                                <div className="mt-6 mb-3 flex justify-center items-center gap-14 md:!gap-14">
                                    <div className="flex flex-col items-center justify-center">
                                        <p className="text-2xl font-bold text-navy-700 dark:text-white">
                                            {student.tableCount}
                                        </p>
                                        <p className="text-sm font-normal text-gray-600">Tables</p>
                                    </div>
                                    <Button asChild className="bg-brand-600 transition-colors duration-300 hover:bg-brand-800">
                                        <Link href={`/students/${publicId}?tablesPage=1`}>
                                            View profile
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <PaginationControl
                    currentPage={parseInt(searchParams.page ?? "1")}
                    metadata={response.data.metadata}
                    className="mt-8"
                />
            </div>
        ) : (
            <p className="text-lg text-rose-600 font-semibold">{response.errorMessage}</p>
        )
    )
}
