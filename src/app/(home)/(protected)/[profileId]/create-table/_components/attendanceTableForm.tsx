"use client"
import { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/_components/ui/form"
import { Input } from "@/_components/ui/input"
import { toast } from "sonner"
import SubmitButton from "@/_components/submitButton"
import { createAttendanceTableSchema, CreateAttendanceTableSchema } from '@/lib/formSchemas'
import { returnPublicId } from '@/lib/utils'
import SubjectField from './subjectField'
import { createAttendanceTable } from '@/_actions/tableActions'
import { Switch } from "@/_components/ui/switch"
import { useRouter } from 'next/navigation'


type AttendanceTableFormProps = {
    studentId: string
}

export default function AttendanceTableForm({ studentId }: AttendanceTableFormProps) {
    const [isPending, setIsPending] = useState<boolean>(false)
    const router = useRouter()
    const days = [
        {
            text: "Days",
            value: "Days"
        },
        {
            text: "Mon",
            value: "Monday"
        },
        {
            text: "Tue",
            value: "Tuesday"
        },
        {
            text: "Wed",
            value: "Wednesday"
        },
        {
            text: "Thu",
            value: "Thursday"
        },
        {
            text: "Fri",
            value: "Friday"
        },
        {
            text: "Sat",
            value: "Saturday"
        },
        {
            text: "Sun",
            value: "Sunday"
        },
    ]
    let subjects = {
        subjectName: "",
        teacher: "",
        startTime: {
            hour: "08" as "08" | "09" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "10" | "11" | "12",
            minute: "00" as "00" | "15" | "30" | "45",
            period: "AM" as "AM" | "PM"
        },
        endTime: {
            hour: "09" as "08" | "09" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "10" | "11" | "12",
            minute: "00" as "00" | "15" | "30" | "45",
            period: "AM" as "AM" | "PM"
        },
        attendance: 0,
        absence: 0,
    }


    const form = useForm<CreateAttendanceTableSchema>({
        resolver: zodResolver(createAttendanceTableSchema),
        defaultValues: {
            tableName: "",
            isPublic: false,
            userId: returnPublicId(studentId),
            days: {
                Monday: { subjects: Array.from({ length: 2 }, () => subjects) },
                Tuesday: { subjects: Array.from({ length: 2 }, () => subjects) },
                Wednesday: { subjects: Array.from({ length: 2 }, () => subjects) },
                Thursday: { subjects: Array.from({ length: 2 }, () => subjects) },
                Friday: { subjects: Array.from({ length: 2 }, () => subjects) },
                Saturday: { subjects: [] },
                Sunday: { subjects: [] },
            }
        }
    });


    async function createTable(data: CreateAttendanceTableSchema) {
        setIsPending(true)
        try {
            const result = await createAttendanceTableSchema.safeParseAsync(data)
            if (!result.success) {
                toast("Error!", {
                    description: "Something went wrong with the form data. Please try again.",
                })
                return
            }
            const { tableName, isPublic, userId, days } = data

            const res = await createAttendanceTable({ userId, tableName, isPublic, days })
            if (res.status === "Success") {
                toast.success("Success!", {
                    description: res.successMessage,
                })
                form.reset()
                router.push(`/${studentId}?tablesPage=1`)
            }
        } catch (error) {
            toast("Error!", {
                description: "Something went wrong with the form data. Please try again.",
            })
        }
        setIsPending(false)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(createTable)}
                className="my-8 container flex flex-col gap-4"
            >
                <h2 className="text-2xl font-semibold mb-12 text-center">
                    Create a new table
                </h2>
                <FormField
                    control={form.control}
                    name="tableName"
                    render={({ field }) => (
                        <FormItem className='max-w-2xl self-center w-full mb-12'>
                            <FormControl>
                                <Input
                                    id="tableName"
                                    type="text"
                                    placeholder="Table name..."
                                    className="hover:bg-white dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>
                </FormField>
                <div className="flex flex-col max-w-7xl w-full p-4 sm:divide-y-2 divide-slate-200 dark:divide-slate-700">
                    {days.map((day, i) => (
                        <div key={day.text} className='flex sm:flex-row flex-col items-center'>
                            <p className={`py-2 mt-4 sm:mt-0 px-4 md:basis-[10%] sm:basis-[20%] text-center ${day.text === "Days" ? "bg-diagonal bg-repeat" : "dark:text-slate-300 text-slate-500"}`}>
                                {day.text}
                            </p>
                            {day.text === "Days" ? (
                                <div className='md:basis-[90%] sm:basis-[80%] sm:border-l-2 border-slate-200 dark:border-slate-700 flex items-baseline justify-between w-full'>
                                    <p className='text-lg tracking-widest py-2 px-4 text-center'>Subjects</p>
                                    <FormField
                                        control={form.control}
                                        name="isPublic"
                                        render={({ field }) => (
                                            <FormItem className='flex items-center space-x-2'>
                                                <FormControl>
                                                    <Switch
                                                        id="isPublic"
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className='!mt-0' htmlFor="isPublic">Public</FormLabel>
                                            </FormItem>
                                        )}>
                                    </FormField>
                                </div>
                            ) : (
                                <div className="max-sm:max-w-sm md:basis-[90%] sm:basis-[80%] sm:mx-auto mx-2 gap-4 p-4 items-center  sm:rounded-none rounded-2xl shadow-input sm:shadow-none grid sm:!border-l-2  border-slate-200 dark:border-slate-700 sm:grid-cols-1 grid-cols-2 sm:overflow-x-scroll">
                                    <SubjectField day={day.value} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <SubmitButton pending={isPending}>Create Table</SubmitButton>
            </form>
        </Form >
    )
}
