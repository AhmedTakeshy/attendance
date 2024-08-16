import { UserWithTables } from '@/_actions/studentActions'
import { copyTable, deleteTable } from '@/_actions/tableActions'
import PaginationControl from '@/_components/PaginationControl'
import SubmitButton from '@/_components/submitButton'
import { Button } from '@/_components/ui/button'
import { Table as TableRoot, TableHeader, TableRow, TableHead, TableBody, TableCell, } from '@/_components/ui/table'
import { createPublicId, returnPublicId } from '@/lib/utils'
import { Table } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'


type AttendanceTablesProps = {
    data: Metadata<{ student: UserWithTables }>
}

export default function AttendanceTables({ data }: AttendanceTablesProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, setIsPending] = useState<{ [key: number]: { delete: boolean, use: boolean } }>({})
    const tablesPage = parseInt(searchParams.get("tablesPage") ?? "1")
    const router = useRouter()
    const { data: session } = useSession()

    const isStudent = pathname.includes("students")

    function copyTableId(tableId: string) {
        navigator.clipboard.writeText(tableId)
        toast.success("Table Id copied to clipboard")
    }

    async function handleDeleteTable(tableId: number) {
        setIsPending(prev => ({ ...prev, [tableId]: { ...prev[tableId], delete: true } }))
        try {
            const res = await deleteTable({ tableId, studentId: data.student.id })
            if (res.status === "Success") {
                toast.success("Table has been deleted successfully.")
            } else {
                toast.error("Table has not been deleted.")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
        setIsPending(prev => ({ ...prev, [tableId]: { ...prev[tableId], delete: false } }))
    }

    async function handleCopyTable(tableId: number) {
        setIsPending(prev => ({ ...prev, [tableId]: { ...prev[tableId], use: true } }))
        try {
            const res = await copyTable({ tableId, studentId: returnPublicId(session?.user.id as string) })
            if (res.status === "Success") {
                toast.success("Table has been copied successfully.")
                router.push(`/${session?.user?.id}`)
            } else {
                toast.error("Table has not been copied.")
            }
        } catch (error) {
            toast.error("Something went wrong!")
        }
        setIsPending(prev => ({ ...prev, [tableId]: { ...prev[tableId], use: false } }))
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
                    const isDeletePending = isPending[table.id]?.delete || false
                    const isUsePending = isPending[table.id]?.use || false
                    return (
                        <TableRow key={tableId} className="dark:hover:bg-white/20">
                            <TableCell className='hidden md:table-cell'>{tableId}</TableCell>
                            <TableCell>{table.name}</TableCell>
                            <TableCell align='right' className="space-x-2 flex sm:flex-row flex-col max-sm:space-y-2 justify-end sm:items-center items-end">
                                <Button asChild className="bg-brand-300 hover:bg-brand-400 dark:bg-navy-500 dark:hover:bg-navy-600 text-inherit">
                                    <Link href={`${pathname}/${tableId}`} >View</Link>
                                </Button>
                                {!isStudent && (
                                    <SubmitButton
                                        pending={isDeletePending}
                                        onClick={() => handleDeleteTable(table.id)}
                                        className="!bg-rose-500 hover:!bg-rose-600 text-inherit">
                                        Delete
                                    </SubmitButton>
                                )}
                                <Button onClick={() => copyTableId(tableId)} className="bg-green-500 hover:bg-green-700 text-inherit">
                                    Copy Id
                                </Button>
                                {isStudent && (
                                    <SubmitButton
                                        pending={isUsePending}
                                        onClick={() => handleCopyTable(table.id)}
                                        className="!bg-primary !text-primary-foreground shadow hover:!bg-primary/70">
                                        Use Table
                                    </SubmitButton>
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
