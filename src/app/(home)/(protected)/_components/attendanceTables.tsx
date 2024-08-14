import { UserWithTables } from '@/_actions/studentActions'
import { deleteTable } from '@/_actions/tableActions'
import PaginationControl from '@/_components/PaginationControl'
import { Button } from '@/_components/ui/button'
import { Table as TableRoot, TableHeader, TableRow, TableHead, TableBody, TableCell, } from '@/_components/ui/table'
import { createPublicId, returnPublicId } from '@/lib/utils'
import { Table } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'


type AttendanceTablesProps = {
    data: Metadata<{ student: UserWithTables }>
}

export default function AttendanceTables({ data }: AttendanceTablesProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tablesPage = parseInt(searchParams.get("tablesPage") ?? "1")

    const isStudent = pathname.includes("students")

    function copyTableId(tableId: string) {
        navigator.clipboard.writeText(tableId)
        toast.success("Table Id copied to clipboard")
    }

    async function handleDeleteTable(tableId: string) {
        try {
            const res = await deleteTable(returnPublicId(tableId), data.student.id)
            if (res.status === "Success") {
                toast.success("Table has been deleted successfully.")
            } else {
                toast.error("Table has not been deleted.")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
    }

    return (
        <TableRoot className="w-full mt-12">
            <TableHeader>
                <TableRow>
                    <TableHead className="hidden sm:table-cell">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.student.tables.map((table: Table) => {
                    const tableId = createPublicId(table.publicId, table.id)
                    return (
                        <TableRow key={tableId} className="dark:hover:bg-white/20">
                            <TableCell className='hidden sm:table-cell'>{tableId}</TableCell>
                            <TableCell>{table.name}</TableCell>
                            <TableCell align='right' className="space-x-2 flex sm:flex-row flex-col max-sm:space-y-2 justify-end sm:items-center items-end">
                                <Button asChild className="bg-brand-300 hover:bg-brand-400 dark:bg-navy-500 dark:hover:bg-navy-600 text-inherit">
                                    <Link href={`${pathname}/${tableId}`} >View</Link>
                                </Button>
                                {!isStudent && (
                                    <Button onClick={() => handleDeleteTable(tableId)} className="bg-rose-500 hover:bg-rose-600 text-inherit">
                                        Delete
                                    </Button>
                                )}
                                <Button onClick={() => copyTableId(tableId)} className="bg-green-500 hover:bg-green-700 text-inherit">
                                    Copy Id
                                </Button>
                                {!isStudent && (
                                    <Button onClick={() => copyTableId(tableId)} className="">
                                        Use Table
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                })}
                <TableRow className='hover:bg-transparent'>
                    <TableCell colSpan={3} className="text-center">
                        <PaginationControl
                            currentPage={tablesPage}
                            metadata={data.metadata}
                            className='mt-8'
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </TableRoot>
    )
}
