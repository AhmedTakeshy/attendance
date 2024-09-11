import { getLibraryTables } from "@/_actions/tableActions"
import Search from "@/_components/search"
import AttendanceTables from "../../(protected)/_components/attendanceTables"

type LibraryProps = {
    searchParams: {
        [key: string]: string | undefined
    }
}
export default async function Library({ searchParams }: LibraryProps) {
    const response = await getLibraryTables({
        search: { name: searchParams?.name, id: searchParams?.id },
        page: parseInt(searchParams.page ?? "1"),
    })

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <Search placeholder="Search tables..." option1="id" option2="name" />
            </div>
            {response.status === "Success" ? (
                <div className="px-1 sm:px-4 md:px-8 mt-2 w-full max-w-6xl">
                    {response.data.tables.length > 0 ? (
                        <AttendanceTables data={response.data} />
                    ) : (
                        <div className="flex items-center justify-center">
                            <p className="text-lg dark:text-rose-200 text-rose-400">
                                No tables found{" "}
                                {(searchParams?.name || searchParams?.id) && (
                                    <span className={`underline`}>
                                        with this {`${searchParams?.name ? "name: " + searchParams?.name : "id: " + searchParams?.id}`}.
                                    </span>
                                )}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-center">
                    <p className="text-lg text-rose-500">Something went wrong!</p>
                </div>
            )
            }
        </>
    )
}
