"use client"
import { addAbsence, TableObj } from '@/_actions/tableActions'
import SubmitButton from '@/_components/submitButton'
import { Button } from '@/_components/ui/button'
import { Table as TableRoot, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption, } from '@/_components/ui/table'
import { createPublicId } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { TbExposurePlus1 } from "react-icons/tb";
import { BiSolidEditAlt } from "react-icons/bi";
import { DayName } from '@prisma/client'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuGroup, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/_components/ui/dropdown-menu'
import { FaGear } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import { useSession } from 'next-auth/react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/_components/ui/select'


type SimpleAttendanceTableProps = {
    table: TableObj
}

export default function SimpleAttendanceTable({ table }: SimpleAttendanceTableProps) {
    const { data: session } = useSession()
    const pathname = usePathname()
    const [isPending, setIsPending] = useState<{ [key: number]: boolean }>({})
    const [mobWidth, setMobWidth] = useState<boolean>(typeof window !== "undefined" ? window.innerWidth < 640 : false)
    const [selectedDay, setSelectedDay] = useState<DayName | undefined>(table.days[new Date().getDay() - 1]?.name)

    const currentDay = useMemo(() => table.days.find(day => day.name === selectedDay), [selectedDay, table.days])
    const today = useMemo(() => table.days[new Date().getDay() - 1]?.name, [table.days])
    const isMoreDetails = useMemo(() => pathname.includes(`${createPublicId(table.publicId as string, table.id as number)}`), [pathname, table.publicId, table.id])
    const notForStudent = useMemo(() => !pathname.includes("students"), [pathname])

    const handleDayChange = (dayName: DayName) => setSelectedDay(dayName)


    async function handleAbsence(dayName: DayName, subjectId: number) {
        setIsPending(prev => ({ ...prev, [subjectId]: true }))
        try {
            const res = await addAbsence({
                tableId: table.id as number,
                studentId: table.userId as number,
                dayName,
                subjectId,
            })

            res.status === "Success"
                ? toast.success("Absence added successfully")
                : toast.error("Failed to add absence");
        } catch (error) {
            toast.error("Something went wrong!")
        }
        setIsPending(prev => ({ ...prev, [subjectId]: false }))
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setMobWidth(true);
            } else {
                setMobWidth(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <div className="flex flex-col w-full max-sm:max-w-md sm:px-8 px-4 mx-auto max-w-5xl">
            {notForStudent && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"outline"} className='ml-auto'>
                            <FaGear />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 dark:bg-navy-800">
                        <DropdownMenuGroup>
                            {!isMoreDetails && (
                                <DropdownMenuItem asChild>
                                    <Link href={`/${session?.user.id}/${createPublicId(table.publicId as string, table.id as number)}`} className='flex gap-2 items-center'>
                                        <IoEyeOutline />
                                        View in details
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild>
                                <Link href={`/${session?.user.id}/${createPublicId(table.publicId as string, table.id as number)}/edit`} className='flex gap-2 items-center'>
                                    <BiSolidEditAlt />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <div className='flex justify-center  items-center'>
                <TableRoot>
                    <TableCaption className='text-base tracking-widest'>
                        Table name: <span className="font-bold dark:text-white text-black">{table.name}</span></TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={`${mobWidth ? "text-center" : ""}`}>Day</TableHead>
                            {!mobWidth && (<TableHead className='text-center'>Subjects</TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!isMoreDetails ? (
                            <TableRow
                                className={`hover:bg-transparent ${mobWidth ? " flex flex-col items-center" : ""}`}>
                                <TableCell className='align-top'>
                                    <Select onValueChange={handleDayChange} defaultValue={selectedDay}>
                                        <SelectTrigger className='w-48'>
                                            <SelectValue asChild>
                                                {today === selectedDay ? (
                                                    <span className='capitalize font-bold dark:text-white text-slate-900'>
                                                        Today - {selectedDay?.toLowerCase()}
                                                    </span>
                                                ) : (
                                                    <span className='capitalize dark:text-slate-600 text-slate-400'>
                                                        {selectedDay?.toLowerCase()}
                                                    </span>
                                                )}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {table.days.map((day) => (
                                                    <SelectItem
                                                        key={day.id}
                                                        value={day.name}
                                                        className='capitalize dark:text-white text-slate-900'>
                                                        {day.name.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {!mobWidth && (
                                        <div className="flex flex-col gap-2 pt-2 text-slate-400 dark:text-slate-600">
                                            <p>Subject</p>
                                            <p>Teacher</p>
                                            <p>Start</p>
                                            <p>End</p>
                                            <p>Attendance</p>
                                            <p>Absence</p>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className={`grid grid-cols-2 gap-4`}>
                                    {currentDay && currentDay.subjects.length > 0 ?
                                        currentDay.subjects.map((subject) => (
                                            <div
                                                key={subject.id}
                                                className={`flex flex-col items-center ${notForStudent ? "" : "pt-4"} gap-2 ${currentDay.subjects.length > 1 ? "col-span-1" : "col-span-2"}`}>
                                                {notForStudent && (
                                                    <SubmitButton
                                                        disabled={!notForStudent}
                                                        onClick={() => handleAbsence(currentDay.name, subject.id)}
                                                        pending={isPending[subject.id] || false}
                                                        className={`flex gap-2 items-center font-bold ${mobWidth ? "order-1" : "order-none"}`}>
                                                        <TbExposurePlus1 size={20} />
                                                        Absence
                                                    </SubmitButton>
                                                )}
                                                <p>{subject.name}</p>
                                                <p>{subject.teacher}</p>
                                                <p>{subject.startTime}</p>
                                                <p>{subject.endTime}</p>
                                                <p>{subject.attendance}</p>
                                                <p>{subject.absence}</p>
                                            </div>
                                        )) : (
                                            <p className={`flex flex-col items-center text-center col-span-2 mt-4 sm:mt-20 text-lg`}>
                                                No subjects for today.
                                            </p>
                                        )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            // little details
                            table.days.map((day) => (
                                <TableRow
                                    key={day.id}
                                    className={`hover:bg-transparent ${mobWidth ? " flex flex-col items-center" : ""}`}>
                                    <TableCell className='align-top'>
                                        <p className='capitalize dark:text-white text-slate-900'>{day.name.toLowerCase()}</p>
                                        {!mobWidth && (
                                            <div className="flex flex-col gap-2 pt-2 text-slate-400 dark:text-slate-600">
                                                <p>Subject</p>
                                                <p>Teacher</p>
                                                <p>Start</p>
                                                <p>End</p>
                                                <p>Attendance</p>
                                                <p>Absence</p>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className={`grid grid-cols-2 gap-4`}>
                                        {day.subjects.length > 0 ?
                                            day.subjects.map((subject) => (
                                                <div
                                                    key={subject.id}
                                                    className={`flex flex-col items-center ${notForStudent ? "" : "pt-4"} gap-2 ${day.subjects.length > 1 ? "col-span-1" : "col-span-2"}`}>
                                                    {notForStudent && (
                                                        <SubmitButton
                                                            disabled={!notForStudent}
                                                            onClick={() => handleAbsence(day.name, subject.id)}
                                                            pending={isPending[subject.id] || false}
                                                            className={`flex gap-2 items-center font-bold ${mobWidth ? "order-1" : "order-none"}`}>
                                                            <TbExposurePlus1 size={20} />
                                                            Absence
                                                        </SubmitButton>
                                                    )}
                                                    <p>{subject.name}</p>
                                                    <p>{subject.teacher}</p>
                                                    <p>{subject.startTime}</p>
                                                    <p>{subject.endTime}</p>
                                                    <p>{subject.attendance}</p>
                                                    <p>{subject.absence}</p>
                                                </div>
                                            ))
                                            : (
                                                <p className={`flex flex-col items-center text-center col-span-2 mt-4 sm:mt-20 text-lg`}>
                                                    No subjects for today.
                                                </p>
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </TableRoot>
            </div>
        </div>
    )
}

