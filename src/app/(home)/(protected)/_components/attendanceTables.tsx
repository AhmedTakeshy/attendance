import { UserWithTables } from '@/_actions/studentActions'
import PaginationControl from '@/_components/PaginationControl'
import { Button } from '@/_components/ui/button'
import { Table as TableRoot, TableHeader, TableRow, TableHead, TableBody, TableCell, } from '@/_components/ui/table'
import { createPublicId } from '@/lib/utils'
import { Table } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'


type AttendanceTablesProps = {
    data: Metadata<{ student: UserWithTables }>
    tablesPage: number
}

export default function AttendanceTables({ data, tablesPage }: AttendanceTablesProps) {
    const pathname = usePathname()

    return (
        <TableRoot className="w-full mt-12">
            <TableHeader>
                <TableRow>
                    <TableHead className="">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.student.tables.map((table: Table) => {
                    const tableId = createPublicId(table.publicId, table.id)
                    return (
                        <TableRow key={tableId} className="dark:hover:bg-white/20">
                            <TableCell>{tableId}</TableCell>
                            <TableCell>{table.name}</TableCell>
                            <TableCell className="text-right">
                                <Button asChild className="bg-brand-300 hover:bg-brand-400 dark:bg-navy-500 dark:hover:bg-navy-600 text-inherit">
                                    <Link href={`${pathname}/${tableId}`} >View</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
                {data.student.tables.length > 0 ? (
                    <TableRow className='hover:bg-transparent'>
                        <TableCell colSpan={3} className="text-center">
                            <PaginationControl
                                currentPage={tablesPage}
                                metadata={data.metadata}
                                className='mt-8'
                            />
                        </TableCell>
                    </TableRow>
                ) : null
                }
            </TableBody>
        </TableRoot>
    )
}
