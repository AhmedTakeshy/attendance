import { useFormContext } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/_components/ui/form";
import { Input } from "@/_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/_components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/_components/ui/popover";
import { Button } from "@/_components/ui/button";
import { useState } from "react";

type SubjectFormProps = {
    index: number;
    name: string;
    onRemove: (index: number) => void;
}

export function SubjectForm({ index, name, onRemove }: SubjectFormProps) {
    const { control } = useFormContext();
    const hours = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const minutes = ["00", "15", "30", "45"];
    const periods = ["AM", "PM"];
    const [startTime, setStartTime] = useState<{ hour: string, minute: string, period: string }>({ hour: "", minute: "", period: "" });
    const [endTime, setEndTime] = useState<{ hour: string, minute: string, period: string }>({ hour: "", minute: "", period: "" });

    return (
        <div className=' flex flex-col sm:flex-row sm:items-baseline items-center justify-start w-full gap-6'>
            <FormField
                control={control}
                name={`${name}[${index}].name`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Subject name..."
                                className="hover:bg-white sm:w-auto dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base subjectName"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="dark:bg-navy-700 startsAt">
                        {startTime.hour ? `${startTime.hour}:${startTime.minute} ${startTime.period}` : "Starts at"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-3 gap-4 dark:bg-navy-800">
                    <Select
                        value={startTime.hour}
                        onValueChange={(e) => setStartTime(prev => ({ ...prev, hour: e }))}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Hour"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={startTime.minute}
                        onValueChange={(e) => { setStartTime(prev => ({ ...prev, minute: e })) }}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Minute"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={startTime.period}
                        onValueChange={(e) => { setStartTime(prev => ({ ...prev, period: e })) }}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Period"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {periods.map((period) => (
                                <SelectItem key={period} value={period}>
                                    {period}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormField
                        control={control}
                        name={`${name}[${index}].startTime`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                </FormControl>
                                <Input
                                    type="hidden"
                                    {...field}
                                    value={`${startTime.hour}:${startTime.minute} ${startTime.period}`}
                                />
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    {/* <FormField control={control} name={`${name}[${index}].startTime.minute`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    <FormField control={control} name={`${name}[${index}].startTime.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField> */}
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="dark:bg-navy-700 endsAt">
                        {endTime.hour ? `${endTime.hour}:${endTime.minute} ${endTime.period}` : "Ends at"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-3 gap-4 dark:bg-navy-800">
                    <Select
                        value={endTime.hour}
                        onValueChange={(e) => { setEndTime(prev => ({ ...prev, hour: e })) }}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Hour"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {hours.map((hour) => (
                                <SelectItem key={hour} value={hour}>
                                    {hour}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={endTime.minute}
                        onValueChange={(e) => { setEndTime(prev => ({ ...prev, minute: e })) }}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Minute"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {minutes.map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                    {minute}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={endTime.period}
                        onValueChange={(e) => { setEndTime(prev => ({ ...prev, period: e })) }}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder="Period"
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {periods.map((period) => (
                                <SelectItem key={period} value={period}>
                                    {period}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormField control={control} name={`${name}[${index}].endTime`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        value={`${endTime.hour}:${endTime.minute} ${endTime.period}`}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField>
                    {/* <FormField control={control} name={`${name}[${index}].endTime.minute`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField> */}
                    {/* <FormField control={control} name={`${name}[${index}].endTime.period`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}>
                    </FormField> */}
                </PopoverContent>
            </Popover>
            <FormField control={control} name={`${name}[${index}].teacher`}
                render={({ field }) => (
                    <FormItem className='sm:basis-52'>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="Teacher name (optional)"
                                className="hover:bg-white sm:w-full dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base teacherName"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <FormField control={control} name={`${name}[${index}].attendance`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                min="0"
                                type="number"
                                pattern="[0-9]"
                                placeholder="Attendance"
                                className="hover:bg-white dark:bg-navy-800 dark:shadow-navy-400 placeholder:text-base attendanceNumber"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}>
            </FormField>
            <Button variant={"destructive"} onClick={() => onRemove(index)} className="sm:ml-auto deleteSubject">
                Delete Subject
            </Button>
        </div>
    )
}
